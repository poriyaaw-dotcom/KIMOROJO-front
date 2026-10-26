import { Metadata } from 'next';
import ShopClient from './ShopClient';

async function getCategories() {
  const res = await fetch('http://127.0.0.1:8000/api/categories', { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getProducts() {
  const res = await fetch('http://127.0.0.1:8000/api/products', { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

// --- DYNAMIC SEO METADATA FOR CATEGORIES ---
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories();
  const currentCategory = categories.find((c: any) => c.slug === slug);

  if (!currentCategory || slug === 'all') {
    return { title: 'Shop Premium Jewelry | KIMOROJO' };
  }

  const title = currentCategory.meta_title || `${currentCategory.name_en} | KIMOROJO Premium Jewelry`;
  const description = currentCategory.meta_description || `Explore our exquisite collection of ${currentCategory.name_en.toLowerCase()}. Handcrafted gold and silver jewelry.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <ShopClient 
      initialProducts={products} 
      initialCategories={categories} 
      initialCategorySlug={slug} 
    />
  );
}