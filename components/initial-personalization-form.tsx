"use client"

import type React from "react"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createPersonalizationAction } from "@/app/actions/personalization-actions"
import Image from "next/image"
import { usePersonalizationStore } from "@/lib/personalization-store"
import { useRouter } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Submitting..." : "Personalize My Experience"}
    </Button>
  )
}

export function InitialPersonalizationForm() {
  const router = useRouter()
  const store = usePersonalizationStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await createPersonalizationAction(null, formData)

    setIsSubmitting(false)

    if (result?.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      router.push("/")
    } else if (result && !result.success) {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Image
        src="/images/rocketopp-logo.png"
        alt="RocketOpp - AI-Powered Apps for Business"
        width={200}
        height={50}
        className="mb-8 h-12 w-auto"
      />
      <h1 className="text-2xl font-bold mb-2">Personalize Your Experience</h1>
      <p className="text-muted-foreground mb-6 max-w-sm text-center">
        Tell us your name so we can tailor the content and examples you see across the site.
      </p>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" placeholder="John" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" placeholder="Doe" required className="mt-1" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Personalize My Experience"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default InitialPersonalizationForm
