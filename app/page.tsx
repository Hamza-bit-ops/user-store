"use client"
import { Edit, Plus, TrendingUp, Calendar, FileText, BarChart3, Shield, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="text-center pt-16 pb-12 px-4">
        <div className="mb-6">
          <FileText className="h-16 w-16 mx-auto text-blue-600" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          LogBook Pro
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Experience the future of professional record management with cutting-edge technology.
        </p>

        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
            <Plus className="inline-block h-5 w-5 mr-2" /> Start Creating
          </button>

          <button className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700">
            <BarChart3 className="inline-block h-5 w-5 mr-2" /> View Analytics
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Plus, title: "Create Records", desc: "Instantly add new entries" },
          { icon: Edit, title: "Manage Data", desc: "Edit and organize entries" },
          { icon: BarChart3, title: "Analytics", desc: "Deep insights & trends" },
          { icon: FileText, title: "Reports", desc: "Generate summaries" },
          { icon: Calendar, title: "Schedule", desc: "Plan & organize" },
          { icon: Shield, title: "Security", desc: "Protected & encrypted" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <item.icon className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Experience the Power
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Advanced features for professional logging
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel */}
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Database className="h-5 w-5 text-green-600 mr-2" /> Smart Storage
                </h4>
                <p className="text-gray-600">Intelligent data management</p>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" /> Real-time Insights
                </h4>
                <p className="text-gray-600">Dynamic visualizations of your data</p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="p-4 border rounded-md text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Simple Dashboard Preview</h4>
              <p className="text-gray-600">Easy to understand and responsive design.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-center py-12">
        <h3 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Workflow?
        </h3>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100">
          Get Started Now
        </button>
      </div>
    </div>
  );
}
