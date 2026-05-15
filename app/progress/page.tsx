'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, CartesianGrid,
} from 'recharts'
import { Clock, BookOpen, CheckSquare, Flame, Award } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { StatCardSkeleton } from '@/components/Skeleton'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

const INTENSITY_COLORS = ['#F0FDF4', '#BBF7D0', '#4ADE80', '#00C853', '#065F46']
const FADE_UP = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

interface ProgressData {
  stats: { study_hours: number; modules_done: number; quizzes_passed: number; streak: number }
  weeklyActivity: Array<{ day: string; hours: number }>
  heatmap: Array<{ week: number; day: number; intensity: number }>
  skillRadar: Array<{ skill: string; score: number }>
  completedModules: Array<{ title: string; course: string; date: string; score: number }>
  certificates: Array<{ id: string; course_title: string; issued_at: string; verification_code: string }>
  leaderboard: Array<{ rank: number; name: string; score: number; badge: string; is_me: boolean }>
}

const mockProgressData: ProgressData = {
  stats: { study_hours: 128.5, modules_done: 42, quizzes_passed: 156, streak: 14 },
  weeklyActivity: [
    { day: 'Mon', hours: 2.2 },
    { day: 'Tue', hours: 3.4 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 2.7 },
    { day: 'Fri', hours: 3.1 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.6 },
  ],
  heatmap: [],
  skillRadar: [
    { skill: 'UI', score: 82 },
    { skill: 'UX', score: 76 },
    { skill: 'Design', score: 88 },
    { skill: 'Research', score: 71 },
    { skill: 'Prototyping', score: 79 },
  ],
  completedModules: [
    { title: 'Intro to Neural Networks', course: 'Machine Learning Fundamentals', date: 'Oct 14, 2023', score: 87 },
    { title: 'Data Processing with Python', course: 'Advanced Python for Data Science', date: 'Nov 02, 2023', score: 85 },
    { title: 'Ethics in Artificial Intelligence', course: 'AI Governance & Policy', date: 'Dec 20, 2023', score: 100 },
    { title: 'Vector Databases Deep Dive', course: 'LLM Architecture', date: 'Feb 15, 2024', score: 87 },
  ],
  certificates: [],
  leaderboard: [],
}

export default function ProgressPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ProgressData | null>(null)

  useEffect(() => {
    apiFetch<ProgressData>('/api/progress')
      .then((d) => setData(d))
      .catch(() => {
        setData(mockProgressData)
        showToast('Live data unavailable. Showing demo data.', 'info')
      })
      .finally(() => setLoading(false))
  }, [])

  const heatmapData = useMemo(() => {
    const source = data?.heatmap ?? []
    if (source.length > 0) return source
    return Array.from({ length: 52 }).flatMap((_, week) => (
      Array.from({ length: 7 }).map((__, day) => ({
        week,
        day,
        intensity: (week * 3 + day * 2) % 5,
      }))
    ))
  }, [data])

  const stats = data ? [
    { label: 'Study Hours', value: `${data.stats.study_hours}h`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Modules Done', value: String(data.stats.modules_done), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Quizzes Passed', value: String(data.stats.quizzes_passed), icon: CheckSquare, color: 'text-brand-success', bg: 'bg-green-50' },
    { label: 'Day Streak', value: `${data.stats.streak} days 🔥`, icon: Flame, color: 'text-brand-orange', bg: 'bg-orange-50' },
  ] : []

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <motion.div {...FADE_UP} className="mb-7">
          <h1 className="font-sora text-2xl font-bold text-brand-navy">My Learning Journey</h1>
          <p className="text-brand-muted text-sm font-dm-sans mt-1">Visualize your growth and educational milestones.</p>
        </motion.div>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map(({ label, value, icon: Icon, color, bg }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white rounded-xl border border-brand-border p-5 shadow-card">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', bg)}><Icon size={20} className={color} /></div>
                  <p className="text-xs text-brand-muted font-dm-sans">{label}</p>
                  <p className="font-sora text-xl font-bold text-brand-navy mt-1">{value}</p>
                </motion.div>
              ))}
        </section>

        {/* Activity Heatmap */}
        <motion.section {...FADE_UP} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-6 mb-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-sora text-lg font-bold text-brand-navy">Activity Heatmap</h3>
            <p className="text-xs text-brand-muted font-dm-sans">Last 52 weeks</p>
          </div>
          {loading ? (
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="flex gap-1 min-w-[780px]">
              {Array.from({ length: 52 }).map((_, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const cell = heatmapData.find((c) => c.week === w && c.day === d)
                    const intensity = cell?.intensity ?? 0
                    return <div key={d} title={`${intensity} sessions`} className="heatmap-cell w-3 h-3" style={{ backgroundColor: INTENSITY_COLORS[intensity] }} />
                  })}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-brand-muted font-dm-sans">Less</span>
            {INTENSITY_COLORS.map((c, i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />)}
            <span className="text-[10px] text-brand-muted font-dm-sans">More</span>
          </div>
        </motion.section>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <motion.div {...FADE_UP} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Weekly Progress</h3>
            {loading ? <div className="h-52 bg-gray-100 rounded-xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.weeklyActivity ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8, border: '1px solid #E2E8F0' }} formatter={(v: number) => [`${v}h`, 'Study Time']} />
                  <Line type="monotone" dataKey="hours" stroke="#077837" strokeWidth={2.5} dot={{ r: 3, fill: '#077837' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div {...FADE_UP} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Skill Proficiency</h3>
            {loading ? <div className="h-52 bg-gray-100 rounded-xl animate-pulse" /> : (data?.skillRadar ?? []).length === 0 ? (
              <div className="h-52 flex items-center justify-center text-brand-muted text-sm font-dm-sans">Complete modules to see your skill radar.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={data?.skillRadar ?? []} cx="50%" cy="50%" outerRadius={80}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} />
                  <Radar name="Score" dataKey="score" stroke="#077837" fill="#077837" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Completed Modules */}
        <motion.div {...FADE_UP} transition={{ delay: 0.25 }} className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
            <h3 className="font-sora text-lg font-bold text-brand-navy">Completed Modules</h3>
            <span className="text-xs text-brand-muted font-dm-sans">Showing {data?.completedModules?.length ?? 0} modules</span>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : (data?.completedModules ?? []).length === 0 ? (
            <div className="p-8 text-center text-brand-muted text-sm font-dm-sans">No completed modules yet. Keep learning!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-bg">
                    {['Module Name', 'Course', 'Score', 'Completion Date', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-brand-muted font-dm-sans uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.completedModules ?? []).map((m, i) => (
                    <tr key={i} className="border-b border-brand-border hover:bg-brand-bg/50 transition group">
                      <td className="px-5 py-3.5 font-medium text-brand-navy font-dm-sans">{m.title}</td>
                      <td className="px-5 py-3.5 text-brand-muted font-dm-sans text-xs">{m.course}</td>
                      <td className="px-5 py-3.5">
                        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', m.score >= 90 ? 'bg-green-100 text-green-700' : m.score >= 75 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700')}>
                          {m.score > 0 ? `${m.score}%` : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-brand-muted font-dm-sans text-xs">{m.date}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => showToast('PDF download started!', 'success')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">PDF</button>
                          <button onClick={() => showToast('Certificate download started!', 'success')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Certificate</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div {...FADE_UP} transition={{ delay: 0.3 }} className="rounded-2xl overflow-hidden border border-brand-border shadow-card relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 p-6 text-white">
              <p className="text-xs uppercase tracking-widest font-dm-sans text-white/70">Keep the momentum going</p>
              <h3 className="font-sora text-xl font-bold mt-2">You are in the top 5% of learners this month</h3>
              <p className="text-xs text-white/80 font-dm-sans mt-2">Complete your next module and unlock the Data Architect badge.</p>
            </div>
          </motion.div>

          <motion.div {...FADE_UP} transition={{ delay: 0.35 }} className="bg-emerald-600 rounded-2xl border border-emerald-500/30 shadow-card p-6 text-white flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><Award size={20} className="text-white" /></div>
              <div>
                <p className="text-xs uppercase tracking-widest font-dm-sans text-white/70">Certificate Milestone</p>
                <h3 className="font-sora text-lg font-bold">Your verified specialization certificate is ready</h3>
              </div>
            </div>
            <button
              onClick={() => showToast('Opening certificates...', 'success')}
              className="mt-6 inline-flex items-center justify-center bg-white text-emerald-700 font-semibold text-sm font-dm-sans py-2.5 rounded-xl"
            >
              View Certificates
            </button>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
