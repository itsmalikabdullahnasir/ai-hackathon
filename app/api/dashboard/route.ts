import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

function formatSessionDate(date: Date) {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString()
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return { label: `Today, ${time}`, is_today: true }
  if (isTomorrow) return { label: `Tomorrow, ${time}`, is_today: false }
  return { label: date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' }), is_today: false }
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [{ data: profile }, { data: streak }] = await Promise.all([
    admin.from('profiles').select('id, full_name, avatar_url').eq('id', userId).single(),
    admin.from('streaks').select('current_streak, longest_streak').eq('student_id', userId).maybeSingle(),
  ])

  const { data: enrollment } = await admin
    .from('enrollments')
    .select('course_id, status, enrolled_at, courses(id, title, total_modules, thumbnail_url, instructor_id, duration_weeks, rating, skills, price_pkr)')
    .eq('student_id', userId)
    .order('enrolled_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const course = Array.isArray(enrollment?.courses)
    ? enrollment?.courses[0]
    : (enrollment?.courses as {
        id: string
        title: string
        total_modules: number | null
        thumbnail_url: string | null
        instructor_id: string
        duration_weeks: number
        rating: number | null
        skills: string[] | null
        price_pkr: number | null
      } | null | undefined)
  if (!course) {
    return NextResponse.json({
      profile,
      stats: [],
      enrolledCourse: null,
      insights: [],
      liveSessions: [],
      learningPath: [],
      today: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    })
  }

  const [{ data: modules }, { data: progressRows }, { data: instructor }, { data: deadlines }] = await Promise.all([
    admin
      .from('modules')
      .select('id, title, order_index, duration_minutes, week_id, weeks(week_number)')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true }),
    admin
      .from('module_progress')
      .select('module_id, completed, completed_at')
      .eq('student_id', userId),
    admin
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', course.instructor_id)
      .maybeSingle(),
    admin
      .from('course_deadlines')
      .select('title, due_at')
      .eq('course_id', course.id)
      .gte('due_at', new Date().toISOString())
      .order('due_at', { ascending: true })
      .limit(1),
  ])

  const progressMap = new Map((progressRows || []).map((p) => [p.module_id, p]))
  const totalModules = modules?.length ?? course.total_modules ?? 0
  const completedCount = (modules || []).filter((m) => progressMap.get(m.id)?.completed).length
  const overallProgress = totalModules ? Math.round((completedCount / totalModules) * 100) : 0

  const currentModuleId = (modules || []).find((m) => !progressMap.get(m.id)?.completed)?.id

  const learningPath = (modules || []).map((m) => {
    const completed = !!progressMap.get(m.id)?.completed
    const current = m.id === currentModuleId
    const locked = !completed && currentModuleId ? m.order_index > (modules || []).find((x) => x.id === currentModuleId)?.order_index! : false
    const week = Array.isArray(m.weeks)
      ? m.weeks[0]?.week_number
      : (m.weeks as { week_number?: number } | null)?.week_number

    return {
      id: m.id,
      title: m.title,
      week: week ?? 1,
      duration: m.duration_minutes,
      completed,
      current,
      locked,
    }
  })

  const { data: insights } = await admin
    .from('ai_insights')
    .select('id, type, insight_text')
    .eq('student_id', userId)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: cohortEnrollments } = await admin
    .from('cohort_enrollments')
    .select('cohort_id')
    .eq('student_id', userId)

  const cohortIds = (cohortEnrollments || []).map((c) => c.cohort_id)
  const { data: liveSessions } = cohortIds.length
    ? await admin
        .from('live_sessions')
        .select('id, title, starts_at, participants_count, instructor:profiles(full_name)')
        .in('cohort_id', cohortIds)
        .order('starts_at', { ascending: true })
        .limit(4)
    : { data: [] }

  const sessions = (liveSessions || []).map((s) => {
    const start = new Date(s.starts_at)
    const formatted = formatSessionDate(start)
    const sessionInstructor = Array.isArray(s.instructor)
      ? s.instructor[0]
      : (s.instructor as { full_name?: string } | null)

    return {
      id: s.id,
      title: s.title,
      date: formatted.label,
      instructor: sessionInstructor?.full_name ?? 'Instructor',
      participants: s.participants_count ?? 0,
      is_today: formatted.is_today,
    }
  })

  const deadline = deadlines && deadlines[0] ? new Date(deadlines[0].due_at) : null
  const daysUntil = deadline ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400000)) : null

  return NextResponse.json({
    profile,
    today: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    stats: [
      { label: 'Learning Streak', value: `${streak?.current_streak ?? 0} Days`, badge: '+1 today' },
      { label: 'Modules Completed', value: `${completedCount} / ${totalModules}` },
      { label: 'Overall Progress', value: `${overallProgress}%` },
      { label: 'Next Deadline', value: daysUntil !== null ? `In ${daysUntil} Days` : 'No upcoming deadline' },
    ],
    enrolledCourse: {
      id: course.id,
      title: course.title,
      thumbnail_url: course.thumbnail_url,
      total_modules: totalModules,
      progress: overallProgress,
      current_module: learningPath.find((m) => m.current)?.title ?? learningPath[0]?.title ?? '',
      instructor_name: instructor?.full_name ?? 'Instructor',
      instructor_avatar: instructor?.avatar_url ?? null,
    },
    learningPath,
    insights: (insights || []).map((ins) => ({ id: ins.id, type: ins.type, text: ins.insight_text })),
    liveSessions: sessions,
  })
}
