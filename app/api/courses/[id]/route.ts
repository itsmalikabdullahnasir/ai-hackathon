import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const courseId = params.id
  const admin = createAdminClient()

  const [{ data: course }, { data: modules }, { data: progressRows }] = await Promise.all([
    admin
      .from('courses')
      .select('id, title, description, level, price_pkr, duration_weeks, total_modules, thumbnail_url, rating, skills, instructor:profiles(full_name, avatar_url)')
      .eq('id', courseId)
      .single(),
    admin
      .from('modules')
      .select('id, title, description, video_url, duration_minutes, order_index, week_id, weeks(week_number)')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true }),
    admin
      .from('module_progress')
      .select('module_id, completed')
      .eq('student_id', userId),
  ])

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const progressMap = new Map((progressRows || []).map((row) => [row.module_id, row]))
  const currentModuleId = (modules || []).find((m) => !progressMap.get(m.id)?.completed)?.id
  const totalModules = modules?.length ?? course.total_modules ?? 0
  const completedCount = (modules || []).filter((m) => progressMap.get(m.id)?.completed).length
  const overallProgress = totalModules ? Math.round((completedCount / totalModules) * 100) : 0

  const orderedModules = (modules || []).map((m) => {
    const completed = !!progressMap.get(m.id)?.completed
    const current = m.id === currentModuleId
    const locked = !completed && currentModuleId ? m.order_index > (modules || []).find((x) => x.id === currentModuleId)?.order_index! : false
    const week = Array.isArray(m.weeks)
      ? m.weeks[0]?.week_number
      : (m.weeks as { week_number?: number } | null)?.week_number

    return {
      id: m.id,
      title: m.title,
      description: m.description,
      video_url: m.video_url,
      duration: m.duration_minutes,
      week: week ?? 1,
      completed,
      current,
      locked,
    }
  })

  const activeModuleId = currentModuleId ?? orderedModules[0]?.id
  const instructor = Array.isArray(course.instructor)
    ? course.instructor[0]
    : (course.instructor as { full_name?: string; avatar_url?: string | null } | null)

  const [{ data: resources }, { data: quiz }] = await Promise.all([
    activeModuleId
      ? admin
          .from('resources')
          .select('id, title, type, file_url')
          .eq('module_id', activeModuleId)
      : Promise.resolve({ data: [] }),
    activeModuleId
      ? admin
          .from('quizzes')
          .select('id, title, module_id, questions(id, body, options, correct_index, explanation)')
          .eq('module_id', activeModuleId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return NextResponse.json({
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      price_pkr: course.price_pkr,
      duration_weeks: course.duration_weeks,
      total_modules: totalModules,
      thumbnail_url: course.thumbnail_url,
      rating: course.rating ?? 4.7,
      skills: course.skills ?? [],
      instructor_name: instructor?.full_name ?? 'Instructor',
      instructor_avatar: instructor?.avatar_url ?? null,
      progress: overallProgress,
    },
    modules: orderedModules,
    resources: resources || [],
    quiz: quiz || null,
  })
}
