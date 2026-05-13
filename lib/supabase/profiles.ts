import type { SupabaseClient, User } from '@supabase/supabase-js'

export type ProfileRow = {
  id: string
  full_name: string
  avatar_url: string | null
  role: 'student' | 'instructor' | 'admin'
  onboarding_completed: boolean
  level: 'beginner' | 'intermediate' | 'advanced' | null
  cohort_id: string | null
}

function metadataString(user: User, key: string) {
  const value = user.user_metadata?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function fullNameFromUser(user: User) {
  return (
    metadataString(user, 'full_name') ||
    metadataString(user, 'name') ||
    user.email?.split('@')[0] ||
    'Learner'
  )
}

function avatarFromUser(user: User) {
  return metadataString(user, 'avatar_url') || metadataString(user, 'picture')
}

export async function ensureProfile(admin: SupabaseClient, user: User): Promise<ProfileRow> {
  const { data: existing, error: existingError } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (existingError) throw existingError
  if (existing) return existing as ProfileRow

  const { data: profile, error: upsertError } = await admin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        full_name: fullNameFromUser(user),
        avatar_url: avatarFromUser(user),
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single()

  if (upsertError) throw upsertError
  return profile as ProfileRow
}
