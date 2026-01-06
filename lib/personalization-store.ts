import { create } from "zustand"

// Updated and alphabetized list of industries
export type Industry =
  | "automotive-services" // New
  | "construction"
  | "day-spa" // New
  | "e-commerce"
  | "family-lawyers"
  | "financial-services"
  | "franchise-businesses"
  | "general-contractors"
  | "general-practitioners"
  | "healthcare"
  | "home-services"
  | "insurance-companies"
  | "lawncare-services"
  | "manufacturing"
  | "professional-painting"
  | "real-estate"
  | "retail-shop" // New
  | "social-influencers"
  | "telemedicine-services"
  | "trucking-logistics"
  | null // Keep null for unselected state

export type PrimaryNeed =
  | "website-help"
  | "online-marketing"
  | "automating-tasks"
  | "customer-management"
  | "leads-sales"
  | "app-development"
  | "ai-integration"
  | null

interface PersonalizationState {
  industry: Industry
  userName: string | null
  companyName: string | null
  zipCode: string | null
  primaryNeed: PrimaryNeed
  hasWebsite: "yes" | "no" | null
  websiteAddress: string | null
  userTitle: string | null
  userEmail: string | null
  userPhone: string | null
  aiAssessmentReady: boolean
  hasSeenAiExplanation: boolean

  setIndustry: (industry: Industry) => void
  setUserName: (name: string | null) => void
  setCompanyName: (name: string | null) => void
  setZipCode: (zip: string | null) => void
  setPrimaryNeed: (need: PrimaryNeed) => void
  setHasWebsite: (has: "yes" | "no" | null) => void
  setWebsiteAddress: (address: string | null) => void
  setUserTitle: (title: string | null) => void
  setUserEmail: (email: string | null) => void
  setUserPhone: (phone: string | null) => void
  setAiAssessmentReady: (status: boolean) => void
  setHasSeenAiExplanation: (status: boolean) => void

  isPersonalized: () => boolean
  getPersonalizedGreeting: () => string
  getIndustryDisplayName: (industry: Industry | null) => string
  getPrimaryNeedDisplayName: (need: PrimaryNeed | null) => string
  getAssessmentData: () => Omit<
    PersonalizationState,
    | "setIndustry"
    | "setUserName"
    | "setCompanyName"
    | "setZipCode"
    | "setPrimaryNeed"
    | "setHasWebsite"
    | "setWebsiteAddress"
    | "setUserTitle"
    | "setUserEmail"
    | "setUserPhone"
    | "setAiAssessmentReady"
    | "setHasSeenAiExplanation"
    | "isPersonalized"
    | "getPersonalizedGreeting"
    | "getIndustryDisplayName"
    | "getPrimaryNeedDisplayName"
    | "getAssessmentData"
  >
}

export const usePersonalizationStore = create<PersonalizationState>((set, get) => ({
  industry: null,
  userName: null,
  companyName: null,
  zipCode: null,
  primaryNeed: null,
  hasWebsite: null,
  websiteAddress: null,
  userTitle: null,
  userEmail: null,
  userPhone: null,
  aiAssessmentReady: false,
  hasSeenAiExplanation: false,

  setIndustry: (industry) => set({ industry, aiAssessmentReady: false }),
  setUserName: (userName) => set({ userName, aiAssessmentReady: false }),
  setCompanyName: (companyName) => set({ companyName, aiAssessmentReady: false }),
  setZipCode: (zipCode) => set({ zipCode, aiAssessmentReady: false }),
  setPrimaryNeed: (primaryNeed) => set({ primaryNeed, aiAssessmentReady: false }),
  setHasWebsite: (hasWebsite) => {
    set({ hasWebsite, aiAssessmentReady: false })
    if (hasWebsite === "no") {
      set({ websiteAddress: null })
    }
  },
  setWebsiteAddress: (websiteAddress) => set({ websiteAddress, aiAssessmentReady: false }),
  setUserTitle: (userTitle) => set({ userTitle, aiAssessmentReady: false }),
  setUserEmail: (userEmail) => set({ userEmail, aiAssessmentReady: false }),
  setUserPhone: (userPhone) => set({ userPhone, aiAssessmentReady: false }),
  setAiAssessmentReady: (aiAssessmentReady) => set({ aiAssessmentReady }),
  setHasSeenAiExplanation: (status) => set({ hasSeenAiExplanation: status }),

  isPersonalized: () => {
    return !!(get().industry || get().userName || get().companyName)
  },
  getPersonalizedGreeting: () => {
    const { userName, companyName, industry } = get()
    const industryDisplayName = get().getIndustryDisplayName(industry)

    if (userName && companyName && industry) {
      return `Hello ${userName} from ${companyName}! Let's boost your ${industryDisplayName} business with RocketOpp.`
    }
    if (userName && industry) {
      return `Hello ${userName}! Let's explore RocketOpp solutions for the ${industryDisplayName} sector.`
    }
    if (userName) {
      return `Hello ${userName}!`
    }
    if (companyName && industry) {
      return `For ${companyName} in the ${industryDisplayName} field, RocketOpp offers:`
    }
    if (industry) {
      return `For the ${industryDisplayName} industry, RocketOpp provides:`
    }
    return "Welcome to RocketOpp!"
  },
  getIndustryDisplayName: (industry: Industry | null): string => {
    if (!industry) return "Your Industry" // If null, return placeholder
    return industry
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  },
  getPrimaryNeedDisplayName: (need: PrimaryNeed | null): string => {
    if (!need) return "Your Primary Need"
    const { companyName } = get()
    switch (need) {
      case "website-help":
        return companyName ? `The ${companyName}'s Website` : "My Company's Website"
      case "online-marketing":
        return "Online Marketing"
      case "automating-tasks":
        return "Automating Tasks"
      case "customer-management":
        return "Customer Management"
      case "leads-sales":
        return "Leads & Sales"
      case "app-development":
        return "App Development"
      case "ai-integration":
        return companyName ? `Integrating AI into ${companyName}` : "Integrating AI into My Company"
      default:
        return "Specific Area of Focus"
    }
  },
  getAssessmentData: () => {
    const {
      industry,
      userName,
      companyName,
      zipCode,
      primaryNeed,
      hasWebsite,
      websiteAddress,
      userTitle,
      userEmail,
      userPhone,
      hasSeenAiExplanation,
    } = get()
    return {
      industry,
      userName,
      companyName,
      zipCode,
      primaryNeed,
      hasWebsite,
      websiteAddress,
      userTitle,
      userEmail,
      userPhone,
      aiAssessmentReady: false,
      hasSeenAiExplanation,
    }
  },
}))

// Helper for populating Select components alphabetically
export const industryOptionsForSelect = [
  { value: "automotive-services", label: "Automotive Services" }, // New
  { value: "construction", label: "Construction" },
  { value: "day-spa", label: "Day Spa" }, // New
  { value: "e-commerce", label: "eCommerce Websites" },
  { value: "family-lawyers", label: "Family Lawyers" },
  { value: "financial-services", label: "Financial Services" },
  { value: "franchise-businesses", label: "Franchise Businesses" },
  { value: "general-contractors", label: "General Contractors" },
  { value: "general-practitioners", label: "General Practitioners" },
  { value: "healthcare", label: "Healthcare (General)" },
  { value: "home-services", label: "Home Services" },
  { value: "insurance-companies", label: "Insurance Companies" },
  { value: "lawncare-services", label: "Lawncare Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "professional-painting", label: "Professional Painting" },
  { value: "real-estate", label: "Real Estate" },
  { value: "retail-shop", label: "Retail Shop" }, // New
  { value: "social-influencers", label: "Social Influencers" },
  { value: "telemedicine-services", label: "Telemedicine Services" },
  { value: "trucking-logistics", label: "Trucking & Logistics" },
].sort((a, b) => a.label.localeCompare(b.label)) // Ensure it's sorted

export const primaryNeedOptionsForSelect = (companyName: string | null) => [
  { value: "website-help", label: companyName ? `The ${companyName}'s Website` : "My Company's Website" },
  { value: "online-marketing", label: "Online Marketing" },
  { value: "automating-tasks", label: "Automating Tasks" },
  { value: "customer-management", label: "Customer Management" },
  { value: "leads-sales", label: "Leads & Sales" },
  { value: "app-development", label: "App Development" },
  {
    value: "ai-integration",
    label: companyName ? `Integrating AI into ${companyName}` : "Integrating AI into My Company",
  },
]
