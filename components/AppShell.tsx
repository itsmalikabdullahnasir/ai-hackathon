'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import TopNav from '@/components/TopNav'
import { useUser } from '@/components/UserProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-navy">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
