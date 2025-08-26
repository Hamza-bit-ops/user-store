'use client';

import { useState, FormEvent, useEffect } from 'react';
import { AccountEntry } from '@/types/Accounts';
import { User, Phone, MapPin, Save, Loader2, UserPlus } from 'lucide-react';

interface UserFormProps {
  onSubmit: (userData: UserData) => void;
  initialValues?: UserData;
  buttonText?: string;
}

export interface UserData {
  _id?: string;
  name: string;
  number: string;
  address: string;
  accounts?: AccountEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export default function UserForm({ onSubmit, initialValues, buttonText = 'Save' }: UserFormProps) {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    number: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialValues) setUserData(initialValues);
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!userData.name.trim()) newErrors.name = 'Name is required';
    if (!userData.number.trim()) newErrors.number = 'Phone is required';
    if (!userData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onSubmit(userData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          {initialValues ? 'Edit Customer' : 'Create New Customer'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
 className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2 shadow-sm 
             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="number"
            value={userData.number}
            onChange={handleChange}
 className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2 shadow-sm 
             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"          />
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={userData.address}
            onChange={handleChange}
            rows={3}
 className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2 shadow-sm 
             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
}
