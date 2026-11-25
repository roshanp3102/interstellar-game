/**
 * Landing page — static (no providers), prerendered for crawlers.
 * The game itself lives at /play under (app)/.
 */

import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { seo } from '../seo'
import { ENGINES } from '../game/engine'

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div
        data-testid="static-landing"
        className="landing relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
        style={{ fontFamily: "'Patrick Hand', cursive", color: '#2b1d10' }}
      >
        <div className="landing-sky" aria-hidden />
        <div className="paper-card relative max-w-2xl px-6 py-8 sm:px-10">
          <span className="tape tape-l" />
          <span className="tape tape-r" />
          <p className="text-sm uppercase tracking-[0.3em] opacity-70">A cardboard trivia flight</p>
          <h1 className="font-marker mt-2 text-5xl sm:text-7xl">Interstellar</h1>
          <p className="mx-auto mt-4 max-w-md text-xl leading-snug">
            Seven new categories every day. Twenty-five seconds each. The rarer your answer, the bigger the engine — fly a
            taped-together cardboard plane from the clouds to the stars.
          </p>
          <ul className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2 text-base">
            {ENGINES.map((e) => (
              <li key={e.tier} className="stat flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-full border-2 border-[#3b2412]"
                  style={{ background: e.color }}
                />
                {e.name}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-md text-base opacity-80">
            Every category hides one secret trap answer. Say it and the engine coughs out, dropping you back down to where the round began.
          </p>
          <Link to="/play" className="btn btn-fire mt-6 inline-block px-8 py-3 text-2xl no-underline">
            Take off ✈
          </Link>
          <div className="mt-3">
            <Link to="/home" className="text-base underline opacity-75">
              See the highest flights
            </Link>
            <span aria-hidden className="mx-2 opacity-50">·</span>
            <Link to="/privacy" className="text-base underline opacity-75">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
