"use client";

import { useState, useEffect } from "react";
import UserForm, { UserData } from "@/components/UserForm";
import UserList from "@/components/UserList";
import { Users, Plus, DollarSign, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";

interface TotalStats {
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [totalStats, setTotalStats] = useState<TotalStats>({
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showTotals, setShowTotals] = useState(false);

  const VIEW_TOTALS_PASSWORD = "786"; // Same password as view details

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total statistics for all users (optimized with parallel requests)
  const fetchTotalStats = async () => {
    try {
      setLoadingStats(true);
      let totalCredit = 0;
      let totalDebit = 0;

      // Create promises for all user account fetches (parallel execution)
      const accountPromises = users
        .filter(user => user._id)
        .map(async (user) => {
          try {
            const response = await fetch(`/api/users/${user._id}/accounts`);
            if (response.ok) {
              const data = await response.json();
              return data.accounts || [];
            }
            return [];
          } catch (error) {
            console.warn(`Failed to fetch accounts for user ${user.name}:`, error);
            return [];
          }
        });

      // Wait for all requests to complete
      const allAccountsArrays = await Promise.all(accountPromises);
      
      // Flatten and process all accounts
      const allAccounts = allAccountsArrays.flat();
      
      allAccounts.forEach((account: any) => {
        if (account.type === 'credit') {
          totalCredit += account.amount || 0;
        } else if (account.type === 'debit') {
          totalDebit += account.amount || 0;
        }
      });

      setTotalStats({
        totalCredit,
        totalDebit,
        netBalance: totalCredit - totalDebit
      });
    } catch (error) {
      console.error("Error fetching total stats:", error);
      alert("Failed to fetch total statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch stats when users change and totals are shown
  useEffect(() => {
    if (showTotals && users.length > 0) {
      fetchTotalStats();
    }
  }, [showTotals, users]);

  const handleShowTotalsClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === VIEW_TOTALS_PASSWORD) {
      setShowTotals(true);
      setPasswordInput("");
      setShowPasswordPrompt(false);
      if (users.length > 0) {
        fetchTotalStats();
      }
    } else {
      alert("❌ Wrong password");
      setPasswordInput("");
    }
  };

  const handleHideTotals = () => {
    setShowTotals(false);
  };

  // Handle create user
  const handleCreateUser = async (userData: UserData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prev) => [...prev, data.user]);
        setShowForm(false);
        alert("User created successfully!");
        
        // Refresh stats if they're being shown
        if (showTotals) {
          fetchTotalStats();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  // Handle update user
  const handleUpdateUser = async (userData: UserData) => {
    if (!userData._id) return;
    try {
      const response = await fetch(`/api/users/${userData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          number: userData.number,
          address: userData.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prev) =>
          prev.map((user) => (user._id === userData._id ? data.user : user))
        );
        setEditingUser(null);
        setShowForm(false);
        alert("User updated successfully!");
        
        // Refresh stats if they're being shown
        if (showTotals) {
          fetchTotalStats();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Handle delete user
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert("User deleted successfully!");
        
        // Refresh stats if they're being shown
        if (showTotals) {
          fetchTotalStats();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // Handle form submit
  const handleUserSubmit = async (userData: UserData) => {
    if (editingUser) {
      await handleUpdateUser(userData);
    } else {
      await handleCreateUser(userData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center space-x-3">
          <Users className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Customers Management System
          </h1>
        </div>

        {/* Total Statistics Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <DollarSign className="h-6 w-6 text-green-600 mr-2" />
              Financial Overview
            </h2>
            
            {!showTotals ? (
              <button
                onClick={handleShowTotalsClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Eye className="h-4 w-4" />
                Show Totals
              </button>
            ) : (
              <button
                onClick={handleHideTotals}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
              >
                <EyeOff className="h-4 w-4" />
                Hide Totals
              </button>
            )}
          </div>

          {showTotals && (
            <>
              {loadingStats ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Calculating totals...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Fetching data for {users.length} customer{users.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Credit */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Total Credit</p>
                        <p className="text-2xl font-bold text-green-800">
                          PKR {totalStats.totalCredit.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  {/* Total Debit */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700">Total Debit</p>
                        <p className="text-2xl font-bold text-red-800">
                          PKR {totalStats.totalDebit.toLocaleString()}
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                  </div>

                  {/* Net Balance */}
                  <div className={`bg-gradient-to-r p-4 rounded-lg border-2 ${
                    totalStats.netBalance >= 0 
                      ? 'from-blue-50 to-blue-100 border-blue-200' 
                      : 'from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          totalStats.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
                        }`}>
                          Net Balance
                        </p>
                        <p className={`text-2xl font-bold ${
                          totalStats.netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
                        }`}>
                          PKR {totalStats.netBalance.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className={`h-8 w-8 ${
                        totalStats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!showTotals && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Click "Show Totals" to view financial overview</p>
            </div>
          )}
        </div>

        {/* Add New User Button or Form */}
        {showForm ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <UserForm
              onSubmit={handleUserSubmit}
              initialValues={editingUser || undefined}
              buttonText={editingUser ? "Update Customer" : "Create Customer"}
            />
            <div className="text-center">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowForm(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
            >
              <Plus className="h-5 w-5" />
              Add New Customer
            </button>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-600 text-center">Loading customers...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600 text-center">No customers found.</p>
          ) : (
            <UserList
              users={users}
              onEdit={(user) => {
                setEditingUser(user);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onRefresh={fetchUsers}
            />
          )}
        </div>

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-semibold mb-4">Enter Password to View Totals</h3>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                className="w-full border rounded-md px-3 py-2 mb-4"
                placeholder="Password"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPasswordInput("");
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 