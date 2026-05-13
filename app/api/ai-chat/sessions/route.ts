import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: sessions } = await admin
    .from('chat_sessions')
    .select('id, title, updated_at')
    .eq('student_id', userId)
    .order('updated_at', { ascending: false })

  const ids = (sessions || []).map((s) => s.id)
  const { data: messages } = ids.length
    ? await admin
        .from('chat_messages')
        .select('session_id, content, created_at')
        .in('session_id', ids)
        .order('created_at', { ascending: false })
    : { data: [] }

  const latestBySession = new Map<string, { content: string; created_at: string }>()
  for (const msg of messages || []) {
    if (!latestBySession.has(msg.session_id)) {
      latestBySession.set(msg.session_id, { content: msg.content, created_at: msg.created_at })
    }
  }

  const payload = (sessions || []).map((s) => {
    const latest = latestBySession.get(s.id)
    const date = latest?.created_at ? new Date(latest.created_at) : new Date(s.updated_at)
    return {
      id: s.id,
      title: s.title,
      preview: latest?.content ?? '',
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })

  return NextResponse.json({ sessions: payload })
}
