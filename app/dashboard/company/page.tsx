import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import {
  Building2, Globe, MapPin, Users, Phone, Mail,
  Camera, Save, Briefcase, Calendar, Link as LinkIcon,
  Facebook, Twitter, Linkedin, Instagram
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Company Profile | RocketOpp",
  description: "Manage your company profile",
}

export default async function CompanyProfilePage() {
  const user = await getSession()
  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Company Profile
        </h1>
        <p className="text-white/50">
          Tell us about your business so we can personalize your experience
        </p>
      </div>

      {/* Company Logo & Basic Info */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Basic Information
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-2xl bg-zinc-800 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group">
              <Camera className="w-8 h-8 text-white/30 group-hover:text-primary/50 transition-colors" />
              <span className="text-xs text-white/30 mt-2">Upload Logo</span>
            </div>
            <p className="text-xs text-white/30 mt-2">Max 2MB, PNG or JPG</p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="Enter your company name"
                className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Industry
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all">
                  <option value="">Select industry</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="saas">SaaS / Software</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="consulting">Consulting</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="realestate">Real Estate</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Company Size
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all">
                  <option value="">Select size</option>
                  <option value="1">Just me</option>
                  <option value="2-10">2-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-400" />
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Business Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                placeholder="contact@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
              <textarea
                placeholder="123 Business St, Suite 100, City, State 12345"
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-purple-400" />
          Social Links
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              LinkedIn
            </label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                placeholder="linkedin.com/company/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Twitter / X
            </label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                placeholder="twitter.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Facebook
            </label>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                placeholder="facebook.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Instagram
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                placeholder="instagram.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-green-400" />
          About Your Business
        </h2>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Company Description
          </label>
          <textarea
            placeholder="Tell us what your company does, your mission, and what makes you unique..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          />
          <p className="text-xs text-white/30 mt-1.5">Max 500 characters</p>
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
