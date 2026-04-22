import type { Metadata } from 'next'
import { ReportView } from './report-view'

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
    </main>
  )
}
