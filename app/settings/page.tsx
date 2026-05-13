'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Lock, Palette, Save } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { currentUser } from '@/lib/mockData'
import { useToast } from '@/components/Toast'

export default function SettingsPage() {
  const { showToast } = useToast()
  const [name, setName] = useState(currentUser.full_name)
  const [email, setEmail] = useState(currentUser.email)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // TODO: PATCH /api/profile { full_name, email }
    showToast('Profile updated successfully!', 'success')
  }

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
              <img src={currentUser.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange/30" />
              <button type="button" onClick={() => showToast('Upload feature coming soon!', 'info')} className="text-sm text-brand-orange font-semibold font-dm-sans hover:underline">
                Change photo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-muted font-dm-sans mb-1.5 uppercase tracking-wider">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted font-dm-sans mb-1.5 uppercase tracking-wider">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition" />
              </div>
            </div>
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

          <button type="submit"
            className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-semibold font-dm-sans text-sm hover:bg-brand-orange-dark transition flex items-center justify-center gap-2 shadow-sm">
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>
    </AppShell>
  )
}
