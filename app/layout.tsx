'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Users, Package } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation */}
          <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Malik Kiryana Store
                </Link>
                <div className="flex space-x-6">
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/users' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    href="/daily-records"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/daily-records'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}
                  >
                    Daily Records
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Home Page */}
          {isHomePage ? (
            <div className="max-w-7xl mx-auto px-6 py-12">
              {/* Hero */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-600 p-4 rounded-full">
                    <Store className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Malik Kiryana
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your trusted neighborhood store for all daily needs. Quality
                  products, unbeatable prices, and exceptional service.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex justify-center gap-6 mb-12">
                <Link href="/users">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Manage Users
                  </button>
                </Link>
                <Link href="/daily-records">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                    <Package className="h-5 w-5" /> Daily Records
                  </button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Easy Shopping',
                    desc: 'Quick and convenient shopping experience',
                  },
                  {
                    title: 'Fast Delivery',
                    desc: 'Quick delivery to your doorstep',
                  },
                  {
                    title: 'Best Prices',
                    desc: 'Competitive pricing for all items',
                  },
                  {
                    title: 'Premium Products',
                    desc: 'Carefully selected items for you',
                  },
                  {
                    title: 'Customer Support',
                    desc: 'Friendly staff always ready to help',
                  },
                  {
                    title: 'Fresh Stock',
                    desc: 'Daily deliveries of fresh products',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white shadow rounded-lg p-6 text-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
          )}
        </div>
      </body>
    </html>
  );
}
