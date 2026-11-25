/**
 * The one WebSocket the game needs: this app's record room.
 *
 * Canvas, document, presence, cron and job rooms are deliberately not routed,
 * and a room id other than the app's own is refused, so a visitor cannot open
 * arbitrary rooms. Identity comes only from a verified JWT.
 */

import type { Hono } from 'hono'
import { authenticatedRoomRequest, verifyJwt } from 'deepspace/worker'
import type { VerifyResult } from 'deepspace/worker'
import type { AppContext } from '../../worker.js'

export function registerRealtimeRoutes(app: Hono<AppContext>): void {
  app.get('/ws/:roomId', async (c) => {
    const roomId = `app:${c.env.DEEPSPACE_APP_ID}`
    if (c.req.param('roomId') !== roomId) return c.json({ error: 'not_found' }, 404)
    if (c.req.header('Upgrade')?.toLowerCase() !== 'websocket') {
      return c.json({ error: 'upgrade_required' }, 426)
    }

    const token = new URL(c.req.url).searchParams.get('token')
    let auth: VerifyResult | null = null
    if (token) {
      auth = (await verifyJwt({ publicKey: c.env.AUTH_JWT_PUBLIC_KEY, issuer: c.env.AUTH_JWT_ISSUER }, token)).result
      if (!auth) return new Response('Unauthorized', { status: 401 })
    }
    const stub = c.env.RECORD_ROOMS.get(c.env.RECORD_ROOMS.idFromName(roomId))
    return stub.fetch(authenticatedRoomRequest(c.req.raw, auth))
  })
  app.all('/ws/*', (c) => c.json({ error: 'not_found' }, 404))
}
