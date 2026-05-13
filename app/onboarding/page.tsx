'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react'
import { login, completeOnboarding } from '@/lib/auth'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface OnboardingData {
  background: string
  python: string
  goal: string
  hours: string
}

function computeLevel(data: OnboardingData) {
  const isCS = data.background === 'CS Grad'
  const isNonTech = data.background === 'Non-tech Professional'
  const hasPython = ['Projects', 'Professional'].includes(data.python)
  const someCode = data.background === 'Tech (Not Data)' || data.python === 'Basic'

  if (isCS && hasPython) return { level: 'Advanced', course_id: 'course-2', label: 'AI Bootcamp', weeks: 14, skills: ['Neural Networks', 'Deep Learning', 'PyTorch', 'NLP'] }
  if (isNonTech || data.python === 'None') return { level: 'Beginner', course_id: 'course-1', label: 'Data Analytics Bootcamp', weeks: 12, skills: ['Python Basics', 'SQL', 'Data Viz', 'Statistics'] }
  if (someCode || data.python === 'Basic') return { level: 'Intermediate', course_id: 'course-3', label: 'Automation with AI', weeks: 6, skills: ['Python', 'APIs', 'LLMs', 'Automation'] }
  return { level: 'Intermediate', course_id: 'course-1', label: 'Data Analytics Bootcamp', weeks: 10, skills: ['Python', 'SQL', 'EDA', 'ML Basics'] }
}

const backgrounds = ['CS Grad', 'Non-tech Professional', 'Student', 'Tech (Not Data)']
const pythonLevels = ['None', 'Basic scripting', 'Built projects', 'Professional Python']
const goals = ['Land a Data/AI job', 'Automate work tasks', 'Build AI products', 'Get a promotion']
const timeOptions = ['< 3 hrs/week', '3–7 hrs/week', '7–15 hrs/week', '15+ hrs/week']

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-100 text-purple-700 border-purple-200',
}

function OptionCard({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-dm-sans text-sm font-medium flex items-center gap-3',
        selected
          ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
          : 'border-brand-border bg-white text-gray-700 hover:border-brand-orange/40 hover:bg-brand-orange/3',
      )}
    >
      <div className={clsx(
        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
        selected ? 'border-brand-orange bg-brand-orange' : 'border-gray-300',
      )}>
        {selected && <Check size={12} className="text-white" />}
      </div>
      {label}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<OnboardingData>({ background: '', python: '', goal: '', hours: '' })
  const direction = 1

  function next() { setStep((s) => Math.min(s + 1, 6) as Step) }
  function back() { setStep((s) => Math.max(s - 1, 1) as Step) }

  function handleFinish() {
    const result = computeLevel(data)
    login('demo@atomcamp.com')
    completeOnboarding({
      level: result.level,
      course_id: result.course_id,
      estimated_weeks: result.weeks,
      skill_tags: result.skills,
    })
    // TODO: POST /api/onboarding-assess { background, python_level, goal, hours_per_week }
    showToast('Learning path created! Welcome to atomcamp 🚀', 'success')
    router.push('/dashboard')
  }

  const result = computeLevel(data)
  const progress = ((step - 1) / 5) * 100

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <h1 className="font-sora text-white text-lg font-bold">
          atom<span className="text-brand-orange">learn</span>
        </h1>
      </div>

      {/* Progress bar */}
      {step < 5 && (
        <div className="w-full max-w-lg mb-6">
          <div className="flex justify-between text-xs text-white/40 font-dm-sans mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              className="bg-brand-orange h-full rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Step 1: Background */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2 font-dm-sans">Your Background</p>
                  <h2 className="font-sora text-2xl font-bold text-brand-navy">What best describes you?</h2>
                  <p className="text-brand-muted text-sm mt-1 font-dm-sans">We&apos;ll tailor your learning path accordingly.</p>
                </div>
                <div className="space-y-2.5">
                  {backgrounds.map((b) => (
                    <OptionCard key={b} label={b} selected={data.background === b}
                      onClick={() => setData((d) => ({ ...d, background: b }))} />
                  ))}
                </div>
                <button
                  onClick={next}
                  disabled={!data.background}
                  className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold text-sm font-dm-sans
                             hover:bg-brand-orange-dark transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Python */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2 font-dm-sans">Coding Skills</p>
                  <h2 className="font-sora text-2xl font-bold text-brand-navy">How comfortable are you with Python?</h2>
                  <p className="text-brand-muted text-sm mt-1 font-dm-sans">Honest answer = better recommendations.</p>
                </div>
                <div className="space-y-2.5">
                  {pythonLevels.map((p) => (
                    <OptionCard key={p} label={p} selected={data.python === p}
                      onClick={() => setData((d) => ({ ...d, python: p }))} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={back} className="flex items-center gap-1 text-brand-muted text-sm font-dm-sans hover:text-brand-navy transition">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!data.python}
                    className="flex-1 bg-brand-orange text-white py-3 rounded-xl font-semibold text-sm font-dm-sans
                               hover:bg-brand-orange-dark transition disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2 font-dm-sans">Your Goal</p>
                  <h2 className="font-sora text-2xl font-bold text-brand-navy">What do you want to achieve?</h2>
                  <p className="text-brand-muted text-sm mt-1 font-dm-sans">This helps us prioritize the right skills.</p>
                </div>
                <div className="space-y-2.5">
                  {goals.map((g) => (
                    <OptionCard key={g} label={g} selected={data.goal === g}
                      onClick={() => setData((d) => ({ ...d, goal: g }))} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={back} className="flex items-center gap-1 text-brand-muted text-sm font-dm-sans hover:text-brand-navy transition">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!data.goal}
                    className="flex-1 bg-brand-orange text-white py-3 rounded-xl font-semibold text-sm font-dm-sans
                               hover:bg-brand-orange-dark transition disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Time */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2 font-dm-sans">Time Commitment</p>
                  <h2 className="font-sora text-2xl font-bold text-brand-navy">How much time can you dedicate?</h2>
                  <p className="text-brand-muted text-sm mt-1 font-dm-sans">We&apos;ll pace your learning accordingly.</p>
                </div>
                <div className="space-y-2.5">
                  {timeOptions.map((t) => (
                    <OptionCard key={t} label={t} selected={data.hours === t}
                      onClick={() => setData((d) => ({ ...d, hours: t }))} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={back} className="flex items-center gap-1 text-brand-muted text-sm font-dm-sans hover:text-brand-navy transition">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={() => { next() }}
                    disabled={!data.hours}
                    className="flex-1 bg-brand-orange text-white py-3 rounded-xl font-semibold text-sm font-dm-sans
                               hover:bg-brand-orange-dark transition disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    Build My Path <Sparkles size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Loading */}
            {step === 5 && <LoadingStep onDone={next} />}

            {/* Step 6: Result */}
            {step === 6 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles size={32} className="text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-sora text-2xl font-bold text-brand-navy">Your path is ready!</h2>
                  <p className="text-brand-muted text-sm mt-1 font-dm-sans">Here&apos;s what our AI recommends for you.</p>
                </div>

                <div className="bg-brand-bg rounded-xl border border-brand-border p-5 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest font-dm-sans">Your Level</span>
                    <span className={clsx('text-xs font-bold px-3 py-1 rounded-full border', levelColors[result.level])}>
                      {result.level}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted font-dm-sans mb-1">Recommended Course</p>
                    <p className="font-sora text-lg font-bold text-brand-navy">{result.label}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-brand-muted font-dm-sans">
                    <span>⏱ {result.weeks} weeks</span>
                    <span>📚 Adaptive modules</span>
                    <span>🤖 AI Tutor included</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((s) => (
                      <span key={s} className="text-xs px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full font-dm-sans font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-semibold font-dm-sans text-sm
                             hover:bg-brand-orange-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Start Learning → Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function LoadingStep({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false)
  const steps = [
    'Analyzing your background…',
    'Mapping skill gaps…',
    'Selecting optimal course…',
    'Building your learning path…',
  ]
  const [current, setCurrent] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setCurrent((c) => {
        if (c >= steps.length - 1) {
          clearInterval(interval)
          setTimeout(() => { setDone(true); onDone() }, 600)
          return c
        }
        return c + 1
      })
    }, 500)
  })

  return (
    <div className="text-center py-8 space-y-6">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-brand-orange/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-brand-orange animate-spin" />
        <Sparkles size={32} className="absolute inset-0 m-auto text-brand-orange" />
      </div>
      <div>
        <h2 className="font-sora text-xl font-bold text-brand-navy mb-2">AI is building your path</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-brand-muted text-sm font-dm-sans"
          >
            {steps[current]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={clsx(
              'w-2 h-2 rounded-full transition-all',
              i <= current ? 'bg-brand-orange' : 'bg-gray-200',
            )}
          />
        ))}
      </div>
    </div>
  )
}
