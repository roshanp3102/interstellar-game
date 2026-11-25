/** Privacy notice: static and prerendered, like the landing page. */

import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

export default function Privacy() {
  return (
    <>
      <Seo
        {...seo}
        title="Privacy | Interstellar"
        description="What Interstellar stores when you play or sign in, who can see it, and how to delete it."
        path="/privacy"
      />
      <main
        className="flex min-h-screen flex-col items-center px-4 py-12"
        style={{ fontFamily: "'Patrick Hand', cursive", color: '#2b1d10', fontSize: 18 }}
      >
        <article className="paper-card relative w-full max-w-2xl space-y-3 px-6 py-8 sm:px-10">
          <h1 className="font-marker text-4xl">Privacy</h1>
          <p>You can play without signing in. Your flight in progress is saved only in your own browser.</p>
          <h2 className="font-marker text-2xl">If you sign in</h2>
          <p>
            Sign-in is handled by DeepSpace through GitHub or Google. Interstellar never sees your password. The app stores
            your name, email, picture link, role and visit times. Other players can't see these; the app's owner can.
          </p>
          <h2 className="font-marker text-2xl">If you log a flight</h2>
          <p>
            Your callsign, the date, altitude, stage and answer count are public, along with a random-looking account id. A
            blank callsign shows as "Anonymous Pilot", never your account name.
          </p>
          <h2 className="font-marker text-2xl">Other services</h2>
          <p>
            DeepSpace hosts the app on Cloudflare, and fonts load from Google Fonts. Like any web host, they receive your IP
            address. Interstellar itself adds no ads or analytics.
          </p>
          <h2 className="font-marker text-2xl">Deleting your data</h2>
          <p>
            Sign in and open <Link to="/settings" className="underline">Settings</Link> to erase your flights and profile
            from the game. Your DeepSpace account is separate and stays.
          </p>
          <p>
            <Link to="/" className="underline">Back to Interstellar</Link>
          </p>
        </article>
      </main>
    </>
  )
}
