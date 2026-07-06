import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import ProfileSidebar from '../components/ProfileSidebar';
import Swal from 'sweetalert2';

export default function Profile() {
  const { currentUser, setUser } = useAuth();

  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: ''
  });

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).getFullYear().toString()
    : '2026';

  useEffect(() => {
    if (currentUser) {
      setEditData({
        fullname: currentUser.fullname || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });

      apiService.getOrders(currentUser._id)
        .then(res => {
          setOrdersCount(res.data ? res.data.length : 0);
        })
        .catch(() => setOrdersCount(0));

      apiService.getWishlist(currentUser._id)
        .then(res => {
          setWishlistCount(res.products ? res.products.length : 0);
        })
        .catch(() => setWishlistCount(0));
    }
  }, [currentUser]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing && currentUser) {
      // Reset if cancelling
      setEditData({
        fullname: currentUser.fullname || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      const updatedUser = await apiService.updateUser(currentUser._id, editData);
      // Properly update context and localStorage
      setUser(updatedUser);
      setIsEditing(false);
      Swal.fire({
        title: 'Profile Updated',
        text: 'Your luxury profile details have been securely saved.',
        icon: 'success',
        confirmButtonColor: '#000',
        confirmButtonText: 'Excellent'
      });
    } catch (err) {
      console.error('Failed to update profile', err);
      Swal.fire({
        title: 'Update Failed',
        text: 'Failed to update your personal details. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Acknowledge'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-24">
        <div className="lg:flex lg:gap-24">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-80 shrink-0 lg:border-r lg:border-gray-100 lg:pr-12">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 pt-12 lg:pt-0">
            {/* Header */}
            <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight">My Profile</h1>
                {currentUser && (
                  <p className="mt-3 text-lg text-gray-500 font-light">
                    Welcome back, <span className="italic text-yellow-600 font-serif">{currentUser.fullname}</span>.
                  </p>
                )}
              </div>
              <button
                onClick={toggleEdit}
                className="px-8 py-3 bg-gray-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors shadow-lg rounded-sm border border-gray-900"
              >
                Edit Profile
              </button>
            </div>

            {currentUser && (
              <div className="space-y-8">
                {/* Stats / Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Stat Card: Orders */}
                  <div className="bg-white border border-gray-400 shadow-sm rounded-sm p-6 hover:shadow-md transition-shadow">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Purchases</span>
                    <h3 className="text-2xl font-serif text-gray-900">{ordersCount} completed orders</h3>
                    <Link
                      to="/orders"
                      className="inline-block text-xs font-medium text-gray-900 border-b border-gray-900 pb-0.5 mt-4 hover:text-black hover:border-black transition-colors"
                    >
                      View Order History
                    </Link>
                  </div>

                  {/* Stat Card: Wishlist */}
                  <div className="bg-white border border-gray-400 shadow-sm rounded-sm p-6 hover:shadow-md transition-shadow">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Wishlist</span>
                    <h3 className="text-2xl font-serif text-gray-900">{wishlistCount} saved items</h3>
                    <Link
                      to="/wishlist"
                      className="inline-block text-xs font-medium text-gray-900 border-b border-gray-900 pb-0.5 mt-4 hover:text-black hover:border-black transition-colors"
                    >
                      View My Wishlist
                    </Link>
                  </div>
                </div>

                {/* Personal Information details */}
                <div className="bg-white border border-gray-400 shadow-sm rounded-sm p-8">
                  <h2 className="text-xl font-serif text-gray-900 mb-6 pb-2 border-b border-gray-100">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Full Name</span>
                      <p className="text-lg text-gray-900 font-light">{currentUser.fullname}</p>
                    </div>
                    <div className="group">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Username</span>
                      <p className="text-lg text-gray-900 font-light">@{currentUser.username || 'not_set'}</p>
                    </div>
                    <div className="group">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email Address</span>
                      <p className="text-lg text-gray-900 font-light truncate">{currentUser.email}</p>
                    </div>
                    <div className="group">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone Number</span>
                      <p className="text-lg text-gray-900 font-light">{currentUser.phone || 'No phone number provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={toggleEdit}></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white border border-gray-400 shadow-2xl rounded-sm overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-serif text-gray-900">Edit Personal Details</h3>
              <button onClick={toggleEdit} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={editData.fullname}
                  onChange={handleInputChange}
                  className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9999999999"
                  className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
              <button onClick={toggleEdit} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="bg-gray-900 text-white px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-black transition-all shadow-lg rounded-sm border border-gray-900"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
