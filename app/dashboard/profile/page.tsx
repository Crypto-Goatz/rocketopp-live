import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import {
  User, Mail, Phone, Camera, Save, Shield,
  Key, Bell, Trash2, CheckCircle
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Profile | RocketOpp",
  description: "Manage your personal profile",
}

export default async function UserProfilePage() {
  const user = await getSession()
  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Profile
        </h1>
        <p className="text-white/50">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Picture & Basic Info */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
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
                  placeholder="Enter first name"
                  defaultValue={user.name?.split(' ')[0] || ''}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  defaultValue={user.name?.split(' ').slice(1).join(' ') || ''}
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
                  defaultValue={user.email}
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
            placeholder="Tell us a bit about yourself, your role, and what you're working on..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          />
          <p className="text-xs text-white/30 mt-1.5">Max 280 characters</p>
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
            <Button variant="outline" size="sm">
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
            <Button variant="outline" size="sm">
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
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Marketing Emails</p>
              <p className="text-xs text-white/40">Receive tips, trends, and special offers</p>
            </div>
            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Fuel Credit Alerts</p>
              <p className="text-xs text-white/40">Get notified when your credits are running low</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50" />
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
          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
