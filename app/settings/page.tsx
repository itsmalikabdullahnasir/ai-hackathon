'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Save, Camera } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { useUser } from '@/components/UserProvider'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'

export default function SettingsPage() {
  const { showToast } = useToast()
  const { user, refresh } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.full_name)
      setEmail(user.email)
    }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await apiFetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: name.trim(), email: email.trim() }),
      })
      await refresh()
      showToast('Profile updated successfully!', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data: session } = await (await import('@/lib/supabase/client')).supabase.auth.getSession()
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: session?.session?.access_token ? { Authorization: `Bearer ${session.session.access_token}` } : {},
        body: form,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Upload failed')
      }
      await refresh()
      showToast('Profile photo updated!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const initials = name.trim().split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'U'

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <h1 className="font-sora text-2xl font-bold text-brand-navy">Settings</h1>
          <p className="text-brand-muted text-sm font-dm-sans mt-1">Manage your account preferences.</p>
        </motion.div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <User size={18} className="text-brand-orange" />
              <h2 className="font-sora text-base font-bold text-brand-navy">Profile</h2>
            </div>
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange/30" />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-brand-orange/30 bg-brand-orange/15 text-brand-orange text-sm font-semibold flex items-center justify-center">{initials}</div>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-sm text-brand-orange font-semibold font-dm-sans hover:underline disabled:opacity-50"
                >
                  <Camera size={14} />
                  {uploadingPhoto ? 'Uploading…' : 'Change photo'}
                </button>
                <p className="text-xs text-brand-muted font-dm-sans mt-1">JPEG, PNG or WebP · max 2 MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-muted font-dm-sans mb-1.5 uppercase tracking-wider">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted font-dm-sans mb-1.5 uppercase tracking-wider">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
                />
              </div>
            </div>
            {user?.role && (
              <div className="mt-4 pt-4 border-t border-brand-border">
                <p className="text-xs text-brand-muted font-dm-sans">Role: <span className="font-semibold text-brand-navy capitalize">{user.role}</span></p>
                {user.level && <p className="text-xs text-brand-muted font-dm-sans mt-1">Level: <span className="font-semibold text-brand-navy capitalize">{user.level}</span></p>}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Bell size={18} className="text-brand-orange" />
              <h2 className="font-sora text-base font-bold text-brand-navy">Notifications</h2>
            </div>
            {['Email reminders for live sessions', 'Weekly progress digest', 'AI tutor recommendations', 'New course announcements'].map((label) => (
              <label key={label} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0 cursor-pointer">
                <span className="text-sm text-brand-navy font-dm-sans">{label}</span>
                <div className="relative w-11 h-6 bg-brand-orange rounded-full flex items-center px-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </label>
            ))}
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-semibold font-dm-sans text-sm hover:bg-brand-orange-dark transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
