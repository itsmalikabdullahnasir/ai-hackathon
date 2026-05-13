'use client'

import { useState } from 'react'
import { Bell, Search, Calendar, Menu } from 'lucide-react'
import { currentUser } from '@/lib/mockData'

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-brand-border flex items-center gap-4 px-6 h-16">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Search */}
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

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-bg text-gray-500 hover:text-brand-orange transition-colors relative">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-bg text-gray-500 hover:text-brand-orange transition-colors">
          <Calendar size={19} />
        </button>
        <img
          src={currentUser.avatar_url}
          alt={currentUser.full_name}
          className="w-9 h-9 rounded-full object-cover border-2 border-brand-orange/30 cursor-pointer hover:border-brand-orange transition-colors"
        />
      </div>
    </header>
  )
}
