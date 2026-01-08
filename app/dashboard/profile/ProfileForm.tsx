"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  User, Mail, Phone, Camera, Save, Shield, Key, Bell, Trash2,
  CheckCircle, Loader2
} from "lucide-react"

interface ProfileData {
  name: string
  phone: string
  job_title: string
  bio: string
  notifications: {
    product_updates: boolean
    marketing_emails: boolean
    fuel_alerts: boolean
  }
}

interface ProfileFormProps {
  user: {
    email: string
    name?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ProfileData>({
    name: user.name || '',
    phone: '',
    job_title: '',
    bio: '',
    notifications: {
      product_updates: true,
      marketing_emails: false,
      fuel_alerts: true,
    }
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile')
        const data = await res.json()
        if (data.success) {
          setForm({
            name: data.profile.name || user.name || '',
            phone: data.profile.phone || '',
            job_title: data.profile.job_title || '',
            bio: data.profile.bio || '',
            notifications: data.profile.notifications || {
              product_updates: true,
              marketing_emails: false,
              fuel_alerts: true,
            }
          })
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user.name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
  }

  const handleNotificationChange = (key: keyof ProfileData['notifications']) => {
    setForm(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const nameParts = form.name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const handleNameChange = (type: 'first' | 'last', value: string) => {
    const newName = type === 'first'
      ? `${value} ${lastName}`.trim()
      : `${firstName} ${value}`.trim()
    setForm(prev => ({ ...prev, name: newName }))
    setSuccess(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile Picture & Basic Info */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {form.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2">Click to upload</p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => handleNameChange('first', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => handleNameChange('last', e.target.value)}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/5 text-white/50 cursor-not-allowed"
                />
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                placeholder="e.g. Marketing Director, CEO, Developer"
                className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">About You</h2>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself, your role, and what you're working on..."
            rows={3}
            maxLength={280}
            className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          />
          <p className="text-xs text-white/30 mt-1.5">{form.bio.length}/280 characters</p>
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Security
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs text-white/40">Last changed: Never</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-white/40">Add an extra layer of security</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Notifications
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Product Updates</p>
              <p className="text-xs text-white/40">Get notified about new features and improvements</p>
            </div>
            <input
              type="checkbox"
              checked={form.notifications.product_updates}
              onChange={() => handleNotificationChange('product_updates')}
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Marketing Emails</p>
              <p className="text-xs text-white/40">Receive tips, trends, and special offers</p>
            </div>
            <input
              type="checkbox"
              checked={form.notifications.marketing_emails}
              onChange={() => handleNotificationChange('marketing_emails')}
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Fuel Credit Alerts</p>
              <p className="text-xs text-white/40">Get notified when your credits are running low</p>
            </div>
            <input
              type="checkbox"
              checked={form.notifications.fuel_alerts}
              onChange={() => handleNotificationChange('fuel_alerts')}
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 mb-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Delete Account</p>
            <p className="text-xs text-white/40">Permanently delete your account and all data</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Profile saved successfully!
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
