'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { apiFetch } from '@/lib/api'

export type UserProfile = {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: 'student' | 'instructor' | 'admin'
  onboarding_completed: boolean
  level: 'beginner' | 'intermediate' | 'advanced' | null
}

type UserContextValue = {
  user: UserProfile | null
  loading: boolean
  refresh: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await apiFetch<UserProfile>('/api/me')
      setUser(profile)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void load()
    })
    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, loading, refresh: load }), [user, loading])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
