import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { WorkspaceLayout } from "@/components/dashboard/workspace-layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <WorkspaceLayout user={user}>
      {children}
    </WorkspaceLayout>
  )
}
