import { useEffect, useState } from 'react'
import { ENGINES, GUESSES_PER_ROUND, ROUND_SECONDS, ROUNDS, dayKey, formatKm, secondsToNextDay, stageFor, type Answer } from './engine'
import type { GameState, RoundLog } from './useGame'
import { Leaderboard, LogFlight } from './Leaderboard'

export function TitleCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="overlay">
      <div className="paper-card overlay-card max-w-2xl">
        <span className="tape tape-l" />
        <span className="tape tape-r" />
        <p className="text-sm uppercase tracking-[0.3em] opacity-70">A cardboard flight of fancy</p>
        <h1 className="font-marker mt-1 text-5xl sm:text-6xl">Interstellar</h1>
        <p className="mt-3 text-lg leading-snug">
          Seven rounds, the same for everyone, new every day. One flight per day. <b>{ROUND_SECONDS} seconds</b> and up to <b>{GUESSES_PER_ROUND} guesses</b> to
          name things that fit a mystery category. The rarer your answer, the bigger the engine it fires. Answers not on
          our list don't use up a guess.
        </p>
        <ul className="mt-4 grid gap-1.5 text-left sm:grid-cols-2">
          {ENGINES.map((e) => (
            <li key={e.tier} className="engine-row">
              <span className="engine-swatch" style={{ background: e.color, boxShadow: `0 0 10px ${e.glow}` }} />
              <span>
                <b>{e.name}</b> <span className="opacity-70">+{e.km} km</span>
                <br />
                <span className="text-sm opacity-75">{e.blurb}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="trap-note mt-4">
          <b>Beware:</b> every category hides one secret trap answer. Say it and your engine coughs out — you lose the
          whole round's climb and glide back down. Obvious answers hide it most often. Bank your altitude whenever
          your nerve runs out.
        </p>
        <button className="btn btn-fire mt-5 px-8 py-3 text-2xl" onClick={onStart} autoFocus>
          Take off ✈
        </button>
      </div>
    </div>
  )
}

export function Briefing({ state, onLaunch }: { state: GameState; onLaunch: () => void }) {
  return (
    <div className="overlay">
      <div className="paper-card overlay-card max-w-lg">
        <span className="tape tape-c" />
        <p className="text-sm uppercase tracking-[0.3em] opacity-70">
          Round {state.round + 1} of {ROUNDS}
        </p>
        <h2 className="font-marker mt-2 text-4xl leading-tight">Mystery category</h2>
        <p className="mt-3 opacity-80">
          Current altitude <b>{formatKm(state.altitude)}</b> · {stageFor(state.altitude).name}
        </p>
        <p className="mt-1 text-sm opacity-70">The category and the clock both start when you do.</p>
        <button className="btn btn-fire mt-5 px-8 py-3 text-2xl" onClick={onLaunch} autoFocus>
          Start round
        </button>
      </div>
    </div>
  )
}

const REASON: Record<RoundLog['reason'], string> = {
  trap: 'Engine sputtered — you glided back down.',
  time: 'Time ran out — altitude banked.',
  banked: 'You levelled off and banked it.',
  guesses: 'Out of guesses — altitude banked.',
}

/** A few answers the player didn't say, one from each of the rarest tiers. */
function deepCuts(log: RoundLog): Answer[] {
  const said = new Set(log.guesses.map((g) => g.answer.id))
  const out: Answer[] = []
  for (const tier of [4, 3, 2]) {
    const pool = log.prompt.answers.filter((a) => a.tier === tier && !said.has(a.id) && a.id !== log.trap.id)
    if (pool.length) out.push(pool[(log.prompt.answers.length + tier * 7) % pool.length])
  }
  return out
}

export function Debrief({ state, onNext }: { state: GameState; onNext: () => void }) {
  const log = state.log[state.log.length - 1]
  if (!log) return null
  const gained = log.endAlt - log.startAlt
  const last = state.round + 1 >= ROUNDS
  const hitTrap = log.reason === 'trap'
  return (
    <div className="overlay overlay-delayed">
      <div className={`paper-card overlay-card max-w-lg ${hitTrap ? 'card-trap' : ''}`}>
        <span className="tape tape-c" />
        <p className="text-sm uppercase tracking-[0.3em] opacity-70">Round {state.round + 1} debrief</p>
        <h2 className="font-marker mt-1 text-4xl">{hitTrap ? 'Sputter!' : `+${gained} km`}</h2>
        <p className="mt-1">{REASON[log.reason]}</p>

        <div className="mt-4 rounded-md border-2 border-dashed border-[#c9a978] p-3 text-left">
          <div className="text-xs uppercase tracking-widest opacity-70">The hidden trap was</div>
          <div className="font-marker text-2xl text-[#e8463a]">{log.trap.display}</div>
        </div>

        {log.guesses.length > 0 && (
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
            {log.guesses.map((g, i) => (
              <li key={i} className={`chip chip-${g.kind} tier-${g.answer.tier}`}>
                {g.answer.display}
                <small>{g.kind === 'boost' ? ` +${g.km}` : ' trap'}</small>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 text-sm opacity-80">
          Deep cuts you could have reached for:{' '}
          {deepCuts(log).map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              <b>{a.display}</b> <span className="opacity-70">({ENGINES[a.tier].short})</span>
            </span>
          ))}
        </div>

        <button className="btn btn-fire mt-5 px-8 py-3 text-xl" onClick={onNext} autoFocus>
          {last ? 'Land & see final altitude' : 'Next round →'}
        </button>
      </div>
    </div>
  )
}

/** Counts down to tomorrow's flight, then offers it. */
function NextFlight({ day, onReady }: { day: string; onReady: () => void }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  if (dayKey(now) !== day) {
    return (
      <button className="btn btn-fire mt-6 px-8 py-3 text-2xl" onClick={onReady}>
        Fly today's flight ✈
      </button>
    )
  }
  const left = secondsToNextDay(now)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="mt-6" data-testid="next-flight">
      <p>You've flown today. Next flight in</p>
      <p className="font-marker text-3xl tabular-nums">
        {pad(Math.floor(left / 3600))}:{pad(Math.floor(left / 60) % 60)}:{pad(left % 60)}
      </p>
    </div>
  )
}

export function Landed({ state, onAgain }: { state: GameState; onAgain: () => void }) {
  const answers = state.log.reduce((n, l) => n + l.guesses.filter((g) => g.kind === 'boost').length, 0)
  const traps = state.log.filter((l) => l.reason === 'trap').length
  const best = state.log.reduce((m, l) => Math.max(m, l.endAlt - l.startAlt), 0)
  const stage = stageFor(state.altitude).name
  return (
    <div className="overlay overlay-scroll">
      <div className="paper-card overlay-card max-w-3xl">
        <span className="tape tape-l" />
        <span className="tape tape-r" />
        <p className="text-sm uppercase tracking-[0.3em] opacity-70">Flight log</p>
        <h2 className="font-marker mt-1 text-5xl">{formatKm(state.altitude)}</h2>
        <p className="text-xl">Reached: <b>{stage}</b></p>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
          <span className="stat">{answers} answers fired</span>
          <span className="stat">best round +{best} km</span>
          <span className="stat">{traps} trap{traps === 1 ? '' : 's'} hit</span>
        </div>

        <div className="mt-5 grid gap-5 text-left md:grid-cols-2">
          <div>
            <h3 className="font-marker text-xl">Your rounds</h3>
            <ol className="mt-1 space-y-1 text-sm">
              {state.log.map((l, i) => (
                <li key={i} className="flex justify-between gap-2 border-b border-dashed border-[#d8c3a0] pb-1">
                  <span className="truncate">{i + 1}. {l.prompt.category}</span>
                  <span className={l.reason === 'trap' ? 'text-[#e8463a]' : ''}>
                    {l.reason === 'trap' ? `trap: ${l.trap.display}` : `+${l.endAlt - l.startAlt} km`}
                  </span>
                </li>
              ))}
            </ol>
            <LogFlight day={state.day} altitude={state.altitude} rounds={state.log.map((l) => l.guesses.map((g) => g.answer.id))} />
          </div>
          <Leaderboard highlightAltitude={state.altitude} />
        </div>

        <NextFlight day={state.day} onReady={onAgain} />
      </div>
    </div>
  )
}
