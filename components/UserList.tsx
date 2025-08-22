'use client';

import { useState, useEffect } from 'react';
import { UserData } from './UserForm';
import UserDetailsModal from './UserDetailModal';
import { Eye, Edit, Trash2, Search, Users, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface UserListProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onDelete: (userId: string) => void;
  onRefresh?: () => void; // Add refresh callback
}

export default function UserList({ users, onEdit, onDelete, onRefresh }: UserListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDeleteClick = async (userId: string) => {
    if (confirmDelete === userId) {
      try {
        await onDelete(userId);
        setConfirmDelete(null);
        // Refresh the list after successful deletion
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        setConfirmDelete(null);
      }
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
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
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
    
    // Fix the sorting logic
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    if (aString < bString) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aString > bString) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
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

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    // Refresh the list when modal closes (in case data was updated)
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleEditFromModal = (user: UserData) => {
    setShowModal(false);
    setSelectedUser(null);
    onEdit(user);
  };

  const handleDeleteFromModal = async (userId: string) => {
    try {
      await onDelete(userId);
      setShowModal(false);
      setSelectedUser(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
   <div className="max-w-7xl mx-auto">
      <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Users ({users.length})
            </h2>
          </div>
          
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 block w-full pl-12 p-3 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10 backdrop-blur-md">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors rounded-tl-2xl"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center">
                    Phone
                    <SortIcon columnKey="number" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-200 uppercase tracking-wider rounded-tr-2xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-300">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">{searchTerm ? 'No users match your search' : 'No users found'}</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-white/10 transition-colors duration-300 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-semibold text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-300">{user.number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-base text-gray-300 max-w-xs truncate">{user.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/20 p-2 rounded-xl hover:bg-indigo-500/30 transition-all duration-300 transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="text-purple-400 hover:text-purple-300 bg-purple-500/20 p-2 rounded-xl hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-110"
                        title="Edit User"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id!)}
                        className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                          confirmDelete === user._id
                            ? 'text-pink-300 hover:text-pink-200 bg-pink-500/30'
                            : 'text-pink-400 hover:text-pink-300 bg-pink-500/20 hover:bg-pink-500/30'
                        }`}
                        title={confirmDelete === user._id ? 'Confirm Delete' : 'Delete User'}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
        </div>
         
      </div>
 {showModal && selectedUser && (
          <UserDetailsModal 
            user={selectedUser} 
            onClose={handleModalClose}
            onEdit={handleEditFromModal}
            onDelete={handleDeleteFromModal}
          />
        )}
    </div>

    
  );
}