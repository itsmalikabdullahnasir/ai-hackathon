'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) {
        setError('Invalid or expired link. Please request a new reset email.')
      }
      setHasSession(Boolean(data.session))
      setReady(true)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasSession(Boolean(session))
        setReady(true)
      }
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!hasSession) {
      setError('This reset link is invalid or has expired.')
      return
    }
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess('Password updated. You can sign in with your new password.')
    showToast('Password updated successfully.', 'success')
    setLoading(false)
  }

  async function goToLogin() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F9FB' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#077837' }}>
            <Zap size={20} className="text-white fill-white" />
          </div>
          <h1 className="font-sora text-xl font-bold" style={{ color: '#010A13' }}>auto<span style={{ color: '#00C853' }}>camp</span></h1>
        </div>

        <div className="rounded-2xl p-7" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)' }}>
          <div className="mb-6">
            <h2 className="font-sora text-2xl font-bold mb-1" style={{ color: '#010A13' }}>Reset your password</h2>
            <p className="text-sm font-dm-sans" style={{ color: '#64748B' }}>Choose a new password for your account.</p>
          </div>

          {!ready && (
            <p className="text-sm font-dm-sans" style={{ color: '#64748B' }}>Loading your reset link...</p>
          )}

          {ready && !hasSession && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-dm-sans" style={{ color: '#B91C1C' }}>
                <AlertCircle size={16} className="text-red-500" />
                <span>{error || 'This reset link is invalid or has expired.'}</span>
              </div>
              <button type="button" onClick={() => router.push('/login')}
                className="w-full py-3 rounded-xl font-semibold font-dm-sans text-sm text-white transition-all"
                style={{ background: '#077837' }}
              >
                Back to sign in
              </button>
            </div>
          )}

          {ready && hasSession && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-dm-sans">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 font-dm-sans">{success}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium font-dm-sans" style={{ color: '#374151' }}>New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input id="password" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-dm-sans outline-none transition-all"
                    style={{ background: '#F8F9FB', border: '1px solid #E2E8F0' }}
                    onFocus={(e) => { e.target.style.border = '1px solid #077837'; e.target.style.boxShadow = '0 0 0 3px rgba(7,120,55,0.12)' }}
                    onBlur={(e) => { e.target.style.border = '1px solid #E2E8F0'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#9CA3AF' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium font-dm-sans" style={{ color: '#374151' }}>Confirm new password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input id="confirmPassword" type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-dm-sans outline-none transition-all"
                    style={{ background: '#F8F9FB', border: '1px solid #E2E8F0' }}
                    onFocus={(e) => { e.target.style.border = '1px solid #077837'; e.target.style.boxShadow = '0 0 0 3px rgba(7,120,55,0.12)' }}
                    onBlur={(e) => { e.target.style.border = '1px solid #E2E8F0'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold font-dm-sans text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: loading ? '#065F46' : '#077837' }}
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>

              {success && (
                <button type="button" onClick={goToLogin}
                  className="w-full py-3 rounded-xl font-semibold font-dm-sans text-sm text-white transition-all"
                  style={{ background: '#010A13' }}
                >
                  Go to sign in
                </button>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
