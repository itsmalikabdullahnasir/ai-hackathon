// Edge Function: update-streak
// POST /functions/v1/update-streak
// Triggered via DB webhook on activity_log INSERT
// Updates student streak based on activity date

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Webhook payload from Supabase DB trigger
    const body = await req.json()
    const student_id: string = body.record?.student_id ?? body.student_id

    if (!student_id) {
      return new Response('student_id required', { status: 400, headers: corsHeaders })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // Get current streak record
    const { data: streakRecord } = await supabase
      .from('streaks')
      .select('*')
      .eq('student_id', student_id)
      .single()

    if (!streakRecord) {
      // Create new streak record
      await supabase.from('streaks').insert({
        student_id,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: todayStr,
      })
      return new Response(JSON.stringify({ streak: 1, action: 'created' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const lastDate = streakRecord.last_activity_date

    // Already logged today — no update needed
    if (lastDate === todayStr) {
      return new Response(JSON.stringify({ streak: streakRecord.current_streak, action: 'no_change' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let newStreak: number

    if (lastDate === yesterdayStr) {
      // Consecutive day — increment streak
      newStreak = streakRecord.current_streak + 1
    } else {
      // Gap detected — reset streak
      newStreak = 1
    }

    const newLongest = Math.max(newStreak, streakRecord.longest_streak ?? 0)

    await supabase.from('streaks').update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: todayStr,
      updated_at: new Date().toISOString(),
    }).eq('student_id', student_id)

    // Award milestone toast if milestone hit
    const milestones = [7, 14, 30, 60, 100]
    const hitMilestone = milestones.includes(newStreak)

    if (hitMilestone) {
      await supabase.from('ai_insights').insert({
        student_id,
        insight_text: `🔥 ${newStreak}-day streak! You're in the top learners at atomcamp. This consistency will pay off massively in your career journey.`,
        type: 'encouragement',
      })
    }

    return new Response(
      JSON.stringify({ streak: newStreak, longest: newLongest, milestone: hitMilestone, action: 'updated' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
