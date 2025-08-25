'use client';

import { useState } from 'react';
import { UserData } from './UserForm';
import UserDetailsModal from './UserDetailModal';
import { Eye, Edit, Trash2, Search, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface UserListProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onDelete: (userId: string) => void;
  onRefresh?: () => void;
}

export default function UserList({ users, onEdit, onDelete, onRefresh }: UserListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
const [passwordInput, setPasswordInput] = useState("");
const [pendingUser, setPendingUser] = useState<UserData | null>(null);

const VIEW_PASSWORD = "786";


const handleViewClick = (user: UserData) => {
  setPendingUser(user);       // jis user ko dekhna hai
  setShowPasswordPrompt(true); // password modal khol do
};

const handlePasswordSubmit = () => {
  if (passwordInput === VIEW_PASSWORD) {
    setSelectedUser(pendingUser);
    setShowModal(true);
    setPasswordInput("");
    setShowPasswordPrompt(false);
  } else {
    alert("❌ Wrong password");
  }
};


  const handleDeleteClick = async (userId: string) => {
    if (confirmDelete === userId) {
      try {
        await onDelete(userId);
        setConfirmDelete(null);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    } else {
      setConfirmDelete(userId);
    }
  };

  const handleViewDetails = async (user: UserData) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key as keyof UserData];
    const bValue = b[sortConfig.key as keyof UserData];
    if (!aValue) return 1;
    if (!bValue) return -1;
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    if (aString < bString) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aString > bString) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            Users ({users.length})
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-md w-64 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-md">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th onClick={() => handleSort('name')} className="px-4 py-3 text-left cursor-pointer">
                <div className="flex items-center gap-1">
                  Name <SortIcon columnKey="name" />
                </div>
              </th>
              <th onClick={() => handleSort('number')} className="px-4 py-3 text-left cursor-pointer">
                <div className="flex items-center gap-1">
                  Phone <SortIcon columnKey="number" />
                </div>
              </th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No users match your search' : 'No users found'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.number}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{user.address}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
  onClick={() => handleViewClick(user)}
  className="text-blue-600 hover:text-blue-800"
>
  <Eye className="h-5 w-5 inline" />
</button>

                    <button
                      onClick={() => onEdit(user)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id!)}
                      className={`${
                        confirmDelete === user._id
                          ? 'text-red-800'
                          : 'text-red-600 hover:text-red-800'
                      }`}
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

/* Password Prompt Modal */
{showPasswordPrompt && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h3 className="text-lg font-semibold mb-4">Enter Password</h3>
      <input
        type="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-4"
        placeholder="Password"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowPasswordPrompt(false)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handlePasswordSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

//userDetail
      {showModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
