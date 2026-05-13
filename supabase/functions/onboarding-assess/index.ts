// Edge Function: onboarding-assess
// POST /functions/v1/onboarding-assess
// Determines student level, assigns course, creates initial AI insights

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AssessmentInput {
  student_id: string
  background: string        // 'CS Grad' | 'Non-tech' | 'Student' | 'Tech (Not Data)'
  python_level: string      // 'None' | 'Basic' | 'Projects' | 'Professional'
  goal: string              // 'Job' | 'Automate' | 'Build' | 'Promotion'
  hours_per_week: string    // '<3' | '3-7' | '7-15' | '15+'
}

const COURSE_MAP: Record<string, string> = {
  // Replace with actual UUIDs from your DB
  beginner: 'course-uuid-data-analytics',
  intermediate: 'course-uuid-automation',
  advanced: 'course-uuid-ai-bootcamp',
}

function determineLevel(input: AssessmentInput): {
  level: 'beginner' | 'intermediate' | 'advanced'
  estimated_weeks: number
  skill_tags: string[]
} {
  const isCS = input.background === 'CS Grad'
  const isNonTech = input.background === 'Non-tech Professional'
  const hasPython = ['Projects', 'Professional'].includes(input.python_level)
  const noPython = input.python_level === 'None'
  const someCode = input.background === 'Tech (Not Data)' || input.python_level === 'Basic'

  const hoursMultiplier: Record<string, number> = { '<3': 1.4, '3-7': 1.0, '7-15': 0.75, '15+': 0.6 }
  const mult = hoursMultiplier[input.hours_per_week] ?? 1.0

  if (isCS && hasPython) {
    return {
      level: 'advanced',
      estimated_weeks: Math.round(14 * mult),
      skill_tags: ['Neural Networks', 'Deep Learning', 'PyTorch', 'NLP', 'Computer Vision'],
    }
  }

  if (isNonTech || noPython) {
    return {
      level: 'beginner',
      estimated_weeks: Math.round(12 * mult),
      skill_tags: ['Python Basics', 'SQL', 'Data Visualization', 'Statistics', 'Excel'],
    }
  }

  return {
    level: 'intermediate',
    estimated_weeks: Math.round(8 * mult),
    skill_tags: ['Python', 'APIs', 'LLMs', 'Automation', 'Pandas'],
  }
}

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

    const input: AssessmentInput = await req.json()

    const assessment = determineLevel(input)
    const courseId = COURSE_MAP[assessment.level]

    // Update student profile with level
    await supabase
      .from('profiles')
      .update({ level: assessment.level, onboarding_completed: true })
      .eq('id', input.student_id)

    // Create enrollment in recommended course
    await supabase
      .from('enrollments')
      .upsert({ student_id: input.student_id, course_id: courseId, status: 'active' })

    // Initialize streak record
    await supabase
      .from('streaks')
      .upsert({ student_id: input.student_id, current_streak: 0, longest_streak: 0 })

    // Generate initial AI insights
    const insights = [
      {
        student_id: input.student_id,
        insight_text: `Welcome! Based on your ${input.background} background, you're starting on the ${assessment.level} track. Your estimated completion is ${assessment.estimated_weeks} weeks at your chosen pace.`,
        type: 'encouragement',
      },
      {
        student_id: input.student_id,
        insight_text: `Focus areas for your first week: ${assessment.skill_tags.slice(0, 2).join(' and ')}. These form the foundation for everything ahead.`,
        type: 'recommendation',
      },
    ]
    await supabase.from('ai_insights').insert(insights)

    // Log activity
    await supabase.from('activity_log').insert({
      student_id: input.student_id,
      action: 'login',
      metadata: { event: 'onboarding_complete', level: assessment.level },
    })

    return new Response(
      JSON.stringify({
        level: assessment.level,
        recommended_course_id: courseId,
        estimated_weeks: assessment.estimated_weeks,
        skill_tags: assessment.skill_tags,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
