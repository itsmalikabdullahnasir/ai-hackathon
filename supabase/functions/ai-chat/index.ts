// Edge Function: ai-chat
// POST /functions/v1/ai-chat
// Streams Claude AI responses for the Autobot tutor

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3'

interface ChatInput {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  student_id: string
  session_id: string
  module_context_id?: string
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
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const { messages, student_id, session_id, module_context_id }: ChatInput = await req.json()

    // Fetch student profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, level')
      .eq('id', student_id)
      .single()

    // Fetch module context if provided
    let moduleContext = ''
    if (module_context_id) {
      const { data: mod } = await supabase
        .from('modules')
        .select('title, description')
        .eq('id', module_context_id)
        .single()
      if (mod) moduleContext = `The student is currently studying the module: "${mod.title}". ${mod.description ?? ''}`
    }

    const systemPrompt = `You are Autobot, atomcamp's expert AI study tutor for Data Science, Machine Learning, Python, SQL, and AI.

Student Profile:
- Name: ${profile?.full_name ?? 'Student'}
- Level: ${profile?.level ?? 'intermediate'}
${moduleContext ? `- Current Module: ${moduleContext}` : ''}

Guidelines:
- Be encouraging, concise, and educational
- Use code examples with Python when relevant
- Break complex concepts into digestible steps
- Connect concepts to real-world Pakistani/global industry applications
- If the student struggles, simplify your explanation
- Format code blocks clearly with triple backticks
- Always ask if they need further clarification`

    // Save user's last message to DB
    const lastUserMsg = messages[messages.length - 1]
    await supabase.from('chat_messages').insert({
      student_id,
      session_id,
      role: lastUserMsg.role,
      content: lastUserMsg.content,
      module_context_id: module_context_id ?? null,
    })

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const encoder = new TextEncoder()
    let fullContent = ''

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const text = chunk.delta.text
            fullContent += text
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()

        // Save assistant response to DB after streaming completes
        await supabase.from('chat_messages').insert({
          student_id,
          session_id,
          role: 'assistant',
          content: fullContent,
          module_context_id: module_context_id ?? null,
        })

        // Log activity
        await supabase.from('activity_log').insert({
          student_id,
          action: 'chat_message',
          metadata: { session_id, module_context_id },
        })
      },
    })

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

