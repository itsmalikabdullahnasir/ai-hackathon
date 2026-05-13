type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function isLearningRelated(input: string): boolean {
  const learningKeywords = [
    'learn', 'learning', 'study', 'lesson', 'concept', 'assignment',
    'python', 'sql', 'pandas', 'data', 'dataset', 'analysis', 'statistics', 'math',
    'ml', 'machine learning', 'ai', 'neural', 'model', 'algorithm', 'gradient',
    'overfitting', 'cross validation', 'regression', 'classification',
  ]
  return learningKeywords.some((keyword) => input.toLowerCase().includes(keyword))
}

function localTutorResponse(input: string): string {
  const lower = input.toLowerCase()

  if (!isLearningRelated(lower)) {
    return `I am ready to help as your AI tutor. Ask me about Python, data science, machine learning, SQL, math, or any study topic you are working on.`
  }

  if (lower.includes('gradient') || lower.includes('descent')) {
    return `**Gradient descent** is a way for a model to improve by taking small steps toward lower error.

Imagine standing on a hill in fog. You cannot see the whole valley, but you can feel which direction slopes downward. Gradient descent repeats that idea:

* measure the current error
* calculate which direction reduces the error
* take a small step using the learning rate
* repeat until the model improves

In code, the core idea looks like:

\`\`\`python
weight = weight - learning_rate * gradient
\`\`\`

A learning rate that is too large can overshoot the best answer, while one that is too small can make training painfully slow.`
  }

  if (lower.includes('python')) {
    return `**Python** is a beginner-friendly programming language used for web apps, automation, data analysis, AI, and machine learning.

The basics to learn first are:

* variables
* lists and dictionaries
* if statements
* loops
* functions
* reading and cleaning data with libraries like Pandas

Here is a tiny example:

\`\`\`python
scores = [80, 90, 100]
average = sum(scores) / len(scores)
print(average)
\`\`\`

That calculates the average score from a list of numbers.`
  }

  if (lower.includes('pandas') || lower.includes('missing')) {
    return `**Missing data in Pandas** is usually handled in three steps:

* inspect missing values with \`df.isna().sum()\`
* decide whether to drop or fill missing values
* document the reason for your choice

Example:

\`\`\`python
df['age'] = df['age'].fillna(df['age'].median())
df = df.dropna(subset=['target'])
\`\`\`

Use median for numeric columns when outliers may exist, and drop rows only when losing them will not bias your analysis.`
  }

  return `Great question. Here is a simple way to think about it:

* start with the core definition
* connect it to a concrete example
* practice it with a small exercise
* check what mistakes are common

For your topic, tell me what part feels confusing and I will break it down step by step.`
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  const payload = await request.json().catch(() => null)
  const messages = payload?.messages as ChatMessage[] | undefined

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages are required.' }, { status: 400 })
  }

  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content ?? ''

  if (!apiKey) {
    return Response.json({ content: localTutorResponse(lastUserMessage) })
  }

  const systemPrompt = `You are an AI tutor focused on technical and learning topics (DSA, programming, data science, AI, math). Answer clearly and helpfully.
If a question is not related to learning or technical topics, reply politely that you are designed to help with learning-based questions and ask the user to share a study topic.`

  try {
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
      return Response.json({ content: localTutorResponse(lastUserMessage) })
    }

    const result = await response.json()
    const content = result?.choices?.[0]?.message?.content?.trim() || localTutorResponse(lastUserMessage)

    return Response.json({ content })
  } catch {
    return Response.json({ content: localTutorResponse(lastUserMessage) })
  }
}
