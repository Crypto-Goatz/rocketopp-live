import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | RocketOpp",
  description:
    "The terms and conditions governing your use of RocketOpp's website, products, and services.",
}

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow pt-8">
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
            </div>

            <div className="prose prose-blue max-w-none dark:prose-invert">
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
                websites, applications, products, and services (collectively, the
                &ldquo;Services&rdquo;) provided by RocketOpp LLC (&ldquo;RocketOpp,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the
                Services, you agree to be bound by these Terms. If you do not agree, do not use the
                Services.
              </p>

              <h2>1. Eligibility &amp; Accounts</h2>
              <p>
                You must be at least 18 years old and able to form a binding contract to use the
                Services. When you create an account, you agree to provide accurate information and
                to keep it current. You are responsible for safeguarding your account credentials and
                for all activity that occurs under your account. Notify us immediately at{" "}
                <a href="mailto:mike@rocketopp.com">mike@rocketopp.com</a> if you suspect any
                unauthorized use.
              </p>

              <h2>2. Use of the Services</h2>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the
                Services in accordance with these Terms. You agree not to:
              </p>
              <ul>
                <li>use the Services for any unlawful, harmful, or fraudulent purpose;</li>
                <li>
                  attempt to gain unauthorized access to any system, account, or data, or interfere
                  with the integrity or performance of the Services;
                </li>
                <li>
                  reverse engineer, decompile, or attempt to extract source code from the Services
                  except where permitted by law;
                </li>
                <li>
                  resell, sublicense, or otherwise commercially exploit the Services without our prior
                  written consent;
                </li>
                <li>
                  upload or transmit malware, or use the Services to send unsolicited or unauthorized
                  communications.
                </li>
              </ul>

              <h2>3. Subscriptions, Fees &amp; Billing</h2>
              <p>
                Certain Services are offered on a paid, subscription, or lease-to-own basis. By
                purchasing a paid plan, you authorize us and our payment processor (Stripe) to charge
                the applicable fees, including recurring charges, to your payment method. Unless
                otherwise stated, fees are non-refundable. We may change pricing prospectively; any
                changes will not affect the current billing period. You are responsible for all
                applicable taxes.
              </p>

              <h2>4. Cancellation</h2>
              <p>
                You may cancel a subscription at any time through your account settings or by
                contacting us. Cancellation takes effect at the end of the current billing period,
                and you will retain access until then. We may suspend or terminate your access for
                violation of these Terms or for non-payment.
              </p>

              <h2>5. AI-Generated Output</h2>
              <p>
                The Services may use artificial intelligence to generate text, recommendations, and
                other output. AI output may contain errors or inaccuracies and is provided for your
                convenience. You are responsible for reviewing and verifying any output before relying
                on it, and you assume all risk arising from its use.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The Services, including all software, content, trademarks, and branding, are owned by
                RocketOpp LLC or its licensors and are protected by intellectual property laws. These
                Terms do not transfer any ownership rights to you. You retain ownership of content you
                submit, but you grant us a worldwide, royalty-free license to host, process, and
                display that content solely as necessary to provide the Services.
              </p>

              <h2>7. Third-Party Services</h2>
              <p>
                The Services may integrate with or link to third-party products and services (such as
                payment processors, analytics providers, AI providers, and CRM platforms). We are not
                responsible for the content, policies, or practices of any third party. Your use of
                third-party services is governed by their respective terms.
              </p>

              <h2>8. Disclaimer of Warranties</h2>
              <p>
                The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                warranties of any kind, whether express or implied, including warranties of
                merchantability, fitness for a particular purpose, and non-infringement. We do not
                warrant that the Services will be uninterrupted, error-free, or secure.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, RocketOpp LLC and its affiliates will not be
                liable for any indirect, incidental, special, consequential, or punitive damages, or
                any loss of profits, revenue, data, or goodwill, arising out of or related to your use
                of the Services. Our total liability for any claim relating to the Services will not
                exceed the amount you paid us in the twelve (12) months preceding the claim.
              </p>

              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless RocketOpp LLC and its officers, employees, and
                affiliates from any claims, damages, liabilities, and expenses (including reasonable
                attorneys&rsquo; fees) arising out of your use of the Services or your violation of
                these Terms.
              </p>

              <h2>11. Termination</h2>
              <p>
                We may suspend or terminate your access to the Services at any time, with or without
                cause or notice. Upon termination, your right to use the Services will immediately
                cease. Sections that by their nature should survive termination will continue to apply.
              </p>

              <h2>12. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. When we do, we will revise the
                &ldquo;Last updated&rdquo; date above. Your continued use of the Services after changes
                take effect constitutes acceptance of the revised Terms.
              </p>

              <h2>13. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the United States and the state in which
                RocketOpp LLC is organized, without regard to conflict-of-law principles. Any disputes
                will be resolved in the courts located in that jurisdiction.
              </p>

              <h2>14. Contact</h2>
              <p>
                Questions about these Terms? Contact us at{" "}
                <a href="mailto:mike@rocketopp.com">mike@rocketopp.com</a> or visit{" "}
                <Link href="/contact">our contact page</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
