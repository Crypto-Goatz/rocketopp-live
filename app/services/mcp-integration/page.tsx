import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title: "MCP Server Integration — Connect Your Business to 1,600+ Tools",
  description:
    "Plug your business into 0nMCP — the largest interconnected MCP server. 1,640+ tools across 111 services accessible to any AI agent in your stack. Ships in 1 week.",
  keywords: [
    "MCP server integration",
    "Model Context Protocol",
    "0nMCP setup",
    "AI tool orchestration",
    "MCP for business",
    "AI agent tooling",
    "Anthropic MCP",
    "Claude MCP setup",
    "MCP server for SMB",
    "AI integration platform",
    "1500 AI tools",
    "AI orchestrator",
    "agentic AI infrastructure",
    "RocketOpp MCP",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=MCP%20Server%20Integration&eyebrow=Services', width: 1200, height: 630, alt: "MCP Server Integration" }],
    title: "MCP Server Integration | RocketOpp",
    description: "Plug your business into 1,640+ tools across 111 services. Ships in 1 week.",
    url: "https://rocketopp.com/services/mcp-integration",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/mcp-integration" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/mcp-integration', metadataBase)
}

export default function Page() {
  return <ServicePage slug="mcp-integration" />
}
