'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Plus, MessageSquare, Sparkles, User, Copy, ThumbsUp,
  ThumbsDown, RefreshCw, ChevronRight, Zap, Mic, Square, Play, Users,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { currentUser } from '@/lib/mockData'
import { getUsername } from '@/lib/auth'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  preview: string
  date: string
}

const SUGGESTED_PROMPTS = [
  'Explain gradient descent in simple terms',
  'What\'s the difference between ML and deep learning?',
  'How do I handle missing data in Pandas?',
  'Explain overfitting and how to prevent it',
  'What is cross-validation and why use it?',
  'How does a neural network learn?',
]

const SAMPLE_CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'Python Data Structures', preview: 'Explained lists vs dicts…', date: 'Today' },
  { id: 'c2', title: 'Pandas vs SQL', preview: 'When to use each tool…', date: 'Yesterday' },
  { id: 'c3', title: 'Module 3 Review', preview: 'Backpropagation explained…', date: 'Oct 20' },
  { id: 'c4', title: 'Career Advice', preview: 'Portfolio projects to build…', date: 'Oct 18' },
]

const BOT_RESPONSES: Record<string, string> = {
  offTopic: `Thanks for the question! I am designed to help with learning and study topics only.

Share a concept you want to learn (e.g., data science, ML, Python, SQL), and I will help you.` ,
  default: `Great question! Let me break that down for you.

In data science and AI, we often encounter complex concepts that become much clearer when explained step by step.

**Key points to understand:**
• Start with the fundamentals before diving into advanced topics
• Practice hands-on with real datasets to solidify your understanding
• Connect new concepts to things you already know

Is there a specific aspect you'd like me to elaborate on? I can provide code examples, visual analogies, or deeper mathematical explanations depending on what helps you best.`,

  gradient: `**Gradient Descent** is an optimization algorithm used to minimize a function by iteratively moving in the direction of steepest descent.

**The intuition:** Imagine you're hiking and need to reach the lowest valley. At each step, you look around and take a step in the downhill direction.

**Mathematically:**
\`\`\`python
# Simple gradient descent
theta = theta - learning_rate * gradient(loss, theta)
\`\`\`

**Types:**
• **Batch GD** — uses entire dataset (slow but stable)
• **SGD** — uses one sample at a time (fast, noisy)
• **Mini-batch GD** — uses small batches (best of both!)

**Learning rate matters:**
• Too high → overshoots minimum
• Too low → takes forever
• Just right → converges smoothly 📉

Want me to show you how to implement this in PyTorch?`,

  pandas: `**Handling Missing Data in Pandas** is critical for clean analysis!

\`\`\`python
import pandas as pd

df = pd.read_csv('your_data.csv')

# 1. Check for missing values
print(df.isnull().sum())
print(df.isnull().mean() * 100)  # percentage

# 2. Drop rows/columns
df.dropna()                    # drop rows with any NaN
df.dropna(thresh=5)            # keep rows with ≥5 non-NaN
df.dropna(subset=['col1'])     # drop if specific col is NaN

# 3. Fill with statistics
df.fillna(df.mean())           # fill with mean
df.fillna(df.median())         # fill with median
df.fillna(method='ffill')      # forward fill

# 4. Advanced: Use ML to impute
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df_imputed = imputer.fit_transform(df)
\`\`\`

**Rule of thumb:**
• < 5% missing → safe to drop
• 5-30% missing → impute with mean/median/mode
• > 30% missing → consider dropping the feature

Would you like me to walk through a real-world example?`,
}

function isLearningRelated(input: string): boolean {
  const learningKeywords = [
    'learn', 'learning', 'study', 'lesson', 'concept', 'syllabus', 'assignment',
    'python', 'sql', 'pandas', 'data', 'dataset', 'analysis', 'statistics', 'math',
    'ml', 'machine learning', 'ai', 'neural', 'model', 'algorithm', 'gradient',
    'overfitting', 'cross validation', 'regression', 'classification',
  ]
  return learningKeywords.some((keyword) => input.includes(keyword))
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (!isLearningRelated(lower)) return BOT_RESPONSES.offTopic
  if (lower.includes('gradient') || lower.includes('descent')) return BOT_RESPONSES.gradient
  if (lower.includes('pandas') || lower.includes('missing')) return BOT_RESPONSES.pandas
  return BOT_RESPONSES.default
}

export default function AiTutorPage() {
  const { showToast } = useToast()
  const [displayName, setDisplayName] = useState(currentUser.full_name)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey ${currentUser.full_name.split(' ')[0]}! 👋 I'm **Autobot**, your personal AI tutor from atomcamp.\n\nI specialize in **Data Science, Machine Learning, Python, SQL, and AI**. I know you're currently working on your Data Analytics bootcamp — so I've got all the context you need!\n\nWhat would you like to explore today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeConv, setActiveConv] = useState('current')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioBlobRef = useRef<Blob | null>(null)
  const recordingTimeoutRef = useRef<number | null>(null)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [explainInput, setExplainInput] = useState('')
  const [explainLoading, setExplainLoading] = useState(false)
  const [explainError, setExplainError] = useState('')
  const [lessonScript, setLessonScript] = useState('')
  const [lessonMessageId, setLessonMessageId] = useState<string | null>(null)
  const [explainMode, setExplainMode] = useState(false)
  const [explainResult, setExplainResult] = useState<{
    understood: string[]
    missing: string[]
    incorrect: string[]
    note?: string
  } | null>(null)
  const [peerOpen, setPeerOpen] = useState(false)
  const [peerNeed, setPeerNeed] = useState('')
  const [peerOffer, setPeerOffer] = useState('')
  const [peerLoading, setPeerLoading] = useState(false)
  const [peerError, setPeerError] = useState('')
  const [peerCredits, setPeerCredits] = useState(12)
  const [peerMatches, setPeerMatches] = useState<Array<{
    name: string
    topic: string
    strength: string
    summary: string
  }>>([])

  useEffect(() => {
    const updateName = () => setDisplayName(getUsername() ?? currentUser.full_name)
    updateName()
    window.addEventListener('autocamp-username', updateName)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    return () => window.removeEventListener('autocamp-username', updateName)
  }, [messages])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0 || prev[0]?.role !== 'assistant') return prev
      const updated = [...prev]
      updated[0] = {
        ...updated[0],
        content: `Hey ${displayName.split(' ')[0]}! 👋 I'm **Autobot**, your personal AI tutor from atomcamp.\n\nI specialize in **Data Science, Machine Learning, Python, SQL, and AI**. I know you're currently working on your Data Analytics bootcamp — so I've got all the context you need!\n\nWhat would you like to explore today?`,
      }
      return updated
    })
  }, [displayName])

  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) window.clearTimeout(recordingTimeoutRef.current)
    }
  }, [])

  async function sendMessage(text?: string) {
    const content = text ?? input.trim()
    if (!content || loading) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() }
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: 'user', content },
          ],
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'AI tutor failed to respond.')
      }

      const data = await response.json()
      const botContent = data?.content || getResponse(content)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botContent,
        timestamp: new Date(),
      }
      setMessages((m) => [...m, botMsg])
      if (botContent === BOT_RESPONSES.offTopic) {
        setLessonScript('')
        setLessonMessageId(null)
        setExplainMode(false)
        setExplainResult(null)
      } else {
        setLessonScript(botContent)
        setLessonMessageId(botMsg.id)
        setExplainMode(false)
        setExplainResult(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      showToast(message, 'error')
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getResponse(content),
        timestamp: new Date(),
      }
      setMessages((m) => [...m, fallbackMsg])
    } finally {
      setLoading(false)
    }
  }

  async function startRecording() {
    if (recording) return
    setVoiceError('')
    setTranscript('')
    setFeedback('')
    setAudioUrl(null)
    audioBlobRef.current = null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunks.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        audioBlobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)

      recordingTimeoutRef.current = window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording()
        }
      }, 60000)
    } catch (error) {
      setVoiceError('Microphone access denied. Please allow mic access and try again.')
    }
  }

  function stopRecording() {
    if (!recording || !mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
    setRecording(false)
    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }
  }

  async function submitVoiceNote() {
    if (voiceLoading || !audioBlobRef.current) {
      setVoiceError('Record a voice note before submitting.')
      return
    }

    setVoiceError('')
    setVoiceLoading(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlobRef.current, 'voice-note.webm')
      const response = await fetch('/api/voice-note', { method: 'POST', body: formData })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Voice note processing failed.')
      }

      const data = await response.json()
      setTranscript(data.transcript || '')
      setFeedback(data.feedback || '')
      showToast('Voice note processed!', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setVoiceError(message)
      showToast(message, 'error')
    } finally {
      setVoiceLoading(false)
    }
  }

  function startExplainBack() {
    if (!lessonScript) return
    setExplainInput('')
    setExplainError('')
    setExplainResult(null)
    setExplainMode(true)
    if (lessonMessageId) {
      setMessages((m) => m.filter((msg) => msg.id !== lessonMessageId))
      setLessonMessageId(null)
    }
  }

  function cancelExplainBack() {
    if (!lessonScript) return
    if (!lessonMessageId) {
      const restoredId = Date.now().toString()
      setMessages((m) => [...m, { id: restoredId, role: 'assistant', content: lessonScript, timestamp: new Date() }])
      setLessonMessageId(restoredId)
    }
    setExplainMode(false)
    setExplainError('')
  }

  async function submitExplainBack() {
    if (explainLoading) return
    const content = explainInput.trim()
    if (!content) {
      setExplainError('Write your explanation before submitting.')
      return
    }

    setExplainError('')
    setExplainResult(null)
    setExplainLoading(true)

    try {
      const response = await fetch('/api/explain-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson: lessonScript, explanation: content }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Explain-back evaluation failed.')
      }

      const data = await response.json()
      setExplainResult({
        understood: Array.isArray(data.understood) ? data.understood : [],
        missing: Array.isArray(data.missing) ? data.missing : [],
        incorrect: Array.isArray(data.incorrect) ? data.incorrect : [],
        note: typeof data.note === 'string' ? data.note : undefined,
      })
      if (!lessonMessageId) {
        const restoredId = Date.now().toString()
        setMessages((m) => [...m, { id: restoredId, role: 'assistant', content: lessonScript, timestamp: new Date() }])
        setLessonMessageId(restoredId)
      }
      setExplainMode(false)
      showToast('Explain-back feedback ready!', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setExplainError(message)
      showToast(message, 'error')
    } finally {
      setExplainLoading(false)
    }
  }

  async function matchPeers() {
    if (peerLoading) return
    if (!peerNeed.trim() && !peerOffer.trim()) {
      setPeerError('Share what you need help with or what you can teach.')
      return
    }

    setPeerError('')
    setPeerLoading(true)

    try {
      const response = await fetch('/api/peer-debt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ need: peerNeed.trim(), offer: peerOffer.trim() }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Matching failed.')
      }

      const data = await response.json()
      setPeerMatches(Array.isArray(data.matches) ? data.matches : [])
      if (typeof data.credits === 'number') setPeerCredits(data.credits)
      showToast('Matches ready!', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setPeerError(message)
      showToast(message, 'error')
    } finally {
      setPeerLoading(false)
    }
  }

  function newChat() {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: 'New conversation started! What would you like to learn today?',
      timestamp: new Date(),
    }])
    setActiveConv('current')
  }

  return (
    <AppShell>
      <div className="relative flex min-h-[calc(100vh-64px)] pt-6 pb-6 px-4 lg:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl" />
          <div className="absolute top-28 right-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        </div>
        {/* Left panel — history */}
        <aside className="hidden lg:flex flex-col w-[240px] bg-brand-navy/95 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(1,10,19,0.35)] flex-shrink-0 relative">
          <div className="p-4">
            <button
              onClick={newChat}
              className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-semibold font-dm-sans hover:bg-brand-orange-dark transition shadow-[0_12px_24px_rgba(7,120,55,0.35)]"
            >
              <Plus size={16} /> New Chat
            </button>
          </div>

          <div className="px-3 py-2">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-dm-sans px-2 mb-2">Recent</p>
            <div className="space-y-1">
              {SAMPLE_CONVERSATIONS.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2.5 rounded-xl transition group',
                    activeConv === conv.id ? 'bg-white/10' : 'hover:bg-white/5',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare size={13} className="text-white/40 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-medium truncate font-dm-sans">{conv.title}</p>
                      <p className="text-white/30 text-[10px] truncate font-dm-sans mt-0.5">{conv.preview}</p>
                    </div>
                  </div>
                  <p className="text-white/20 text-[10px] font-dm-sans mt-1 pl-5">{conv.date}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-orange/20 rounded-full flex items-center justify-center">
                <Zap size={12} className="text-brand-orange" />
              </div>
              <p className="text-white/30 text-[10px] font-dm-sans">Powered by Claude AI</p>
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_30px_80px_rgba(1,10,19,0.18)] overflow-hidden relative">
          {/* Chat header */}
          <div className="bg-white/80 backdrop-blur border-b border-brand-border px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-orange rounded-full flex items-center justify-center shadow-[0_12px_24px_rgba(7,120,55,0.35)]">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="font-sora text-sm font-bold text-brand-navy">Autobot</p>
              <p className="text-xs text-brand-success font-dm-sans flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-success rounded-full inline-block" />
                Online · Data Science & AI Expert
              </p>
            </div>
            <div className="ml-auto relative">
              <button
                onClick={() => setPeerOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold font-dm-sans text-brand-navy hover:border-brand-orange/40 transition"
              >
                <Users size={14} className="text-brand-orange" />
                Help Credits
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
                  {peerCredits}
                </span>
              </button>

              {peerOpen && (
                <div className="absolute right-0 mt-3 w-[320px] bg-white border border-brand-border rounded-2xl shadow-xl p-4 z-20">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy font-sora">Peer Debt Matching</p>
                      <p className="text-[11px] text-brand-muted font-dm-sans mt-1">
                        Earn credits by helping. Spend credits when you need help.
                      </p>
                    </div>
                    <button
                      onClick={() => setPeerOpen(false)}
                      className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    <textarea
                      value={peerNeed}
                      onChange={(e) => setPeerNeed(e.target.value)}
                      placeholder="What do you need help with?"
                      rows={2}
                      className="w-full px-3 py-2 text-xs font-dm-sans bg-brand-bg border border-brand-border rounded-xl resize-none
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
                    />
                    <textarea
                      value={peerOffer}
                      onChange={(e) => setPeerOffer(e.target.value)}
                      placeholder="What can you teach?"
                      rows={2}
                      className="w-full px-3 py-2 text-xs font-dm-sans bg-brand-bg border border-brand-border rounded-xl resize-none
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
                    />
                    {peerError && (
                      <div className="text-[11px] text-brand-danger font-dm-sans">{peerError}</div>
                    )}
                    <button
                      onClick={matchPeers}
                      disabled={peerLoading}
                      className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-orange-dark transition disabled:opacity-60"
                    >
                      {peerLoading ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Match me
                    </button>
                  </div>

                  {peerMatches.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[11px] uppercase tracking-widest text-brand-muted font-dm-sans">Suggested Peers</p>
                      {peerMatches.map((match, index) => (
                        <div key={`${match.name}-${index}`} className="border border-brand-border rounded-xl p-2 bg-brand-bg">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-brand-navy font-dm-sans">{match.name}</p>
                            <span className="text-[10px] text-brand-orange font-dm-sans">{match.strength}</span>
                          </div>
                          <p className="text-[11px] text-brand-muted font-dm-sans">{match.topic}</p>
                          <p className="text-[11px] text-gray-600 font-dm-sans mt-1">{match.summary}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto bg-white/95 border border-brand-border rounded-2xl p-5 shadow-[0_18px_40px_rgba(2,8,20,0.12)]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy font-sora">Voice Note Learning</p>
                    <p className="text-xs text-brand-muted font-dm-sans mt-1">
                      Record a 60-second concept recap. The AI will transcribe it, evaluate understanding, and give feedback.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!recording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 bg-brand-orange text-white px-3 py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-orange-dark transition"
                      >
                        <Mic size={14} /> Start
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 bg-brand-danger text-white px-3 py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-danger/90 transition"
                      >
                        <Square size={14} /> Stop
                      </button>
                    )}
                    <button
                      onClick={submitVoiceNote}
                      disabled={voiceLoading || !audioUrl}
                      className="flex items-center gap-2 border border-brand-border px-3 py-2 rounded-xl text-xs font-semibold font-dm-sans text-brand-navy hover:border-brand-orange/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {voiceLoading ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                      Analyze
                    </button>
                  </div>
                </div>

                {audioUrl && (
                  <div className="flex items-center gap-3 bg-brand-bg border border-brand-border rounded-xl px-3 py-2">
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}

                {voiceError && (
                  <div className="text-xs text-brand-danger font-dm-sans">{voiceError}</div>
                )}

                {(transcript || feedback) && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-3">
                      <p className="text-[11px] uppercase tracking-widest text-brand-muted font-dm-sans mb-2">Transcript</p>
                      <p className="text-xs text-gray-700 font-dm-sans whitespace-pre-line">{transcript || 'No transcript yet.'}</p>
                    </div>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-3">
                      <p className="text-[11px] uppercase tracking-widest text-brand-muted font-dm-sans mb-2">Tutor Feedback</p>
                      <p className="text-xs text-gray-700 font-dm-sans whitespace-pre-line">{feedback || 'No feedback yet.'}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            {lessonScript && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white/95 border border-brand-border rounded-2xl p-5 shadow-[0_18px_40px_rgba(2,8,20,0.12)]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy font-sora">Explain It Back to Me</p>
                      <p className="text-xs text-brand-muted font-dm-sans mt-1">
                        After the lesson, explain it in your own words. I will highlight what you got right and what is missing.
                      </p>
                    </div>
                    {!explainMode && (
                      <button
                        onClick={startExplainBack}
                        className="flex items-center gap-2 bg-brand-orange text-white px-3 py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-orange-dark transition"
                      >
                        <Sparkles size={14} /> Explain it back
                      </button>
                    )}
                  </div>

                  {explainMode && (
                    <div className="space-y-3">
                      <textarea
                        value={explainInput}
                        onChange={(e) => setExplainInput(e.target.value)}
                        placeholder="Explain the lesson in your own words."
                        rows={4}
                        className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans resize-none
                                   focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
                      />
                      {explainError && (
                        <div className="text-xs text-brand-danger font-dm-sans">{explainError}</div>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={submitExplainBack}
                          disabled={explainLoading || !explainInput.trim()}
                          className="flex items-center gap-2 border border-brand-border px-3 py-2 rounded-xl text-xs font-semibold font-dm-sans text-brand-navy hover:border-brand-orange/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {explainLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Evaluate
                        </button>
                        <button
                          onClick={cancelExplainBack}
                          className="text-xs font-semibold font-dm-sans text-gray-400 hover:text-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {explainResult && (
                    <div className="space-y-3">
                      {explainResult.note && (
                        <div className="text-xs text-brand-danger font-dm-sans">{explainResult.note}</div>
                      )}
                      <div className="bg-brand-bg border border-brand-border rounded-xl p-3">
                        <p className="text-[11px] uppercase tracking-widest text-brand-muted font-dm-sans mb-2">Lesson Recap</p>
                        <p className="text-xs text-gray-700 font-dm-sans whitespace-pre-line">{lessonScript}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <p className="text-[11px] uppercase tracking-widest text-emerald-700 font-dm-sans mb-2">Understood</p>
                          <ul className="text-xs text-emerald-700 font-dm-sans list-disc pl-4 space-y-1">
                            {explainResult.understood.map((item, index) => (
                              <li key={`u-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                          <p className="text-[11px] uppercase tracking-widest text-rose-700 font-dm-sans mb-2">Missing or Incorrect</p>
                          <ul className="text-xs text-rose-700 font-dm-sans list-disc pl-4 space-y-1">
                            {explainResult.missing.map((item, index) => (
                              <li key={`m-${index}`}>{item}</li>
                            ))}
                            {explainResult.incorrect.map((item, index) => (
                              <li key={`i-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <button
                        onClick={startExplainBack}
                        className="text-xs font-semibold font-dm-sans text-brand-orange hover:text-brand-orange-dark transition"
                      >
                        Explain it again
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* Suggested prompts when only initial message */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <p className="text-center text-xs text-brand-muted font-dm-sans mb-4">
                  <Sparkles size={12} className="inline mr-1 text-brand-orange" />
                  Try one of these prompts
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs font-dm-sans text-gray-700 bg-white px-4 py-3 rounded-xl border border-brand-border hover:border-brand-orange/40 hover:text-brand-orange transition-all flex items-center justify-between gap-2 group"
                    >
                      <span>{prompt}</span>
                      <ChevronRight size={12} className="text-gray-300 group-hover:text-brand-orange flex-shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
                className={clsx('flex gap-3 max-w-3xl', msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto')}
              >
                {/* Avatar */}
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  msg.role === 'user' ? 'bg-brand-orange' : 'bg-brand-navy',
                )}>
                  {msg.role === 'user'
                    ? <User size={15} className="text-white" />
                    : <Bot size={15} className="text-white" />}
                </div>

                <div className={clsx('space-y-1', msg.role === 'user' ? 'items-end' : 'items-start', 'flex flex-col')}>
                  <div className={clsx(
                    'max-w-xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user' ? 'chat-user-bubble' : 'chat-bot-bubble',
                  )}>
                    <MarkdownText content={msg.content} />
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 px-1">
                      <button
                        onClick={() => { navigator.clipboard.writeText(msg.content); showToast('Copied to clipboard!', 'success') }}
                        className="text-gray-300 hover:text-gray-500 transition"
                      >
                        <Copy size={12} />
                      </button>
                      <button onClick={() => showToast('Thanks for the feedback!', 'success')} className="text-gray-300 hover:text-brand-success transition">
                        <ThumbsUp size={12} />
                      </button>
                      <button onClick={() => showToast('Feedback recorded', 'info')} className="text-gray-300 hover:text-brand-danger transition">
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-3xl mr-auto">
                <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="chat-bot-bubble px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-300 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="bg-white/90 backdrop-blur border-t border-brand-border p-4">
            <div className="max-w-3xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask Autobot anything… (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans resize-none
                             focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition
                             max-h-32 overflow-y-auto"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-brand-orange rounded-xl flex items-center justify-center hover:bg-brand-orange-dark transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 self-end"
              >
                {loading
                  ? <RefreshCw size={17} className="text-white animate-spin" />
                  : <Send size={17} className="text-white" />}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-300 font-dm-sans mt-2">
              Autobot is powered by Claude AI · Responses may not always be accurate · atomcamp
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function MarkdownText({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-current">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.startsWith('• ')) {
          return <p key={i} className="pl-2">{line}</p>
        }
        if (line.startsWith('```')) {
          return null
        }
        const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />
      })}
    </div>
  )
}
