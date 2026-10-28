import { MetadataRoute } from 'next';

const BASE_URL = 'http://localhost:3000'; // Change to your real domain later

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`http://https://api.kimorojo.com/api/${endpoint}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, collections, blogs, products] = await Promise.all([
    fetchData('categories'),
    fetchData('collections'),
    fetchData('blogs'),
    fetchData('products'),
  ]);

  return [
    // Homepage
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Static Pages
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Dynamic Categories
    ...categories.map((cat: any) => ({
      url: `${BASE_URL}/shop/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Dynamic Collections
    ...collections.map((col: any) => ({
      url: `${BASE_URL}/collections/${col.slug}`,
      lastModified: new Date(col.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Dynamic Blogs
    ...blogs.map((blog: any) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Dynamic Products
    ...products.map((product: any) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}