'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronUp, Play, CheckCircle, Lock, BookOpen,
  FileText, Link2, Code2, Download, Bot, Send, X, HelpCircle, Star,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

type Tab = 'overview' | 'video' | 'quiz' | 'resources' | 'discussion'

interface CourseModule {
  id: string
  title: string
  description: string | null
  video_url: string | null
  duration: number
  week: number
  completed: boolean
  current: boolean
  locked: boolean
}

interface Quiz {
  id: string
  title: string
  module_id: string
  questions: Array<{
    id: string
    body: string
    options: string[]
    correct_index: number
    explanation: string
  }>
}

interface Resource {
  id: string
  title: string
  type: string
  file_url: string | null
}

interface CourseDetail {
  course: {
    id: string
    title: string
    description: string
    level: string
    price_pkr: number
    duration_weeks: number
    total_modules: number
    thumbnail_url: string | null
    rating: number
    skills: string[]
    instructor_name: string
    instructor_avatar: string | null
    progress: number
  }
  modules: CourseModule[]
  resources: Resource[]
  quiz: Quiz | null
}

export default function CoursePage() {
  const params = useParams()
  const rawId = params?.id
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '')
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CourseDetail | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [expandedWeek, setExpandedWeek] = useState<number>(1)
  const [selectedModuleId, setSelectedModuleId] = useState<string>('')
  const [markingComplete, setMarkingComplete] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi! I'm Autobot, your AI study buddy. What would you like to explore from this module?" }])
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    apiFetch<CourseDetail>(`/api/courses/${id}`)
      .then((d) => {
        setData(d)
        const currentMod = d.modules.find((m) => m.current) ?? d.modules[0]
        if (currentMod) {
          setSelectedModuleId(currentMod.id)
          setExpandedWeek(currentMod.week)
        }
      })
      .catch(() => showToast('Failed to load course', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectedModule = data?.modules.find((m) => m.id === selectedModuleId) ?? data?.modules[0]
  const weekGroups = (data?.modules ?? []).reduce<Record<number, CourseModule[]>>((acc, m) => {
    if (!acc[m.week]) acc[m.week] = []
    acc[m.week].push(m)
    return acc
  }, {})

  async function sendMessage() {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setMessages((m) => [...m, { role: 'user', content: userMsg }])

    try {
      const response = await apiFetch<{ content: string }>('/api/ai-chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages.map((msg) => ({ role: msg.role, content: msg.content })), { role: 'user', content: userMsg }] }),
      })
      setMessages((m) => [...m, { role: 'assistant', content: response.content }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Great question! Let me help you understand this concept better. Could you be more specific about what you'd like to explore?" }])
    }
  }

  async function handleMarkComplete() {
    if (!selectedModule || selectedModule.completed || markingComplete) return
    setMarkingComplete(true)
    try {
      await apiFetch('/api/progress/complete', {
        method: 'POST',
        body: JSON.stringify({ module_id: selectedModule.id }),
      })
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          modules: prev.modules.map((m) => m.id === selectedModule.id ? { ...m, completed: true, current: false } : m),
        }
      })
      showToast('Module marked as complete! ✅', 'success')
      setTab('quiz')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark complete'
      showToast(message, 'error')
    } finally {
      setMarkingComplete(false)
    }
  }

  async function handleQuizSubmit() {
    if (!data?.quiz) return
    if (Object.keys(quizAnswers).length < data.quiz.questions.length) {
      showToast('Please answer all questions first.', 'warning')
      return
    }
    setSubmittingQuiz(true)
    try {
      const answers = data.quiz.questions.map((q) => quizAnswers[q.id] ?? -1)
      await apiFetch('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ quiz_id: data.quiz.id, answers }),
      })
      setQuizSubmitted(true)
      const correct = data.quiz.questions.filter((q) => quizAnswers[q.id] === q.correct_index).length
      showToast(`Quiz complete! You scored ${correct}/${data.quiz.questions.length} 🎯`, correct >= Math.ceil(data.quiz.questions.length * 0.7) ? 'success' : 'warning')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Quiz submission failed'
      showToast(message, 'error')
    } finally {
      setSubmittingQuiz(false)
    }
  }

  function selectModule(moduleId: string, locked?: boolean) {
    if (locked) { showToast('This lesson unlocks after you finish the previous week.', 'info'); return }
    setSelectedModuleId(moduleId)
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'video', label: 'Video' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'resources', label: 'Resources' },
    { key: 'discussion', label: 'Discussion' },
  ]

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return (
      <AppShell>
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <p className="text-brand-muted font-dm-sans">Course not found.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left sidebar */}
        <aside className="hidden lg:flex flex-col w-[300px] bg-white border-r border-brand-border overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-brand-border">
            <h2 className="font-sora text-sm font-bold text-brand-navy leading-snug">{data.course.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="bg-brand-orange h-full rounded-full" style={{ width: `${data.course.progress}%` }} />
              </div>
              <span className="text-xs text-brand-muted font-dm-sans">{data.course.progress}%</span>
            </div>
          </div>

          <div className="flex-1 py-2">
            {Object.entries(weekGroups).map(([week, mods]) => {
              const wk = parseInt(week)
              const isOpen = expandedWeek === wk
              return (
                <div key={wk}>
                  <button onClick={() => setExpandedWeek(isOpen ? -1 : wk)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-brand-bg transition text-left">
                    <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider font-dm-sans">Week {wk}</span>
                    {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        {mods.map((m) => {
                          const isSelected = selectedModule?.id === m.id
                          return (
                            <button key={m.id} onClick={() => selectModule(m.id, m.locked)}
                              className={clsx('w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-brand-bg transition border-l-2', isSelected ? 'border-brand-orange bg-brand-orange/3' : 'border-transparent')}
                            >
                              <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', m.completed ? 'bg-brand-success' : m.current ? 'bg-brand-orange animate-pulse' : 'bg-gray-100')}>
                                {m.completed ? <CheckCircle size={13} className="text-white fill-white" /> : m.current ? <Play size={10} className="text-white fill-white" /> : <Lock size={10} className="text-gray-400" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={clsx('text-xs font-medium truncate font-dm-sans', isSelected ? 'text-brand-orange' : m.locked ? 'text-gray-300' : 'text-brand-navy')}>{m.title}</p>
                                {!m.locked && <p className="text-[10px] text-brand-muted mt-0.5">{m.duration} min</p>}
                              </div>
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-brand-border z-10 px-6">
            <div className="flex gap-0">
              {tabs.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={clsx('px-5 py-4 text-sm font-medium font-dm-sans border-b-2 transition-colors', tab === key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-muted hover:text-brand-navy')}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8">
            {tab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-orange uppercase tracking-widest font-dm-sans">Week {selectedModule?.week}</span>
                    <h1 className="font-sora text-2xl font-bold text-brand-navy mt-1">{selectedModule?.title}</h1>
                    <p className="text-brand-muted text-sm font-dm-sans mt-2 leading-relaxed">{selectedModule?.description ?? 'No description available.'}</p>
                  </div>
                  <span className="flex-shrink-0 bg-brand-orange/10 text-brand-orange text-xs font-semibold px-3 py-1.5 rounded-lg font-dm-sans">{selectedModule?.duration} min</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleMarkComplete}
                    disabled={selectedModule?.completed || markingComplete}
                    className={clsx('flex-1 py-3 rounded-xl font-semibold text-sm font-dm-sans transition-all flex items-center justify-center gap-2',
                      selectedModule?.completed ? 'bg-brand-success text-white cursor-default' : 'bg-brand-orange text-white hover:bg-brand-orange-dark disabled:opacity-60',
                    )}
                  >
                    {markingComplete ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={16} />}
                    {selectedModule?.completed ? 'Completed ✓' : markingComplete ? 'Saving…' : 'Mark as Complete'}
                  </button>
                  <button onClick={() => setChatOpen(true)} className="flex items-center gap-2 border-2 border-brand-orange text-brand-orange px-5 py-3 rounded-xl font-semibold text-sm font-dm-sans hover:bg-brand-orange hover:text-white transition-all">
                    <Bot size={16} /> Ask AI Tutor
                  </button>
                </div>
              </motion.div>
            )}

            {tab === 'video' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="aspect-video bg-brand-navy rounded-xl overflow-hidden flex items-center justify-center mb-6">
                  {selectedModule?.video_url ? (
                    <iframe key={selectedModule.id} className="w-full h-full"
                      src={`${selectedModule.video_url}?rel=0&modestbranding=1`}
                      title={selectedModule.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Play size={28} className="text-white fill-white ml-1" />
                      </div>
                      <p className="text-white/60 text-sm font-dm-sans">Video coming soon</p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl border border-brand-border p-5">
                  <h3 className="font-sora text-sm font-bold text-brand-navy mb-1">{selectedModule?.title}</h3>
                  <p className="text-xs text-brand-muted font-dm-sans">{selectedModule?.duration} min</p>
                </div>
              </motion.div>
            )}

            {tab === 'quiz' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {data.quiz ? (
                  <>
                    <div>
                      <h2 className="font-sora text-xl font-bold text-brand-navy">{data.quiz.title}</h2>
                      <p className="text-brand-muted text-sm font-dm-sans mt-1">{data.quiz.questions.length} questions · Submit when ready</p>
                    </div>
                    {quizSubmitted ? (
                      <QuizResult questions={data.quiz.questions} answers={quizAnswers} onReset={() => { setQuizAnswers({}); setQuizSubmitted(false) }} />
                    ) : (
                      <>
                        {data.quiz.questions.map((q, qi) => (
                          <div key={q.id} className="bg-white rounded-xl border border-brand-border p-5">
                            <p className="font-dm-sans text-sm font-semibold text-brand-navy mb-4"><span className="text-brand-orange mr-2">Q{qi + 1}.</span>{q.body}</p>
                            <div className="space-y-2.5">
                              {q.options.map((opt, oi) => (
                                <button key={oi} onClick={() => setQuizAnswers((a) => ({ ...a, [q.id]: oi }))}
                                  className={clsx('w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-dm-sans transition-all',
                                    quizAnswers[q.id] === oi ? 'border-brand-orange bg-brand-orange/5 text-brand-orange font-medium' : 'border-brand-border hover:border-brand-orange/40 text-gray-700',
                                  )}
                                >
                                  <span className="w-5 h-5 rounded-full border-2 inline-flex items-center justify-center mr-2.5 flex-shrink-0 text-[10px] font-bold border-current">{String.fromCharCode(65 + oi)}</span>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button onClick={handleQuizSubmit} disabled={submittingQuiz}
                          className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-semibold font-dm-sans text-sm hover:bg-brand-orange-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {submittingQuiz ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                          Submit Quiz →
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
                    <HelpCircle size={40} className="mx-auto text-gray-200 mb-3" />
                    <h2 className="font-sora text-lg font-bold text-brand-navy">Quiz coming soon</h2>
                    <p className="text-brand-muted text-sm font-dm-sans mt-1">This lesson has a video ready.</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'resources' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-sora text-xl font-bold text-brand-navy mb-5">Module Resources</h2>
                {data.resources.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
                    <BookOpen size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-brand-muted font-dm-sans text-sm">No resources for this module yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.resources.map((r) => (
                      <div key={r.id} className="flex items-center gap-4 bg-white rounded-xl border border-brand-border p-4 hover:border-brand-orange/40 transition group">
                        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', r.type === 'pdf' ? 'bg-red-50' : r.type === 'code' ? 'bg-blue-50' : 'bg-purple-50')}>
                          {r.type === 'pdf' ? <FileText size={18} className="text-red-500" /> : r.type === 'code' ? <Code2 size={18} className="text-blue-500" /> : <Link2 size={18} className="text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-brand-navy font-dm-sans">{r.title}</p>
                        </div>
                        {r.file_url && (
                          <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orange-dark font-dm-sans opacity-0 group-hover:opacity-100 transition"
                          >
                            <Download size={14} />{r.type === 'link' ? 'Open' : 'Download'}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'discussion' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-sora text-xl font-bold text-brand-navy mb-5">Discussion</h2>
                <div className="text-center py-12">
                  <HelpCircle size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-brand-muted font-dm-sans text-sm">Discussion threads coming soon.</p>
                  <p className="text-xs text-gray-400 mt-1 font-dm-sans">Use the AI Tutor in the meantime!</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-brand-border w-[360px] mb-4 overflow-hidden"
            >
              <div className="bg-brand-navy px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center"><Bot size={16} className="text-white" /></div>
                  <div>
                    <p className="text-white text-xs font-bold font-dm-sans">Autobot</p>
                    <p className="text-white/40 text-[10px]">AI Study Buddy · always on</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white transition"><X size={16} /></button>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-brand-bg">
                {messages.map((msg, i) => (
                  <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={clsx('max-w-[85%] text-xs leading-relaxed px-3.5 py-2.5', msg.role === 'user' ? 'chat-user-bubble' : 'chat-bot-bubble')}>{msg.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 p-3 border-t border-brand-border bg-white">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Autobot anything…"
                  className="flex-1 text-xs px-3 py-2 bg-brand-bg border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange/30 font-dm-sans"
                />
                <button onClick={sendMessage} className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center hover:bg-brand-orange-dark transition">
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!chatOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center shadow-xl hover:bg-brand-orange-dark transition hover:scale-105"
          >
            <Bot size={24} className="text-white" />
          </motion.button>
        )}
      </div>
    </AppShell>
  )
}

function QuizResult({ questions, answers, onReset }: {
  questions: Array<{ id: string; body: string; options: string[]; correct_index: number; explanation: string }>
  answers: Record<string, number>
  onReset: () => void
}) {
  const correct = questions.filter((q) => answers[q.id] === q.correct_index).length
  const pct = Math.round((correct / questions.length) * 100)

  return (
    <div className="space-y-5">
      <div className={clsx('p-6 rounded-2xl border-2 text-center', pct >= 70 ? 'bg-green-50 border-brand-success' : 'bg-orange-50 border-brand-warning')}>
        <div className="text-4xl font-sora font-bold mb-1">{pct}%</div>
        <p className="font-dm-sans text-sm">{correct} of {questions.length} correct · {pct >= 70 ? '🎉 Passed!' : '📚 Keep studying'}</p>
      </div>
      {questions.map((q, qi) => {
        const userAns = answers[q.id]
        const isCorrect = userAns === q.correct_index
        return (
          <div key={q.id} className={clsx('bg-white rounded-xl border-2 p-4', isCorrect ? 'border-brand-success/40' : 'border-brand-danger/40')}>
            <p className="font-sora text-sm font-bold text-brand-navy mb-3"><span className={clsx('mr-2', isCorrect ? 'text-brand-success' : 'text-brand-danger')}>Q{qi + 1}.</span>{q.body}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className={clsx('px-3 py-2 rounded-lg text-xs font-dm-sans',
                  oi === q.correct_index ? 'bg-green-100 text-green-700 font-semibold' : oi === userAns && !isCorrect ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-500',
                )}>
                  {oi === q.correct_index ? '✓ ' : oi === userAns && !isCorrect ? '✗ ' : ''}{opt}
                </div>
              ))}
            </div>
            <p className="text-xs text-brand-muted font-dm-sans mt-2 italic">{q.explanation}</p>
          </div>
        )
      })}
      <button onClick={onReset} className="w-full border-2 border-brand-border text-brand-navy py-3 rounded-xl font-semibold text-sm font-dm-sans hover:border-brand-orange/40 hover:text-brand-orange transition">Retake Quiz</button>
    </div>
  )
}
