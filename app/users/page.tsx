'use client';

import { useState, useEffect } from 'react';
import UserForm, { UserData } from '@/components/UserForm';
import UserList from '@/components/UserList';
import { Users, Plus, UserCheck } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle creating new user
  const handleCreateUser = async (userData: UserData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new user to the list
        setUsers(prev => [...prev, data.user]);
        setShowForm(false);
        alert('User created successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  // Handle updating existing user
  const handleUpdateUser = async (userData: UserData) => {
    if (!userData._id) return;

    try {
      const response = await fetch(`/api/users/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          number: userData.number,
          address: userData.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the user in the list
        setUsers(prev => 
          prev.map(user => user._id === userData._id ? data.user : user)
        );
        setEditingUser(null);
        setShowForm(false);
        alert('User updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  // Handle user submission (create or update)
  const handleUserSubmit = async (userData: UserData) => {
    if (editingUser) {
      await handleUpdateUser(userData);
    } else {
      await handleCreateUser(userData);
    }
  };

  // Handle edit button click
  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle delete user
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the user from the list
        setUsers(prev => prev.filter(user => user._id !== userId));
        alert('User deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  // Show new user form
  const handleShowNewForm = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <div className="text-white text-xl">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className={`text-center transition-all duration-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 relative">
              <div className="inline-block">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                  <Users className="h-12 w-12 text-white animate-bounce" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
              User Management System
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Manage your users and their account information with ease
            </p>
          </div>

          {/* Add New User Button or Form */}
          {showForm ? (
            <div className={`space-y-6 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <UserForm
                onSubmit={handleUserSubmit}
                initialValues={editingUser || undefined}
                buttonText={editingUser ? 'Update User' : 'Create User'}
              />
              <div className="text-center">
                <button
                  onClick={handleCancel}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-3 rounded-2xl border border-white/20 font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={`text-center transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <button
                onClick={handleShowNewForm}
                className="group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-indigo-500/25"
              >
                <div className="flex items-center">
                  <Plus className="h-6 w-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add New User
                </div>
              </button>
            </div>
          )}

          {/* Users List */}
          <div className={`transition-all duration-1500 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={fetchUsers}
            />
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-30"></div>
        <div className="fixed top-32 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
        <div className="fixed bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-35"></div>
        <div className="fixed bottom-40 right-10 w-5 h-5 bg-cyan-400 rounded-full animate-ping opacity-25"></div>

        {/* Custom CSS for animations */}
        <style jsx>{`
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