import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'
import { ensureProfile } from '@/lib/supabase/profiles'

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const courseId = String(body.course_id || '')
  const level = String(body.level || '').toLowerCase()
  const skillTags = Array.isArray(body.skill_tags) ? body.skill_tags : []

  if (!courseId) return NextResponse.json({ error: 'Course required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: authUser, error: authError } = await admin.auth.admin.getUserById(userId)

  if (authError || !authUser.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    await ensureProfile(admin, authUser.user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const { data: cohort } = await admin
    .from('cohorts')
    .select('id')
    .eq('course_id', courseId)
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  await admin
    .from('profiles')
    .update({ onboarding_completed: true, level: level || null, cohort_id: cohort?.id ?? null })
    .eq('id', userId)

  await admin
    .from('enrollments')
    .upsert({ student_id: userId, course_id: courseId, status: 'active' })

  if (cohort?.id) {
    await admin
      .from('cohort_enrollments')
      .upsert({ cohort_id: cohort.id, student_id: userId })
  }

  await admin
    .from('streaks')
    .upsert({ student_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: new Date().toISOString() })

  if (skillTags.length) {
    const rows = skillTags.map((skill: string) => ({
      student_id: userId,
      skill,
      score: 40 + Math.floor(Math.random() * 30),
    }))
    await admin.from('skill_scores').upsert(rows, { onConflict: 'student_id,skill' })
  }

  await admin.from('activity_log').insert({
    student_id: userId,
    action: 'login',
    metadata: { source: 'onboarding' },
  })

  return NextResponse.json({ success: true })
}
