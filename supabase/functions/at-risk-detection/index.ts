// Edge Function: at-risk-detection
// GET /functions/v1/at-risk-detection?cohort_id=xxx
// Analyzes cohort students and flags at-risk learners using heuristics + Claude

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
    // Verify instructor auth
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const url = new URL(req.url)
    const cohort_id = url.searchParams.get('cohort_id')
    if (!cohort_id) return new Response('cohort_id required', { status: 400 })

    // Get all students in this cohort
    const { data: cohortStudents } = await supabase
      .from('cohort_enrollments')
      .select('student_id, profiles(full_name, level)')
      .eq('cohort_id', cohort_id)

    if (!cohortStudents?.length) {
      return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const studentIds = cohortStudents.map((s) => s.student_id)

    // Batch fetch progress + quiz + activity data
    const [progressRes, quizRes, activityRes] = await Promise.all([
      supabase.from('module_progress').select('student_id, completed, last_viewed_at').in('student_id', studentIds),
      supabase.from('quiz_attempts').select('student_id, score, passed, attempted_at').in('student_id', studentIds),
      supabase.from('activity_log').select('student_id, created_at').in('student_id', studentIds).order('created_at', { ascending: false }),
    ])

    const now = Date.now()
    const flags: Array<{
      student_id: string
      student_name: string
      risk_level: 'high' | 'medium' | 'low'
      reason: string
      last_login_days: number
      completion_pct: number
      avg_quiz_score: number
    }> = []

    for (const student of cohortStudents) {
      const sid = student.student_id
      const progress = (progressRes.data ?? []).filter((p) => p.student_id === sid)
      const attempts = (quizRes.data ?? []).filter((q) => q.student_id === sid)
      const activities = (activityRes.data ?? []).filter((a) => a.student_id === sid)

      const completedModules = progress.filter((p) => p.completed).length
      const totalModules = progress.length
      const completionPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

      const avgScore = attempts.length
        ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
        : 0

      const lastActivity = activities[0]?.created_at
      const daysSinceActive = lastActivity
        ? Math.floor((now - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
        : 999

      const failedAttempts = attempts.filter((a) => !a.passed).length

      // Risk classification logic
      let riskLevel: 'high' | 'medium' | 'low' = 'low'

      if (daysSinceActive > 5 || (attempts.length >= 2 && avgScore < 50)) {
        riskLevel = 'high'
      } else if (completionPct < 40 && daysSinceActive > 2) {
        riskLevel = 'medium'
      }

      if (riskLevel !== 'low') {
        flags.push({
          student_id: sid,
          student_name: (student as any).profiles?.full_name ?? 'Unknown',
          risk_level: riskLevel,
          reason: '', // Will be filled by Claude
          last_login_days: daysSinceActive,
          completion_pct: completionPct,
          avg_quiz_score: avgScore,
        })
      }
    }

    // Generate AI reasons for flagged students via Claude (batch call)
    if (flags.length > 0) {
      const prompt = flags.map((f, i) =>
        `${i + 1}. ${f.student_name}: ${f.last_login_days}d inactive, ${f.completion_pct}% done, ${f.avg_quiz_score}% quiz avg → ${f.risk_level} risk`
      ).join('\n')

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `For each at-risk student below, write a 1-sentence actionable reason for their risk level that an instructor can use to decide intervention. Return as JSON array of strings (one per student, same order).

${prompt}`,
        }],
      })

      try {
        const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
        const match = raw.match(/\[[\s\S]*\]/)
        const reasons: string[] = match ? JSON.parse(match[0]) : []
        flags.forEach((f, i) => { f.reason = reasons[i] ?? 'Needs instructor review.' })
      } catch {
        flags.forEach((f) => { f.reason = `${f.risk_level === 'high' ? 'Urgent: ' : ''}${f.last_login_days}d inactive with ${f.completion_pct}% completion.` })
      }
    }

    // Upsert at_risk_flags
    for (const flag of flags) {
      await supabase.from('at_risk_flags').upsert({
        student_id: flag.student_id,
        cohort_id,
        risk_level: flag.risk_level,
        reason: flag.reason,
        resolved: false,
      })
    }

    // Sort: HIGH first, then MEDIUM
    const sorted = flags.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.risk_level] - order[b.risk_level]
    })

    return new Response(
      JSON.stringify(sorted),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
