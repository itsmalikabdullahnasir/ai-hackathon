'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Bot, TrendingUp, Users } from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Bot },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/instructor', label: 'Teach', icon: Users },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy border-t border-white/10 flex lg:hidden">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (pathname?.startsWith(href + '/') ?? false)
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 transition-colors',
              active ? 'text-brand-orange' : 'text-white/40 hover:text-white/70',
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-dm-sans">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
