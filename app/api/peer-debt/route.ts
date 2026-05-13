type MatchRequest = {
  need?: string
  offer?: string
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Server is missing GROQ_API_KEY.' }, { status: 500 })
  }

  const payload = (await request.json().catch(() => ({}))) as MatchRequest
  const need = payload?.need?.trim() || ''
  const offer = payload?.offer?.trim() || ''

  if (!need && !offer) {
    return Response.json({ error: 'Need or offer text is required.' }, { status: 400 })
  }

  const peerPool = [
    {
      name: 'Ayesha',
      strengths: ['DSA basics', 'Arrays', 'Time complexity'],
      needs: ['SQL joins'],
    },
    {
      name: 'Bilal',
      strengths: ['React', 'Next.js', 'UI design'],
      needs: ['Graph algorithms'],
    },
    {
      name: 'Sana',
      strengths: ['Python', 'Pandas', 'Data cleaning'],
      needs: ['Binary trees'],
    },
    {
      name: 'Hamza',
      strengths: ['SQL', 'Joins', 'Indexes'],
      needs: ['Gradient descent'],
    },
  ]

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
          content: 'You match peers for learning help credits. Return ONLY valid JSON with keys: matches (array of {name, topic, strength, summary}), credits (number). Keep summaries under 18 words.',
        },
        {
          role: 'user',
          content: `Need: ${need || 'none'}\nOffer: ${offer || 'none'}\n\nPeer pool: ${JSON.stringify(peerPool)}`,
        },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return Response.json({ error: errorText || 'Peer matching failed.' }, { status: 502 })
  }

  const result = await response.json()
  const content = result?.choices?.[0]?.message?.content?.trim() || ''

  try {
    const parsed = JSON.parse(content)
    return Response.json({
      matches: Array.isArray(parsed?.matches) ? parsed.matches : [],
      credits: typeof parsed?.credits === 'number' ? parsed.credits : 12,
    })
  } catch (error) {
    return Response.json({ error: 'Failed to parse peer matches.' }, { status: 502 })
  }
}
