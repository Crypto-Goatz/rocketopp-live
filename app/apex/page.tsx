import type { Metadata } from 'next'
import { ApexClient } from './ApexClient'

export const metadata: Metadata = {
  title: 'APEX AI Business Assessment — Free | RocketOpp',
  description: 'A 5-minute conversational business assessment. The APEX AI analyzes your website, surfaces competitive threats, and ships a strategic blueprint to your inbox. Free.',
  alternates: { canonical: 'https://rocketopp.com/apex' },
  openGraph: {
    title: 'APEX AI Business Assessment — Free',
    description: 'Conversational AI assessment. Strategic blueprint in 5 minutes.',
    url: 'https://rocketopp.com/apex',
    type: 'website',
    images: [{ url: 'https://rocketopp.com/images/rocketopp-og.png', width: 1200, height: 630, alt: 'APEX Assessment' }],
  },
  twitter: { card: 'summary_large_image', title: 'APEX AI Business Assessment', description: 'Free 5-minute assessment. Strategic blueprint emailed.' },
}

export default function Page() {
  return <ApexClient />
}
