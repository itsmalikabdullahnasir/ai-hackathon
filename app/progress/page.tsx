'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { Clock, BookOpen, CheckSquare, Flame, Award, Download, Trophy } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { StatCardSkeleton } from '@/components/Skeleton'
import {
  currentUser, weeklyActivity, skillRadar, certificates, leaderboard, cohortCompletion,
} from '@/lib/mockData'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

const ACTIVITY_WEEKS = 52
const DAYS_PER_WEEK = 7

function generateHeatmap() {
  const cells = []
  for (let w = 0; w < ACTIVITY_WEEKS; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const rand = Math.random()
      const intensity = rand > 0.6 ? (rand > 0.8 ? (rand > 0.93 ? 4 : 3) : 2) : rand > 0.4 ? 1 : 0
      cells.push({ week: w, day: d, intensity })
    }
  }
  return cells
}

const heatmapData = generateHeatmap()
const INTENSITY_COLORS = ['#F0FDF4', '#BBF7D0', '#4ADE80', '#00C853', '#065F46']

const completedModules = [
  { title: 'Python for Data Analysis', date: 'Oct 12, 2024', score: 98, course: 'Data Analytics' },
  { title: 'SQL Fundamentals', date: 'Oct 15, 2024', score: 92, course: 'Data Analytics' },
  { title: 'Data Cleaning with Pandas', date: 'Oct 18, 2024', score: 87, course: 'Data Analytics' },
  { title: 'NumPy Essentials', date: 'Oct 8, 2024', score: 95, course: 'Data Analytics' },
  { title: 'Statistics Basics', date: 'Sep 28, 2024', score: 79, course: 'Data Analytics' },
]

const FADE_UP = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

export default function ProgressPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: GET /api/progress/stats { student_id }
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { label: 'Study Hours', value: `${currentUser.total_hours}h`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Modules Done', value: String(currentUser.modules_completed), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Quizzes Passed', value: String(currentUser.quizzes_passed), icon: CheckSquare, color: 'text-brand-success', bg: 'bg-green-50' },
    { label: 'Day Streak', value: `${currentUser.streak} days 🔥`, icon: Flame, color: 'text-brand-orange', bg: 'bg-orange-50' },
  ]

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <motion.div {...FADE_UP} className="mb-7">
          <h1 className="font-sora text-2xl font-bold text-brand-navy">My Progress</h1>
          <p className="text-brand-muted text-sm font-dm-sans mt-1">Track your learning journey across all courses.</p>
        </motion.div>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map(({ label, value, icon: Icon, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl border border-brand-border p-5 shadow-card"
                >
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', bg)}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="text-xs text-brand-muted font-dm-sans">{label}</p>
                  <p className="font-sora text-xl font-bold text-brand-navy mt-1">{value}</p>
                </motion.div>
              ))}
        </section>

        {/* Activity Heatmap */}
        <motion.section
          {...FADE_UP} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-brand-border shadow-card p-6 mb-7 overflow-x-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-sora text-lg font-bold text-brand-navy">Activity Heatmap</h3>
            <p className="text-xs text-brand-muted font-dm-sans">Last 52 weeks</p>
          </div>
          <div className="flex gap-1 min-w-[780px]">
            {Array.from({ length: ACTIVITY_WEEKS }).map((_, w) => (
              <div key={w} className="flex flex-col gap-1">
                {Array.from({ length: DAYS_PER_WEEK }).map((_, d) => {
                  const cell = heatmapData.find((c) => c.week === w && c.day === d)!
                  return (
                    <div
                      key={d}
                      title={`${cell.intensity} sessions`}
                      className="heatmap-cell w-3 h-3"
                      style={{ backgroundColor: INTENSITY_COLORS[cell.intensity] }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-brand-muted font-dm-sans">Less</span>
            {INTENSITY_COLORS.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[10px] text-brand-muted font-dm-sans">More</span>
          </div>
        </motion.section>

        {/* Two col: bar chart + radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
          {/* Bar chart */}
          <motion.div
            {...FADE_UP} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
          >
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Study Hours — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyActivity} barSize={28}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8, border: '1px solid #E2E8F0' }}
                  formatter={(v: number) => [`${v}h`, 'Study Time']}
                />
                <Bar dataKey="hours" fill="#077837" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar */}
          <motion.div
            {...FADE_UP} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
          >
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillRadar} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} />
                <Radar name="Score" dataKey="score" stroke="#077837" fill="#077837" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Course Progress + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
          {/* Completed Modules Table */}
          <motion.div
            {...FADE_UP} transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
              <h3 className="font-sora text-lg font-bold text-brand-navy">Completed Modules</h3>
              <span className="text-xs text-brand-muted font-dm-sans">{completedModules.length} modules</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-bg">
                    {['Module', 'Course', 'Date', 'Score', 'Certificate'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-brand-muted font-dm-sans uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completedModules.map((m, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="border-b border-brand-border hover:bg-brand-bg/50 transition group"
                    >
                      <td className="px-5 py-3.5 font-medium text-brand-navy font-dm-sans">{m.title}</td>
                      <td className="px-5 py-3.5 text-brand-muted font-dm-sans text-xs">{m.course}</td>
                      <td className="px-5 py-3.5 text-brand-muted font-dm-sans text-xs">{m.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={clsx(
                          'text-xs font-bold px-2 py-0.5 rounded-full',
                          m.score >= 90 ? 'bg-green-100 text-green-700' : m.score >= 75 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700',
                        )}>
                          {m.score}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => showToast('Certificate download started!', 'success')}
                          className="flex items-center gap-1.5 text-xs text-brand-orange font-semibold font-dm-sans opacity-0 group-hover:opacity-100 transition hover:underline"
                        >
                          <Download size={13} /> Download
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* TODO: GET /api/progress/completed-modules { student_id } */}
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            {...FADE_UP} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-brand-warning" />
              <h3 className="font-sora text-lg font-bold text-brand-navy">Cohort Ranking</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-xl transition',
                    entry.is_me ? 'bg-brand-orange/5 border-2 border-brand-orange/20' : 'hover:bg-brand-bg',
                  )}
                >
                  <span className={clsx(
                    'text-lg w-6 text-center flex-shrink-0',
                    entry.badge ? '' : 'text-brand-muted text-sm font-bold',
                  )}>
                    {entry.badge || `#${entry.rank}`}
                  </span>
                  <div className="flex-1">
                    <p className={clsx(
                      'text-sm font-semibold font-dm-sans',
                      entry.is_me ? 'text-brand-orange' : 'text-brand-navy',
                    )}>
                      {entry.name} {entry.is_me && <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded-full ml-1">You</span>}
                    </p>
                    <p className="text-[10px] text-brand-muted font-dm-sans">{entry.score.toLocaleString()} pts</p>
                  </div>
                </div>
              ))}
            </div>
            {/* TODO: GET /api/cohort/:id/leaderboard */}
          </motion.div>
        </div>

        {/* Certificates */}
        <motion.section
          {...FADE_UP} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award size={20} className="text-brand-orange" />
            <h3 className="font-sora text-lg font-bold text-brand-navy">Earned Certificates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-4 p-4 border-2 border-brand-orange/20 rounded-xl bg-brand-orange/3 hover:bg-brand-orange/5 transition group">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-brand-orange" />
                </div>
                <div className="flex-1">
                  <p className="font-sora text-sm font-bold text-brand-navy">{cert.course_title}</p>
                  <p className="text-xs text-brand-muted font-dm-sans mt-0.5">Issued {cert.issued_at}</p>
                  <p className="text-[10px] text-brand-muted font-dm-sans font-mono mt-0.5 opacity-70">{cert.verification_code}</p>
                </div>
                <button
                  onClick={() => showToast('Downloading certificate PDF…', 'success')}
                  className="text-brand-orange opacity-0 group-hover:opacity-100 transition"
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
            {/* TODO: GET /api/certificates { student_id } */}
          </div>
        </motion.section>
      </div>
    </AppShell>
  )
}
