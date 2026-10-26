import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/account', '/cart', '/checkout'],
      },
    ],
    sitemap: 'http://localhost:3000/sitemap.xml', // Change to your real domain later
  };
}