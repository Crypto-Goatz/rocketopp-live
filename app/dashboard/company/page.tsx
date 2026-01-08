import type { Metadata } from "next"
import { CompanyForm } from "./CompanyForm"

export const metadata: Metadata = {
  title: "Company Profile | RocketOpp",
  description: "Manage your company profile",
}

export default function CompanyProfilePage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Company Profile
        </h1>
        <p className="text-white/50">
          Tell us about your business so we can personalize your experience
        </p>
      </div>

      <CompanyForm />
    </div>
  )
}
