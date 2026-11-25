import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthOverlay, useAuth, useQuery } from 'deepspace'
import { runAction } from '../lib/action'
import { CALLSIGN_MAX, DEFAULT_CALLSIGN, cleanCallsign } from './callsign'
import { formatKm } from './engine'

export interface Flight {
  pilotId?: string
  pilot: string
  day?: string
  altitude: number
  stage: string
  answers: number
}

export function Leaderboard({ highlightAltitude, limit = 10 }: { highlightAltitude?: number; limit?: number }) {
  const { records, status } = useQuery<Flight>('flights', { orderBy: 'altitude', orderDir: 'desc', limit })
  const rows = [...records].sort((a, b) => b.data.altitude - a.data.altitude).slice(0, limit)
  return (
    <div data-testid="leaderboard">
      <h3 className="font-marker text-xl">Highest flights</h3>
      {status === 'loading' ? (
        <p className="mt-1 text-sm opacity-70">Radioing the tower…</p>
      ) : rows.length === 0 ? (
        <p className="mt-1 text-sm opacity-70">No flights logged yet. Be the first into orbit.</p>
      ) : (
        <ol className="mt-1 space-y-1 text-sm">
          {rows.map((r, i) => (
            <li
              key={r.recordId}
              className={`flex justify-between gap-2 border-b border-dashed border-[#d8c3a0] pb-1 ${
                highlightAltitude !== undefined && r.data.altitude === highlightAltitude ? 'font-bold' : ''
              }`}
            >
              <span className="truncate">
                <span className="inline-block w-6 opacity-60">{i + 1}.</span>
                {r.data.pilot}
                <span className="ml-1 opacity-60">· {r.data.stage}</span>
              </span>
              <span className="tabular-nums">{formatKm(r.data.altitude)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/** `rounds` holds the answer ids given each round; the server works out the score. */
export function LogFlight({ day, altitude, rounds }: { day: string; altitude: number; rounds: string[][] }) {
  const { isSignedIn, isLoaded } = useAuth()
  const [pilot, setPilot] = useState('')
  const [savedAs, setSavedAs] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAuth, setShowAuth] = useState(false)

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className="mt-4 rounded-md bg-[#f7ecd6] p-3 text-sm">
        <p>Sign in to log this flight on the global board. <Link to="/privacy" className="underline">Privacy</Link></p>
        <button className="btn btn-bank mt-2" onClick={() => setShowAuth(true)}>
          Sign in to log flight
        </button>
        {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  if (savedAs) {
    return <p className="mt-4 rounded-md bg-[#e6f4d9] p-3 text-sm">Flight logged as <b>{savedAs}</b>. Blue skies!</p>
  }

  const save = async () => {
    if (!cleanCallsign(pilot)) {
      setError(`Pick a different callsign: up to ${CALLSIGN_MAX} plain letters and numbers.`)
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await runAction<{ pilot: string }>('logFlight', { day, pilot, rounds })
      setSavedAs(res.pilot)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log the flight.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 rounded-md bg-[#f7ecd6] p-3 text-sm">
      <label className="block">
        Pilot callsign
        <input
          className="guess-input mt-1 py-1.5 text-base"
          value={pilot}
          placeholder={DEFAULT_CALLSIGN}
          maxLength={CALLSIGN_MAX}
          onChange={(e) => setPilot(e.target.value)}
        />
      </label>
      <button className="btn btn-fire mt-2" disabled={saving} onClick={save}>
        {saving ? 'Logging…' : `Log ${formatKm(altitude)}`}
      </button>
      {error && <p className="mt-1 text-[#e8463a]" role="alert">{error}</p>}
      <p className="mt-1 opacity-70">
        Your callsign is public. <Link to="/privacy" className="underline">Privacy</Link>
      </p>
    </div>
  )
}
