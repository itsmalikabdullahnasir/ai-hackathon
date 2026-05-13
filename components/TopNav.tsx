'use client'

import { useState } from 'react'
import { Bell, Search, Calendar, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/components/UserProvider'
import { useToast } from '@/components/Toast'

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const { user } = useUser()

  const displayName = user?.full_name ?? 'Learner'
  const displayEmail = user?.email ?? ''
  const avatarUrl = user?.avatar_url ?? null

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  async function handleLogout() {
    await supabase.auth.signOut()
    showToast('Logged out successfully', 'success')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-brand-border flex items-center gap-4 px-6 h-16">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors">
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, lessons, AI tutor…"
          className="w-full pl-10 pr-4 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-dm-sans
                     focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40
                     placeholder:text-gray-400 transition"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="relative">
          <button
            onClick={() => { setShowNotifications((p) => !p); setShowSchedule(false); setShowProfile(false) }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-bg text-gray-500 hover:text-brand-orange transition-colors relative"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-brand-border rounded-2xl shadow-xl p-4 z-20">
              <p className="text-xs font-semibold text-brand-navy font-dm-sans mb-3">Notifications</p>
              <div className="space-y-2">
                {['New quiz scores are available for Module 3.', '3 students requested help on DSA basics.', 'Your next live session starts in 2 hours.'].map((note) => (
                  <div key={note} className="text-xs text-brand-muted font-dm-sans bg-brand-bg rounded-xl p-3">{note}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowSchedule((p) => !p); setShowNotifications(false); setShowProfile(false) }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-bg text-gray-500 hover:text-brand-orange transition-colors"
          >
            <Calendar size={19} />
          </button>
          {showSchedule && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-brand-border rounded-2xl shadow-xl p-4 z-20">
              <p className="text-xs font-semibold text-brand-navy font-dm-sans mb-3">Today&apos;s Sessions</p>
              <div className="space-y-2">
                {[{ title: 'Live Q&A: Data Structures', time: '3:00 PM' }, { title: 'Office Hours: SQL Joins', time: '6:30 PM' }].map((event) => (
                  <div key={event.title} className="flex items-center justify-between bg-brand-bg rounded-xl px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-navy font-dm-sans">{event.title}</p>
                      <p className="text-[10px] text-brand-muted font-dm-sans">{event.time}</p>
                    </div>
                    <button onClick={() => showToast(`Opening ${event.title}`, 'info')} className="text-[10px] font-semibold text-brand-orange hover:text-brand-orange-dark">Join</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowProfile((p) => !p); setShowNotifications(false); setShowSchedule(false) }}
            className="w-9 h-9 rounded-full border-2 border-brand-orange/30 hover:border-brand-orange transition-colors overflow-hidden"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-orange/15 text-brand-orange text-xs font-semibold flex items-center justify-center">{initials}</div>
            )}
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-brand-border rounded-2xl shadow-xl p-3 z-20">
              <div className="px-2 pb-2 border-b border-brand-border">
                <p className="text-xs font-semibold text-brand-navy font-dm-sans">{displayName}</p>
                <p className="text-[10px] text-brand-muted font-dm-sans">{displayEmail}</p>
              </div>
              <div className="mt-2 space-y-1">
                <button onClick={() => router.push('/settings')} className="w-full text-left text-xs font-semibold text-brand-navy font-dm-sans px-2 py-2 rounded-lg hover:bg-brand-bg">Settings</button>
                <button onClick={handleLogout} className="w-full text-left text-xs font-semibold text-red-600 font-dm-sans px-2 py-2 rounded-lg hover:bg-red-50">Log out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
