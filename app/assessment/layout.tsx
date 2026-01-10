import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AI Business Assessment | RocketOpp',
  description: 'Get a comprehensive AI-powered analysis of your business in minutes. Discover opportunities, identify weaknesses, and receive a custom strategic blueprint.',
  openGraph: {
    title: 'Free AI Business Assessment | RocketOpp',
    description: 'Get a comprehensive AI-powered analysis of your business in minutes.',
    type: 'website',
  },
}

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {children}
    </div>
  )
}
