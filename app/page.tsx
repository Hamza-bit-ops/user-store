"use client"
import { Edit, Plus, TrendingUp, Calendar, FileText, BarChart3, Clock, Users, Zap, Shield, Database } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className={`text-center pt-20 pb-16 px-4 transition-all duration-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8 relative">
            <div className="inline-block">
              <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                <FileText className="h-16 w-16 text-white animate-bounce" />
              </div>
            </div>
          </div>
          
          <h1 className={`text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            LogBook Pro
          </h1>
          
          <p className={`text-2xl text-gray-300 max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Experience the future of professional record management with cutting-edge technology
          </p>

          {/* Floating Action Buttons */}
          <div className={`flex justify-center space-x-6 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25">
              <div className="flex items-center">
                <Plus className="h-6 w-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Start Creating
              </div>
            </button>
            
            <button className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-purple-500/25">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                View Analytics
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6">
          {/* Feature Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1500 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              { icon: Plus, title: "Create Records", desc: "Instantly add new entries", color: "from-blue-500 to-cyan-500", delay: "delay-100" },
              { icon: Edit, title: "Manage Data", desc: "Edit and organize entries", color: "from-green-500 to-emerald-500", delay: "delay-200" },
              { icon: BarChart3, title: "Analytics", desc: "Deep insights & trends", color: "from-purple-500 to-violet-500", delay: "delay-300" },
              { icon: FileText, title: "Reports", desc: "Generate summaries", color: "from-orange-500 to-red-500", delay: "delay-400" },
              { icon: Calendar, title: "Schedule", desc: "Plan & organize", color: "from-pink-500 to-rose-500", delay: "delay-500" },
              { icon: Shield, title: "Security", desc: "Protected & encrypted", color: "from-indigo-500 to-blue-500", delay: "delay-600" }
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
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
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

          {/* Interactive Dashboard Preview */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-2000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Experience the Power
              </h3>
              <p className="text-xl text-gray-300">
                Advanced features for professional logging
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 p-3 rounded-full mr-4 animate-pulse">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Lightning Fast</h4>
                      <p className="text-blue-300">Instant data processing</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 p-3 rounded-full mr-4 animate-bounce">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Smart Storage</h4>
                      <p className="text-green-300">Intelligent data management</p>
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
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-12 w-12 text-white animate-pulse" />
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">Real-time Insights</h4>
                    <p className="text-gray-300 mb-6">
                      Watch your data come alive with dynamic visualizations
                    </p>

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 animate-pulse`} style={{animationDelay: `${i * 200}ms`}}></div>
                            <span className="text-gray-300">Data Stream {i}</span>
                          </div>
                          <div className="text-white font-mono">
                            <span className="animate-pulse">●</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className={`mt-16 text-center transition-all duration-2000 delay-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <h3 className="text-4xl font-bold text-white mb-6 animate-pulse">
                Ready to Transform Your Workflow?
              </h3>
              
              <div className="flex justify-center space-x-8 mb-8">
                {[Plus, Edit, BarChart3].map((Icon, index) => (
                  <div key={index} className={`bg-white/20 p-6 rounded-full transform hover:scale-125 transition-all duration-300 hover:rotate-12`} style={{animationDelay: `${index * 500}ms`}}>
                    <Icon className="h-8 w-8 text-white animate-pulse" />
                  </div>
                ))}
              </div>

              <button className="group bg-white text-gray-900 px-12 py-4 rounded-full text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-white/25">
                <span className="group-hover:animate-pulse">Get Started Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30"></div>
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
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
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
  );
}