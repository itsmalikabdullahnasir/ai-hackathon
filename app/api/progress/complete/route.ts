import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const moduleId = String(body.module_id || '').trim()
  if (!moduleId) return NextResponse.json({ error: 'module_id required' }, { status: 400 })

  const admin = createAdminClient()

  const { data: module } = await admin
    .from('modules')
    .select('id, course_id, duration_minutes')
    .eq('id', moduleId)
    .maybeSingle()

  if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  const { error } = await admin.from('module_progress').upsert(
    {
      student_id: userId,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
      last_viewed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,module_id' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await admin.from('activity_log').insert({
    student_id: userId,
    action: 'module_view',
    metadata: {
      module_id: moduleId,
      course_id: module.course_id,
      duration_minutes: module.duration_minutes ?? 0,
    },
  })

  const { data: streak } = await admin
    .from('streaks')
    .select('current_streak, longest_streak, last_activity_date')
    .eq('student_id', userId)
    .maybeSingle()

  const today = new Date().toISOString().slice(0, 10)
  const lastDate = streak?.last_activity_date

  let newCurrent = streak?.current_streak ?? 0
  let newLongest = streak?.longest_streak ?? 0

  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    newCurrent = lastDate === yesterday ? newCurrent + 1 : 1
    newLongest = Math.max(newLongest, newCurrent)

    await admin.from('streaks').upsert(
      {
        student_id: userId,
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_activity_date: today,
      },
      { onConflict: 'student_id' },
    )
  }

  return NextResponse.json({ success: true, streak: newCurrent })
}
