'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Flame, BookOpen, BarChart2, Clock, Play, Lock, CheckCircle,
  Bot, ArrowRight, ChevronLeft, ChevronRight, Users, Video, Bell,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { StatCardSkeleton } from '@/components/Skeleton'
import { useUser } from '@/components/UserProvider'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

const FADE_UP = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } }

interface DashboardData {
  profile: { id: string; full_name: string; avatar_url: string | null }
  today: string
  stats: Array<{ label: string; value: string; badge?: string }>
  enrolledCourse: {
    id: string
    title: string
    thumbnail_url: string | null
    total_modules: number
    progress: number
    current_module: string
    instructor_name: string
    instructor_avatar: string | null
  } | null
  learningPath: Array<{
    id: string
    title: string
    week: number
    duration: number
    completed: boolean
    current: boolean
    locked: boolean
  }>
  insights: Array<{ id: string; type: string; text: string }>
  liveSessions: Array<{
    id: string
    title: string
    date: string
    instructor: string
    participants: number
    is_today: boolean
  }>
}

const STAT_ICONS = [Flame, BookOpen, BarChart2, Clock]
const STAT_COLORS = [
  { color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  { color: 'text-blue-500', bg: 'bg-blue-50' },
  { color: 'text-purple-500', bg: 'bg-purple-50' },
  { color: 'text-brand-danger', bg: 'bg-red-50' },
]

export default function DashboardPage() {
  const { showToast } = useToast()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [sessionIdx, setSessionIdx] = useState(0)
  const [dashData, setDashData] = useState<DashboardData | null>(null)

  useEffect(() => {
    apiFetch<DashboardData>('/api/dashboard')
      .then((data) => setDashData(data))
      .catch(() => showToast('Failed to load dashboard data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const displayName = user?.full_name ?? dashData?.profile?.full_name ?? 'Learner'
  const today = dashData?.today ?? new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Header */}
        <motion.section {...FADE_UP} className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="font-sora text-2xl font-bold text-brand-navy">
              Good morning, {displayName.split(' ')[0]} 👋
            </h2>
            <p className="text-brand-muted text-sm font-dm-sans mt-0.5">{today} &bull; You have {dashData?.liveSessions?.filter(s => s.is_today).length ?? 0} live sessions today.</p>
          </div>
          <button
            onClick={() => showToast('3 new notifications', 'info')}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-brand-border hover:border-brand-orange/40 transition"
          >
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
          </button>
        </motion.section>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : (dashData?.stats ?? []).map(({ label, value, badge }, i) => {
                const Icon = STAT_ICONS[i] ?? Flame
                const { color, bg } = STAT_COLORS[i] ?? STAT_COLORS[0]
                return (
                  <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="bg-white rounded-xl border border-brand-border p-5 flex flex-col gap-3 shadow-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', bg)}>
                        <Icon size={20} className={color} />
                      </div>
                      {badge && (
                        <span className="text-xs font-semibold text-brand-success bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-brand-muted font-dm-sans font-medium">{label}</p>
                    <p className="font-sora text-xl font-bold text-brand-navy">{value}</p>
                  </motion.div>
                )
              })}
        </section>

        {/* Continue Learning */}
        {dashData?.enrolledCourse && (
          <motion.section {...FADE_UP} transition={{ delay: 0.15, duration: 0.35 }} className="mb-7">
            <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-72 h-44 md:h-auto flex-shrink-0 relative">
                <img
                  src={dashData.enrolledCourse.thumbnail_url ?? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'}
                  alt={dashData.enrolledCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-brand-orange text-white px-2.5 py-1 rounded-full">IN PROGRESS</span>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-sora text-xl font-bold text-brand-navy">{dashData.enrolledCourse.title}</h3>
                  <p className="text-brand-muted text-sm font-dm-sans mt-1">{dashData.enrolledCourse.current_module}</p>
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-brand-navy font-dm-sans">{dashData.enrolledCourse.progress}% Complete</span>
                      <span className="text-xs text-brand-muted font-dm-sans">of {dashData.enrolledCourse.total_modules} modules</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div className="bg-brand-orange h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${dashData.enrolledCourse.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-5">
                  <Link href={`/courses/${dashData.enrolledCourse.id}`}
                    className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-semibold text-sm font-dm-sans hover:bg-brand-orange-dark transition-all active:scale-[0.98]"
                  >
                    <Play size={15} className="fill-white" /> Resume Learning
                  </Link>
                  <Link href="/courses" className="text-brand-navy text-sm font-semibold font-dm-sans hover:text-brand-orange transition">Course Details →</Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {!loading && !dashData?.enrolledCourse && (
          <motion.section {...FADE_UP} transition={{ delay: 0.15 }} className="mb-7">
            <div className="bg-white rounded-2xl border border-brand-border shadow-card p-8 text-center">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="font-sora text-lg font-bold text-brand-navy">No course enrolled yet</h3>
              <p className="text-brand-muted text-sm font-dm-sans mt-1">Browse our catalog and enroll in a course to get started.</p>
              <Link href="/courses" className="inline-flex items-center gap-2 mt-4 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-semibold text-sm font-dm-sans hover:bg-brand-orange-dark transition">
                Browse Courses <ArrowRight size={14} />
              </Link>
            </div>
          </motion.section>
        )}

        {/* Two-col: Learning Path + AI Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-7">
          {/* Learning Path */}
          <motion.div {...FADE_UP} transition={{ delay: 0.2, duration: 0.35 }} className="lg:col-span-7 bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-sora text-lg font-bold text-brand-navy">Your Learning Path</h3>
              <Link href="/courses" className="text-brand-orange text-sm font-semibold font-dm-sans hover:underline">View All →</Link>
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : (dashData?.learningPath ?? []).length === 0 ? (
              <p className="text-brand-muted text-sm font-dm-sans text-center py-8">Enroll in a course to see your learning path.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-5">
                  {(dashData?.learningPath ?? []).map((module) => (
                    <div key={module.id} className="relative pl-10 flex items-start gap-3">
                      <div className={clsx('absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center z-10 border-2',
                        module.completed ? 'bg-brand-success border-brand-success' : module.current ? 'bg-brand-orange border-brand-orange animate-pulse' : 'bg-white border-gray-200',
                      )}>
                        {module.completed ? <CheckCircle size={14} className="text-white fill-white" /> : module.current ? <Play size={12} className="text-white fill-white" /> : <Lock size={12} className="text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className={clsx('text-sm font-semibold font-dm-sans', module.current ? 'text-brand-orange' : module.completed ? 'text-brand-navy' : 'text-gray-400')}>{module.title}</h4>
                        <p className={clsx('text-xs font-dm-sans mt-0.5', module.locked ? 'text-gray-300' : 'text-brand-muted')}>
                          {module.completed ? 'Completed ✓' : module.current ? `In progress · ${module.duration} min` : module.locked ? 'Locked — complete previous module' : `${module.duration} min`}
                        </p>
                      </div>
                      {module.completed && <span className="text-xs text-brand-success font-semibold font-dm-sans">Done</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* AI Insights */}
          <motion.div {...FADE_UP} transition={{ delay: 0.25, duration: 0.35 }} className="lg:col-span-5 bg-white rounded-2xl border-2 border-brand-orange/20 shadow-card p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-orange/5 rounded-full pointer-events-none" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                <Bot size={18} className="text-brand-orange" />
              </div>
              <h3 className="font-sora text-lg font-bold text-brand-navy">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)
              ) : (dashData?.insights ?? []).length === 0 ? (
                <p className="text-brand-muted text-sm font-dm-sans">No insights yet. Keep learning to get personalized recommendations!</p>
              ) : (
                (dashData?.insights ?? []).map((ins) => (
                  <div key={ins.id} className={clsx('p-3.5 rounded-xl text-sm font-dm-sans border-l-4',
                    ins.type === 'recommendation' ? 'bg-brand-orange/5 border-brand-orange' : ins.type === 'warning' ? 'bg-yellow-50 border-brand-warning' : 'bg-green-50 border-brand-success',
                  )}>
                    <p className={clsx('text-[10px] font-bold uppercase tracking-widest mb-1',
                      ins.type === 'recommendation' ? 'text-brand-orange' : ins.type === 'warning' ? 'text-brand-warning' : 'text-brand-success',
                    )}>
                      {ins.type === 'recommendation' ? '💡 Recommendation' : ins.type === 'warning' ? '⚠ Watch out' : '🎉 Keep it up'}
                    </p>
                    <p className="text-gray-700 leading-relaxed">{ins.text}</p>
                  </div>
                ))
              )}
            </div>
            <Link href="/ai-tutor" className="w-full flex items-center justify-center gap-2 border-2 border-brand-orange text-brand-orange font-semibold text-sm font-dm-sans py-2.5 rounded-xl hover:bg-brand-orange hover:text-white transition-all">
              <Bot size={16} /> Chat with AI Tutor <ArrowRight size={14} />
            </Link>
          </motion.div>
        </section>

        {/* Live Sessions */}
        <motion.section {...FADE_UP} transition={{ delay: 0.3, duration: 0.35 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-sora text-lg font-bold text-brand-navy">Upcoming Live Sessions</h3>
            <div className="flex gap-2">
              <button onClick={() => setSessionIdx((i) => Math.max(0, i - 1))} className="w-9 h-9 rounded-full bg-white border border-brand-border flex items-center justify-center hover:border-brand-orange/40 transition">
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button onClick={() => setSessionIdx((i) => Math.min((dashData?.liveSessions?.length ?? 1) - 1, i + 1))} className="w-9 h-9 rounded-full bg-white border border-brand-border flex items-center justify-center hover:border-brand-orange/40 transition">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="min-w-[300px] h-36 bg-white rounded-xl border border-brand-border animate-pulse" />)}
            </div>
          ) : (dashData?.liveSessions ?? []).length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-brand-border">
              <Video size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-brand-muted text-sm font-dm-sans">No upcoming live sessions scheduled.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {(dashData?.liveSessions ?? []).map((session, i) => (
                <motion.div key={session.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                  className="min-w-[300px] bg-white rounded-xl border border-brand-border shadow-card p-5 flex flex-col gap-3 hover:border-brand-orange/40 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <span className={clsx('text-xs font-bold px-3 py-1 rounded-full', session.is_today ? 'bg-brand-orange/10 text-brand-orange' : 'bg-gray-100 text-gray-500')}>{session.date}</span>
                    <div className="flex items-center gap-1 text-xs text-brand-muted font-dm-sans"><Users size={12} /><span>+{session.participants}</span></div>
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-bold text-brand-navy group-hover:text-brand-orange transition">{session.title}</h4>
                    <p className="text-xs text-brand-muted font-dm-sans mt-0.5">{session.instructor}</p>
                  </div>
                  <button
                    onClick={() => showToast(session.is_today ? 'Joining waiting room…' : 'Added to calendar!', 'success')}
                    className={clsx('w-full py-2 rounded-lg text-xs font-semibold font-dm-sans transition-colors flex items-center justify-center gap-1.5',
                      session.is_today ? 'bg-brand-navy text-white hover:bg-brand-orange' : 'border border-brand-border text-gray-600 hover:border-brand-orange/40 hover:text-brand-orange',
                    )}
                  >
                    {session.is_today ? <><Video size={12} /> Join Now</> : 'Add to Calendar'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </AppShell>
  )
}
