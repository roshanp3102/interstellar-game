import { useCallback, useEffect, useReducer, useState } from 'react'
import {
  ENGINES,
  GUESSES_PER_ROUND,
  ROUND_SECONDS,
  ROUNDS,
  matchAnswer,
  dailyRounds,
  dayKey,
  type Answer,
  type CompiledPrompt,
  type DailyRound,
  type Tier,
} from './engine'

export type Phase = 'title' | 'briefing' | 'flying' | 'debrief' | 'landed'
export type EndReason = 'trap' | 'time' | 'banked' | 'guesses'

export interface Guess {
  text: string
  kind: 'boost' | 'trap'
  answer: Answer
  km: number
}

export interface RoundLog {
  prompt: CompiledPrompt
  trap: Answer
  guesses: Guess[]
  startAlt: number
  endAlt: number
  reason: EndReason
}

/** A one-shot event the scene and HUD react to (keyed by seq). */
export type FlightEvent =
  | { seq: number; kind: 'boost'; tier: Tier }
  | { seq: number; kind: 'trap' }
  | { seq: number; kind: 'miss' }
  | { seq: number; kind: 'dupe'; text: string }

export interface GameState {
  phase: Phase
  /** Game day this flight belongs to (YYYY-MM-DD). */
  day: string
  rounds: DailyRound[]
  round: number
  altitude: number
  roundStartAlt: number
  trap: Answer | null
  guesses: Guess[]
  log: RoundLog[]
  endsAt: number
  event: FlightEvent | null
}

type Action =
  | { type: 'start'; day: string }
  | { type: 'restore'; state: GameState }
  | { type: 'launchRound'; now: number }
  | { type: 'guess'; text: string }
  | { type: 'bank' }
  | { type: 'timeout' }
  | { type: 'next' }

export const initial: GameState = {
  phase: 'title',
  day: '',
  rounds: [],
  round: 0,
  altitude: 0,
  roundStartAlt: 0,
  trap: null,
  guesses: [],
  log: [],
  endsAt: 0,
  event: null,
}

let seq = 0
const nextSeq = () => ++seq

function endRound(s: GameState, reason: EndReason, extra: Partial<GameState> = {}): GameState {
  const merged = { ...s, ...extra }
  const entry: RoundLog = {
    prompt: merged.rounds[merged.round].prompt,
    trap: merged.trap!,
    guesses: merged.guesses,
    startAlt: merged.roundStartAlt,
    endAlt: merged.altitude,
    reason,
  }
  return { ...merged, phase: 'debrief', log: [...merged.log, entry] }
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'start':
      return { ...initial, phase: 'briefing', day: a.day, rounds: dailyRounds(a.day) }

    case 'restore':
      return a.state

    case 'launchRound': {
      if (s.phase !== 'briefing') return s
      return {
        ...s,
        phase: 'flying',
        trap: s.rounds[s.round].trap,
        guesses: [],
        roundStartAlt: s.altitude,
        endsAt: a.now + ROUND_SECONDS * 1000,
        event: null,
      }
    }

    case 'guess': {
      if (s.phase !== 'flying') return s
      const text = a.text.trim()
      if (!text) return s
      const { prompt } = s.rounds[s.round]
      const answer = matchAnswer(prompt, text)

      // Only answers on the list cost a guess; anything else is free.
      if (!answer) return { ...s, event: { seq: nextSeq(), kind: 'miss' } }

      // Repeats never cost a guess either.
      if (s.guesses.some((g) => g.answer.id === answer.id)) {
        return { ...s, event: { seq: nextSeq(), kind: 'dupe', text } }
      }

      if (s.trap && answer.id === s.trap.id) {
        const guesses = [...s.guesses, { text, kind: 'trap' as const, answer, km: 0 }]
        return endRound(s, 'trap', {
          guesses,
          altitude: s.roundStartAlt,
          event: { seq: nextSeq(), kind: 'trap' },
        })
      }

      const km = ENGINES[answer.tier].km
      const guesses = [...s.guesses, { text, kind: 'boost' as const, answer, km }]
      const altitude = s.altitude + km
      const event: FlightEvent = { seq: nextSeq(), kind: 'boost', tier: answer.tier }
      if (guesses.length >= GUESSES_PER_ROUND) return endRound(s, 'guesses', { guesses, altitude, event })
      return { ...s, guesses, altitude, event }
    }

    case 'bank':
      return s.phase === 'flying' ? endRound(s, 'banked') : s

    case 'timeout':
      return s.phase === 'flying' ? endRound(s, 'time') : s

    case 'next':
      if (s.phase !== 'debrief') return s
      if (s.round + 1 >= ROUNDS) return { ...s, phase: 'landed', event: null }
      return { ...s, phase: 'briefing', round: s.round + 1, trap: null, guesses: [], event: null }
  }
}

// ── One flight per day, remembered on this device ───────────────────────────

const STORE_KEY = 'interstellar.flight'

function loadToday(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as GameState
    return saved.day === dayKey() ? { ...saved, event: null } : null
  } catch {
    return null
  }
}

function saveFlight(state: GameState) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, event: null }))
  } catch {
    // Private mode or full storage: the flight still plays, it just isn't remembered.
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial, (s) => loadToday() ?? s)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const { phase, endsAt } = state

  // Saved on every step, so a refresh resumes the flight. A running clock keeps running.
  useEffect(() => {
    if (state.phase !== 'title') saveFlight(state)
  }, [state])

  useEffect(() => {
    if (phase !== 'flying') return
    const tick = () => {
      const left = Math.max(0, (endsAt - Date.now()) / 1000)
      setTimeLeft(left)
      if (left <= 0) dispatch({ type: 'timeout' })
    }
    tick()
    const id = window.setInterval(tick, 100)
    return () => window.clearInterval(id)
  }, [phase, endsAt])

  const start = useCallback(() => {
    // Another tab may already have started or finished today's flight.
    const saved = loadToday()
    if (saved) dispatch({ type: 'restore', state: saved })
    else dispatch({ type: 'start', day: dayKey() })
  }, [])

  const launchRound = useCallback(() => {
    setTimeLeft(ROUND_SECONDS)
    dispatch({ type: 'launchRound', now: Date.now() })
  }, [])

  return {
    state,
    timeLeft: state.phase === 'briefing' ? ROUND_SECONDS : timeLeft,
    start,
    launchRound,
    guess: useCallback((text: string) => dispatch({ type: 'guess', text }), []),
    bank: useCallback(() => dispatch({ type: 'bank' }), []),
    next: useCallback(() => dispatch({ type: 'next' }), []),
  }
}
