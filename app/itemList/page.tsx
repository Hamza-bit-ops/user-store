"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Check, X, Plus } from "lucide-react";

interface Item {
  id: string;
  value: string;
}

export default function LocalStorageList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!inputValue.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      value: inputValue.trim(),
    };
    setItems([...items, newItem]);
    setInputValue("");
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const startEditing = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) return;
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, value: editValue.trim() } : item
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h2 className="text-xl font-semibold mb-5 text-center">📋 Saved Items</h2>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Type something..."
          className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        <button
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-750 transition"
          >
            {editingId === item.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 p-1 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
                <button
                  onClick={() => saveEdit(item.id)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded-lg transition"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded-lg transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium">{item.value}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEditing(item.id, item.value)}
                    className="text-blue-400 hover:text-blue-500 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}

        {items.length === 0 && (
          <li className="text-gray-500 text-center py-3 text-sm italic">
            Nothing saved yet...
          </li>
        )}
      </ul>
    </div>
  );
}
