'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Zap, CheckCircle, Briefcase, Building2, AlertCircle } from 'lucide-react'
import { login, isAuthenticated, hasCompletedOnboarding } from '@/lib/auth'
import { useToast } from '@/components/Toast'

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      if (hasCompletedOnboarding()) router.replace('/dashboard')
      else router.replace('/onboarding')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    // TODO: POST /api/auth/login { email, password }
    await new Promise((r) => setTimeout(r, 1000))
    login(email)
    showToast('Welcome back to atomcamp! 🎉', 'success')
    if (hasCompletedOnboarding()) router.push('/dashboard')
    else router.push('/onboarding')
  }

  function handleGoogle() {
    // TODO: GET /api/auth/google — OAuth redirect
    setLoading(true)
    setTimeout(() => {
      login('google-user@gmail.com')
      showToast('Signed in with Google!', 'success')
      if (hasCompletedOnboarding()) router.push('/dashboard')
      else router.push('/onboarding')
    }, 800)
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, #0C2929 0%, #061018 45%, #010A13 100%)',
        }}
      >
        {/* ── BRAIN IMAGE ──────────────────────────────────────────────────
            Place your brain image at:  /public/brain.jpg
            ──────────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/brain.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Green glow particles */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 480, height: 480,
            top: '8%', left: '18%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 280, height: 280,
            bottom: '12%', right: '5%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.07) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Dark overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(to right, rgba(1,10,19,0.88) 0%, rgba(1,10,19,0.60) 55%, rgba(1,10,19,0.72) 100%)',
              'linear-gradient(to bottom, rgba(1,10,19,0.30) 0%, transparent 40%, rgba(1,10,19,0.50) 100%)',
            ].join(', '),
          }}
        />

        {/* Content (above overlay) */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: '#077837' }}
            >
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span
              className="font-sora text-xl font-bold text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              atom<span style={{ color: '#00C853' }}>learn</span>
            </span>
          </div>

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md"
          >
            <h2
              className="font-sora font-bold text-white leading-[1.15] mb-5"
              style={{ fontSize: '52px', letterSpacing: '-0.025em' }}
            >
              Learn AI.<br />
              <span style={{ color: '#00C853' }}>Get Hired.</span>
            </h2>

            <p className="text-white/70 text-lg font-dm-sans mb-8 leading-relaxed" style={{ fontSize: '17px' }}>
              Join over 10,000+ professionals mastering adaptive learning and cutting-edge artificial intelligence to transform their careers.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: CheckCircle, label: '10,000 Trained' },
                { icon: Briefcase, label: '80% Job Placement' },
                { icon: Building2, label: '70 Corporate Clients' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border font-dm-sans text-sm text-white"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Icon size={15} style={{ color: '#00C853' }} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-start gap-4 p-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
              alt="Alumni"
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              style={{ border: '2px solid #00C853' }}
            />
            <div>
              <p className="text-white/80 text-sm font-dm-sans italic leading-relaxed">
                &ldquo;The AI Tutor path at atomlearn changed my career trajectory in just 3&nbsp;months. Highly recommended for anyone in tech.&rdquo;
              </p>
              <p className="text-sm font-semibold font-dm-sans mt-2" style={{ color: '#00C853' }}>
                — David Chen, Senior AI Engineer
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── RIGHT PANEL ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#077837' }}>
              <Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-sora text-xl font-bold" style={{ color: '#010A13' }}>
              atom<span style={{ color: '#00C853' }}>learn</span>
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-sora text-2xl font-bold mb-1" style={{ color: '#010A13' }}>Welcome back</h2>
            <p className="text-sm font-dm-sans" style={{ color: '#64748B' }}>
              Please enter your details to sign in to your account.
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-dm-sans">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium font-dm-sans" style={{ color: '#374151' }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-dm-sans outline-none transition-all"
                    style={{
                      background: '#F8F9FB',
                      border: '1px solid #E2E8F0',
                    }}
                    onFocus={(e) => { e.target.style.border = '1px solid #077837'; e.target.style.boxShadow = '0 0 0 3px rgba(7,120,55,0.12)' }}
                    onBlur={(e) => { e.target.style.border = '1px solid #E2E8F0'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium font-dm-sans" style={{ color: '#374151' }}>
                    Password
                  </label>
                  <button type="button" className="text-xs font-dm-sans font-semibold hover:underline" style={{ color: '#00C853' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-dm-sans outline-none transition-all"
                    style={{
                      background: '#F8F9FB',
                      border: '1px solid #E2E8F0',
                    }}
                    onFocus={(e) => { e.target.style.border = '1px solid #077837'; e.target.style.boxShadow = '0 0 0 3px rgba(7,120,55,0.12)' }}
                    onBlur={(e) => { e.target.style.border = '1px solid #E2E8F0'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#9CA3AF' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#077837' }}
                />
                <span className="text-sm font-dm-sans" style={{ color: '#6B7280' }}>Remember me for 30 days</span>
              </label>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold font-dm-sans text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  background: loading ? '#065F46' : '#077837',
                  boxShadow: '0 1px 3px rgba(7,120,55,0.25)',
                }}
                onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#065F46' }}
                onMouseLeave={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#077837' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-dm-sans uppercase tracking-wider" style={{ color: '#9CA3AF' }}>or</span>
              </div>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium font-dm-sans transition-all active:scale-[0.98]"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#374151',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F9FB' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm font-dm-sans" style={{ color: '#6B7280' }}>
            Don&apos;t have an account?{' '}
            <a href="/onboarding" className="font-bold hover:underline" style={{ color: '#00C853' }}>
              Get started
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
