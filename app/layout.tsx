"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 👈 router import
import { Store, Users, Package, Calculator } from 'lucide-react';
import AuthWrapper from "./../components/AuthWrapper";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("expiryTime");

    if (token && expiry && new Date().getTime() < parseInt(expiry)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]); // har page change pe check kare

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiryTime");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          {isLoginPage ? (
            <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
          ) : (
            <AuthWrapper>
              {/* Navigation */}
              <nav className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                      Malik Kiryana Store
                    </Link>
                    <div className="flex space-x-6 items-center">
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
                          pathname === '/users'
                            ? 'text-blue-600'
                            : 'text-gray-600'
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
                      <Link
                        href="/calculater"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          pathname === '/calculater'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      >
                        Calculater
                      </Link>

                      {/* 👇 Logout button sirf jab logged in ho */}
                      {isLoggedIn && (
                        <button
                          onClick={handleLogout}
                          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                        >
                          Logout
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </nav>

              {/* Page Content */}
              <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
            </AuthWrapper>
          )}
        </div>
      </body>
    </html>
  );
}
