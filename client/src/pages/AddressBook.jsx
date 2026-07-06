import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import ProfileSidebar from '../components/ProfileSidebar';

export default function AddressBook() {
  const { currentUser, setUser } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.address) {
      setAddress({
        street: currentUser.address.street || '',
        city: currentUser.address.city || '',
        state: currentUser.address.state || '',
        zip: currentUser.address.zip || '',
        country: currentUser.address.country || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    if (name === 'zip') {
      if (!value) {
        setErrors(prev => ({ ...prev, zip: 'ZIP Code is required' }));
      } else if (!/^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, zip: 'ZIP Code must contain only numbers' }));
      } else if (value.length !== 6) {
        setErrors(prev => ({ ...prev, zip: 'ZIP Code must be exactly 6 digits' }));
      } else {
        setErrors(prev => ({ ...prev, zip: '' }));
      }
    } else {
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!address.street) errs.street = 'Street Address is required';
    if (!address.city) errs.city = 'City is required';
    if (!address.state) errs.state = 'State is required';
    
    if (!address.zip) {
      errs.zip = 'ZIP Code is required';
    } else if (!/^\d+$/.test(address.zip)) {
      errs.zip = 'ZIP Code must contain only numbers';
    } else if (address.zip.length !== 6) {
      errs.zip = 'ZIP Code must be exactly 6 digits';
    }
    
    if (!address.country) errs.country = 'Country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !currentUser) return;

    setIsSubmitting(true);

    try {
      const updatedUser = await apiService.updateUser(currentUser._id, { address });
      const newData = { ...currentUser, ...updatedUser };
      setUser(newData);

      setIsSubmitting(false);
      setSuccessMessage('Address updated successfully.');

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Error updating address', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-24">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Address Book</h1>
        </div>

        <div className="lg:flex lg:gap-24">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0 lg:border-r lg:border-gray-100 lg:pr-12">
            <ProfileSidebar />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Address Book</h1>
              <p className="mt-2 text-gray-500 font-light">Manage your shipping and billing details.</p>
            </div>

            <div className="bg-white px-8 py-10 border border-gray-400 shadow-sm rounded-sm">
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 text-sm rounded-sm border border-green-100 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <div className="group">
                      <label htmlFor="street" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gray-900 transition-colors">Street Address</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-400 font-light"
                        placeholder="123 Fashion Ave"
                      />
                      {errors.street && <div className="text-red-500 text-xs mt-1">{errors.street}</div>}
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label htmlFor="city" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gray-900 transition-colors">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-400 font-light"
                        placeholder="New York"
                      />
                      {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label htmlFor="state" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gray-900 transition-colors">State / Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-400 font-light"
                        placeholder="NY"
                      />
                      {errors.state && <div className="text-red-500 text-xs mt-1">{errors.state}</div>}
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label htmlFor="zip" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gray-900 transition-colors">ZIP / Postal Code</label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={address.zip}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-400 font-light"
                        placeholder="10001"
                      />
                      {errors.zip && <div className="text-red-500 text-xs mt-1">{errors.zip}</div>}
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label htmlFor="country" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gray-900 transition-colors">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-400 font-light"
                        placeholder="United States"
                      />
                      {errors.country && <div className="text-red-500 text-xs mt-1">{errors.country}</div>}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-block bg-gray-900 text-white py-4 px-12 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
