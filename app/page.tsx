'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('autocamp_auth')
    if (isLoggedIn) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-sora text-sm opacity-60">Loading autocamp…</p>
      </div>
    </div>
  )
}

