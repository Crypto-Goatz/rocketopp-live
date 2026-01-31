"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  User, CreditCard, Package, Shield, ExternalLink,
  Loader2, ChevronRight, Check, AlertCircle, Fuel,
  Building2, Mail, Phone, Edit2, Save, X, Rocket
} from "lucide-react"

interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  avatarUrl: string | null
  fuelCredits: number
  subscriptionStatus: string
  emailVerified: boolean
  createdAt: string
}

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

interface ProductAccess {
  product: string
  name: string
  accessType: string
  status: 'active' | 'inactive' | 'trial' | 'expired'
  expiresAt?: string
  url: string
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [products, setProducts] = useState<ProductAccess[]>([])
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: ''
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Fetch all data in parallel
      const [profileRes, billingRes, productsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/billing/portal'),
        fetch('/api/user/products')
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        if (profileData.user) {
          setUser({
            id: profileData.user.id,
            email: profileData.user.email,
            name: profileData.user.name,
            company: profileData.user.company || null,
            phone: profileData.user.phone || null,
            avatarUrl: profileData.user.avatar_url || null,
            fuelCredits: profileData.user.fuel_credits || 100,
            subscriptionStatus: profileData.user.subscription_status || 'free',
            emailVerified: profileData.user.email_verified || false,
            createdAt: profileData.user.created_at
          })
          setFormData({
            name: profileData.user.name || '',
            company: profileData.user.company || '',
            phone: profileData.user.phone || ''
          })
        }
      }

      // Fetch payment methods separately (GET request)
      const pmRes = await fetch('/api/billing/portal')
      if (pmRes.ok) {
        const pmData = await pmRes.json()
        setPaymentMethods(pmData.paymentMethods || [])
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }
    } catch (err) {
      console.error('Failed to load account data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to save profile')
      }

      setUser(prev => prev ? { ...prev, ...formData } : null)
      setEditing(false)
    } catch {
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const openBillingPortal = async () => {
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.href })
      })

      if (res.ok) {
        const { url } = await res.json()
        window.location.href = url
      }
    } catch (err) {
      console.error('Failed to open billing portal:', err)
    }
  }

  const handleSSO = async (product: string) => {
    try {
      const res = await fetch('/api/auth/sso/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      })

      if (res.ok) {
        const { redirectUrl } = await res.json()
        window.location.href = redirectUrl
      }
    } catch (err) {
      console.error('SSO failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-white/50">
          Manage your profile, billing, and connected products
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h2>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email (not editable) */}
            <div>
              <label className="block text-sm text-white/40 mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-black/30 rounded-xl text-white">
                <Mail className="w-4 h-4 text-white/40" />
                <span>{user?.email}</span>
                {user?.emailVerified && <Check className="w-4 h-4 text-green-400 ml-auto" />}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm text-white/40 mb-2">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-primary/50 focus:outline-none"
                  placeholder="Your name"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-black/30 rounded-xl text-white">
                  <User className="w-4 h-4 text-white/40" />
                  <span>{user?.name || 'Not set'}</span>
                </div>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm text-white/40 mb-2">Company</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-primary/50 focus:outline-none"
                  placeholder="Your company"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-black/30 rounded-xl text-white">
                  <Building2 className="w-4 h-4 text-white/40" />
                  <span>{user?.company || 'Not set'}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-white/40 mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-primary/50 focus:outline-none"
                  placeholder="Your phone number"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-black/30 rounded-xl text-white">
                  <Phone className="w-4 h-4 text-white/40" />
                  <span>{user?.phone || 'Not set'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user?.fuelCredits?.toLocaleString()}</div>
              <div className="text-xs text-white/40 flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-orange-400" /> Fuel Credits
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white capitalize">{user?.subscriptionStatus}</div>
              <div className="text-xs text-white/40">Account Tier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{products.filter(p => p.status === 'active').length}</div>
              <div className="text-xs text-white/40">Active Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{paymentMethods.length}</div>
              <div className="text-xs text-white/40">Payment Methods</div>
            </div>
          </div>
        </section>

        {/* Billing Section */}
        <section className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-400" />
              Billing & Payment Methods
            </h2>
            <Button size="sm" onClick={openBillingPortal}>
              Manage Billing
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 mb-4">No payment methods on file</p>
              <Button variant="outline" size="sm" onClick={openBillingPortal}>
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {pm.brand} ****{pm.last4}
                      </p>
                      <p className="text-xs text-white/40">
                        Expires {pm.expMonth}/{pm.expYear}
                      </p>
                    </div>
                  </div>
                  {pm.isDefault && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Connected Products Section */}
        <section className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Your Products
            </h2>
            <Link href="/marketplace">
              <Button variant="ghost" size="sm">
                Browse Marketplace
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.product}
                className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-white/40 capitalize">
                      {product.accessType}
                      {product.expiresAt && ` · Expires ${new Date(product.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    product.status === 'trial' ? 'bg-blue-500/20 text-blue-400' :
                    product.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                    'bg-white/10 text-white/40'
                  }`}>
                    {product.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSSO(product.product)}
                  >
                    Open
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-yellow-400" />
            Security
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30">
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs text-white/40">Last changed: Never</p>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30">
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-white/40">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30">
              <div>
                <p className="text-sm font-medium text-white">Active Sessions</p>
                <p className="text-xs text-white/40">Manage your logged-in devices</p>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
