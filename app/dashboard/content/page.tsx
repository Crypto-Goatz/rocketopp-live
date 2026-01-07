import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { WorkspaceLayout } from '@/components/dashboard/workspace-layout'
import { ContentPipelineManager } from './content-manager'

export const metadata = {
  title: 'Content Pipeline | RocketOpp',
  description: 'Manage automated content generation',
}

export default async function ContentPipelinePage() {
  const user = await getSession()

  if (!user) {
    redirect('/login?redirect=/dashboard/content')
  }

  // Only admins can access
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    redirect('/dashboard')
  }

  return (
    <WorkspaceLayout user={user}>
      <ContentPipelineManager />
    </WorkspaceLayout>
  )
}
