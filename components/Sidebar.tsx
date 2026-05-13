'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Bot, TrendingUp, Users, Settings,
  LogOut, Zap, ChevronRight, GraduationCap,
} from 'lucide-react'
import { currentUser } from '@/lib/mockData'
import { logout, getUsername, getAuthEmail } from '@/lib/auth'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'My Courses', icon: BookOpen },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Bot },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/instructor', label: 'Instructor View', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const [displayName, setDisplayName] = useState(currentUser.full_name)
  const [displayEmail, setDisplayEmail] = useState(currentUser.email)

  useEffect(() => {
    const updateName = () => setDisplayName(getUsername() ?? currentUser.full_name)
    const updateEmail = () => setDisplayEmail(getAuthEmail() ?? currentUser.email)
    updateName()
    updateEmail()
    window.addEventListener('autocamp-username', updateName)
    window.addEventListener('autocamp-auth', updateEmail)
    return () => {
      window.removeEventListener('autocamp-username', updateName)
      window.removeEventListener('autocamp-auth', updateEmail)
    }
  }, [])

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  function handleLogout() {
    logout()
    showToast('Logged out successfully', 'success')
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-brand-navy flex flex-col z-40 shadow-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="font-sora text-white text-lg font-bold leading-none">
              auto<span className="text-brand-orange">camp</span>
            </h1>
            <p className="text-white/40 text-[10px] mt-0.5 font-dm-sans">by atomcamp</p>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (pathname?.startsWith(href + '/') ?? false)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 group',
                active
                  ? 'bg-brand-orange/10 text-brand-orange border-l-[3px] border-brand-orange'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent',
              )}
            >
              <Icon size={18} className={clsx(active ? 'text-brand-orange' : 'text-white/50 group-hover:text-white')} />
              <span className="font-dm-sans text-sm font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-brand-orange" />}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-6 border-t border-white/5 pt-3 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
          {currentUser.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover border-2 border-brand-orange/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-brand-orange/40 bg-brand-orange/15 text-brand-orange text-[10px] font-semibold flex items-center justify-center">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate font-dm-sans">{displayName}</p>
            <p className="text-white/40 text-[10px] truncate">{displayEmail}</p>
          </div>
          <GraduationCap size={14} className="text-brand-orange flex-shrink-0" />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-dm-sans"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
