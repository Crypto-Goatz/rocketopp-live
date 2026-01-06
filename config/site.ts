// Site configuration
export const siteConfig = {
  name: "RocketOpp",
  description: "AI-Powered Apps for Business - Next-Generation Website Design & AI Integration Services",
  url: "https://rocketopp.com",
  ogImage: "https://rocketopp.com/og.jpg",
  links: {
    github: "https://github.com/rocketopp",
    twitter: "https://twitter.com/rocketopp",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "AI for Business",
      href: "/ai-for-business",
    },
    {
      title: "Automation",
      href: "/services/automation",
    },
    {
      title: "CRO",
      href: "/services/website-development/conversion-optimization",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
}

export type SiteConfig = typeof siteConfig
