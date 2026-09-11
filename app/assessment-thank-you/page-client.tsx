"use client"

import { motion } from "framer-motion"
import { CheckCircle, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export default function AssessmentThankYouPage() {
  return (
    <>
      <main className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>

            <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for completing your project assessment. We have everything we need to create a customized
              solution for your business.
            </p>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 mb-8 border border-primary/20">
              <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">What Happens Next?</h2>
              <div className="text-left space-y-3 max-w-xl mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <p className="text-muted-foreground">
                    Our team will review your assessment and project details within 24 hours
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <p className="text-muted-foreground">
                    We'll prepare a customized proposal tailored to your timeline and requirements
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <p className="text-muted-foreground">
                    A dedicated specialist will reach out to discuss next steps and answer any questions
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                In the meantime, feel free to explore our other services or check out our portfolio of successful
                projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" variant="outline">
                    Return to Home
                  </Button>
                </Link>
                <Link href="/applications">
                  <Button size="lg">View Our Portfolio</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
