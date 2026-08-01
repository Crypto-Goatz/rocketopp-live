import type { Metadata } from "next"
import AutomationClientPage from "./AutomationClientPage"

export const metadata: Metadata = {
  title: "AI-Powered Automation Services | Workflow Optimization",
  description:
    "Transform your business with intelligent automation. 23 years of experience scaling businesses through AI-powered workflows with human operators. Automated processes that actually work.",
  keywords:
    "business automation, workflow automation, AI automation, process automation, business process automation, automated workflows, RPA, intelligent automation, workflow optimization",
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=AI-Powered%20Automation%20Services%20%7C%20Intelligent%20Workflow%20Solutions&eyebrow=Services', width: 1200, height: 630, alt: "AI-Powered Automation Services | Intelligent Workflow Solutions" }],
    title: "AI-Powered Automation Services | Intelligent Workflow Solutions",
    description:
      "Transform your business operations with AI-powered automation. Proven strategies from 23 years of scaling businesses through automated workflows.",
    type: "website",
  },
}

export default function AutomationPage() {
  return <AutomationClientPage />
}
