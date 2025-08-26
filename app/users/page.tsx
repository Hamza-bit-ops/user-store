"use client";

import { useState, useEffect } from "react";
import UserForm, { UserData } from "@/components/UserForm";
import UserList from "@/components/UserList";
import { Users, Plus } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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
      </div>
    </div>
  );
}
