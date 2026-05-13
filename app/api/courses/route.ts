import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const courseId = String(body.course_id || '').trim()
  if (!courseId) return NextResponse.json({ error: 'course_id required' }, { status: 400 })

  const admin = createAdminClient()

  const { data: course } = await admin.from('courses').select('id').eq('id', courseId).maybeSingle()
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const { error } = await admin
    .from('enrollments')
    .upsert({ student_id: userId, course_id: courseId, status: 'active' }, { onConflict: 'student_id,course_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: cohort } = await admin
    .from('cohorts')
    .select('id')
    .eq('course_id', courseId)
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (cohort?.id) {
    await admin
      .from('cohort_enrollments')
      .upsert({ cohort_id: cohort.id, student_id: userId }, { onConflict: 'cohort_id,student_id' })
    await admin
      .from('profiles')
      .update({ cohort_id: cohort.id })
      .eq('id', userId)
  }

  await admin.from('activity_log').insert({
    student_id: userId,
    action: 'login',
    metadata: { source: 'enrollment', course_id: courseId },
  })

  return NextResponse.json({ success: true })
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [{ data: courses }, { data: enrollments }, { data: progressRows }] = await Promise.all([
    admin
      .from('courses')
      .select('id, title, description, level, price_pkr, duration_weeks, total_modules, thumbnail_url, rating, skills, instructor:profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    admin.from('enrollments').select('course_id, student_id'),
    admin
      .from('module_progress')
      .select('module_id, completed, modules(course_id)')
      .eq('student_id', userId),
  ])

  const enrolledCourseIds = new Set(
    (enrollments || []).filter((e) => e.student_id === userId).map((e) => e.course_id)
  )

  const enrollmentCounts = (enrollments || []).reduce<Record<string, number>>((acc, e) => {
    acc[e.course_id] = (acc[e.course_id] || 0) + 1
    return acc
  }, {})

  const completedByCourse = (progressRows || []).reduce<Record<string, number>>((acc, row) => {
    const module = Array.isArray(row.modules)
      ? row.modules[0]
      : (row.modules as { course_id?: string } | null)

    if (row.completed && module?.course_id) {
      acc[module.course_id] = (acc[module.course_id] || 0) + 1
    }
    return acc
  }, {})

  const payload = (courses || []).map((course) => {
    const completed = completedByCourse[course.id] || 0
    const total = course.total_modules || 0
    const progress = total ? Math.round((completed / total) * 100) : 0
    const instructor = Array.isArray(course.instructor)
      ? course.instructor[0]
      : (course.instructor as { full_name?: string; avatar_url?: string | null } | null)

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      price_pkr: course.price_pkr,
      duration_weeks: course.duration_weeks,
      total_modules: course.total_modules,
      thumbnail_url: course.thumbnail_url,
      rating: course.rating ?? 4.7,
      skills: course.skills ?? [],
      enrolled_count: enrollmentCounts[course.id] || 0,
      instructor_name: instructor?.full_name ?? 'Instructor',
      instructor_avatar: instructor?.avatar_url ?? null,
      is_enrolled: enrolledCourseIds.has(course.id),
      progress,
    }
  })

  return NextResponse.json({ courses: payload })
}
