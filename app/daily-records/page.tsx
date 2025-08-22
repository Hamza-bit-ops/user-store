'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import { Plus, Save, X, Loader, Trash2, Edit, Store, TrendingUp, Calculator, Clock, Calendar, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Item {
  _id: string;
  amount: string;
  date: string;
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function EnhancedExcelManager() {
  const [showForm, setShowForm] = useState(true);
  const [newAmount, setNewAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Filtering & Pagination States
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [searchAmount, setSearchAmount] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    // Generate more demo data for better pagination demonstration
    setTimeout(() => {
      const demoItems = [];
      const today = new Date();
      
      for (let i = 0; i < 25; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Random dates within last 30 days
        
        demoItems.push({
          _id: (i + 1).toString(),
          amount: (Math.random() * 500 + 10).toFixed(2),
          date: date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }
      
      // Sort by date (newest first)
      demoItems.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      setItems(demoItems);
    }, 1000);
  }, []);

  // Filtered items based on date and search criteria
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Date filtering
    if (selectedDate) {
      filtered = filtered.filter(item => item.date === selectedDate);
    }

    // Date range filtering
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt || '');
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Amount search filtering
    if (searchAmount) {
      filtered = filtered.filter(item => 
        item.amount.toLowerCase().includes(searchAmount.toLowerCase())
      );
    }

    return filtered;
  }, [items, selectedDate, dateRange, searchAmount]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Get unique dates for filter dropdown
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(items.map(item => item.date)));
    return dates.sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  }, [items]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, dateRange, searchAmount]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const validateAmount = (amount: string): boolean => {
    if (!amount.trim()) {
      setError('Amount is required');
      return false;
    }
    if (isNaN(Number(amount))) {
      setError('Amount must be a number');
      return false;
    }
    setError('');
    return true;
  };

  const handleAdd = async () => {
    if (!validateAmount(newAmount)) return;

    try {
      setLoading(true);
      const now = new Date();
      const itemData = {
        _id: Date.now().toString(),
        amount: newAmount,
        date: getCurrentDate(),
        time: getCurrentTime(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 800));
      
      setItems([itemData, ...items]);
      setNewAmount('');
      setError('');
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item._id);
    setEditAmount(item.amount);
  };

  const handleSaveEdit = async () => {
    if (!validateAmount(editAmount)) return;

    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      setItems(items.map(item => 
        item._id === editingId 
          ? { ...item, amount: editAmount, date: getCurrentDate(), time: getCurrentTime(), updatedAt: new Date().toISOString() }
          : item
      ));
      setEditingId(null);
      setEditAmount('');
      setError('');
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));

      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAdd();
      } else {
        handleSaveEdit();
      }
    }
  };

  const resetForm = () => {
    setNewAmount('');
    setShowForm(false);
    setError('');
  };

  const clearFilters = () => {
    setSelectedDate('');
    setDateRange({ start: '', end: '' });
    setSearchAmount('');
    setCurrentPage(1);
  };

  const getTotalAmount = (itemsList = filteredItems) => {
    return itemsList.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 transition-all duration-2000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-2xl transform hover:scale-110 transition-all duration-300 hover:rotate-12">
                  <Store className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Enhanced Excel Manager
                  </h1>
                  <p className="text-blue-100 text-lg mt-2 animate-pulse">Advanced tracking with filters & pagination</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="group flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
                >
                  <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Filters</span>
                </button>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="group flex items-center gap-3 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold">Add Item</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className={`p-6 bg-gradient-to-r from-gray-800/50 via-purple-800/30 to-gray-800/50 border-b border-white/20 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Date Filter */}
                <div>
                  <label className=" text-sm font-semibold text-white mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Filter by Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">All Dates</option>
                    {uniqueDates.map(date => (
                      <option key={date} value={date} className="bg-gray-800">{date}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Start */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  />
                </div>

                {/* Date Range End */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  />
                </div>

                {/* Amount Search */}
                <div>
                  <label className="text-sm font-semibold text-white mb-2 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search Amount
                  </label>
                  <input
                    type="text"
                    value={searchAmount}
                    onChange={(e) => setSearchAmount(e.target.value)}
                    placeholder="Search amounts..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5} className="bg-gray-800">5</option>
                    <option value={10} className="bg-gray-800">10</option>
                    <option value={25} className="bg-gray-800">25</option>
                    <option value={50} className="bg-gray-800">50</option>
                  </select>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-300">
                  Showing <span className="text-purple-300 font-bold">{filteredItems.length}</span> of <span className="text-indigo-300 font-bold">{items.length}</span> items
                </p>
              </div>
            </div>
          )}

          {/* Add New Item Form */}
          {showForm && (
            <div className={`p-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/20 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl animate-pulse">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Add New Item</h2>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-300 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                  aria-label="Close form"
                >
                  <X className="w-8 h-8 hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              
              <div className="flex gap-6 items-end max-w-2xl">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-white mb-3">
                    Amount <span className="text-pink-400 animate-pulse">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'add')}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 text-white text-xl placeholder-gray-400 transition-all duration-300 ${
                      error ? 'border-red-400 animate-shake' : 'border-white/30 hover:border-white/50'
                    }`}
                    placeholder="Enter amount..."
                    autoFocus
                  />
                  {error && (
                    <p className="mt-3 text-lg text-red-400 animate-bounce font-medium">{error}</p>
                  )}
                </div>
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className={`px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-3 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-2xl ${
                    loading ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:shadow-green-500/25'
                  }`}
                >
                  {loading ? (
                    <Loader className="animate-spin w-6 h-6" />
                  ) : (
                    <Plus className="w-6 h-6 animate-bounce" />
                  )}
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b-2 border-purple-500/30">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <span>ID</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-pink-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Time</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-right text-sm font-bold text-yellow-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-white">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-spin-slow"></div>
                          <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                            <Loader className="w-8 h-8 text-white animate-pulse" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-6 animate-pulse">Loading items...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-white">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                          <Search className="w-16 h-16 text-white animate-pulse" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-4">No items found</p>
                        <p className="text-xl text-gray-300">Try adjusting your filters or add new items</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <tr key={item._id} className={`hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20 transition-all duration-500 transform hover:scale-[1.02] ${
                        globalIndex % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                      }`}>
                        <td className="px-8 py-6 text-lg font-bold">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                            <span className="text-purple-400">#{filteredItems.length - globalIndex}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {editingId === item._id ? (
                            <div className="flex gap-4 items-center">
                              <input
                                type="text"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, 'edit')}
                                className="px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 text-white text-lg flex-1 transition-all duration-300"
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                className="text-green-400 hover:text-green-300 p-3 rounded-xl hover:bg-green-500/20 transition-all duration-300 transform hover:scale-110"
                                title="Save"
                              >
                                {loading ? <Loader className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6" />}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-400 hover:text-white p-3 rounded-xl hover:bg-gray-500/20 transition-all duration-300 transform hover:scale-110"
                                title="Cancel"
                              >
                                <X className="w-6 h-6 hover:rotate-90 transition-transform duration-300" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ${item.amount}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-lg font-semibold text-pink-300">
                          {item.date}
                        </td>
                        <td className="px-8 py-6 text-lg text-cyan-300 font-medium">
                          {item.time}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {editingId !== item._id && (
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-400 hover:text-blue-300 p-3 rounded-xl hover:bg-blue-500/20 transition-all duration-300 transform hover:scale-110"
                                title="Edit"
                              >
                                <Edit className="w-6 h-6" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                disabled={loading}
                                className="text-red-400 hover:text-red-300 p-3 rounded-xl hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                                title="Delete"
                              >
                                {loading ? <Loader className="animate-spin w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-white/20 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  Showing <span className="font-bold text-purple-300">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-purple-300">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> of{' '}
                  <span className="font-bold text-indigo-300">{filteredItems.length}</span> items
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex space-x-2">
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-110 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer Stats */}
          {filteredItems.length > 0 && (
            <div className="px-8 py-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-t border-white/20 rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {filteredItems.length}
                  </p>
                  <p className="text-sm font-bold text-indigo-300 uppercase tracking-wide">Filtered Items</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Calculator className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    ${getTotalAmount()}
                  </p>
                  <p className="text-sm font-bold text-green-300 uppercase tracking-wide">Filtered Total</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                    ${filteredItems.length > 0 ? (parseFloat(getTotalAmount()) / filteredItems.length).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm font-bold text-pink-300 uppercase tracking-wide">Average</p>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <Store className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                    {items.length}
                  </p>
                  <p className="text-sm font-bold text-orange-300 uppercase tracking-wide">Total Items</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-300 mb-1">Last Updated</p>
                    <p className="text-sm text-cyan-400">{items[0]?.date || 'N/A'}</p>
                    <p className="text-sm text-cyan-400">{items[0]?.time || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Page Info */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-6 bg-white/5 rounded-2xl px-8 py-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-300 font-medium">Page {currentPage} of {totalPages}</span>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-300" />
                    <span className="text-indigo-300 font-medium">
                      {uniqueDates.length} unique date{uniqueDates.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-pink-300" />
                    <span className="text-pink-300 font-medium">
                      {selectedDate || dateRange.start || searchAmount ? 'Filtered' : 'All'} View
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-30"></div>
      <div className="fixed top-32 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
      <div className="fixed bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-35"></div>
      <div className="fixed bottom-40 right-10 w-5 h-5 bg-cyan-400 rounded-full animate-ping opacity-25"></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}