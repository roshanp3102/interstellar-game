/** Server-side scoring: rebuilds a flight from the answers, ignoring claimed totals. */

import { ENGINES, GUESSES_PER_ROUND, ROUNDS, dailyRounds, dayKey, stageFor } from './engine'

/** A flight finished just before midnight can still be logged for an hour. */
const GRACE_MS = 60 * 60 * 1000

export function isLoggableDay(day: unknown, now: number = Date.now()): day is string {
  return typeof day === 'string' && (day === dayKey(now) || day === dayKey(now - GRACE_MS))
}

export interface ScoredFlight {
  altitude: number
  stage: string
  answers: number
}

/** `rounds[i]` lists the answer ids given in round i, in order. Null if impossible. */
export function scoreFlight(day: string, rounds: unknown): ScoredFlight | null {
  if (!Array.isArray(rounds) || rounds.length !== ROUNDS) return null
  const daily = dailyRounds(day)
  let altitude = 0
  let answers = 0
  for (let r = 0; r < ROUNDS; r++) {
    const ids: unknown = rounds[r]
    if (!Array.isArray(ids) || ids.length > GUESSES_PER_ROUND) return null
    const { prompt, trap } = daily[r]
    const seen = new Set<string>()
    let climbed = 0
    for (let i = 0; i < ids.length; i++) {
      const answer = prompt.answers.find((a) => a.id === ids[i])
      if (!answer || seen.has(answer.id)) return null
      seen.add(answer.id)
      if (answer.id === trap.id) {
        // The trap ends the round, so nothing can follow it.
        if (i !== ids.length - 1) return null
        climbed = 0
      } else {
        climbed += ENGINES[answer.tier].km
        answers++
      }
    }
    altitude += climbed
  }
  return { altitude, stage: stageFor(altitude).name, answers }
}
