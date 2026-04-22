import type { Metadata } from 'next'
import { OrderForm } from './order-form'

export const metadata: Metadata = {
  title: 'Order your HIPAA readiness report | RocketOpp',
  description: 'Get the full 51-point HIPAA readiness report with prioritised remediation plan — delivered to your inbox within 60 minutes.',
}

interface Props { searchParams: Promise<{ aid?: string; email?: string; company?: string }> }

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams
  return (
    <main className="min-h-screen relative pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <OrderForm
          assessmentId={sp.aid || ''}
          defaultEmail={sp.email || ''}
          defaultCompany={sp.company || ''}
        />
      </div>
    </main>
  )
}
