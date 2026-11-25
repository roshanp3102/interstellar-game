import { getAuthToken } from 'deepspace'

/** Call one of this app's server actions as the signed-in user. Throws a readable error. */
export async function runAction<T>(name: string, params: Record<string, unknown> = {}): Promise<T> {
  const token = await getAuthToken()
  const res = await fetch(`/api/actions/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(params),
  })
  const body = (await res.json().catch(() => null)) as { success?: boolean; data?: T; error?: string } | null
  if (!res.ok || !body?.success) throw new Error(body?.error ?? 'Something went wrong. Please try again.')
  return body.data as T
}
