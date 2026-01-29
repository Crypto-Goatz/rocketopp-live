// ============================================================
// Breadcrumbs Component with Schema
// ============================================================
// Visual breadcrumb navigation + BreadcrumbList JSON-LD schema
// For SXO optimization on service and product pages
// ============================================================

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showSchema?: boolean
  showHomeIcon?: boolean
  className?: string
}

// BreadcrumbList JSON-LD Schema Component
export function BreadcrumbListSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://rocketopp.com${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Visual Breadcrumbs Component
export function Breadcrumbs({
  items,
  showSchema = true,
  showHomeIcon = true,
  className = ''
}: BreadcrumbsProps) {
  return (
    <>
      {showSchema && <BreadcrumbListSchema items={items} />}

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1 text-sm ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <div key={item.url} className="flex items-center gap-1">
              {/* Separator (not for first item) */}
              {!isFirst && (
                <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              )}

              {/* Breadcrumb Item */}
              {isLast ? (
                // Current page (not a link)
                <span className="text-zinc-300 font-medium truncate max-w-[200px]">
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center gap-1.5">
                      <Home className="w-4 h-4" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                // Link to parent page
                <Link
                  href={item.url}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors truncate max-w-[200px]"
                >
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center gap-1.5">
                      <Home className="w-4 h-4" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}

// Predefined breadcrumb paths for common pages
export const breadcrumbPaths = {
  // Services
  services: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' }
  ],

  // Individual Services
  websiteDesign: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Website Design', url: '/services/website-design' }
  ],
  aiIntegration: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'AI Integration', url: '/services/ai-integration' }
  ],
  aiCrm: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'AI CRM', url: '/services/ai-crm' }
  ],
  automation: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Automation', url: '/services/automation' }
  ],
  appDevelopment: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'App Development', url: '/services/app-development' }
  ],
  webMarketing: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Web Marketing', url: '/services/web-marketing' }
  ],
  seoServices: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Web Marketing', url: '/services/web-marketing' },
    { name: 'SEO Services', url: '/services/website-development/seo-services' }
  ],
  conversionOptimization: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Website Development', url: '/services/website-development' },
    { name: 'Conversion Optimization', url: '/services/website-development/conversion-optimization' }
  ],

  // Other pages
  about: [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ],
  contact: [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ],
  blog: [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ],
  marketplace: [
    { name: 'Home', url: '/' },
    { name: 'Marketplace', url: '/marketplace' }
  ],
  assessment: [
    { name: 'Home', url: '/' },
    { name: 'AI Assessment', url: '/ai-assessment' }
  ]
}

// Helper function to create custom breadcrumb paths
export function createBreadcrumbs(
  basePath: keyof typeof breadcrumbPaths,
  additional?: BreadcrumbItem[]
): BreadcrumbItem[] {
  const base = breadcrumbPaths[basePath] || breadcrumbPaths.services
  return additional ? [...base, ...additional] : base
}

// Compact breadcrumbs variant (for mobile or tight spaces)
export function BreadcrumbsCompact({
  items,
  showSchema = true,
  className = ''
}: BreadcrumbsProps) {
  // Show only first and last item with ellipsis in between
  const displayItems = items.length > 2
    ? [items[0], { name: '...', url: '' }, items[items.length - 1]]
    : items

  return (
    <>
      {showSchema && <BreadcrumbListSchema items={items} />}

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1 text-sm ${className}`}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.name === '...'

          return (
            <div key={`${item.url}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-zinc-600 flex-shrink-0" />
              )}

              {isEllipsis ? (
                <span className="text-zinc-600">...</span>
              ) : isLast ? (
                <span className="text-zinc-300 font-medium truncate max-w-[120px]">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors truncate max-w-[100px]"
                >
                  {index === 0 ? <Home className="w-3.5 h-3.5" /> : item.name}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
