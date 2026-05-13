import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessionId = request.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: messages } = await admin
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('student_id', userId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  return NextResponse.json({ messages: messages || [] })
}
