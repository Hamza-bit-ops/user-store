'use client';

import { useState } from 'react';
import { UserData } from './UserForm';
import UserDetailsModal from './UserDetailModal';

interface UserListProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onDelete: (userId: string) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (userId: string) => {
    if (confirmDelete === userId) {
      onDelete(userId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(userId);
    }
  };

  const handleViewDetails = async (user: UserData) => {
    try {
      const response = await fetch(`/api/users/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Address</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 text-sm">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.address}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id!)}
                      className={`font-medium ${
                        confirmDelete === user._id
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {confirmDelete === user._id ? 'Confirm?' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
