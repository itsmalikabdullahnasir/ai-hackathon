'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
} from 'recharts'
import {
  Users, AlertTriangle, TrendingUp, BarChart2, Bot, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, Clock, Download,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { StatCardSkeleton, TableRowSkeleton } from '@/components/Skeleton'
import { students, cohortCompletion, moduleDropOff } from '@/lib/mockData'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

const COHORTS = ['Cohort 12 — Data Analytics (Oct 2024)', 'Cohort 11 — AI Bootcamp (Sep 2024)', 'Cohort 10 — Python Basics (Aug 2024)']

const AI_RECOMMENDATIONS = [
  '⚡ 8 students haven\'t logged in for 3+ days — send an automated re-engagement email nudge.',
  '📉 Statistics module has a 22% drop-off rate. Consider adding an explainer video or office hours.',
  '🏆 Top performers (Amna, Ali, Sana) are ready for advanced projects — recommend the AI Agents track.',
]

export default function InstructorPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [cohort, setCohort] = useState(COHORTS[0])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    // TODO: GET /api/instructor/cohort/:id/stats
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [cohort])

  const atRisk = students.filter((s) => s.risk !== 'low')
  const filteredStudents = riskFilter === 'all' ? students : students.filter((s) => s.risk === riskFilter)

  const statCards = [
    { label: 'Total Students', value: '124', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Avg Completion', value: '67%', icon: TrendingUp, color: 'text-brand-success', bg: 'bg-green-50' },
    { label: 'At-Risk Students', value: String(atRisk.length), icon: AlertTriangle, color: 'text-brand-warning', bg: 'bg-yellow-50', badge: 'NEEDS ATTENTION' },
    { label: 'Avg Quiz Score', value: '74%', icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Dropout Rate', value: '12%', icon: AlertCircle, color: 'text-brand-danger', bg: 'bg-red-50' },
  ]

  const riskBadge: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
        >
          <div>
            <h1 className="font-sora text-2xl font-bold text-brand-navy">Instructor Dashboard</h1>
            <p className="text-brand-muted text-sm font-dm-sans mt-1">Monitor cohort progress and identify at-risk students.</p>
          </div>
          <select
            value={cohort}
            onChange={(e) => { setCohort(e.target.value); setLoading(true) }}
            className="px-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-dm-sans text-brand-navy
                       focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
          >
            {COHORTS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </motion.div>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map(({ label, value, icon: Icon, color, bg, badge }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-xl border border-brand-border p-5 shadow-card"
                >
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', bg)}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="text-xs text-brand-muted font-dm-sans">{label}</p>
                  <p className="font-sora text-xl font-bold text-brand-navy mt-0.5">{value}</p>
                  {badge && (
                    <span className="text-[9px] font-bold text-brand-warning bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 mt-1 inline-block">
                      {badge}
                    </span>
                  )}
                </motion.div>
              ))}
        </section>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
          {/* Completion line chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
          >
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Cohort Completion Over 12 Weeks</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cohortCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8, border: '1px solid #E2E8F0' }} formatter={(v: number) => [`${v}%`, 'Completion']} />
                <Line type="monotone" dataKey="completion" stroke="#077837" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Module drop-off bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-6"
          >
            <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Module Drop-off Heatmap</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moduleDropOff} layout="vertical" barSize={16}>
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="module" type="category" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8 }} formatter={(v: number) => [`${v}%`, 'Drop-off']} />
                <Bar dataKey="drop_rate" fill="#077837" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border-2 border-brand-orange/20 shadow-card p-6 mb-7 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-orange/5 rounded-full pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-brand-orange/10 rounded-lg flex items-center justify-center">
              <Bot size={18} className="text-brand-orange" />
            </div>
            <h3 className="font-sora text-lg font-bold text-brand-navy">AI Recommendations</h3>
            <span className="ml-auto text-xs text-brand-muted font-dm-sans">Updated 2h ago</span>
          </div>
          <div className="space-y-3">
            {AI_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-brand-orange/3 rounded-xl border-l-4 border-brand-orange">
                <p className="text-sm text-gray-700 font-dm-sans leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
          {/* TODO: GET /api/instructor/ai-recommendations { cohort_id } */}
        </motion.div>

        {/* At-risk Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-sora text-lg font-bold text-brand-navy">Student Overview</h3>
              <p className="text-xs text-brand-muted font-dm-sans mt-0.5">{students.length} students · {atRisk.length} need attention</p>
            </div>
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold font-dm-sans capitalize transition border',
                    riskFilter === f
                      ? f === 'high' ? 'bg-red-100 text-red-700 border-red-200'
                        : f === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : f === 'low' ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white text-brand-muted border-brand-border hover:border-brand-orange/40',
                  )}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
              <button
                onClick={() => showToast('Exporting student report…', 'info')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-dm-sans border border-brand-border hover:border-brand-orange/40 text-brand-muted hover:text-brand-orange transition"
              >
                <Download size={13} /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-bg border-b border-brand-border">
                  {['Student', 'Progress', 'Last Active', 'Quiz Avg', 'Risk', 'AI Reason', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-brand-muted font-dm-sans uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton rows={5} />
                ) : (
                  filteredStudents.map((student) => (
                    <>
                      <tr
                        key={student.id}
                        onClick={() => setExpandedRow(expandedRow === student.id ? null : student.id)}
                        className="border-b border-brand-border hover:bg-brand-bg/50 transition cursor-pointer group"
                      >
                        {/* Student */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-semibold text-brand-navy font-dm-sans">{student.name}</span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={clsx('h-full rounded-full', student.progress >= 70 ? 'bg-brand-success' : student.progress >= 40 ? 'bg-brand-warning' : 'bg-brand-danger')}
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-brand-navy font-dm-sans w-8">{student.progress}%</span>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-brand-muted font-dm-sans">
                            <Clock size={12} />
                            {student.last_active}
                          </div>
                        </td>

                        {/* Quiz Avg */}
                        <td className="px-5 py-4">
                          <span className={clsx(
                            'text-xs font-bold px-2 py-1 rounded-full',
                            student.quiz_avg >= 70 ? 'bg-green-100 text-green-700' : student.quiz_avg >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700',
                          )}>
                            {student.quiz_avg}%
                          </span>
                        </td>

                        {/* Risk */}
                        <td className="px-5 py-4">
                          <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide', riskBadge[student.risk])}>
                            {student.risk}
                          </span>
                        </td>

                        {/* AI Reason */}
                        <td className="px-5 py-4 max-w-[200px]">
                          <p className="text-xs text-brand-muted font-dm-sans truncate">{student.risk_reason}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); showToast(`Message sent to ${student.name}`, 'success') }}
                              className="text-xs font-semibold text-brand-orange hover:underline font-dm-sans"
                            >
                              Message
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === student.id ? null : student.id) }}
                              className="text-gray-400 hover:text-brand-navy transition"
                            >
                              {expandedRow === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      <AnimatePresence>
                        {expandedRow === student.id && (
                          <tr key={`${student.id}-expanded`}>
                            <td colSpan={7} className="px-0 py-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-brand-bg border-b border-brand-border"
                              >
                                <div className="px-5 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                                  {/* Module Progress */}
                                  <div className="lg:col-span-2">
                                    <p className="text-xs font-bold text-brand-navy font-dm-sans uppercase tracking-wider mb-3">Module Progress</p>
                                    <div className="space-y-2.5">
                                      {['Python Basics', 'Data Structures', 'Pandas', 'Statistics', 'Visualization'].map((mod, i) => {
                                        const pct = Math.max(0, student.progress - i * 15)
                                        return (
                                          <div key={mod} className="flex items-center gap-3">
                                            <p className="text-xs text-brand-muted font-dm-sans w-28 flex-shrink-0">{mod}</p>
                                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                              <div className={clsx('h-full rounded-full', pct > 0 ? 'bg-brand-orange' : 'bg-gray-200')} style={{ width: `${Math.min(100, pct)}%` }} />
                                            </div>
                                            <span className="text-xs text-brand-muted font-dm-sans w-8 text-right">{Math.min(100, pct)}%</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>

                                  {/* AI Summary */}
                                  <div className="bg-white rounded-xl border border-brand-orange/20 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Bot size={14} className="text-brand-orange" />
                                      <p className="text-xs font-bold text-brand-navy font-dm-sans">AI Summary</p>
                                    </div>
                                    <p className="text-xs text-gray-600 font-dm-sans leading-relaxed">{student.risk_reason}</p>
                                    <div className="mt-3 pt-3 border-t border-brand-border flex gap-2">
                                      <button
                                        onClick={() => showToast(`Scheduled check-in with ${student.name}`, 'success')}
                                        className="flex-1 text-xs bg-brand-orange text-white py-2 rounded-lg font-semibold font-dm-sans hover:bg-brand-orange-dark transition"
                                      >
                                        Schedule Check-in
                                      </button>
                                      <button
                                        onClick={() => showToast(`Flagged ${student.name} for review`, 'warning')}
                                        className="flex-1 text-xs border border-brand-border text-brand-muted py-2 rounded-lg font-semibold font-dm-sans hover:border-brand-orange/40 hover:text-brand-orange transition"
                                      >
                                        Flag
                                      </button>
                                    </div>
                                    {/* TODO: GET /api/instructor/student/:id/ai-summary { student_id, cohort_id } */}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* TODO: GET /api/instructor/cohort/:id/students */}
        </motion.div>
      </div>
    </AppShell>
  )
}
