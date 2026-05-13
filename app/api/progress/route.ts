import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function intensityFromMinutes(minutes: number) {
  if (minutes <= 0) return 0
  if (minutes < 30) return 1
  if (minutes < 60) return 2
  if (minutes < 120) return 3
  return 4
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const since = new Date()
  since.setDate(since.getDate() - 370)

  const [{ data: streak }, { data: profile }, { data: activity }, { data: progressRows }, { data: skills }, { data: certificates }, { data: quizAttempts }] = await Promise.all([
    admin.from('streaks').select('current_streak').eq('student_id', userId).maybeSingle(),
    admin.from('profiles').select('cohort_id').eq('id', userId).maybeSingle(),
    admin.from('activity_log').select('created_at, metadata').eq('student_id', userId).gte('created_at', since.toISOString()),
    admin
      .from('module_progress')
      .select('completed, completed_at, modules(id, title, course_id, courses(title))')
      .eq('student_id', userId),
    admin.from('skill_scores').select('skill, score').eq('student_id', userId),
    admin
      .from('certificates')
      .select('id, issued_at, verification_code, course:courses(title)')
      .eq('student_id', userId),
    admin
      .from('quiz_attempts')
      .select('score, attempted_at, quizzes(module_id)')
      .eq('student_id', userId),
  ])

  const activityByDay = new Map<string, number>()
  let totalMinutes = 0

  for (const entry of activity || []) {
    const dayKey = toDateKey(new Date(entry.created_at))
    const minutes = Number(entry.metadata?.duration_minutes || 0)
    totalMinutes += minutes
    activityByDay.set(dayKey, (activityByDay.get(dayKey) || 0) + minutes)
  }

  const weeklyActivity = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = toDateKey(date)
    const hours = (activityByDay.get(key) || 0) / 60
    weeklyActivity.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Number(hours.toFixed(1)),
    })
  }

  const heatmap = []
  const start = new Date()
  start.setDate(start.getDate() - 364)
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime())
      date.setDate(start.getDate() + w * 7 + d)
      const minutes = activityByDay.get(toDateKey(date)) || 0
      heatmap.push({ week: w, day: d, intensity: intensityFromMinutes(minutes) })
    }
  }

  const completedRows = (progressRows || []).filter((row) => row.completed)
  const completedModules = completedRows
    .map((row) => {
      const module = firstRelation(row.modules as {
        id?: string
        title?: string
        courses?: { title?: string } | Array<{ title?: string }> | null
      } | Array<{
        id?: string
        title?: string
        courses?: { title?: string } | Array<{ title?: string }> | null
      }> | null)
      const course = firstRelation(module?.courses)
      const score = quizAttempts?.find((qa) => firstRelation(qa.quizzes)?.module_id === module?.id)?.score ?? null
      return {
        title: module?.title ?? 'Module',
        course: course?.title ?? 'Course',
        date: row.completed_at ? new Date(row.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        score: score ?? 0,
      }
    })
    .slice(0, 8)

  const quizzesPassed = (quizAttempts || []).filter((q) => (q.score ?? 0) >= 70).length

  const skillRadar = (skills || []).map((s) => ({ skill: s.skill, score: s.score }))

  const certificatesPayload = (certificates || []).map((cert) => ({
    id: cert.id,
    course_title: firstRelation(cert.course)?.title ?? 'Course',
    issued_at: cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    verification_code: cert.verification_code,
  }))

  const cohortId = profile?.cohort_id
  let leaderboard: Array<{ rank: number; name: string; score: number; badge: string; is_me: boolean }> = []

  if (cohortId) {
    const [{ data: cohort }, { data: cohortStudents }] = await Promise.all([
      admin.from('cohorts').select('id, course_id').eq('id', cohortId).maybeSingle(),
      admin.from('cohort_enrollments').select('student_id, profiles(full_name)').eq('cohort_id', cohortId),
    ])

    const { data: cohortProgress } = (cohortStudents || []).length
      ? await admin
          .from('module_progress')
          .select('student_id, completed, modules(course_id)')
          .in('student_id', (cohortStudents || []).map((c) => c.student_id))
      : { data: [] }

    const counts = (cohortProgress || []).reduce<Record<string, number>>((acc, row) => {
      const module = firstRelation(row.modules)
      if (module?.course_id !== cohort?.course_id) return acc
      if (row.completed) acc[row.student_id] = (acc[row.student_id] || 0) + 1
      return acc
    }, {})

    leaderboard = (cohortStudents || [])
      .map((s) => {
        const studentProfile = firstRelation(s.profiles)
        return {
          name: studentProfile?.full_name ?? 'Student',
          score: (counts[s.student_id] || 0) * 100,
          is_me: s.student_id === userId,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        score: entry.score,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '',
        is_me: entry.is_me,
      }))
  }

  return NextResponse.json({
    stats: {
      study_hours: Number((totalMinutes / 60).toFixed(1)),
      modules_done: completedRows.length,
      quizzes_passed: quizzesPassed,
      streak: streak?.current_streak ?? 0,
    },
    weeklyActivity,
    heatmap,
    skillRadar,
    completedModules,
    certificates: certificatesPayload,
    leaderboard,
  })
}
