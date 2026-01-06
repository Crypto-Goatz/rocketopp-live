"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export default function InquiryThankYouPage() {
  const searchParams = useSearchParams()

  const firstName = searchParams.get("firstName")
  const lastName = searchParams.get("lastName")
  const email = searchParams.get("email")
  const phone = searchParams.get("phone")
  const service = searchParams.get("service")
  const project = searchParams.get("project")
  const app = searchParams.get("app")

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

            <h1 className="text-4xl font-bold mb-4">Thank You for Your Inquiry!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              We've received your information and will get back to you shortly.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Submission Details:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {firstName} {lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{service}</p>
                </div>
              </div>
              {app && (
                <div>
                  <p className="text-sm text-muted-foreground">Application</p>
                  <p className="font-medium">{app}</p>
                </div>
              )}
              {project && (
                <div>
                  <p className="text-sm text-muted-foreground">Project Description</p>
                  <p className="font-medium">{project}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our team will review your inquiry and reach out within 1-2 business days to discuss how we can help
                bring your project to life.
              </p>
              <Link href="/">
                <Button size="lg">Return to Home</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
