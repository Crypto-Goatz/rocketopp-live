"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import EcosprayFooter from "../components/footer"

export default function EcosprayContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'residential',
    squareFootage: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setFormState('success')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get Your{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Free Quote
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Fill out the form below and we&apos;ll get back to you within 24 hours with a detailed estimate.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                <h3 className="font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+14125551234"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500">Phone</div>
                      <div className="text-white">(412) 555-1234</div>
                    </div>
                  </a>
                  <a
                    href="mailto:info@ecospraysolutions.com"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500">Email</div>
                      <div className="text-white">info@ecospraysolutions.com</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500">Location</div>
                      <div className="text-white">Murrysville, PA</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500">Hours</div>
                      <div className="text-white">Mon-Fri: 8am-6pm</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <h3 className="font-bold text-white mb-3">Service Area</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  We proudly serve the greater Pittsburgh area including:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    "Murrysville",
                    "Pittsburgh",
                    "Monroeville",
                    "Export",
                    "Greensburg",
                    "Irwin",
                    "North Huntingdon",
                    "Delmont",
                  ].map((area) => (
                    <div key={area} className="flex items-center gap-1 text-zinc-300">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {area}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 p-6 md:p-8 bg-zinc-900/50 border-zinc-800">
              {formState === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quote Request Received!</h3>
                  <p className="text-zinc-400 mb-6">
                    Thank you for your interest. We&apos;ll be in touch within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setFormState('idle')
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        propertyType: 'residential',
                        squareFootage: '',
                        message: '',
                      })
                    }}
                    variant="outline"
                    className="border-zinc-700"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6">Request a Free Quote</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-zinc-300">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="(412) 555-1234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="squareFootage" className="text-zinc-300">Approx. Square Footage</Label>
                      <Input
                        id="squareFootage"
                        value={formData.squareFootage}
                        onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="e.g., 2,500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Property Type *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'residential', label: 'Residential' },
                        { value: 'commercial', label: 'Commercial' },
                        { value: 'new-construction', label: 'New Build' },
                        { value: 'other', label: 'Other' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: option.value })}
                          className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                            formData.propertyType === option.value
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">Tell us about your project</Label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      placeholder="What areas need insulation? Any specific concerns or goals?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white group"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Get My Free Quote
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-zinc-500 text-center">
                    By submitting this form, you agree to be contacted about your project.
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      <EcosprayFooter />
    </div>
  )
}
