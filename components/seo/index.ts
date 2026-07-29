// ============================================================
// SEO Components - Centralized Exports
// ============================================================
// SXO-optimized components for search, user experience, and conversions
// ============================================================

// JSON-LD Schema Components
export {
  OrganizationSchema,
  WebsiteSchema,
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  FAQSchema,
  ProductSchema,
  ServiceSchema,
  VideoSchema,
  HowToSchema,
  LocalBusinessSchema
} from './json-ld'

// Breadcrumb Navigation
export {
  Breadcrumbs,
  BreadcrumbsCompact,
  BreadcrumbListSchema,
  breadcrumbPaths,
  createBreadcrumbs,
  type BreadcrumbItem
} from './breadcrumbs'

// Testimonials & Reviews — intentionally absent.
// The previous testimonials module shipped placeholder quotes attributed to
// invented people and emitted Review/AggregateRating JSON-LD for them. That
// violates Google's review-snippet policy and destroys the site's credibility
// with AI search engines, which weight verifiable sources. Reintroduce only
// with real, attributable client reviews.

// Social Sharing
export {
  SocialShare,
  ShareSection,
  FloatingShareBar,
  NativeShareButton
} from './social-share'

// Video Embeds
export {
  VideoEmbed,
  LazyVideoEmbed,
  VideoGallery
} from './video-embed'
