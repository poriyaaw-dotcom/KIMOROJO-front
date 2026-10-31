import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClient from './ProductClient';

async function getProduct(id: string) {
  try {
    const res = await fetch(`https://admin.kimorojo.ir/api/products/${id}`, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error('Failed to fetch product:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getSettings() {
  try {
    const res = await fetch(`https://admin.kimorojo.ir/api/settings`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch settings');
    
    const response = await res.json();
    
    // Safely extract settings whether the API wraps it in 'data' or returns it directly
    const settings = response.data || response;
    
    return {
      gold_price: Number(settings.gold_price) || 4500000,
      silver_price: Number(settings.silver_price) || 50000,
      seller_profit: Number(settings.seller_profit) || 0.07,
      tax_rate: Number(settings.tax_rate) || 0.10,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { 
      gold_price: 4500000, 
      silver_price: 50000, 
      seller_profit: 0.07, 
      tax_rate: 0.10 
    };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return { title: 'Product Not Found | KIMOROJO' };
  }

  const title = product.meta_title || `${product.name_en} | KIMOROJO Premium Jewelry`;
  const description = product.meta_description || product.description_en || 'Exquisite handcrafted jewelry for every moment.';
  const imageUrl = product.images?.[0] ? `https://admin.kimorojo.ir/storage/${product.images[0]}` : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }

  let relatedProducts = [];
  if (product?.collection?.slug) {
    try {
      const allRes = await fetch(`https://admin.kimorojo.ir/api/products`, { next: { revalidate: 0 } });
      if (allRes.ok) {
        const allData = await allRes.json();
        relatedProducts = allData.data?.filter((p: any) => 
          p.collection?.slug === product.collection?.slug && p.id !== product.id
        ).slice(0, 4) || [];
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }

  return <ProductClient product={product} settings={settings} relatedProducts={relatedProducts} />;
}