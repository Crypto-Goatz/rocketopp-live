"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tag, Save, Check, Search, Sparkles, Gift,
  Briefcase, Code2, Megaphone, Palette, BarChart3,
  Users, ShoppingBag, Heart, Zap, Globe, Film,
  Music, Utensils, Home, Car, Plane, Dumbbell
} from "lucide-react"

const categoryData = [
  {
    name: "Industry",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    tags: [
      "Marketing Agency", "SaaS", "E-Commerce", "Consulting", "Healthcare",
      "Finance", "Real Estate", "Education", "Legal", "Manufacturing",
      "Hospitality", "Non-Profit", "Media", "Technology", "Retail"
    ]
  },
  {
    name: "Services Offered",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    tags: [
      "Web Development", "SEO", "PPC Advertising", "Social Media", "Content Marketing",
      "Email Marketing", "Branding", "Graphic Design", "Video Production", "Copywriting",
      "UI/UX Design", "Mobile Apps", "AI Integration", "Automation", "CRM Management"
    ]
  },
  {
    name: "Target Market",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    tags: [
      "B2B", "B2C", "Enterprise", "SMB", "Startups",
      "Local Businesses", "E-commerce Brands", "SaaS Companies", "Agencies", "Creators"
    ]
  },
  {
    name: "Tools & Platforms",
    icon: Code2,
    color: "from-orange-500 to-red-500",
    tags: [
      "GoHighLevel", "HubSpot", "Salesforce", "Shopify", "WordPress",
      "Webflow", "Figma", "Google Ads", "Meta Ads", "Mailchimp",
      "Klaviyo", "Zapier", "Make", "Notion", "Airtable"
    ]
  },
  {
    name: "Interests",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    tags: [
      "AI & Machine Learning", "No-Code Tools", "Growth Hacking", "Product Management",
      "Data Analytics", "Customer Success", "Sales Automation", "Community Building"
    ]
  },
]

export default function TagsPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredCategories = categoryData.map(category => ({
    ...category,
    tags: category.tags.filter(tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tags.length > 0)

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Specializations
        </h1>
        <p className="text-white/50">
          Select tags that describe your expertise and interests. This helps us personalize your experience.
        </p>
      </div>

      {/* Reward Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/20 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center flex-shrink-0">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Earn 100 Fuel Credits!</p>
          <p className="text-xs text-white/50">Select at least 5 tags to complete your profile and earn bonus credits.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{selectedTags.length}/5</p>
          <p className="text-xs text-white/40">selected</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Selected Tags Preview */}
      {selectedTags.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 mb-6">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Selected Tags ({selectedTags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
              >
                {tag}
                <span className="text-primary/60">×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.name} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {category.name}
              </h2>

              <div className="flex flex-wrap gap-2">
                {category.tags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'bg-black/30 text-white/60 hover:bg-black/50 hover:text-white border border-white/5'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-6 mt-8">
        <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <div>
            <p className="text-sm font-medium text-white">
              {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-white/40">
              {selectedTags.length >= 5 ? 'Great! You qualify for bonus credits!' : `Select ${5 - selectedTags.length} more for bonus`}
            </p>
          </div>
          <Button disabled={selectedTags.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Save Selections
          </Button>
        </div>
      </div>
    </div>
  )
}
