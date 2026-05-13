import { supabase } from '@/lib/supabase/client'

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const headers = new Headers(init?.headers)

  if (data.session?.access_token) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`)
  }
  headers.set('Content-Type', 'application/json')

  const res = await fetch(input, { ...init, headers })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
