import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-serif text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-serif text-gray-900 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors">
        Return Home
      </Link>
    </div>
  );
}