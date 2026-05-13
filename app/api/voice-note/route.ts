export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Server is missing GROQ_API_KEY.' }, { status: 500 })
  }

  const formData = await request.formData()
  const audio = formData.get('audio')

  if (!audio || !(audio instanceof File)) {
    return Response.json({ error: 'Audio file is required.' }, { status: 400 })
  }

  const transcriptionForm = new FormData()
  transcriptionForm.append('file', audio, audio.name || 'voice-note.webm')
  transcriptionForm.append('model', 'whisper-large-v3')

  const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: transcriptionForm,
  })

  if (!transcriptionResponse.ok) {
    const errorText = await transcriptionResponse.text()
    return Response.json({ error: errorText || 'Transcription failed.' }, { status: 502 })
  }

  const transcriptionPayload = await transcriptionResponse.json()
  const transcript = transcriptionPayload?.text?.trim() || ''

  if (!transcript) {
    return Response.json({ error: 'No transcript produced.' }, { status: 502 })
  }

  const feedbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI tutor focused on learning topics. Provide concise feedback on student understanding. Use short bullets and end with one actionable next step. If the transcript is irrelevant to learning, respond politely that you can only help with learning-based questions and ask the learner to share a study topic or concept.',
        },
        {
          role: 'user',
          content: `Student voice note transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.4,
    }),
  })

  if (!feedbackResponse.ok) {
    const errorText = await feedbackResponse.text()
    return Response.json({ error: errorText || 'Feedback generation failed.' }, { status: 502 })
  }

  const feedbackPayload = await feedbackResponse.json()
  const feedback = feedbackPayload?.choices?.[0]?.message?.content?.trim() || ''

  return Response.json({ transcript, feedback })
}
