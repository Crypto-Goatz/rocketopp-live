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

// Testimonials & Reviews
export {
  TestimonialsSection,
  TestimonialStrip,
  AggregateRatingSchema,
  testimonials,
  calculateAggregateRating,
  type Testimonial
} from './testimonials'

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
