import { getSession } from "@/lib/auth/session"
import { ProfileForm } from "./ProfileForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Profile | RocketOpp",
  description: "Manage your personal profile",
}

export default async function UserProfilePage() {
  const user = await getSession()
  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Profile
        </h1>
        <p className="text-white/50">
          Manage your personal information and preferences
        </p>
      </div>

      <ProfileForm user={{ email: user.email, name: user.name }} />
    </div>
  )
}
