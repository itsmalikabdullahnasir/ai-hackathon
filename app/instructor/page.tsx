'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
} from 'recharts'
import {
  Users, AlertTriangle, TrendingUp, BarChart2, Download, Clock, Sparkles, AlertCircle,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { StatCardSkeleton } from '@/components/Skeleton'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

interface Cohort { id: string; name: string; course_id: string }
interface Student {
  id: string; name: string; avatar: string | null; progress: number
  last_active: string; quiz_avg: number; risk: string; risk_reason: string
}
interface InstructorData {
  cohorts: Cohort[]
  cohort: Cohort | null
  stats: { total_students: number; avg_completion: number; at_risk_count: number; avg_quiz_score: number; dropout_rate: number }
  cohortCompletion: Array<{ week: string; completion: number }>
  moduleDropOff: Array<{ module: string; drop_rate: number }>
  recommendations: string[]
  students: Student[]
}

const targetQuizScore = 80
const mockInstructorData: InstructorData = {
  cohorts: [{ id: 'cohort-ux-2024q3', name: 'Advanced UI/UX Design (2024-Q3)', course_id: 'course-ux' }],
  cohort: { id: 'cohort-ux-2024q3', name: 'Advanced UI/UX Design (2024-Q3)', course_id: 'course-ux' },
  stats: {
    total_students: 1284,
    avg_completion: 84.2,
    at_risk_count: 12,
    avg_quiz_score: 78.5,
    dropout_rate: 6.3,
  },
  cohortCompletion: [
    { week: 'Week 1', completion: 18 },
    { week: 'Week 4', completion: 42 },
    { week: 'Week 8', completion: 71 },
    { week: 'Week 12', completion: 84 },
  ],
  moduleDropOff: [
    { module: 'Intro to Design Systems', drop_rate: 2 },
    { module: 'Token Architecture', drop_rate: 8 },
    { module: 'Complex Component Logic', drop_rate: 36 },
    { module: 'Documentation & Handoff', drop_rate: 19 },
  ],
  recommendations: [
    '45% of students struggled with "Complex Component Logic". Schedule a live Q&A session for Module 3.',
    'Focus on Sarah Jenkins and Marcus Thorne based on repeated quiz drops and extended inactivity.',
  ],
  students: [
    {
      id: 'sarah-jenkins',
      name: 'Sarah Jenkins',
      avatar: null,
      progress: 24,
      last_active: '5 days ago',
      quiz_avg: 58,
      risk: 'high',
      risk_reason: 'Consecutive quiz fails',
    },
    {
      id: 'marcus-thorne',
      name: 'Marcus Thorne',
      avatar: null,
      progress: 12,
      last_active: '9 days ago',
      quiz_avg: 46,
      risk: 'high',
      risk_reason: 'Extended inactivity',
    },
  ],
}

function formatPercent(value: number) {
  return `${Math.round(value * 10) / 10}%`
}

function retentionColor(value: number) {
  if (value >= 90) return 'bg-emerald-500'
  if (value >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

function riskBadge(risk: string) {
  if (risk === 'high') return 'bg-red-100 text-red-700'
  if (risk === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

export default function InstructorPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<InstructorData | null>(null)
  const [selectedCohortId, setSelectedCohortId] = useState<string>('')

  function fetchData(cohortId?: string) {
    setLoading(true)
    const url = cohortId ? `/api/instructor?cohort_id=${cohortId}` : '/api/instructor'
    apiFetch<InstructorData>(url)
      .then((d) => {
        setData(d)
        if (d.cohort?.id && !cohortId) setSelectedCohortId(d.cohort.id)
      })
      .catch(() => {
        setData(mockInstructorData)
        setSelectedCohortId(mockInstructorData.cohort?.id ?? '')
        showToast('Live data unavailable. Showing demo data.', 'info')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const atRiskStudents = useMemo(
    () => (data?.students ?? []).filter((s) => s.risk === 'high' || s.risk === 'medium'),
    [data],
  )

  const focusStudent = useMemo(() => {
    const students = data?.students ?? []
    return students.find((s) => s.risk === 'high')
      || students.find((s) => s.risk === 'medium')
      || students[0]
      || null
  }, [data])

  const quizHistory = useMemo(() => {
    if (!focusStudent) return []
    const base = focusStudent.quiz_avg || 70
    return [
      { name: 'Quiz 1', score: Math.max(40, base - 6) },
      { name: 'Quiz 2', score: Math.min(100, base + 4) },
      { name: 'Quiz 3', score: Math.max(40, base - 12) },
      { name: 'Quiz 4', score: Math.min(100, base + 2) },
    ]
  }, [focusStudent])

  const statCards = data ? [
    {
      label: 'Total Students',
      value: data.stats.total_students.toLocaleString(),
      helper: '+12% this month',
      icon: Users,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Completion Rate',
      value: formatPercent(data.stats.avg_completion),
      helper: 'Target: 90%',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'At-Risk Students',
      value: String(data.stats.at_risk_count),
      helper: 'Immediate attention required',
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      helperColor: 'text-red-500',
    },
    {
      label: 'Avg Quiz Score',
      value: formatPercent(data.stats.avg_quiz_score),
      helper: `Target: ${formatPercent(targetQuizScore)}`,
      icon: BarChart2,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ] : []

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 mb-6">
          {(data?.cohorts ?? []).length > 0 && (
            <div className="flex items-center gap-2 text-sm font-dm-sans text-brand-muted">
              <span>Cohort:</span>
              <select
                value={selectedCohortId}
                onChange={(e) => { setSelectedCohortId(e.target.value); fetchData(e.target.value) }}
                className="bg-transparent text-sm font-semibold font-dm-sans text-brand-navy focus:outline-none"
              >
                {(data?.cohorts ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </motion.div>

        {!loading && (data?.cohorts ?? []).length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-brand-border">
            <Users size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-sora text-lg font-bold text-gray-400">No cohorts assigned</h3>
            <p className="text-brand-muted text-sm mt-1 font-dm-sans">You need instructor or admin role to view this dashboard.</p>
          </div>
        )}

        {(loading || (data?.cohorts ?? []).length > 0) && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                : statCards.map(({ label, value, helper, icon: Icon, iconBg, iconColor, helperColor }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-brand-border p-4 shadow-card">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-brand-muted font-dm-sans">{label}</p>
                        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
                          <Icon size={18} className={iconColor} />
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-sora text-2xl font-bold text-brand-navy">{value}</p>
                        <p className={clsx('text-xs font-dm-sans mt-1', helperColor ?? 'text-brand-muted')}>{helper}</p>
                      </div>
                      {label === 'Completion Rate' && (
                        <div className="mt-3 h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${data?.stats.avg_completion ?? 0}%` }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Cohort Completion Over Time</h3>
                {loading ? <div className="h-56 bg-gray-100 rounded-xl animate-pulse" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data?.cohortCompletion ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8, border: '1px solid #E2E8F0' }} formatter={(v: number) => [`${v}%`, 'Completion']} />
                      <Line type="monotone" dataKey="completion" stroke="#077837" strokeWidth={2.5} dot={{ r: 3, fill: '#077837' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <h3 className="font-sora text-lg font-bold text-brand-navy mb-4">Module Drop-off Heatmap</h3>
                {loading ? <div className="h-56 bg-gray-100 rounded-xl animate-pulse" /> : (
                  <div className="space-y-4">
                    {(data?.moduleDropOff ?? []).map((m, idx) => {
                      const retention = Math.max(0, 100 - m.drop_rate)
                      return (
                        <div key={m.module}>
                          <div className="flex items-center justify-between text-xs font-dm-sans text-brand-muted">
                            <span>{`M${idx + 1}: ${m.module}`}</span>
                            <span className="font-semibold text-brand-navy">{retention}% Retention</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 mt-2">
                            <div className={clsx('h-2 rounded-full', retentionColor(retention))} style={{ width: `${retention}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="font-sora text-lg font-bold text-brand-navy">At-Risk Students</h3>
                  <p className="text-xs text-brand-muted font-dm-sans mt-0.5">{atRiskStudents.length} need attention</p>
                </div>
                <button
                  onClick={() => showToast('Exporting full list...', 'info')}
                  className="flex items-center gap-2 text-xs font-semibold font-dm-sans text-brand-muted hover:text-brand-orange transition"
                >
                  <Download size={14} /> Export Full List
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-bg border-b border-brand-border">
                      {['Student', 'Progress', 'Last Active', 'Risk Score', 'Reason', 'Action'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-brand-muted font-dm-sans uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="border-b border-brand-border">
                          <td className="px-5 py-4"><div className="h-4 w-32 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-4"><div className="h-3 w-24 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-4"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-4"><div className="h-7 w-20 bg-gray-100 rounded" /></td>
                        </tr>
                      ))
                    ) : atRiskStudents.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-brand-muted font-dm-sans text-sm">No at-risk students found.</td></tr>
                    ) : (
                      atRiskStudents.map((student) => (
                        <tr key={student.id} className="border-b border-brand-border">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {student.avatar ? (
                                <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-xs font-bold text-brand-orange">{student.name[0]}</div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-brand-navy font-dm-sans">{student.name}</p>
                                <p className="text-[11px] text-brand-muted font-dm-sans">{student.name.toLowerCase().replace(/\s+/g, '.')}@autocamp.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <div className={clsx('h-2 rounded-full', student.progress >= 70 ? 'bg-emerald-500' : student.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${student.progress}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-brand-navy font-dm-sans w-8">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-brand-muted font-dm-sans"><Clock size={12} />{student.last_active}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={clsx('text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide', riskBadge(student.risk))}>{student.risk.toUpperCase()}</span>
                          </td>
                          <td className="px-5 py-4 max-w-[220px]">
                            <p className="text-xs text-brand-muted font-dm-sans leading-relaxed truncate">{student.risk_reason}</p>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => showToast(`Intervention started for ${student.name}`, 'success')}
                              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition px-3 py-1.5 rounded-lg"
                            >
                              Intervene
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Sparkles size={16} className="text-emerald-600" /></div>
                  <h3 className="font-sora text-lg font-bold text-brand-navy">AI Recommendations for Instructor</h3>
                </div>
                <div className="space-y-3">
                  <div className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-4">
                    <p className="text-xs font-semibold text-brand-navy font-dm-sans">Topic Re-Intervention Needed</p>
                    <p className="text-xs text-brand-muted font-dm-sans mt-1">{data?.recommendations?.[0] ?? '45% of students struggled with "Complex Component Logic". Schedule a live Q&A session for Module 3.'}</p>
                    <button onClick={() => showToast('Session scheduled with cohort', 'success')} className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800">Schedule live Q&A</button>
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-4">
                    <p className="text-xs font-semibold text-brand-navy font-dm-sans">Student Drill-down Needed</p>
                    <p className="text-xs text-brand-muted font-dm-sans mt-1">{data?.recommendations?.[1] ?? 'Focus on Sarah Jenkins and Marcus Thorne based on repeated quiz drops and extended inactivity.'}</p>
                    <button onClick={() => showToast('Review notes opened', 'info')} className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800">Open student notes</button>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center"><AlertCircle size={16} className="text-yellow-600" /></div>
                  <h3 className="font-sora text-lg font-bold text-brand-navy">Engagement Dip Detected</h3>
                </div>
                <p className="text-xs text-brand-muted font-dm-sans">Active users dropped by 15% after the weekend. Consider sending a motivational announcement to boost morale.</p>
                <button
                  onClick={() => showToast('Announcement drafted for cohort', 'success')}
                  className="mt-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition px-3 py-2 rounded-lg"
                >
                  Send announcement
                </button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-sora text-lg font-bold text-brand-navy">Student Drill-down: {focusStudent?.name ?? 'Student'}</h3>
                    <p className="text-xs text-brand-muted font-dm-sans mt-0.5">AI-generated profile summary</p>
                  </div>
                  <button onClick={() => showToast('Opening student profile', 'info')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">View profile</button>
                </div>
                {focusStudent ? (
                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
                    <div className="bg-brand-bg rounded-xl p-4">
                      <p className="text-xs font-semibold text-brand-muted font-dm-sans mb-3">Quiz Score History</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={quizHistory} barSize={32}>
                          <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'DM Sans', borderRadius: 8, border: '1px solid #E2E8F0' }} formatter={(v: number) => [`${v}%`, 'Score']} />
                          <Bar dataKey="score" fill="#077837" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="border border-brand-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-brand-muted font-dm-sans">Summary</p>
                      <p className="text-xs text-brand-muted font-dm-sans mt-2">{focusStudent.risk_reason}</p>
                      <div className="mt-4 space-y-2">
                        <button onClick={() => showToast(`Scheduled check-in with ${focusStudent.name}`, 'success')} className="w-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition py-2 rounded-lg">Schedule check-in</button>
                        <button onClick={() => showToast(`Sent nudge to ${focusStudent.name}`, 'info')} className="w-full text-xs font-semibold text-emerald-700 border border-emerald-200 hover:border-emerald-300 transition py-2 rounded-lg">Send nudge</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-brand-muted font-dm-sans">No student data available.</p>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-sora text-lg font-bold text-brand-navy">Student Profile Summary</h3>
                    <p className="text-xs text-brand-muted font-dm-sans mt-0.5">Latest insight</p>
                  </div>
                  <button onClick={() => showToast('Full report exported', 'success')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Full Report</button>
                </div>
                <div className="text-xs text-brand-muted font-dm-sans leading-relaxed space-y-3">
                  <p><span className="text-brand-navy font-semibold">{focusStudent?.name ?? 'Student'}</span> has shown a profile for struggling with lower quiz engagement after complex implementation topics.</p>
                  <p>Recommend action: schedule a 1-on-1 check-in and review project deadlines. Share an encouragement message and provide a focused recap.</p>
                </div>
                <button
                  onClick={() => showToast('Report shared with program lead', 'info')}
                  className="mt-4 w-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition py-2 rounded-lg"
                >
                  Share with program lead
                </button>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
