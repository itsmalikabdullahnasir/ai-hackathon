import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'
import { ensureProfile } from '@/lib/supabase/profiles'

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: authUser, error: authError } = await admin.auth.admin.getUserById(userId)

  if (authError || !authUser.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let profile
  try {
    profile = await ensureProfile(admin, authUser.user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({
    id: profile.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: profile.role,
    onboarding_completed: profile.onboarding_completed,
    level: profile.level,
    email: authUser.user.email ?? '',
  })
}
