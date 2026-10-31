import { Metadata } from 'next';
import Link from 'next/link';
import CollectionClient from './CollectionClient';

async function getCollections() {
  const res = await fetch('https://admin.kimorojo.ir/api/collections', { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getProducts() {
  const res = await fetch('https://admin.kimorojo.ir/api/products', { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collections = await getCollections();
  const currentCollection = collections.find((c: any) => c.slug === slug);

  if (!currentCollection) {
    return { title: 'Collection Not Found | KIMOROJO' };
  }

  const title = currentCollection.meta_title || `${currentCollection.name_en} Collection | KIMOROJO Premium Jewelry`;
  const description = currentCollection.meta_description || `Explore our exquisite ${currentCollection.name_en.toLowerCase()} collection. Handcrafted gold and silver jewelry.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collections = await getCollections();
  const allProducts = await getProducts();
  
  const currentCollection = collections.find((c: any) => c.slug === slug);
  const collectionProducts = currentCollection 
    ? allProducts.filter((p: any) => p.collection?.slug === slug)
    : [];

  if (!currentCollection) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-4">404</h1>
        <p className="text-gray-500">Collection not found.</p>
        <Link href="/" className="mt-8 inline-block bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return <CollectionClient initialProducts={collectionProducts} collection={currentCollection} />;
}