// components/UserDetailsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Plus, X, Trash2, Check, DollarSign, Type, MapPin, Users, BarChart3, FileText, Calendar, TrendingUp, Clock, Database, ChevronDown, ChevronUp, Filter, Search, Download, RefreshCw } from 'lucide-react';

// Types
export interface UserData {
  _id?: string;
  name: string;
  number: string;
  address: string;
}

export interface AccountEntry {
  _id?: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

interface UserDetailsModalProps {
  user: UserData;
  onClose: () => void;
  onEdit: (user: UserData) => void;
  onDelete: (userId: string) => void;
}

export default function UserDetailsModal({ user, onClose, onEdit, onDelete }: UserDetailsModalProps) {
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit' as 'credit' | 'debit',
    amount: '',
    description: ''
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    fetchAccounts();
    return () => clearTimeout(timer);
  }, [user._id]);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        type: editingEntry.type,
        amount: editingEntry.amount.toString(),
        description: editingEntry.description
      });
    } else {
      setFormData({
        type: 'credit',
        amount: '',
        description: ''
      });
    }
    setErrors({});
  }, [editingEntry]);

  const fetchAccounts = async () => {
    if (!user._id) {
      console.error('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching accounts for user:', user._id);
      
      const response = await fetch(`/api/users/${user._id}/accounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Accounts fetched successfully:', data.accounts?.length || 0);
        setAccounts(data.accounts || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch accounts:', errorData);
        alert(`Failed to load accounts: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error fetching accounts:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddEntry = async () => {
    if (!validateForm() || isSubmitting || !user._id) return;

    try {
      setIsSubmitting(true);
      console.log('Adding new entry for user:', user._id);
      
      const requestBody = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim()
      };

      console.log('Request body:', requestBody);
      
      const response = await fetch(`/api/users/${user._id}/accounts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Entry added successfully:', responseData);
        setFormData({ type: 'credit', amount: '', description: '' });
        setShowAddForm(false);
        setErrors({});
        await fetchAccounts();
      } else {
        console.error('Failed to add entry:', responseData);
        alert(`Failed to add entry: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error adding entry:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

const handleUpdateEntry = async () => {
  if (!validateForm() || !editingEntry || !editingEntry._id || isSubmitting || !user._id) return;

  try {
    setIsSubmitting(true);
    console.log('Updating entry:', editingEntry._id, 'for user:', user._id);
    
    const requestBody = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description.trim()
    };

    console.log('Update request body:', requestBody);
    
    const response = await fetch(`/api/users/${user._id}/accounts/${editingEntry._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    console.log('Update response:', response.status, responseData);
    
    if (response.ok) {
      console.log('Entry updated successfully:', responseData);
      setEditingEntry(null);
      setFormData({ type: 'credit', amount: '', description: '' });
      setErrors({});
      await fetchAccounts();
    } else {
      console.error('Failed to update entry:', responseData);
      alert(`Failed to update entry: ${responseData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network error updating entry:', error);
    alert('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  const handleDeleteEntry = async (entryId: string) => {
    if (!entryId || !user._id) {
      alert('Invalid entry ID or user ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting entry:', entryId, 'for user:', user._id);
      
      const response = await fetch(`/api/users/${user._id}/accounts/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Entry deleted successfully:', responseData);
        await fetchAccounts();
      } else {
        console.error('Failed to delete entry:', responseData);
        alert(`Failed to delete entry: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error deleting entry:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteUser = () => {
    if (confirmDelete === user._id) {
      onDelete(user._id!);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(user._id!);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingEntry(null);
    setFormData({ type: 'credit', amount: '', description: '' });
    setErrors({});
  };

  const calculateBalance = () => {
    return accounts.reduce((total, account) => {
      return account.type === 'credit' ? total + account.amount : total - account.amount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || account.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const isFormValid = formData.amount && parseFloat(formData.amount) > 0 && formData.description.trim();

  // Early return if no user ID
  if (!user._id) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-red-900/90 text-white p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>User ID is missing. Please close and try again.</p>
          <button onClick={onClose} className="mt-4 bg-white/20 px-4 py-2 rounded-xl">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className={`bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-purple-500/20 shadow-2xl transition-all duration-700 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} flex flex-col`}>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Header - Fixed */}
        <div className="relative bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-xl flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent">
                User Account Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">ID: {user._id}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onEdit(user)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDeleteUser}
                className={`font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center ${
                  confirmDelete === user._id
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-700 hover:to-rose-800'
                    : 'bg-gradient-to-r from-gray-600 to-slate-700 text-gray-200 hover:from-gray-700 hover:to-slate-800'
                }`}
              >
                {confirmDelete === user._id ? (
                  <>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Confirm?</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            
            {/* User Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-blue-500/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-xl mr-3 group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-300 text-sm sm:text-base">Full Name</h3>
                </div>
                <p className="text-white text-base sm:text-lg font-medium group-hover:text-blue-200 transition-colors duration-300">{user.name}</p>
              </div>

              <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-green-500/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
                <div className="flex items-center mb-3">
                  <div className="bg-green-500/20 p-2 rounded-xl mr-3 group-hover:bg-green-500/30 transition-colors duration-300">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-green-300 text-sm sm:text-base">Phone Number</h3>
                </div>
                <p className="text-white text-base sm:text-lg font-medium group-hover:text-green-200 transition-colors duration-300">{user.number}</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-purple-500/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl lg:col-span-1 col-span-1">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-xl mr-3 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-purple-300 text-sm sm:text-base">Address</h3>
                </div>
                <p className="text-white text-base sm:text-lg font-medium group-hover:text-purple-200 transition-colors duration-300">{user.address}</p>
              </div>
            </div>

            {/* Balance Summary */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-gray-900/60 to-slate-900/60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Account Summary
                  </h3>
                  <button
                    onClick={fetchAccounts}
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  <div className="text-center bg-gradient-to-b from-green-900/30 to-green-800/10 p-3 sm:p-4 rounded-2xl border border-green-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-green-500/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-green-300 mb-1">Total Credit</p>
                    <p className="text-sm sm:text-xl font-bold text-green-400">
                      {formatCurrency(accounts.filter(a => a.type === 'credit').reduce((sum, a) => sum + a.amount, 0))}
                    </p>
                  </div>

                  <div className="text-center bg-gradient-to-b from-red-900/30 to-red-800/10 p-3 sm:p-4 rounded-2xl border border-red-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-red-500/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-red-300 mb-1">Total Debit</p>
                    <p className="text-sm sm:text-xl font-bold text-red-400">
                      {formatCurrency(accounts.filter(a => a.type === 'debit').reduce((sum, a) => sum + a.amount, 0))}
                    </p>
                  </div>

                  <div className="text-center bg-gradient-to-b from-purple-900/30 to-purple-800/10 p-3 sm:p-4 rounded-2xl border border-purple-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-purple-500/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-purple-300 mb-1">Net Balance</p>
                    <p className={`text-sm sm:text-2xl font-bold ${calculateBalance() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(calculateBalance())}
                    </p>
                  </div>

                  <div className="text-center bg-gradient-to-b from-cyan-900/30 to-cyan-800/10 p-3 sm:p-4 rounded-2xl border border-cyan-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-cyan-500/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Database className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-300 mb-1">Total Entries</p>
                    <p className="text-sm sm:text-xl font-bold text-cyan-400">{accounts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit Entry Section */}
            <div className="mb-6 sm:mb-8">
              {!showAddForm && !editingEntry ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <div className="bg-white/20 p-1 rounded-lg mr-2 group-hover:bg-white/30 transition-colors duration-300">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  Add New Entry
                </button>
              ) : (
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-xl">
                  <h3 className="font-bold mb-4 sm:mb-6 text-white text-base sm:text-lg bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    {editingEntry ? 'Edit Account Entry' : 'Add New Account Entry'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                      <div className="relative">
                        <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                        <select
                          value={formData.type}
                          onChange={(e) => handleFormChange('type', e.target.value)}
                          className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 transition-all duration-300 hover:bg-gray-700/70"
                        >
                          <option value="credit">Credit (+)</option>
                          <option value="debit">Debit (-)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount (PKR)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={(e) => handleFormChange('amount', e.target.value)}
                          className={`bg-gray-700/50 border text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 transition-all duration-300 hover:bg-gray-700/70 ${
                            errors.amount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.amount && (
                          <p className="text-red-400 text-xs mt-2 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.amount}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative group sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter description"
                          value={formData.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          maxLength={200}
                          className={`bg-gray-700/50 border text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-300 hover:bg-gray-700/70 ${
                            errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600'
                          }`}
                        />
                        <div className="flex justify-between mt-2">
                          {errors.description && (
                            <p className="text-red-400 text-xs flex items-center">
                              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                              {errors.description}
                            </p>
                          )}
                          <p className="text-gray-400 text-xs ml-auto">
                            {formData.description.length}/200
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 sm:col-span-2 lg:col-span-3 pt-4">
                      <button
                        onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                        disabled={isSubmitting || !isFormValid}
                        className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] font-medium ${
                          isSubmitting || !isFormValid
                            ? 'opacity-50 cursor-not-allowed hover:scale-100'
                            : 'shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingEntry ? 'Updating...' : 'Adding...'}
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {editingEntry ? 'Update Entry' : 'Add Entry'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelForm}
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-lg hover:shadow-xl"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Search descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-4 py-2.5 w-full sm:w-64 transition-all duration-300 hover:bg-gray-700/70"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white px-4 py-2.5 rounded-xl border border-purple-500/20 flex items-center transition-all duration-300 transform hover:scale-105"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </button>
                </div>

                <div className="text-sm text-gray-400">
                  Showing {filteredAccounts.length} of {accounts.length} entries
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 bg-gradient-to-r from-gray-800/40 to-slate-800/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 transition-all duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'credit' | 'debit')}
                        className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2"
                      >
                        <option value="all">All Transactions</option>
                        <option value="credit">Credit Only</option>
                        <option value="debit">Debit Only</option>
                    </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterType('all');
                          setSortOrder('desc');
                        }}
                        className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 w-full"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Entries Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Transaction History
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Date,Type,Amount,Description,Running Balance\n" +
                        filteredAccounts.map((account, index) => {
                          const runningBalance = filteredAccounts.slice(0, index + 1).reduce((total, acc) => {
                            return acc.type === 'credit' ? total + acc.amount : total - acc.amount;
                          }, 0);
                          return `${formatDate(account.createdAt)},${account.type},${account.amount},"${account.description}",${runningBalance}`;
                        }).join("\n");
                      
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `${user.name}_transactions.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 px-3 py-2 rounded-xl border border-green-500/20 flex items-center transition-all duration-300 transform hover:scale-105"
                    disabled={filteredAccounts.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-3xl border border-dashed border-white/10">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 mb-4"></div>
                  <p className="text-gray-400 text-lg">Loading transaction history...</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your data</p>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-3xl border border-dashed border-white/10">
                  <div className="bg-gray-700/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg font-medium">No transactions found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Start by adding your first transaction above'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gray-800/20 backdrop-blur-sm shadow-2xl">
                  <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gradient-to-r from-gray-700/50 to-slate-700/50">
                      <tr>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Date & Time
                          </div>
                        </th>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                            Credit
                          </div>
                        </th>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-red-400" />
                            Debit
                          </div>
                        </th>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-purple-400" />
                            Balance
                          </div>
                        </th>
                        <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900/10 divide-y divide-gray-700/30">
                      {filteredAccounts.map((account, index) => {
                        const runningBalance = filteredAccounts.slice(0, index + 1).reduce((total, acc) => {
                          return acc.type === 'credit' ? total + acc.amount : total - acc.amount;
                        }, 0);

                        return (
                          <tr key={account._id} className="hover:bg-gray-700/20 transition-all duration-300 group">
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center">
                                <div className="bg-gray-600/30 p-1.5 rounded-lg mr-2 group-hover:bg-gray-600/50 transition-colors duration-300">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                </div>
                                <div>
                                  <div className="font-medium">{formatDate(account.createdAt).split(',')[0]}</div>
                                  <div className="text-xs text-gray-500">{formatDate(account.createdAt).split(',')[1]}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {account.type === 'credit' ? (
                                <div className="flex items-center">
                                  <div className="bg-green-500/20 p-1 rounded-lg mr-2">
                                    <TrendingUp className="h-3 w-3 text-green-400" />
                                  </div>
                                  <span className="font-bold text-green-400">{formatCurrency(account.amount)}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {account.type === 'debit' ? (
                                <div className="flex items-center">
                                  <div className="bg-red-500/20 p-1 rounded-lg mr-2">
                                    <BarChart3 className="h-3 w-3 text-red-400" />
                                  </div>
                                  <span className="font-bold text-red-400">{formatCurrency(account.amount)}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-300 max-w-xs">
                              <div className="truncate group-hover:text-white transition-colors duration-300">
                                {account.description}
                              </div>
                            </td>
                            <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold ${
                              runningBalance >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <div className="flex items-center">
                                <div className={`p-1 rounded-lg mr-2 ${
                                  runningBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                  <DollarSign className="h-3 w-3" />
                                </div>
                                {formatCurrency(runningBalance)}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingEntry(account)}
                                  className="group/btn bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 border border-blue-500/20 hover:border-blue-500/40"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (account._id) {
                                      handleDeleteEntry(account._id);
                                    }
                                  }}
                                  className="group/btn bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 border border-red-500/20 hover:border-red-500/40"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}