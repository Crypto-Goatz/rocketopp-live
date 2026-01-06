import type { Metadata } from "next"
import AutomationClientPage from "./AutomationClientPage"

export const metadata: Metadata = {
  title: "AI-Powered Automation Services | Workflow Optimization | RocketOpp",
  description:
    "Transform your business with intelligent automation. 25 years of experience scaling businesses through AI-powered workflows with human operators. Automated processes that actually work.",
  keywords:
    "business automation, workflow automation, AI automation, process automation, business process automation, automated workflows, RPA, intelligent automation, workflow optimization",
  openGraph: {
    title: "AI-Powered Automation Services | Intelligent Workflow Solutions",
    description:
      "Transform your business operations with AI-powered automation. Proven strategies from 25 years of scaling businesses through automated workflows.",
    type: "website",
  },
}

export default function AutomationPage() {
  return <AutomationClientPage />
}
