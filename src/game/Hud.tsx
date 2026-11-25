import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ENGINES, GUESSES_PER_ROUND, ROUND_SECONDS, ROUNDS, STAGES, formatKm, stageFor } from './engine'
import type { FlightEvent, GameState } from './useGame'
import { playTick } from './sound'

// ── Altimeter ──────────────────────────────────────────────────────────────

const GAUGE_MAX = 850
const gaugePos = (km: number) => Math.log10(1 + Math.max(0, km)) / Math.log10(1 + GAUGE_MAX)

export function Altimeter({ readoutRef, stageRef, markerRef }: {
  readoutRef: React.RefObject<HTMLSpanElement | null>
  stageRef: React.RefObject<HTMLSpanElement | null>
  markerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="altimeter paper-card">
      <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">Altitude</div>
      <span ref={readoutRef} className="font-marker block text-2xl leading-tight tabular-nums">0.0 km</span>
      <span ref={stageRef} className="block text-sm leading-tight opacity-80">Lower Clouds</span>
      <div className="gauge" aria-hidden>
        {STAGES.map((s) => (
          <div key={s.name} className="gauge-tick" style={{ bottom: `${gaugePos(s.from) * 100}%` }}>
            <span>{s.name}</span>
          </div>
        ))}
        <div ref={markerRef} className="gauge-marker" />
      </div>
    </div>
  )
}

export function updateAltimeter(
  km: number,
  refs: { readout: HTMLSpanElement | null; stage: HTMLSpanElement | null; marker: HTMLDivElement | null },
) {
  if (refs.readout) refs.readout.textContent = formatKm(km)
  if (refs.stage) refs.stage.textContent = stageFor(km).name
  if (refs.marker) refs.marker.style.bottom = `${gaugePos(km) * 100}%`
}

// ── Timer ring ─────────────────────────────────────────────────────────────

export function TimerRing({ timeLeft, active }: { timeLeft: number; active: boolean }) {
  const frac = Math.max(0, Math.min(1, timeLeft / ROUND_SECONDS))
  const r = 26
  const c = 2 * Math.PI * r
  const urgent = active && timeLeft <= 5
  const secs = Math.ceil(timeLeft)
  const lastTick = useRef(secs)
  useEffect(() => {
    if (!active) return
    if (secs !== lastTick.current && secs <= 5 && secs > 0) playTick(secs <= 3)
    lastTick.current = secs
  }, [secs, active])

  return (
    <div className={`timer-ring paper-card ${urgent ? 'urgent' : ''}`} aria-label={`${secs} seconds left`}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e9dcc2" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={urgent ? '#e8463a' : '#2b1d10'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <span className="font-marker absolute inset-0 flex items-center justify-center text-xl tabular-nums">{secs}</span>
    </div>
  )
}

// ── Event banner ───────────────────────────────────────────────────────────

export function EventBanner({ event, trapName }: { event: FlightEvent | null; trapName?: string }) {
  const [shown, setShown] = useState<FlightEvent | null>(null)
  useEffect(() => {
    if (!event) return
    setShown(event)
    const id = window.setTimeout(() => setShown(null), event.kind === 'trap' ? 2600 : 1700)
    return () => window.clearTimeout(id)
  }, [event])
  if (!shown) return null

  let title = ''
  let sub = ''
  let color = '#2b1d10'
  if (shown.kind === 'boost') {
    const e = ENGINES[shown.tier]
    title = `${e.name}!`
    sub = `+${e.km} km`
    color = e.color === '#ffffff' ? '#ff5ce1' : e.color
  } else if (shown.kind === 'trap') {
    title = 'Engine sputter!'
    sub = trapName ? `"${trapName}" was the trap` : 'You hit the trap'
    color = '#e8463a'
  } else if (shown.kind === 'miss') {
    title = 'Not on our list'
    sub = 'No guess used — try another'
    color = '#6b5a45'
  } else {
    title = 'Already logged'
    sub = 'Repeats are free — try another'
    color = '#6b5a45'
  }

  return (
    <div key={shown.seq} className={`event-banner ${shown.kind === 'boost' ? `tier-${shown.tier}` : shown.kind}`}>
      <div className="font-marker text-3xl sm:text-5xl" style={{ color, WebkitTextStroke: '1px #2b1d10' }}>
        {title}
      </div>
      <div className="mt-1 text-lg sm:text-2xl">{sub}</div>
    </div>
  )
}

// ── Guess console ──────────────────────────────────────────────────────────

export function GuessConsole({ state, onGuess, onBank }: {
  state: GameState
  onGuess: (t: string) => void
  onBank: () => void
}) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const flying = state.phase === 'flying'

  useEffect(() => {
    if (flying) inputRef.current?.focus()
  }, [flying, state.round])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onGuess(text)
    setText('')
  }

  const gained = state.altitude - state.roundStartAlt
  const slots = Array.from({ length: GUESSES_PER_ROUND }, (_, i) => state.guesses[i])

  return (
    <div className="console paper-card">
      <div className="mb-2 flex flex-wrap gap-1.5" aria-label="Guesses this round">
        {slots.map((g, i) => (
          <div
            key={i}
            className={`slot ${g ? `slot-${g.kind}` : ''} ${g ? `tier-${g.answer.tier}` : ''}`}
            title={g ? g.text : 'Unused guess'}
          >
            {g ? (
              <>
                <span className="truncate">{g.answer.display}</span>
                <span className="slot-tag">
                  {g.kind === 'boost' ? ENGINES[g.answer.tier].short : 'TRAP'}
                </span>
              </>
            ) : (
              <span className="opacity-40">guess {i + 1}</span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!flying}
          placeholder={flying ? 'Type an answer and hit Enter…' : 'Waiting for takeoff…'}
          className="guess-input"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Your answer"
        />
        <button type="submit" disabled={!flying || !text.trim()} className="btn btn-fire">
          Fire!
        </button>
      </form>
      <div className="mt-2 flex items-center justify-between gap-2 text-sm">
        <span className="opacity-80">
          This round: <b className="tabular-nums">+{gained.toFixed(0)} km</b> · {GUESSES_PER_ROUND - state.guesses.length} {GUESSES_PER_ROUND - state.guesses.length === 1 ? 'guess' : 'guesses'} left
        </span>
        <button type="button" onClick={onBank} disabled={!flying || state.guesses.length === 0} className="btn btn-bank">
          Bank it<span className="hidden sm:inline"> &amp; level off</span>
        </button>
      </div>
    </div>
  )
}

export function RoundPill({ round }: { round: number }) {
  return (
    <div className="flex gap-1" aria-label={`Round ${round + 1} of ${ROUNDS}`}>
      {Array.from({ length: ROUNDS }, (_, i) => (
        <span key={i} className={`round-dot ${i < round ? 'done' : i === round ? 'now' : ''}`} />
      ))}
    </div>
  )
}
