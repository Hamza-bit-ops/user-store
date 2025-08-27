"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  X,
  Trash2,
  Users,
  BarChart3,
  MapPin,
} from "lucide-react";

// Types
export interface UserData {
  _id?: string;
  name: string;
  number: string;
  address: string;
}

export interface AccountEntry {
  _id?: string;
  type: "credit" | "debit";
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

export default function UserDetailsModal({
  user,
  onClose,
  onEdit,
  onDelete,
}: UserDetailsModalProps) {
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);
  const [formData, setFormData] = useState({
    type: "credit" as "credit" | "debit",
    amount: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">(
    "all"
  );

  useEffect(() => {
    fetchAccounts();
  }, [user._id]);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        type: editingEntry.type,
        amount: editingEntry.amount.toString(),
        description: editingEntry.description,
      });
    } else {
      setFormData({ type: "credit", amount: "", description: "" });
    }
    setErrors({});
  }, [editingEntry]);

  const fetchAccounts = async () => {
    if (!user._id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user._id}/accounts`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      alert("Error fetching accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount > 0";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Enter a description";
    }
    if (formData.description.trim().length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAddEntry = async () => {
    if (!validateForm() || !user._id) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${user._id}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          description: formData.description.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchAccounts();
        setShowAddForm(false);
        setFormData({ type: "credit", amount: "", description: "" });
        alert("Entry added successfully!");
      } else {
        console.error("Error adding entry:", data);
        alert(data.error || "Failed to add entry");
      }
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!validateForm() || !editingEntry || !editingEntry._id || !user._id)
      return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/users/${user._id}/accounts/${editingEntry._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: formData.type,
            amount: parseFloat(formData.amount),
            description: formData.description.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchAccounts();
        setEditingEntry(null);
        setShowAddForm(false);
        alert("Entry updated successfully!");
      } else {
        console.error("Error updating entry:", data);
        alert(data.error || "Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user._id) return;
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/users/${user._id}/accounts/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (res.ok) {
        await fetchAccounts();
        alert("Entry deleted successfully!");
      } else {
        console.error("Error deleting entry:", data);
        alert(data.error || "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const totalCredit = accounts
    .filter((a) => a.type === "credit")
    .reduce((t, a) => t + a.amount, 0);

  const totalDebit = accounts
    .filter((a) => a.type === "debit")
    .reduce((t, a) => t + a.amount, 0);

  const calculateBalance = () => totalCredit - totalDebit;

  const filteredAccounts = accounts
    .filter((a) => {
      const matchesSearch = a.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || a.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  if (!user._id) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-900/95 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">User Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-xl">
              <Users className="text-blue-400 mb-2" />
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-white">{user.name}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <BarChart3 className="text-green-400 mb-2" />
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">{user.number}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <MapPin className="text-purple-400 mb-2" />
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-white">{user.address}</p>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-gray-800 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-400">Net Balance</p>
            <p
              className={`text-2xl font-bold ${calculateBalance() >= 0 ? "text-green-400" : "text-red-400"
                }`}
            >
              PKR {calculateBalance().toLocaleString()}
            </p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-800/50 border border-red-600 rounded-xl p-4">
              <h3 className="text-red-200 font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="text-red-200 text-sm">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add/Edit Entry Form */}
          {(showAddForm || editingEntry) && (
            <div className="bg-gray-800 p-4 rounded-xl space-y-4">
              <h3 className="text-white font-semibold">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h3>
              <select
                value={formData.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                disabled={isSubmitting}
              >
                <option value="credit">Credit (+)</option>
                <option value="debit">Debit (-)</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => handleFormChange("amount", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    editingEntry ? handleUpdateEntry() : handleAddEntry();
                  }
                }}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.amount ? "border-red-500" : "border-gray-600"
                  }`}
                disabled={isSubmitting}
                min="0.01"
                step="0.01"
              />

              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    editingEntry ? handleUpdateEntry() : handleAddEntry();
                  }
                }}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.description ? "border-red-500" : "border-gray-600"
                  }`}
                disabled={isSubmitting}
                maxLength={200}
              />

              <div className="text-xs text-gray-400">
                {formData.description.length}/200 characters
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-2 rounded transition"
                >
                  {isSubmitting
                    ? (editingEntry ? "Updating..." : "Adding...")
                    : (editingEntry ? "Update Entry" : "Add Entry")
                  }
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEntry(null);
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add Button */}
          {!showAddForm && !editingEntry && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              <Plus className="inline h-4 w-4 mr-1" /> Add Entry
            </button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center text-white py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">Loading accounts...</p>
            </div>
          )}

          {/* Entries Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 text-sm text-white">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 px-4 py-2 text-left">
                      Date
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-right">
                      Debit
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-right">
                      Credit
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-700">
                      <td className="border border-gray-700 px-4 py-2">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        {entry.description}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-right">
                        {entry.type === "debit"
                          ? `PKR ${entry.amount.toLocaleString()}`
                          : ""}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-right">
                        {entry.type === "credit"
                          ? `PKR ${entry.amount.toLocaleString()}`
                          : ""}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-blue-400 hover:text-blue-500 transition"
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry._id!)}
                            className="text-red-400 hover:text-red-500 transition"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAccounts.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-gray-400 py-4 border border-gray-700"
                      >
                        No entries found
                      </td>
                    </tr>
                  )}

                  {/* Summary Row */}
                  {filteredAccounts.length > 0 && (
                    <tr className="bg-gray-900 font-bold">
                      <td
                        colSpan={2}
                        className="border border-gray-700 px-4 py-2 text-right"
                      >
                        Totals:
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-right text-red-400">
                        PKR {totalDebit.toLocaleString()}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-right text-green-400">
                        PKR {totalCredit.toLocaleString()}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-center">
                        Net:{" "}
                        <span
                          className={`${calculateBalance() >= 0
                              ? "text-green-400"
                              : "text-red-400"
                            }`}
                        >
                          PKR {calculateBalance().toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 