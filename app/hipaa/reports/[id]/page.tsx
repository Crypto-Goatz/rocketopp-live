import type { Metadata } from 'next'
import { ReportView } from './report-view'
import { HipaaChatWidget } from '@/components/hipaa-chat-widget'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HIPAA Readiness Report | RocketOpp',
  description: 'Your personalised HIPAA compliance report — delivered by the 0nCore AI engine.',
}

interface Props { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { t } = await searchParams
  return (
    <main className="min-h-screen bg-background">
      <ReportView orderId={id} token={t || ''} />
      <HipaaChatWidget
        greeting="Ask me anything about your report. I can expand on a specific finding, cite the rule section, or help you decide what to fix first."
        suggestions={[
          'Explain my highest-severity finding',
          'How does the 2026 NPRM affect me?',
          'What evidence do I need for OCR?',
          'How do I implement MFA properly?',
        ]}
      />
    </main>
  )
}
