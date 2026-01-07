import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { WorkspaceLayout } from '@/components/dashboard/workspace-layout'
import { FeedbackPageContent } from './content'

export const metadata = {
  title: 'Feedback | RocketOpp',
  description: 'Share your ideas and vote on features',
}

export default async function FeedbackPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login?redirect=/dashboard/feedback')
  }

  return (
    <WorkspaceLayout user={user}>
      <FeedbackPageContent />
    </WorkspaceLayout>
  )
}
