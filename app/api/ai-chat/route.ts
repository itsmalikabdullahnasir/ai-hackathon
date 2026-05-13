type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Server is missing GROQ_API_KEY.' }, { status: 500 })
  }

  const payload = await request.json().catch(() => null)
  const messages = payload?.messages as ChatMessage[] | undefined

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages are required.' }, { status: 400 })
  }

  const systemPrompt = `You are an AI tutor focused on technical and learning topics (DSA, programming, data science, AI, math). Answer clearly and helpfully.
If a question is not related to learning or technical topics, reply politely that you are designed to help with learning-based questions and ask the user to share a study topic.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return Response.json({ error: errorText || 'AI tutor failed to respond.' }, { status: 502 })
  }

  const result = await response.json()
  const content = result?.choices?.[0]?.message?.content?.trim() || ''

  return Response.json({ content })
}
