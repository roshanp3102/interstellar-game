/**
 * Example gated page. Reached at /settings — no auth logic lives here
 * because (protected)/_layout.tsx already wraps the subtree in <AuthGate>.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signOut, useUser } from 'deepspace'
import { runAction } from '../../../lib/action'
import { Button } from '@/components/ui'

export default function SettingsPage() {
  const { user } = useUser()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const erase = async () => {
    setBusy(true)
    setError('')
    try {
      await runAction('deleteMyData')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete your data.')
      setBusy(false)
      return
    }
    // Leave at once: reconnecting while signed in would create a new profile row.
    await signOut().catch(() => undefined)
    window.location.replace('/')
  }

  return (
    // No background on page wrappers — pages render into whatever the app's
    // (app)/_layout provides (a plain background, or a raised panel), so they
    // stay transparent and inherit it.
    <div className="min-h-full text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="mb-12 text-4xl font-bold tracking-tight">Settings</h1>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Your account</h2>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-foreground">{user?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground">{user?.email ?? '—'}</dd>
            </div>
          </dl>

          <Button variant="secondary" className="mt-6" onClick={() => signOut()}>
            Sign out
          </Button>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Delete my data</h2>
          <p className="text-sm text-muted-foreground">
            Permanently removes your logged flights and your profile from Interstellar, then signs you out. Your DeepSpace
            account itself isn't affected. <Link to="/privacy" className="underline">Privacy</Link>
          </p>
          {confirming ? (
            <div className="mt-4 flex gap-3">
              <Button variant="destructive" disabled={busy} onClick={erase}>
                {busy ? 'Deleting…' : 'Yes, delete permanently'}
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="secondary" className="mt-4" onClick={() => setConfirming(true)}>
              Delete my data
            </Button>
          )}
          {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
        </section>
      </div>
    </div>
  )
}
