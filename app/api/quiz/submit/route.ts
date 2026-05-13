import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserIdFromRequest } from '@/lib/supabase/auth-server'

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const quizId = String(body.quiz_id || '')
  const answers = body.answers || {}

  if (!quizId || typeof answers !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: questions } = await admin
    .from('questions')
    .select('id, correct_index')
    .eq('quiz_id', quizId)

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  const correct = questions.filter((q) => answers[q.id] === q.correct_index).length
  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= 70

  await admin.from('quiz_attempts').insert({
    student_id: userId,
    quiz_id: quizId,
    answers,
    score,
    passed,
  })

  return NextResponse.json({ score, passed })
}
