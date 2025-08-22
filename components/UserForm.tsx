'use client';

import { useState, FormEvent, useEffect } from 'react';
import { AccountEntry } from '@/types/Accounts';
import { User, Phone, MapPin, Save, Loader2, Mail, UserPlus } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
    <div className="max-w-4xl mx-auto">
      <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-2xl mr-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            {initialValues ? 'Edit User' : 'Create New User'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="flex items-center text-base font-semibold text-gray-200 mb-3">
              <User className="w-5 mr-3 text-indigo-400" /> Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-4 pl-12 rounded-2xl border text-base focus:outline-none focus:ring-2 transition-all duration-300 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 ${
                  errors.name ? 'border-pink-500/50 focus:ring-pink-500' : 'border-white/20 focus:ring-indigo-500 focus:border-indigo-500/50'
                }`}
              />
              <User className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            </div>
            {errors.name && <p className="text-sm text-pink-400 mt-2 flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span> {errors.name}</p>}
          </div>

          {/* Phone and Address Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phone Field */}
            <div>
              <label htmlFor="number" className="flex items-center text-base font-semibold text-gray-200 mb-3">
                <Phone className="w-5 h-5 mr-3 text-purple-400" /> Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="number"
                  value={userData.number}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className={`w-full px-4 py-4 pl-12 rounded-2xl border text-base focus:outline-none focus:ring-2 transition-all duration-300 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 ${
                    errors.number ? 'border-pink-500/50 focus:ring-pink-500' : 'border-white/20 focus:ring-indigo-500 focus:border-indigo-500/50'
                  }`}
                />
                <Phone className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              </div>
              {errors.number && <p className="text-sm text-pink-400 mt-2 flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span> {errors.number}</p>}
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="flex items-center text-base font-semibold text-gray-200 mb-3">
                <MapPin className="w-5 h-5 mr-3 text-pink-400" /> Address
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows={4}
                  className={`w-full px-4 py-4 pl-12 rounded-2xl border text-base resize-none focus:outline-none focus:ring-2 transition-all duration-300 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 ${
                    errors.address ? 'border-pink-500/50 focus:ring-pink-500' : 'border-white/20 focus:ring-indigo-500 focus:border-indigo-500/50'
                  }`}
                />
                <MapPin className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              </div>
              {errors.address && <p className="text-sm text-pink-400 mt-2 flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span> {errors.address}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className={`group inline-flex items-center px-8 py-4 text-base font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 ${
                loading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white focus:ring-2 focus:ring-indigo-500 shadow-indigo-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  {initialValues ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 mr-2 group-hover:animate-pulse" />
                  {buttonText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}