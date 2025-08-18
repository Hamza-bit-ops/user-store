import { Edit, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Logbook</h1>
          <p className="text-lg text-gray-600">
            Simple and efficient way to track your daily records
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/daily-records"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Add New Entry</h3>
                  <p className="text-sm text-blue-600">Create a new log entry</p>
                </div>
              </div>
            </a>
            <a
              href="/users"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Edit className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">View Entries</h3>
                  <p className="text-sm text-green-600">See all your records</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">New entry added</h3>
                  <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Item
                </span>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Entry updated</h3>
                  <p className="text-sm text-gray-500">Yesterday, 4:15 PM</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Update
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">First login</h3>
                  <p className="text-sm text-gray-500">Monday, 9:00 AM</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  System
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}