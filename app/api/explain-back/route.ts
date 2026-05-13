export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Server is missing GROQ_API_KEY.' }, { status: 500 })
  }

  const payload = await request.json().catch(() => null)
  const lesson = payload?.lesson?.trim()
  const explanation = payload?.explanation?.trim()

  if (!lesson || !explanation) {
    return Response.json({ error: 'Lesson and explanation text are required.' }, { status: 400 })
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          content: 'You are an AI tutor focused on learning topics. Compare the lesson and the student explanation. Return ONLY valid JSON with keys: understood (array of short phrases), missing (array), incorrect (array), note (string, optional). If the explanation is irrelevant to learning, set understood/missing/incorrect to empty arrays and use note to politely say you can only help with learning-based questions and ask for a study topic. Do not include any extra text outside JSON.',
        },
        {
          role: 'user',
          content: `Lesson:\n${lesson}\n\nStudent explanation:\n${explanation}`,
        },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return Response.json({ error: errorText || 'Explain-back evaluation failed.' }, { status: 502 })
  }

  const result = await response.json()
  const content = result?.choices?.[0]?.message?.content?.trim() || ''

  try {
    const parsed = JSON.parse(content)
    return Response.json({
      understood: Array.isArray(parsed?.understood) ? parsed.understood : [],
      missing: Array.isArray(parsed?.missing) ? parsed.missing : [],
      incorrect: Array.isArray(parsed?.incorrect) ? parsed.incorrect : [],
      note: typeof parsed?.note === 'string' ? parsed.note : undefined,
    })
  } catch (error) {
    return Response.json({ error: 'Failed to parse tutor feedback.' }, { status: 502 })
  }
}
