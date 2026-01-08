"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Building2, Globe, MapPin, Phone, Mail, Camera, Save, Briefcase,
  Link as LinkIcon, Facebook, Twitter, Linkedin, Instagram, Loader2, CheckCircle
} from "lucide-react"
import Image from "next/image"

interface CompanyData {
  company_name: string
  company_industry: string
  company_size: string
  company_website: string
  company_logo: string
  company_email: string
  company_phone: string
  company_address: string
  company_description: string
  social_linkedin: string
  social_twitter: string
  social_facebook: string
  social_instagram: string
}

export function CompanyForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<CompanyData>({
    company_name: '',
    company_industry: '',
    company_size: '',
    company_website: '',
    company_logo: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_description: '',
    social_linkedin: '',
    social_twitter: '',
    social_facebook: '',
    social_instagram: '',
  })

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch('/api/user/company')
        const data = await res.json()
        if (data.success) {
          setForm(data.company)
          if (data.company.company_logo) {
            setLogoPreview(data.company.company_logo)
          }
        }
      } catch (err) {
        console.error('Failed to load company:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCompany()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be less than 2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setUploadingLogo(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setLogoPreview(data.url)
        setForm(prev => ({ ...prev, company_logo: data.url }))
      } else {
        setError(data.error || 'Failed to upload logo')
      }
    } catch (err) {
      setError('Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/company', {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Company Logo & Basic Info */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Basic Information
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <div
              onClick={handleLogoClick}
              className="w-32 h-32 rounded-2xl bg-zinc-800 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group overflow-hidden relative"
            >
              {uploadingLogo ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company logo"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-white/30 group-hover:text-primary/50 transition-colors" />
                  <span className="text-xs text-white/30 mt-2">Upload Logo</span>
                </>
              )}
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
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Industry
                </label>
                <select
                  name="company_industry"
                  value={form.company_industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                >
                  <option value="">Select industry</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="saas">SaaS / Software</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="consulting">Consulting</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="realestate">Real Estate</option>
                  <option value="education">Education</option>
                  <option value="construction">Construction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Company Size
                </label>
                <select
                  name="company_size"
                  value={form.company_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                >
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
                  name="company_website"
                  value={form.company_website}
                  onChange={handleChange}
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
                name="company_email"
                value={form.company_email}
                onChange={handleChange}
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
                name="company_phone"
                value={form.company_phone}
                onChange={handleChange}
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
                name="company_address"
                value={form.company_address}
                onChange={handleChange}
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
                name="social_linkedin"
                value={form.social_linkedin}
                onChange={handleChange}
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
                name="social_twitter"
                value={form.social_twitter}
                onChange={handleChange}
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
                name="social_facebook"
                value={form.social_facebook}
                onChange={handleChange}
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
                name="social_instagram"
                value={form.social_instagram}
                onChange={handleChange}
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
            name="company_description"
            value={form.company_description}
            onChange={handleChange}
            placeholder="Tell us what your company does, your mission, and what makes you unique..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          />
          <p className="text-xs text-white/30 mt-1.5">{form.company_description.length}/500 characters</p>
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
          Company profile saved successfully!
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
