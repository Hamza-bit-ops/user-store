'use client';

import { useState, useEffect } from 'react';
import { UserData } from './UserForm';
import { AccountEntry } from '@/types/Accounts';

interface UserDetailsModalProps {
  user: UserData;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'credit' as 'credit' | 'debit',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, [user._id]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user._id}/accounts`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.amount || !newEntry.description) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`/api/users/${user._id}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newEntry.type,
          amount: parseFloat(newEntry.amount),
          description: newEntry.description
        })
      });

      if (response.ok) {
        setNewEntry({ type: 'credit', amount: '', description: '' });
        setShowAddForm(false);
        fetchAccounts(); // Refresh accounts
      } else {
        alert('Failed to add entry');
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to add entry');
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-500">ID: {user._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Name</h3>
              <p className="text-blue-700">{user.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Phone Number</h3>
              <p className="text-green-700">{user.number}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Address</h3>
              <p className="text-purple-700">{user.address}</p>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(accounts.filter(a => a.type === 'credit').reduce((sum, a) => sum + a.amount, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(accounts.filter(a => a.type === 'debit').reduce((sum, a) => sum + a.amount, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className={`text-xl font-bold ${calculateBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateBalance())}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Entries</p>
                  <p className="text-lg font-semibold text-blue-600">{accounts.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Entry Section */}
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Entry
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Add New Account Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value as 'credit' | 'debit' }))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="credit">Credit (+)</option>
                    <option value="debit">Debit (-)</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddEntry}
                      className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewEntry({ type: 'credit', amount: '', description: '' });
                      }}
                      className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Entries Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Account History</h3>
            {loading ? (
              <p className="text-gray-500">Loading accounts...</p>
            ) : accounts.length === 0 ? (
              <p className="text-gray-500">No account entries found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account, index) => {
                      // Calculate running balance up to this entry
                      const runningBalance = accounts.slice(0, index + 1).reduce((total, acc) => {
                        return acc.type === 'credit' ? total + acc.amount : total - acc.amount;
                      }, 0);

                      return (
                        <tr key={account._id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(account.createdAt)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              account.type === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {account.type === 'credit' ? 'Credit (+)' : 'Debit (-)'}
                            </span>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                            account.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {account.type === 'credit' ? '+' : '-'}{formatCurrency(account.amount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {account.description}
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${
                            runningBalance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(runningBalance)}
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
  );
}