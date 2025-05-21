import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://openocean.org'; // Assuming your site URL is openocean.org

  // Add more static routes here as needed
  const staticRoutes = [
    '/',
    '/map',
    '/data/browse',
    '/about',
    '/research'
    // Add other static paths like '/about', '/contact', etc.
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly', // Or 'daily', 'monthly', 'yearly', 'always', 'never'
    priority: route === '/' ? 1 : 0.8, // Homepage higher priority
  }));

  // If you have dynamic routes (e.g., for individual buoys if they had their own pages):
  // const dynamicBuoyIds = ['buoy-1', 'buoy-2']; // Fetch these dynamically if possible
  // const dynamicUrls = dynamicBuoyIds.map((id) => ({
  //   url: `${baseUrl}/buoys/${id}`,
  //   lastModified: new Date().toISOString(),
  //   changeFrequency: 'monthly' as 'monthly',
  //   priority: 0.6,
  // }));

  return [
    ...staticUrls,
    // ...dynamicUrls, // Uncomment if you have dynamic URLs
  ];
} 