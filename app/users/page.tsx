'use client';

import { useState, useEffect } from 'react';
import UserForm, { UserData } from '@/components/UserForm';
import UserList from '@/components/UserList';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new user or update existing user
  const handleUserSubmit = async (userData: UserData) => {
    try {
      setLoading(true);
      
      if (editUser && editUser._id) {
        // Update existing user
        const response = await fetch(`/api/users/${editUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update user');
        }
        
        setEditUser(null);
      } else {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create user');
        }
      }
      
      // Refresh the user list
      fetchUsers();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit user
  const handleEditUser = (user: UserData) => {
    setEditUser(user);
  };
  
  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Refresh the user list
      fetchUsers();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users Management</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">
            {editUser ? 'Edit User' : 'Create New User'}
          </h2>
          <UserForm 
            onSubmit={handleUserSubmit} 
            initialValues={editUser || undefined} 
            buttonText={editUser ? 'Update User' : 'Create User'} 
          />
          {editUser && (
            <button
              onClick={() => setEditUser(null)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel editing
            </button>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <UserList 
              users={users} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
