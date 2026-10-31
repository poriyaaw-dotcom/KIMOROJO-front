"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  meta_description: string | null;
  content: string;
  image: string | null;
}

export default function BlogPage() {
  const { lang, t } = useLang();
  const isFarsi = lang === 'fa';
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('https://admin.kimorojo.ir/api/blogs');
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p>{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
          {isFarsi ? 'مجله و مقالات' : 'Journal & Insights'}
        </h1>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          {isFarsi ? 'هنوز مقاله‌ای منتشر نشده است.' : 'No articles published yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
              {blog.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={`https://admin.kimorojo.ir/storage/${blog.image}`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-[#682535] transition-colors">{blog.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.meta_description || blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}