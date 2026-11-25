/**
 * The sky: a canvas that renders daytime → stratosphere → indigo edge →
 * starfield → planets, driven by an eased "camera altitude" that chases the
 * game's target altitude. The plane sits on top as SVG; its pitch, bob and
 * exhaust flame are written directly to the DOM every frame (no React renders).
 */

import { useEffect, useRef, useState } from 'react'
import { ENGINES, type Tier } from './engine'
import type { FlightEvent } from './useGame'
import { Plane } from './Plane'
import { playBoost, playMiss, playSputter } from './sound'

interface Props {
  targetAltitude: number
  event: FlightEvent | null
  /** Called every frame with the displayed (eased) altitude in km. */
  onFrame?: (displayKm: number) => void
}

// ── colour helpers ─────────────────────────────────────────────────────────

type RGB = [number, number, number]
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const rgb = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Sky gradient keyframes: altitude km → [zenith, horizon]. */
const SKY: [number, RGB, RGB][] = [
  [0, hex('#4fb8f5'), hex('#d7f3ff')],
  [10, hex('#2f8fe0'), hex('#a8defc')],
  [35, hex('#1f5bc2'), hex('#6ea7e8')],
  [70, hex('#1a2378'), hex('#3c4fae')],
  [110, hex('#0d0a33'), hex('#251f6b')],
  [220, hex('#05040f'), hex('#0e0b28')],
  [600, hex('#020207'), hex('#0a0618')],
]

function skyAt(km: number): [RGB, RGB] {
  for (let i = 0; i < SKY.length - 1; i++) {
    const [a0, z0, h0] = SKY[i]
    const [a1, z1, h1] = SKY[i + 1]
    if (km <= a1) {
      const t = clamp((km - a0) / (a1 - a0), 0, 1)
      return [mix(z0, z1, t), mix(h0, h1, t)]
    }
  }
  const last = SKY[SKY.length - 1]
  return [last[1], last[2]]
}

// ── world objects ──────────────────────────────────────────────────────────

interface Cloud { x: number; y: number; s: number; depth: number; puffs: [number, number, number][]; wispy: boolean }
interface Star { x: number; y: number; r: number; depth: number; tw: number; hue: number }

function makeCloud(w: number, h: number, wispy: boolean, anywhere = true): Cloud {
  const depth = 0.35 + Math.random() * 0.75
  const s = (wispy ? 70 : 46) * (0.6 + depth)
  const n = wispy ? 3 : 4 + Math.floor(Math.random() * 3)
  const puffs: [number, number, number][] = []
  for (let i = 0; i < n; i++) {
    puffs.push(wispy
      ? [(i - n / 2) * s * 0.9, (Math.random() - 0.5) * s * 0.12, s * (0.5 + Math.random() * 0.4)]
      : [(i - n / 2) * s * 0.42, -Math.random() * s * 0.35, s * (0.35 + Math.random() * 0.3)])
  }
  return {
    x: anywhere ? Math.random() * w : w + s * 2,
    y: Math.random() * h,
    s,
    depth,
    puffs,
    wispy,
  }
}

function makeStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() < 0.08 ? 1.6 + Math.random() : 0.5 + Math.random() * 1.1,
    depth: 0.2 + Math.random() * 0.8,
    tw: Math.random() * Math.PI * 2,
    hue: Math.random(),
  }
}

// ── component ──────────────────────────────────────────────────────────────

export function FlightScene({ targetAltitude, event, onFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const planeWrapRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<SVGSVGElement>(null)
  const flameRef = useRef<SVGGElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  const targetRef = useRef(targetAltitude)
  const onFrameRef = useRef(onFrame)
  useEffect(() => {
    targetRef.current = targetAltitude
    onFrameRef.current = onFrame
  })

  /** Mutable effect state shared with the RAF loop. */
  const fx = useRef({ boostTier: 0 as Tier, boostAt: -1e9, trapAt: -1e9, missAt: -1e9 })
  const [puffs, setPuffs] = useState<{ id: number; dx: number; dy: number; d: number }[]>([])

  // React to one-shot events.
  useEffect(() => {
    if (!event) return
    const now = performance.now()
    if (event.kind === 'boost') {
      fx.current.boostTier = event.tier
      fx.current.boostAt = now
      playBoost(event.tier)
      if (event.tier === 4 && flashRef.current) {
        flashRef.current.classList.remove('ftl-flash')
        void flashRef.current.offsetWidth
        flashRef.current.classList.add('ftl-flash')
      }
    } else if (event.kind === 'trap') {
      fx.current.trapAt = now
      playSputter()
      const base = event.seq * 100
      setPuffs(Array.from({ length: 9 }, (_, i) => ({
        id: base + i,
        dx: -40 - Math.random() * 140,
        dy: -20 + Math.random() * 60,
        d: i * 0.18,
      })))
    } else if (event.kind === 'miss') {
      fx.current.missAt = now
      playMiss()
    }
  }, [event])

  useEffect(() => {
    const canvas = canvasRef.current!
    const g = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let dpr = 1
    let clouds: Cloud[] = []
    let stars: Star[] = []

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const area = (w * h) / (1280 * 800)
      clouds = [
        ...Array.from({ length: Math.round(14 * area) + 6 }, () => makeCloud(w, h, false)),
        ...Array.from({ length: Math.round(8 * area) + 4 }, () => makeCloud(w, h, true)),
      ]
      stars = Array.from({ length: Math.round(260 * area) + 80 }, () => makeStar(w, h))
    }
    resize()
    window.addEventListener('resize', resize)

    let alt = targetRef.current
    let pitch = 0
    let last = performance.now()
    let raf = 0
    let groundX = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000
      const target = targetRef.current
      const sinceTrap = (now - fx.current.trapAt) / 1000
      const falling = sinceTrap < 3.2

      // Ease camera altitude toward target. Falls glide; boosts punch.
      const prev = alt
      const rate = falling ? 1.1 : 2.4
      alt += (target - alt) * Math.min(1, dt * rate)
      if (Math.abs(target - alt) < 0.01) alt = target
      const v = (alt - prev) / Math.max(dt, 1e-4) // km/s
      const vScroll = Math.sign(v) * 230 * Math.log2(1 + Math.abs(v)) // px/s
      const sinceBoost = (now - fx.current.boostAt) / 1000
      const boosting = sinceBoost < 2.4 && !falling
      const tier = fx.current.boostTier
      const cruise = 70 + (boosting ? 160 * (1 + tier) * Math.max(0, 1 - sinceBoost / 2.4) : 0)

      // Sky
      const [zen, hor] = skyAt(alt)
      const sky = g.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, rgb(zen))
      sky.addColorStop(1, rgb(hor))
      g.fillStyle = sky
      g.fillRect(0, 0, w, h)

      // Sun (always there; gets crisper in space)
      const sunA = 1 - smooth(60, 160, alt) * 0.35
      const sx = w * 0.82
      const sy = h * 0.18
      const sunGlow = g.createRadialGradient(sx, sy, 0, sx, sy, 160)
      sunGlow.addColorStop(0, `rgba(255,250,220,${0.9 * sunA})`)
      sunGlow.addColorStop(0.25, `rgba(255,236,170,${0.45 * sunA})`)
      sunGlow.addColorStop(1, 'rgba(255,236,170,0)')
      g.fillStyle = sunGlow
      g.fillRect(sx - 160, sy - 160, 320, 320)
      g.fillStyle = `rgba(255,252,235,${0.95})`
      g.beginPath()
      g.arc(sx, sy, 26, 0, Math.PI * 2)
      g.fill()

      // Stars
      const starA = smooth(45, 130, alt)
      if (starA > 0.01) {
        const streak = boosting && tier >= 3 ? (tier === 4 ? 2.2 : 1.1) * Math.max(0, 1 - sinceBoost / 2.4) : 0
        for (const s of stars) {
          const dx = -cruise * 0.08 * s.depth * dt
          const dy = vScroll * 0.6 * s.depth * dt
          s.x += dx
          s.y += dy
          if (s.x < -10) s.x += w + 20
          if (s.y > h + 10) s.y -= h + 20
          if (s.y < -10) s.y += h + 20
          const tw = 0.65 + 0.35 * Math.sin(t * 2 + s.tw)
          const a = starA * tw
          const len = Math.abs(vScroll) * 0.025 * s.depth + streak * 120 * s.depth
          const col = s.hue < 0.15 ? `rgba(180,200,255,${a})` : s.hue > 0.92 ? `rgba(255,210,180,${a})` : `rgba(255,255,255,${a})`
          if (len > 2) {
            g.strokeStyle = col
            g.lineWidth = s.r
            g.beginPath()
            g.moveTo(s.x, s.y)
            g.lineTo(s.x + len * 0.55, s.y - len)
            g.stroke()
          } else {
            g.fillStyle = col
            g.beginPath()
            g.arc(s.x, s.y, s.r, 0, Math.PI * 2)
            g.fill()
          }
        }
      }

      // Nebula + planets in deep space
      const deep = smooth(250, 480, alt)
      if (deep > 0.01) {
        const drift = Math.sin(t * 0.05) * 10
        const neb = g.createRadialGradient(w * 0.25, h * 0.3, 0, w * 0.25, h * 0.3, w * 0.45)
        neb.addColorStop(0, `rgba(170,70,200,${0.18 * deep})`)
        neb.addColorStop(0.5, `rgba(70,60,190,${0.1 * deep})`)
        neb.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = neb
        g.fillRect(0, 0, w, h)

        // ringed planet
        drawPlanet(g, w * 0.7 + drift, h * 0.32, Math.min(w, h) * 0.09, '#e8c27a', '#a8743a', deep, true)
        // small red planet
        drawPlanet(g, w * 0.14 - drift, h * 0.2, Math.min(w, h) * 0.035, '#e06a4a', '#8a2d1d', deep, false)
      }
      const deeper = smooth(650, 1000, alt)
      if (deeper > 0.01) {
        drawPlanet(g, w * 0.48, h * 0.12, Math.min(w, h) * 0.05, '#8fe0ff', '#2a6aa8', deeper, false)
        drawPlanet(g, w * 0.9, h * 0.72, Math.min(w, h) * 0.13, '#c79bff', '#4b2a8a', deeper, true)
      }

      // Earth's limb rising into view, then dropping away
      const limbIn = smooth(60, 140, alt)
      if (limbIn > 0.01) {
        const away = clamp((alt - 140) / 900, 0, 1)
        const R = w * (2.2 - away * 1.4)
        const top = h - 130 * limbIn + away * 120
        const cx = w * 0.5
        const cy = top + R
        const atm = g.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.06)
        atm.addColorStop(0, `rgba(120,200,255,${0.7 * limbIn})`)
        atm.addColorStop(1, 'rgba(120,200,255,0)')
        g.fillStyle = atm
        g.beginPath()
        g.arc(cx, cy, R * 1.06, 0, Math.PI * 2)
        g.fill()
        const earth = g.createLinearGradient(0, top, 0, h)
        earth.addColorStop(0, `rgba(46,110,190,${limbIn})`)
        earth.addColorStop(1, `rgba(16,48,98,${limbIn})`)
        g.fillStyle = earth
        g.beginPath()
        g.arc(cx, cy, R, 0, Math.PI * 2)
        g.fill()
      }

      // Clouds
      const lowA = 1 - smooth(9, 20, alt)
      const wispA = smooth(6, 14, alt) * (1 - smooth(45, 75, alt))
      for (const c of clouds) {
        c.x -= cruise * c.depth * dt
        c.y += vScroll * c.depth * dt
        const m = c.s * 3
        if (c.x < -m) Object.assign(c, makeCloud(w, h, c.wispy, false), { y: Math.random() * h })
        if (c.y > h + m) Object.assign(c, makeCloud(w, h, c.wispy), { y: -m * 0.8 })
        if (c.y < -m) Object.assign(c, makeCloud(w, h, c.wispy), { y: h + m * 0.8 })
        const a = c.wispy ? wispA * 0.55 : lowA * (0.55 + c.depth * 0.45)
        if (a < 0.01) continue
        drawCloud(g, c, a)
      }

      // Ground & hills (only near the start)
      const groundOff = alt * 140
      if (groundOff < h * 0.6) {
        groundX = (groundX + cruise * 0.9 * dt) % 400
        const base = h - 70 + groundOff
        g.fillStyle = '#7cc46a'
        g.beginPath()
        g.moveTo(0, h + groundOff + 10)
        for (let x = 0; x <= w + 40; x += 40) {
          const wx = x + groundX
          g.lineTo(x, base - 30 - Math.sin(wx * 0.006) * 28 - Math.sin(wx * 0.017) * 10)
        }
        g.lineTo(w, h + groundOff + 10)
        g.fill()
        g.fillStyle = '#5aa64f'
        g.fillRect(0, base + 10, w, 200)
        g.fillStyle = '#6b6b6b'
        g.fillRect(0, base + 24, w, 18)
        g.fillStyle = '#f5f5f5'
        for (let x = -((groundX * 1.4) % 80); x < w; x += 80) g.fillRect(x, base + 31, 40, 4)
      }

      // Hyperdrive / FTL warp tunnel
      if (boosting && tier >= 3) {
        const k = Math.max(0, 1 - sinceBoost / 2.2)
        const vx = w * 0.72
        const vy = h * 0.32
        const n = tier === 4 ? 90 : 40
        g.lineCap = 'round'
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 + i * 0.37
          const r0 = 40 + ((t * 900 + i * 53) % (Math.max(w, h)))
          const r1 = r0 + 60 + 260 * k
          const hueCol = tier === 4 ? `hsla(${(i * 37 + t * 200) % 360},100%,80%,${0.55 * k})` : `rgba(210,170,255,${0.45 * k})`
          g.strokeStyle = hueCol
          g.lineWidth = tier === 4 ? 2.2 : 1.4
          g.beginPath()
          g.moveTo(vx + Math.cos(ang) * r0, vy + Math.sin(ang) * r0)
          g.lineTo(vx + Math.cos(ang) * r1, vy + Math.sin(ang) * r1)
          g.stroke()
        }
      }

      // ── Plane ────────────────────────────────────────────────────────────
      const wantPitch = falling ? clamp(-v * 2.2, 6, 24) + Math.sin(t * 9) * 3 : -clamp(v * 1.6, 0, 26)
      pitch += (wantPitch - pitch) * Math.min(1, dt * 5)
      const sinceMiss = (now - fx.current.missAt) / 1000
      const shake = (falling ? 4 * Math.max(0, 1 - sinceTrap / 2) : 0) + (sinceMiss < 0.35 ? 3 : 0)
      const bob = Math.sin(t * 1.7) * 7
      const sx2 = (Math.random() - 0.5) * shake
      const sy2 = (Math.random() - 0.5) * shake
      const surge = boosting ? 18 * Math.max(0, 1 - sinceBoost / 1.2) : 0
      if (planeWrapRef.current) {
        planeWrapRef.current.style.transform = `translate(${sx2 + surge}px, ${bob + sy2}px) rotate(${pitch}deg)`
      }
      if (flameRef.current) {
        const eng = ENGINES[boosting ? tier : 0]
        const power = falling ? 0 : boosting ? 0.75 + 0.35 * tier * Math.max(0, 1 - sinceBoost / 2.4) + Math.log2(1 + Math.abs(v)) * 0.18 : 0.42
        const flicker = 1 + Math.sin(t * 40) * 0.08 + Math.random() * 0.08
        const sputterBlip = falling && Math.sin(t * 13) > 0.85 ? 0.35 : 0
        const s = Math.max(power, sputterBlip) * flicker
        flameRef.current.style.transform = `scale(${s}, ${0.8 + s * 0.25})`
        flameRef.current.style.opacity = s < 0.02 ? '0' : '1'
        const root = planeRef.current
        if (root) {
          root.style.setProperty('--flame', falling ? '#888' : eng.color)
          root.style.setProperty('--flame-glow', falling ? '#ccc' : eng.glow)
          root.style.filter = boosting && tier >= 2 ? `drop-shadow(0 0 ${8 + tier * 6}px ${eng.color})` : 'none'
        }
      }

      onFrameRef.current?.(alt)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="plane-anchor">
        <div ref={planeWrapRef} className="plane-wrap">
          <Plane ref={planeRef} flameRef={flameRef} />
          {puffs.map((p) => (
            <span
              key={p.id}
              className="smoke-puff"
              style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.d}s` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <div ref={flashRef} className="pointer-events-none absolute inset-0" />
    </div>
  )
}

function drawCloud(g: CanvasRenderingContext2D, c: Cloud, a: number) {
  if (c.wispy) {
    g.fillStyle = `rgba(255,255,255,${a})`
    for (const [px, py, r] of c.puffs) {
      g.beginPath()
      g.ellipse(c.x + px, c.y + py, r * 1.6, r * 0.18, -0.04, 0, Math.PI * 2)
      g.fill()
    }
    return
  }
  // shadow underside
  g.fillStyle = `rgba(170,200,230,${a})`
  for (const [px, py, r] of c.puffs) {
    g.beginPath()
    g.arc(c.x + px + 3, c.y + py + 6, r, 0, Math.PI * 2)
    g.fill()
  }
  g.fillStyle = `rgba(255,255,255,${a})`
  for (const [px, py, r] of c.puffs) {
    g.beginPath()
    g.arc(c.x + px, c.y + py, r, 0, Math.PI * 2)
    g.fill()
  }
  // flat bottom
  const minX = Math.min(...c.puffs.map((p) => p[0] - p[2] * 0.6))
  const maxX = Math.max(...c.puffs.map((p) => p[0] + p[2] * 0.6))
  g.fillRect(c.x + minX, c.y, maxX - minX, c.s * 0.3)
}

function drawPlanet(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  light: string,
  dark: string,
  a: number,
  ring: boolean,
) {
  g.save()
  g.globalAlpha = a
  if (ring) {
    g.strokeStyle = 'rgba(240,220,180,0.55)'
    g.lineWidth = r * 0.12
    g.beginPath()
    g.ellipse(x, y, r * 1.9, r * 0.45, -0.35, Math.PI, Math.PI * 2)
    g.stroke()
  }
  const grd = g.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r)
  grd.addColorStop(0, light)
  grd.addColorStop(1, dark)
  g.fillStyle = grd
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fill()
  if (ring) {
    g.strokeStyle = 'rgba(240,220,180,0.7)'
    g.lineWidth = r * 0.12
    g.beginPath()
    g.ellipse(x, y, r * 1.9, r * 0.45, -0.35, 0, Math.PI)
    g.stroke()
  }
  g.restore()
}
