"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trash2,
  Edit2,
} from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
}

export default function TransactionManager() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transaction");
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions);
      } else {
        console.error(data.error || "Failed to fetch");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    setFilterDate(getTodayDate());
  }, []);

  // Add new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const newTransaction = {
      amount: parseFloat(amount),
      type,
      date: getTodayDate(),
    };

    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions([data.transaction, ...transactions]);
        setAmount("");
      } else {
        console.error(data.error || "Failed to create");
      }
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  // Delete transaction
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter by date
  const filtered = filterDate
    ? transactions.filter((t) => t.date.split("T")[0] === filterDate)
    : transactions;

  // Pagination
  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate]);

  // Totals
  const totalDebit = filtered
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredit = filtered
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredit - totalDebit;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-blue-600 text-white border border-blue-600"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          } ${
            i === startPage && currentPage === 1 ? "rounded-l-md" : ""
          } ${i === endPage && currentPage === totalPages ? "rounded-r-md" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Transaction Manager
          </h1>
          <p className="text-gray-600">
            Track your daily financial transactions
          </p>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Add New Transaction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (Rs)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "debit" | "credit")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Filter by Date
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <button
                  onClick={() => setFilterDate("")}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Credit
                </span>
              </div>
              <p className="text-xl font-bold text-green-800">
                Rs {totalCredit.toLocaleString()}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Debit
                </span>
              </div>
              <p className="text-xl font-bold text-red-800">
                Rs {totalDebit.toLocaleString()}
              </p>
            </div>

            <div
              className={`border rounded-lg p-4 text-center ${
                balance >= 0
                  ? "bg-blue-50 border-blue-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    balance >= 0 ? "bg-blue-600" : "bg-orange-600"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    balance >= 0 ? "text-blue-700" : "text-orange-700"
                  }`}
                >
                  Balance
                </span>
              </div>
              <p
                className={`text-xl font-bold ${
                  balance >= 0 ? "text-blue-800" : "text-orange-800"
                }`}
              >
                Rs {balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Transactions
                {filterDate && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    for{" "}
                    {new Date(filterDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </h2>
              <span className="text-sm text-gray-500">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Type
                  </th>
                  <th className="text-right py-3 px-6 font-medium text-gray-700 text-sm">
                    Amount
                  </th>
                  <th className="text-right py-3 px-6 font-medium text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type === "credit" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-medium ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Rs {transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginated.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500">
                  {filterDate
                    ? "No transactions found for the selected date."
                    : "Add your first transaction to get started."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + pageSize, filtered.length)} of{" "}
                  {filtered.length} results
                </p>
                <div className="flex">{getPaginationButtons()}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
