'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Plus, MessageSquare, Sparkles, User, Copy, ThumbsUp,
  ThumbsDown, RefreshCw, ChevronRight, Zap,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { currentUser } from '@/lib/mockData'
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

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('gradient') || lower.includes('descent')) return BOT_RESPONSES.gradient
  if (lower.includes('pandas') || lower.includes('missing')) return BOT_RESPONSES.pandas
  return BOT_RESPONSES.default
}

export default function AiTutorPage() {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey ${currentUser.full_name.split(' ')[0]}! 👋 I'm **atombot**, your personal AI tutor from atomcamp.\n\nI specialize in **Data Science, Machine Learning, Python, SQL, and AI**. I know you're currently working on your Data Analytics bootcamp — so I've got all the context you need!\n\nWhat would you like to explore today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeConv, setActiveConv] = useState('current')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const content = text ?? input.trim()
    if (!content || loading) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() }
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    // TODO: POST /api/ai-chat { messages, student_id, session_id } — streams Claude response
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500))

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(content),
      timestamp: new Date(),
    }
    setMessages((m) => [...m, botMsg])
    setLoading(false)
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
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left panel — history */}
        <aside className="hidden lg:flex flex-col w-[240px] bg-brand-navy border-r border-white/5 flex-shrink-0">
          <div className="p-4">
            <button
              onClick={newChat}
              className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-semibold font-dm-sans hover:bg-brand-orange-dark transition"
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
        <div className="flex-1 flex flex-col bg-brand-bg">
          {/* Chat header */}
          <div className="bg-white border-b border-brand-border px-6 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-orange rounded-full flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="font-sora text-sm font-bold text-brand-navy">atombot</p>
              <p className="text-xs text-brand-success font-dm-sans flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-success rounded-full inline-block" />
                Online · Data Science & AI Expert
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
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
          <div className="bg-white border-t border-brand-border p-4">
            <div className="max-w-3xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask atombot anything… (Enter to send, Shift+Enter for newline)"
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
              atombot is powered by Claude AI · Responses may not always be accurate · atomcamp
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
