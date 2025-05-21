import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Example: if you had private pages
    },
    sitemap: 'https://openocean.org/sitemap.xml', // Assuming your site URL is openocean.org
  }
} 