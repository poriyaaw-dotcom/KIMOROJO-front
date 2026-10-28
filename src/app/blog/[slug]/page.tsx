"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://https://api.kimorojo.com/api/blogs/${params.slug}`);
        const data = await res.json();
        if (data.data) {
          setBlog(data.data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p>{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-serif text-gray-900 mb-4">404</h1>
        <p className="text-gray-500 mb-8">{isFarsi ? 'مقاله یافت نشد.' : 'Article not found.'}</p>
        <Link href="/blog" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
          {isFarsi ? 'بازگشت به مجله' : 'Back to Journal'}
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <Link href="/blog" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
        {isFarsi ? '→ بازگشت به مجله' : '← Back to Journal'}
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">{blog.title}</h1>
      
      {blog.image && (
        <img src={`http://https://api.kimorojo.com/storage/${blog.image}`} alt={blog.title} className="w-full aspect-video object-cover rounded-sm mb-8" />
      )}
      
      <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}