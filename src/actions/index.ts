import type { ActionHandler } from 'deepspace/worker'
import type { Env } from '../../worker'
import { cleanCallsign } from '../game/callsign'
import { isLoggableDay, scoreFlight } from '../game/score'

/**
 * Actions run with record permissions off, so each one writes only rows
 * belonging to the verified `userId` and never trusts an id from `params`.
 */

/** Log the caller's flight. The score is recomputed from their answers. */
const logFlight: ActionHandler<Env> = async ({ params, tools }) => {
  const pilot = cleanCallsign(params.pilot)
  if (!pilot) return { success: false, error: 'Pick a different callsign: up to 24 plain letters and numbers.' }
  if (!isLoggableDay(params.day)) return { success: false, error: "Only today's flight can be logged." }
  const score = scoreFlight(params.day, params.rounds)
  if (!score) return { success: false, error: "That flight doesn't add up." }

  // `pilotId` is stamped from the verified caller; uniqueOn refuses a second row.
  const saved = await tools.create('flights', { pilot, day: params.day, ...score })
  if (!saved.success) {
    const dupe = saved.error?.startsWith('Duplicate')
    return { success: false, error: dupe ? 'You already logged a flight for this day.' : 'Could not log the flight.' }
  }
  return { success: true, data: { pilot, ...score } }
}

/** Erase the caller's flights and profile row from this app. */
const deleteMyData: ActionHandler<Env> = async ({ userId, tools }) => {
  const PAGE = 500
  for (;;) {
    const res = await tools.deleteWhere('flights', { pilotId: userId }, PAGE)
    if (!res.success) return { success: false, error: 'Could not delete your flights.' }
    if (((res.data as { deleted?: number } | undefined)?.deleted ?? 0) < PAGE) break
  }
  const gone = await tools.remove('users', userId)
  if (!gone.success) {
    const left = await tools.query('users', { where: { recordId: userId }, limit: 1 })
    const rows = (left.data as { records?: unknown[] } | undefined)?.records
    if (!left.success || !rows || rows.length > 0) return { success: false, error: 'Could not delete your profile.' }
  }
  return { success: true, data: { deleted: true } }
}

export const actions: Record<string, ActionHandler<Env>> = { logFlight, deleteMyData }
