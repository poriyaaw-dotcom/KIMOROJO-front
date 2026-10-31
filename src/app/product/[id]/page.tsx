import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClient from './ProductClient';

async function getProduct(id: string) {
  try {
    const url = `https://admin.kimorojo.ir/api/products/${id}`;
    console.log('🔍 Fetching product from:', url);
    
    const res = await fetch(url, { 
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    
    console.log('📡 Product API response status:', res.status);
    
    if (!res.ok) {
      console.error('❌ Failed to fetch product:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    console.log('✅ Product API data received:', data);
    
    // Safely extract the product whether it's in data.data or just data
    return data?.data || data || null;
  } catch (error) {
    console.error('💥 Error fetching product:', error);
    return null;
  }
}

async function getSettings() {
  try {
    const res = await fetch(`https://admin.kimorojo.ir/api/settings`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch settings');
    
    const response = await res.json();
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
  
  let mainImage = null;
  if (product.images) {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        mainImage = `https://admin.kimorojo.ir/storage/${parsed[0]}`;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  return {
    title,
    description,
    openGraph: { title, description, images: mainImage ? [{ url: mainImage }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: mainImage ? [mainImage] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('🚀 Rendering ProductPage for ID:', id);
  
  const product = await getProduct(id);
  const settings = await getSettings();

  if (!product) {
    console.log('⚠️ Product not found, triggering 404');
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