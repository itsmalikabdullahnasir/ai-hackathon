'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import TopNav from '@/components/TopNav'
import { isAuthenticated, getUsername, setUsername } from '@/lib/auth'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    if (!getUsername()) {
      setShowNamePrompt(true)
    }
    setChecked(true)
  }, [router])

  function handleNameSave() {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setNameError('Please enter your name to continue.')
      return
    }
    setUsername(trimmed)
    setShowNamePrompt(false)
    setNameError('')
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-navy">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm border border-brand-border">
            <h2 className="font-sora text-lg font-bold text-brand-navy">Welcome to autocamp</h2>
            <p className="text-sm text-brand-muted font-dm-sans mt-1">What should we call you?</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="mt-4 w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
            />
            {nameError && (
              <p className="text-xs text-brand-danger font-dm-sans mt-2">{nameError}</p>
            )}
            <button
              onClick={handleNameSave}
              className="mt-4 w-full bg-brand-orange text-white py-2.5 rounded-xl font-semibold text-sm font-dm-sans hover:bg-brand-orange-dark transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
