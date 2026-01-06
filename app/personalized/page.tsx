import { Suspense } from "react"
import type { Metadata } from "next"
import PersonalizedPageClient from "./PersonalizedPageClient"

export const metadata: Metadata = {
  title: "Your Personalized RocketOpp Experience",
  description: "A custom page generated just for you based on your industry and business needs.",
  robots: { index: false, follow: false },
}

export default function PersonalizedPage() {
  return (
    <Suspense fallback={<PersonalizedLoadingState />}>
      <PersonalizedPageClient />
    </Suspense>
  )
}

function PersonalizedLoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your personalized experience...</p>
      </div>
    </div>
  )
}
