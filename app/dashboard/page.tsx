import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CreditCard, FileText, MessageSquare } from "lucide-react"
import { getSession } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

// The two surfaces that actually exist. The rest of the dashboard was removed
// as unused; /dashboard is the post-login redirect target, so it needs to land
// somewhere real rather than 404.
const SURFACES = [
  {
    name: "My HIPAA Reports",
    href: "/dashboard/hipaa",
    Icon: FileText,
    body: "Open, download, or book against your generated HIPAA readiness reports.",
  },
  {
    name: "Affiliate",
    href: "/dashboard/affiliate",
    Icon: CreditCard,
    body: "Your referral link, signups attributed to you, and payouts.",
  },
]

export default async function DashboardPage() {
  const user = await getSession()
  const firstName = user?.name?.split(" ")[0]

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Everything available on your account right now.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SURFACES.map(({ name, href, Icon, body }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-primary/40 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-primary">
                {name}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                {body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-white">
              Looking for something else?
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            If you are expecting a project, report, or service that is not
            listed here, get in touch and we will point you at it directly.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Contact us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
