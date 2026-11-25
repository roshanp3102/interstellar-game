/**
 * Auth proxy and static fallback. The scaffold's integration, file and billing
 * proxies are deliberately absent: the game uses none of them, and integrations
 * would let any signed-in user spend the owner's credits.
 *
 * The app worker remains the security boundary: caller identity is derived
 * from a verified JWT, caller-supplied identity headers are removed, and app
 * identity is re-asserted only from worker bindings.
 */

import type { Hono } from 'hono'
import {
  authWorkerFetch,
  isPlatformReservedPath,
  resolveAppRole,
  SESSION_COOKIE,
  verifyJwt,
  nativeAuthCallback,
  nativeAuthExchange,
  nativeAuthMe,
  nativeAuthSignOut,
  nativeAuthStart,
  nativeAuthToken,
} from 'deepspace/worker'
import type { ExpoAuthBridgeOptions, JwtVerifierConfig, VerifyResult } from 'deepspace/worker'
import type { AppContext, Env } from '../../worker.js'

function jwtConfig(env: Env): JwtVerifierConfig {
  return { publicKey: env.AUTH_JWT_PUBLIC_KEY, issuer: env.AUTH_JWT_ISSUER }
}

export async function resolveAuth(req: Request, env: Env): Promise<VerifyResult | null> {
  const header = req.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  return (await verifyJwt(jwtConfig(env), token)).result
}

/** Register auth and debug routes in their required order. */
export function registerAuthRoutes(app: Hono<AppContext>): void {
  const nativeAuthOptions = (env: Env): ExpoAuthBridgeOptions => ({
    allowedRedirectUris: (env.NATIVE_AUTH_REDIRECT_URIS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  })

  // Native routes must precede the Better Auth wildcard below. The exact
  // browser callback handler branches only when the native bridge's validated
  // redirect_uri is present, so a generated worker cannot shadow native OAuth.
  app.get('/api/auth/native-start', (c) => nativeAuthStart(c.req.raw, c.env, nativeAuthOptions(c.env)))
  app.post('/api/auth/native-exchange', (c) => nativeAuthExchange(c.req.raw, c.env))
  app.post('/api/auth/native-token', (c) => nativeAuthToken(c.req.raw, c.env))
  app.get('/api/auth/native-me', (c) => nativeAuthMe(c.req.raw, c.env))
  app.post('/api/auth/native-signout', (c) => nativeAuthSignOut(c.req.raw, c.env))

  // Social OAuth redirect + code exchange.
  app.get('/api/auth/social-redirect', (c) => {
    const provider = c.req.query('provider')
    if (!provider) return c.json({ error: 'Missing provider' }, 400)

    const appOrigin = new URL(c.req.url).origin
    const authOrigin = new URL(c.env.AUTH_WORKER_URL).origin

    return c.redirect(
      `${authOrigin}/login/social?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(appOrigin)}`,
    )
  })

  app.get('/api/auth/oauth-complete', async (c) => {
    if (c.req.query('redirect_uri')) {
      return nativeAuthCallback(c.req.raw, c.env, nativeAuthOptions(c.env))
    }
    const code = c.req.query('code')
    const appOrigin = new URL(c.req.url).origin
    // Land the signed-in user in the app, not on the static landing. `/` is a
    // static page (no auth/realtime providers), so redirecting there after auth
    // would strand the user; `/home` is the dynamic app boundary.
    const appHome = `${appOrigin}/home`

    if (!code) return c.redirect(appHome)

    const res = await authWorkerFetch(c.env, '/api/auth/exchange-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (!res.ok) return c.redirect(appHome)
    const data = (await res.json()) as { sessionToken?: string }
    if (!data.sessionToken) return c.redirect(appHome)
    const sessionToken = data.sessionToken

    return new Response(null, {
      status: 302,
      headers: {
        Location: appHome,
        'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
      },
    })
  })

  app.all('/api/auth/sign-out', async (c) => {
    try {
      await authWorkerFetch(c.env, '/api/auth/sign-out', {
        method: c.req.method,
        headers: c.req.raw.headers,
        body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
      })
    } catch {
      // Still expire the app-scoped cookie below. A network/auth-worker
      // failure must not leave the browser immediately signed back in.
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      },
    })
  })

  // Auth proxy → auth-worker (same-origin cookies).
  app.all('/api/auth/*', async (c) => {
    const url = new URL(c.req.url)
    const res = await authWorkerFetch(c.env, url.pathname + url.search, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
    })
    const headers = new Headers(res.headers)
    const setCookie = headers.get('set-cookie')
    if (setCookie) {
      headers.set('set-cookie', setCookie.replace(/;\s*Domain=[^;]*/gi, ''))
    }
    return new Response(res.body, { status: res.status, headers })
  })

  // Debug proxy → app's RecordRoom DO.
  //
  // Both this proxy and the DO gate on ALLOW_DEBUG_ROUTES === "true". The app
  // proxy also requires the existing owner/admin role before reaching the DO.
  app.all('/api/debug/*', async (c) => {
    if (c.env.ALLOW_DEBUG_ROUTES !== 'true') {
      return c.notFound()
    }
    const auth = await resolveAuth(c.req.raw, c.env)
    if (!auth) return c.json({ error: 'unauthorized' }, 401)
    if ((await resolveAppRole(c.env, auth.userId)) !== 'admin') {
      return c.json({ error: 'forbidden' }, 403)
    }
    const stub = c.env.RECORD_ROOMS.get(
      c.env.RECORD_ROOMS.idFromName(`app:${c.env.DEEPSPACE_APP_ID}`),
    )
    // Forward verbatim: the DO dispatches on the original pathname.
    return stub.fetch(c.req.raw)
  })
}

const matches = (pathname: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

/**
 * An unmatched API call must 404 without consulting the asset layer at all —
 * answering it with a static file, or with HTML a client then parses as JSON,
 * is never right.
 */
const API_PREFIXES = ['/api']

/**
 * The plain SPA shell prerender.ts (app root) writes beside the prerendered
 * pages: the built index.html with #root still empty. Extensionless, so the
 * asset layer's auto-trailing-slash serves `_spa.html` at it.
 */
const SPA_SHELL_PATH = '/_spa'

/**
 * A FILE, not a client route: last segment carries an extension. Wrong in only
 * the cheap direction — a dotted route 404s visibly, where a missing file
 * getting the shell is HTML parsed as JavaScript and a blank page.
 */
function namesAFile(pathname: string): boolean {
  const last = pathname.slice(pathname.lastIndexOf('/') + 1)
  return last.includes('.')
}

/**
 * Register the client-route fallback last so it cannot shadow worker routes.
 * Deploys set `not_found_handling: "none"`, so a 404 from the binding is a
 * real miss and this worker makes the call the asset layer cannot.
 */
export function registerStaticRoutes(app: Hono<AppContext>): void {
  // The API guard is METHOD-AGNOSTIC and sits ahead of the GET fallback, so a
  // POST/PUT/DELETE to a mistyped or rolled-back API route gets the same JSON
  // 404 a GET does — Hono's default would answer it with plain text, which is
  // precisely the "text parsed as JSON" failure this guard exists to prevent.
  // Every non-API path falls through to the asset handling below.
  app.all('*', async (c, next) => {
    if (matches(new URL(c.req.url).pathname, API_PREFIXES)) {
      return c.json({ error: 'not_found' }, 404)
    }
    await next()
  })

  app.get('*', async (c) => {
    const url = new URL(c.req.url)
    const response = await c.env.ASSETS.fetch(c.req.raw)
    if (response.status !== 404) return response

    if (namesAFile(url.pathname) || isPlatformReservedPath(url.pathname)) {
      return c.json({ error: 'not_found' }, 404)
    }
    // Once the prerender has run, `/` is the landing page, not an empty
    // shell — serving it for /home would paint the landing for a frame and
    // hand crawlers the `/` canonical on every app route. Ask for the plain
    // shell the build writes first; a build without it (plain SPA,
    // `deepspace dev`) misses and falls through to `/` exactly as before.
    url.pathname = SPA_SHELL_PATH
    const shell = await c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw))
    if (shell.status !== 404) return shell
    // `/`, not `/index.html`: auto-trailing-slash redirects the explicit
    // filename, and the browser would follow it off the URL it asked for.
    url.pathname = '/'
    return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw))
  })
}
