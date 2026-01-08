import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getAdminUser } from "@/lib/auth/admin"
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

  // Fetch user's company profile for logo display
  const adminUser = await getAdminUser()
  const companyProfile = adminUser ? {
    name: adminUser.company_name || undefined,
    logo: adminUser.company_logo || undefined,
  } : null

  return (
    <WorkspaceLayout user={user} companyProfile={companyProfile}>
      {children}
    </WorkspaceLayout>
  )
}
