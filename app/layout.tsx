'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Store, Truck, Users, Shield, Star, Award, Package, Phone, MapPin, Clock } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Check if we're on the home page
  const isHomePage = pathname === '/';
  
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation - Only show on non-home pages */}
          {!isHomePage && (
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <Link 
                        href="/" 
                        className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent transition-all hover:scale-105"
                      >
                        Malik Kiryana Store
                      </Link>
                    </div>
                    <div className="ml-6 flex space-x-8">
                      <Link
                        href="/"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                          pathname === '/' 
                            ? 'border-indigo-400 text-white' 
                            : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="/users"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                          pathname === '/users' 
                            ? 'border-indigo-400 text-white' 
                            : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                        }`}
                      >
                        Users
                      </Link>
                      <Link
                        href="/daily-records"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                          pathname === '/daily-records' 
                            ? 'border-indigo-400 text-white' 
                            : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                        }`}
                      >
                        Daily Records
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          )}

          {isHomePage ? (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
              </div>

              <div className="relative z-10">
                {/* Navigation for Home Page */}
                <nav className="absolute top-0 w-full z-50 p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                      <Link 
                        href="/" 
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent transition-all hover:scale-105"
                      >
                        Malik Kiryana Store
                      </Link>
                      <div className="flex space-x-6">
                        <Link
                          href="/users"
                          className="text-white hover:text-indigo-300 font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10"
                        >
                          Users
                        </Link>
                        <Link
                          href="/daily-records"
                          className="text-white hover:text-purple-300 font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10"
                        >
                          Daily Records
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>

                {/* Hero Section */}
                <div className={`text-center pt-32 pb-16 px-4 transition-all duration-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="mb-8 relative">
                    <div className="inline-block">
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                        <Store className="h-16 w-16 text-white animate-bounce" />
                      </div>
                    </div>
                  </div>
                  
                  <h1 className={`text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Malik Kiryana
                  </h1>
                  
                  <p className={`text-2xl text-gray-300 max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Your trusted neighborhood store for all daily needs. Quality products, unbeatable prices, and exceptional service.
                  </p>

                  {/* Floating Action Buttons */}
                  <div className={`flex justify-center space-x-6 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Link href="/users">
                      <button className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-indigo-500/25">
                        <div className="flex items-center">
                          <Users className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                          Manage Users
                        </div>
                      </button>
                    </Link>
                    
                    <Link href="/daily-records">
                      <button className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-purple-500/25">
                        <div className="flex items-center">
                          <Package className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Daily Records
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Main Content */}
                <div className="max-w-8xl mx-auto px-6">
                  {/* Feature Cards */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1500 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    {[
                      { icon: ShoppingCart, title: "Easy Shopping", desc: "Quick and convenient shopping experience", color: "from-indigo-500 to-blue-500", delay: "delay-100" },
                      { icon: Truck, title: "Fast Delivery", desc: "Quick delivery to your doorstep", color: "from-green-500 to-emerald-500", delay: "delay-200" },
                      { icon: Shield, title: "Quality Guarantee", desc: "100% quality assurance on all products", color: "from-purple-500 to-violet-500", delay: "delay-300" },
                      { icon: Star, title: "Premium Products", desc: "Carefully selected items for you", color: "from-orange-500 to-amber-500", delay: "delay-400" },
                      { icon: Award, title: "Best Prices", desc: "Competitive pricing for all items", color: "from-pink-500 to-rose-500", delay: "delay-500" },
                      { icon: Users, title: "Customer Support", desc: "Friendly staff always ready to help", color: "from-blue-500 to-cyan-500", delay: "delay-600" }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`group relative ${item.delay}`}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${hoveredCard === index ? 'shadow-purple-500/20' : ''}`}>
                          <div className="relative">
                            <div className={`bg-gradient-to-r ${item.color} p-4 rounded-2xl mb-6 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                              <item.icon className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                              {item.title}
                            </h3>
                            
                            <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                              {item.desc}
                            </p>

                            {/* Hover Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Store Highlights */}
                  <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-2000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Why Shop With Us?
                      </h3>
                      <p className="text-xl text-gray-300">
                        Experience the difference of shopping at Malik Kiryana
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Panel */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <div className="bg-indigo-500 p-3 rounded-full mr-4 animate-pulse">
                              <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">Open 7 Days</h4>
                              <p className="text-indigo-300">Early till late for your convenience</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <div className="bg-green-500 p-3 rounded-full mr-4 animate-bounce">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">Fresh Stock</h4>
                              <p className="text-green-300">Daily deliveries of fresh products</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-3/4 animate-pulse animation-delay-1000"></div>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-600/30 h-full">
                          <div className="text-center">
                            <div className="relative inline-block mb-6">
                              <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full animate-spin-slow"></div>
                              <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                                <Star className="h-12 w-12 text-white animate-pulse" />
                              </div>
                            </div>
                            
                            <h4 className="text-2xl font-bold text-white mb-2">Customer Satisfaction</h4>
                            <p className="text-gray-300 mb-6">
                              Rated 4.9/5 by our loyal customers
                            </p>

                            <div className="space-y-3">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-3 animate-pulse`} style={{animationDelay: `${i * 200}ms`}}></div>
                                    <span className="text-gray-300">{i} Star Ratings</span>
                                  </div>
                                  <div className="text-white font-mono">
                                    <span className="animate-pulse">{i === 5 ? '98%' : '92%'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Info Section */}
                  <div className={`mt-16 text-center transition-all duration-2000 delay-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-500">
                      <h3 className="text-4xl font-bold text-white mb-6 animate-pulse">
                        Visit Us Today!
                      </h3>
                      
                      <div className="flex justify-center space-x-8 mb-8">
                        {[MapPin, Clock, Phone].map((Icon, index) => (
                          <div key={index} className={`bg-white/20 p-6 rounded-full transform hover:scale-125 transition-all duration-300 hover:rotate-12`} style={{animationDelay: `${index * 500}ms`}}>
                            <Icon className="h-8 w-8 text-white animate-pulse" />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-8">
                        <div>
                          <h4 className="font-bold text-lg mb-2">Address</h4>
                          <p>123 Main Street</p>
                          <p>Your City, State 12345</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Hours</h4>
                          <p>Mon-Sat: 8AM - 10PM</p>
                          <p>Sun: 9AM - 9PM</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Contact</h4>
                          <p>Phone: (123) 456-7890</p>
                          <p>Email: info@malikkiryana.com</p>
                        </div>
                      </div>

                      <button className="group bg-white text-gray-900 px-12 py-4 rounded-full text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-white/25">
                        <span className="group-hover:animate-pulse">Get Directions</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="fixed top-20 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-30"></div>
                <div className="fixed top-32 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
                <div className="fixed bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-35"></div>
                <div className="fixed bottom-40 right-10 w-5 h-5 bg-cyan-400 rounded-full animate-ping opacity-25"></div>

                {/* Custom CSS for additional animations */}
                <style jsx>{`
                  @keyframes spin-slow {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }

                  .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                  }

                  .animation-delay-1000 {
                    animation-delay: 1s;
                  }
                  
                  .animation-delay-2000 {
                    animation-delay: 2s;
                  }
                  
                  .animation-delay-4000 {
                    animation-delay: 4s;
                  }
                `}</style>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              {children}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}