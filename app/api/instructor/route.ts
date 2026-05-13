import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (profile?.role !== 'instructor' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: cohorts } = await admin
    .from('cohorts')
    .select('id, name, course_id')
    .eq('instructor_id', userId)
    .order('start_date', { ascending: false })

  const cohortId = request.nextUrl.searchParams.get('cohort_id') || cohorts?.[0]?.id
  if (!cohortId) return NextResponse.json({ cohorts: [], cohort: null })

  const { data: cohort } = await admin
    .from('cohorts')
    .select('id, name, course_id')
    .eq('id', cohortId)
    .maybeSingle()

  const [{ data: cohortStudents }, { data: atRisk }, { data: modules }, { data: recommendations }] = await Promise.all([
    admin.from('cohort_enrollments').select('student_id, profiles(full_name, avatar_url)').eq('cohort_id', cohortId),
    admin.from('at_risk_flags').select('student_id, risk_level, reason').eq('cohort_id', cohortId),
    admin.from('modules').select('id, title, order_index, weeks(week_number)').eq('course_id', cohort?.course_id || '').order('order_index', { ascending: true }),
    admin.from('ai_recommendations').select('text').eq('cohort_id', cohortId).order('created_at', { ascending: false }),
  ])

  const studentIds = (cohortStudents || []).map((s) => s.student_id)
  const moduleIds = (modules || []).map((m) => m.id)

  const [{ data: progressRows }, { data: quizAttempts }, { data: activityRows }] = await Promise.all([
    studentIds.length && moduleIds.length
      ? admin
          .from('module_progress')
          .select('student_id, completed, module_id')
          .in('student_id', studentIds)
          .in('module_id', moduleIds)
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? admin
          .from('quiz_attempts')
          .select('student_id, score, quizzes(module_id)')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? admin
          .from('activity_log')
          .select('student_id, created_at')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [] }),
  ])

  const totalModules = modules?.length || 0
  const completedByStudent = (progressRows || []).reduce<Record<string, number>>((acc, row) => {
    if (row.completed) acc[row.student_id] = (acc[row.student_id] || 0) + 1
    return acc
  }, {})

  const completionAvg = studentIds.length && totalModules
    ? Math.round(
        (studentIds.reduce((sum, id) => sum + (completedByStudent[id] || 0) / totalModules, 0) / studentIds.length) * 100
      )
    : 0

  const quizScores = (quizAttempts || []).map((q) => q.score || 0)
  const avgQuizScore = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0

  const lastActiveByStudent = (activityRows || []).reduce<Record<string, Date>>((acc, row) => {
    const date = new Date(row.created_at)
    const current = acc[row.student_id]
    if (!current || date > current) acc[row.student_id] = date
    return acc
  }, {})

  const dropoutCount = studentIds.filter((id) => {
    const last = lastActiveByStudent[id]
    if (!last) return true
    const diffDays = Math.floor((Date.now() - last.getTime()) / 86400000)
    return diffDays >= 7
  }).length

  const dropoutRate = studentIds.length ? Math.round((dropoutCount / studentIds.length) * 100) : 0

  const riskMap = new Map((atRisk || []).map((r) => [r.student_id, r]))

  const students = (cohortStudents || []).map((s) => {
    const completed = completedByStudent[s.student_id] || 0
    const progress = totalModules ? Math.round((completed / totalModules) * 100) : 0
    const lastActive = lastActiveByStudent[s.student_id]
    const risk = riskMap.get(s.student_id)
    const studentProfile = Array.isArray(s.profiles)
      ? s.profiles[0]
      : (s.profiles as { full_name?: string; avatar_url?: string | null } | null)

    const quizAvg = quizAttempts
      ?.filter((q) => q.student_id === s.student_id)
      .map((q) => q.score || 0)
    const avg = quizAvg && quizAvg.length ? Math.round(quizAvg.reduce((a, b) => a + b, 0) / quizAvg.length) : 0

    return {
      id: s.student_id,
      name: studentProfile?.full_name ?? 'Student',
      avatar: studentProfile?.avatar_url ?? null,
      progress,
      last_active: lastActive ? `${Math.max(1, Math.floor((Date.now() - lastActive.getTime()) / 3600000))} hours ago` : 'No activity',
      quiz_avg: avg,
      risk: risk?.risk_level ?? 'low',
      risk_reason: risk?.reason ?? 'On track. Consistent activity and healthy progress.',
    }
  })

  const weeks = (modules || []).reduce<Record<number, string[]>>((acc, m) => {
    const moduleWeek = Array.isArray(m.weeks)
      ? m.weeks[0]
      : (m.weeks as { week_number?: number } | null)
    const week = moduleWeek?.week_number || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(m.id)
    return acc
  }, {})

  const cohortCompletion = Object.keys(weeks).map((wk) => {
    const moduleIdsForWeek = weeks[Number(wk)]
    const totalPossible = moduleIdsForWeek.length * studentIds.length
    const completed = (progressRows || []).filter((row) => row.completed && moduleIdsForWeek.includes(row.module_id)).length
    const pct = totalPossible ? Math.round((completed / totalPossible) * 100) : 0
    return { week: `Wk ${wk}`, completion: pct }
  })

  const moduleDropOff = (modules || []).map((m) => {
    const totalPossible = studentIds.length
    const completed = (progressRows || []).filter((row) => row.completed && row.module_id === m.id).length
    const pct = totalPossible ? Math.round((completed / totalPossible) * 100) : 0
    return { module: m.title, drop_rate: Math.max(0, 100 - pct) }
  }).sort((a, b) => b.drop_rate - a.drop_rate).slice(0, 6)

  return NextResponse.json({
    cohorts: cohorts || [],
    cohort,
    stats: {
      total_students: studentIds.length,
      avg_completion: completionAvg,
      at_risk_count: (atRisk || []).length,
      avg_quiz_score: avgQuizScore,
      dropout_rate: dropoutRate,
    },
    cohortCompletion,
    moduleDropOff,
    recommendations: (recommendations || []).map((r) => r.text),
    students,
  })
}
