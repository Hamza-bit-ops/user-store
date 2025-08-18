'use client';

import { useState, FormEvent, useEffect } from 'react';
import { AccountEntry } from '@/types/Accounts';
import { User, Phone, MapPin, Save, Loader2 } from 'lucide-react';

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

    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!userData.number.trim()) {
      newErrors.number = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(userData.number)) {
      newErrors.number = 'Enter a valid phone number';
    }

    if (!userData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (userData.address.trim().length < 10) {
      newErrors.address = 'Enter a complete address';
    }

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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-gray-500" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="number" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2 text-gray-500" /> Phone Number
          </label>
          <input
            type="tel"
            name="number"
            value={userData.number}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.number ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" /> Address
          </label>
          <textarea
            name="address"
            value={userData.address}
            onChange={handleChange}
            placeholder="Enter complete address"
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.address ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-lg shadow-sm transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? (initialValues ? 'Updating...' : 'Creating...') : buttonText}
        </button>
      </div>
    </form>
  );
}
