// Edge Function: generate-insights
// POST /functions/v1/generate-insights
// Triggered daily via cron OR after module_progress insert
// Generates 3 personalized AI insights per student

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const { student_id } = await req.json()

    // Gather student data
    const [profileRes, progressRes, quizRes, streakRes] = await Promise.all([
      supabase.from('profiles').select('full_name, level').eq('id', student_id).single(),
      supabase.from('module_progress').select('completed, last_viewed_at').eq('student_id', student_id),
      supabase.from('quiz_attempts').select('score, passed, attempted_at').eq('student_id', student_id).order('attempted_at', { ascending: false }).limit(10),
      supabase.from('streaks').select('current_streak, longest_streak').eq('student_id', student_id).single(),
    ])

    const profile = profileRes.data
    const progress = progressRes.data ?? []
    const quizAttempts = quizRes.data ?? []
    const streak = streakRes.data

    const completedCount = progress.filter((p) => p.completed).length
    const totalModules = progress.length
    const avgQuizScore = quizAttempts.length
      ? Math.round(quizAttempts.reduce((s, q) => s + q.score, 0) / quizAttempts.length)
      : null

    const lastActive = progress.length
      ? new Date(Math.max(...progress.map((p) => new Date(p.last_viewed_at).getTime())))
      : null

    const daysSinceActive = lastActive
      ? Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Build context for Claude
    const context = `
Student: ${profile?.full_name}, Level: ${profile?.level}
Modules completed: ${completedCount} / ${totalModules}
Average quiz score: ${avgQuizScore ?? 'No attempts yet'}%
Current streak: ${streak?.current_streak ?? 0} days (longest: ${streak?.longest_streak ?? 0})
Days since last activity: ${daysSinceActive ?? 'Unknown'}
Recent quiz scores: ${quizAttempts.slice(0, 5).map((q) => `${q.score}%`).join(', ') || 'None'}
`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Based on this student's data, generate exactly 3 short, actionable learning insights.
Each should be 1-2 sentences. Return JSON array with objects: { text: string, type: "encouragement" | "warning" | "recommendation" }

Student data:
${context}

Rules:
- Be specific to their data (not generic)
- encouragement: celebrate wins or progress
- warning: flag risk of falling behind or poor quiz performance
- recommendation: suggest specific next steps
- Use Pakistani cultural context when relevant (mention atomcamp community, job market)`,
      }],
    })

    let insights: Array<{ text: string; type: string }> = []
    try {
      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) insights = JSON.parse(match[0])
    } catch {
      insights = [
        { text: 'Keep up the great work! Consistency is the key to mastering data science.', type: 'encouragement' },
        { text: 'Try completing at least one module today to maintain your learning momentum.', type: 'recommendation' },
        { text: 'Review your recent quiz mistakes — understanding errors is 3x more effective than re-reading.', type: 'recommendation' },
      ]
    }

    // Delete old insights (keep last 10) and insert new ones
    const { data: oldInsights } = await supabase
      .from('ai_insights')
      .select('id, created_at')
      .eq('student_id', student_id)
      .order('created_at', { ascending: false })

    if (oldInsights && oldInsights.length > 7) {
      const toDelete = oldInsights.slice(7).map((i) => i.id)
      await supabase.from('ai_insights').delete().in('id', toDelete)
    }

    const rows = insights.map((ins) => ({
      student_id,
      insight_text: ins.text,
      type: ins.type,
    }))

    await supabase.from('ai_insights').insert(rows)

    return new Response(
      JSON.stringify({ success: true, insights: rows }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
