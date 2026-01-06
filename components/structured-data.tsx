export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite", // Changed from SoftwareApplication
    name: "Rocket Opp",
    url: "https://rocket-opp.com", // Replace with your actual domain
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rocket-opp.com/search?q={search_term_string}", // Adjust if you have site search
      "query-input": "required name=search_term_string",
    },
    description:
      "Rocket Opp offers innovative web design, digital marketing, AI integration, and custom app development services to elevate your business.",
    // You can add more specific types like "ProfessionalService" or "Organization" if it fits better
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
