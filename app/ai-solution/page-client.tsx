"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { ArrowLeft, CalendarDays, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export default function AiSolutionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [originalQuery, setOriginalQuery] = useState("")
  const [solutionText, setSolutionText] = useState("")
  const [imageQuery, setImageQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const query = searchParams.get("query")
    const solution = searchParams.get("solution")
    const imgQuery = searchParams.get("imageQuery")
    const err = searchParams.get("error")

    if (err) {
      setError(decodeURIComponent(err))
    }
    if (query) {
      setOriginalQuery(decodeURIComponent(query))
    }
    if (solution) {
      setSolutionText(decodeURIComponent(solution))
    }
    if (imgQuery) {
      setImageQuery(decodeURIComponent(imgQuery))
    } else if (!err) {
      setImageQuery("abstract digital solution")
    }
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your solution...</p>
      </div>
    )
  }

  const placeholderImageUrl = imageQuery
    ? `/placeholder.svg?width=800&height=400&query=${encodeURIComponent(imageQuery)}`
    : "/abstract-problem-solving.png"

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/10">
      <main className="flex-grow py-12 md:py-16">
        <div className="container max-w-3xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          {error && (
            <div className="mb-8 p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">An Error Occurred</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {originalQuery && (
            <div className="mb-6 p-4 border border-primary/30 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Your Challenge:</p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{originalQuery}</h1>
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-6 sm:p-8 rounded-xl shadow-xl">
            <div className="relative w-full aspect-[2/1] mb-8 rounded-lg overflow-hidden border">
              <Image
                src={placeholderImageUrl || "/placeholder.svg"}
                alt={imageQuery || "AI generated visual concept"}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>

            <h2 className="text-xl font-semibold text-primary mb-3">Our AI-Powered Perspective:</h2>
            {solutionText ? (
              <p>{solutionText}</p>
            ) : !error ? (
              <p>
                It looks like we couldn't generate a specific text solution for this query at the moment. However,
                Rocket Opp is equipped to handle a wide variety of challenges with our expert web design, marketing, and
                AI services. We'd love to discuss your needs personally!
              </p>
            ) : null}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-6 text-lg"
            >
              <a href="/#contact?solution_for={encodeURIComponent(originalQuery)}">
                <CalendarDays className="mr-2 h-5 w-5" />
                Schedule a Call to Discuss
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Let's explore how Rocket Opp can turn this solution into reality for you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
