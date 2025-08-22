"use client";

import { useEffect, useMemo, useState } from "react";

interface Item {
  _id: string;
  amount: string;
  date: string;      // stored as "dd/mm/yyyy"
  time: string;
  createdAt: string;
}

function parseDDMMYYYY(d: string) {
  // converts "dd/mm/yyyy" to Date safely
  const [dd, mm, yyyy] = d.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

export default function ItemsPage() {
  const [amount, setAmount] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  // ---- API ----
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setAllItems(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  // ---- Derived lists ----
  const filteredItems = useMemo(() => {
    let list = [...allItems];

    if (fromDate) {
      const from = new Date(fromDate + "T00:00:00");
      list = list.filter((i) => parseDDMMYYYY(i.date) >= from);
    }
    if (toDate) {
      const to = new Date(toDate + "T23:59:59");
      list = list.filter((i) => parseDDMMYYYY(i.date) <= to);
    }
    return list;
  }, [allItems, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / limit));

  const paginated = useMemo(
    () => filteredItems.slice((page - 1) * limit, page * limit),
    [filteredItems, page]
  );

  const pageTotal = useMemo(
    () => paginated.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0),
    [paginated]
  );

  // ---- Add ----
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      setError("Amount is required");
      return;
    }

    setLoading(true);
    setError("");

    const now = new Date();
    const newItem = {
      amount,
      date: now.toLocaleDateString("en-GB"), // dd/mm/yyyy
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add item");
      }

      setAmount("");
      await fetchItems();
      setPage(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      await fetchItems();
      if ((page - 1) * limit >= filteredItems.length - 1) {
        setPage((p) => Math.max(1, p - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Edit ----
  const startEdit = (item: Item) => {
    setEditingId(item._id);
    setEditAmount(item.amount);
  };

  const saveEdit = async (id: string) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: editAmount }),
      });
      setEditingId(null);
      setEditAmount("");
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Amount Manager</h1>

        {/* Form */}
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Time</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 text-center">
                    <td className="border px-3 py-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="border px-3 py-2">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        item.amount
                      )}
                    </td>
                    <td className="border px-3 py-2">{item.date}</td>
                    <td className="border px-3 py-2">{item.time}</td>
                    <td className="border px-3 py-2 flex justify-center gap-2">
                      {editingId === item._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(item._id)}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Page total */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1}–
            {Math.min(page * limit, filteredItems.length)} of {filteredItems.length}
          </div>
          <div className="text-base font-semibold">
            Page Total: {pageTotal.toFixed(2)}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
