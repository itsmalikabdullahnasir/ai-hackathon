import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function PATCH(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const fullName = String(body.full_name || '').trim()
  const email = String(body.email || '').trim()
  const avatarUrl = body.avatar_url !== undefined ? String(body.avatar_url) : undefined
  const notificationPrefs = body.notification_prefs !== undefined ? body.notification_prefs : undefined

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  const profileUpdate: Record<string, unknown> = { full_name: fullName }
  if (avatarUrl !== undefined) profileUpdate.avatar_url = avatarUrl
  if (notificationPrefs !== undefined) profileUpdate.notification_prefs = notificationPrefs

  const { error: profileError } = await admin
    .from('profiles')
    .update(profileUpdate)
    .eq('id', userId)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  const { data: currentUser } = await admin.auth.admin.getUserById(userId)
  if (currentUser.user?.email !== email) {
    const { error: authError } = await admin.auth.admin.updateUserById(userId, { email })
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ success: true })
}
