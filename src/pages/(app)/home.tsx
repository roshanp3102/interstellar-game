/**
 * Hangar — the leaderboard and a launch button.
 */

import { Link } from 'react-router-dom'
import { Leaderboard } from '../../game/Leaderboard'

export default function HomePage() {
  return (
    <div
      className="flex min-h-full flex-col items-center px-4 py-10"
      style={{ fontFamily: "'Patrick Hand', cursive", fontSize: 17, color: '#2b1d10' }}
    >
      <div className="paper-card relative w-full max-w-xl px-6 py-7">
        <span className="tape tape-c" />
        <h1 className="font-marker text-center text-4xl">The Hangar</h1>
        <p className="mt-1 text-center opacity-80">The highest any cardboard plane has climbed.</p>
        <div className="mt-5">
          <Leaderboard limit={20} />
        </div>
        <div className="mt-6 text-center">
          <Link to="/play" className="btn btn-fire inline-block px-8 py-3 text-2xl no-underline">
            Take off ✈
          </Link>
        </div>
      </div>
    </div>
  )
}
