import type { Metadata } from 'next'
import { HealthCheckWizard } from './wizard'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Free Stack Health Audit | RocketOpp',
  description:
    'Run the CRO9 Stack Health Audit on your live website. Deep infrastructure, TLS, headers, framework, and security-path checks. Letter grade + remediation roadmap emailed in minutes.',
  openGraph: {
    title: 'Free Stack Health Audit | RocketOpp',
    description: 'Deep website audit. Infrastructure, TLS, headers, frameworks, exposed paths. Letter grade in minutes.',
    url: 'https://rocketopp.com/health-check',
  },
}

export default function HealthCheckPage() {
  return (
    <>
      <main className="min-h-screen">
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute inset-0 grid-gradient" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                CRO9 Stack Health Audit · Free
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Grade your stack in{' '}
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                  under 10 minutes
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                We check the same 50+ external signals a security auditor would —
                infrastructure sprawl, TLS validity, missing security headers,
                framework EOL, leaked dev artifacts, stale assets. You get a letter
                grade, detailed findings, and a prioritized fix list by email.
              </p>
            </div>

            <HealthCheckWizard />

            <div className="max-w-3xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { t: 'Infrastructure map', d: 'Subdomain sweep + CT logs + DNS. Where everything actually lives.' },
                { t: 'TLS + header audit', d: 'Cert validity, cipher posture, HSTS/CSP/X-Frame + cookie flags.' },
                { t: 'Stack fingerprint', d: 'Framework, runtime, frontend, CDN — and whether any is EOL.' },
                { t: 'Attack surface', d: '50+ sensitive paths — .env, .git, phpinfo, debug tools, backups.' },
                { t: 'Asset freshness', d: 'Last-modified headers reveal the real maintenance pulse.' },
                { t: 'Remediation plan', d: 'Every finding ranked. Every fix given an effort estimate.' },
              ].map((f) => (
                <div key={f.t} className="card-lifted-sm p-5">
                  <div className="font-semibold mb-1">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
