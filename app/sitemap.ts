import type { MetadataRoute } from "next"
import { supabaseAdmin } from "@/lib/db/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rocketopp.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic marketplace product pages
  let productPages: MetadataRoute.Sitemap = []

  try {
    const { data: products } = await supabaseAdmin
      .from("marketplace_products")
      .select("slug, updated_at, status")
      .in("status", ["active", "coming_soon"])

    if (products) {
      productPages = products.map((product) => ({
        url: `${baseUrl}/marketplace/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly" as const,
        priority: product.status === "active" ? 0.9 : 0.7,
      }))
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = []

  try {
    const { data: categories } = await supabaseAdmin
      .from("marketplace_categories")
      .select("slug")

    if (categories) {
      categoryPages = categories.map((cat) => ({
        url: `${baseUrl}/marketplace?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error)
  }

  return [...staticPages, ...productPages, ...categoryPages]
}
