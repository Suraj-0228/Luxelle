import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import ProfileSidebar from '../components/ProfileSidebar';
import Swal from 'sweetalert2';

export default function Settings() {
  const { currentUser, setUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('security');
  const [passwordModel, setPasswordModel] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addressModel, setAddressModel] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    resetAddressModel();
  }, [currentUser]);

  const resetAddressModel = () => {
    if (currentUser && currentUser.address) {
      setAddressModel({
        street: currentUser.address.street || '',
        city: currentUser.address.city || '',
        state: currentUser.address.state || '',
        zip: currentUser.address.zip || '',
        country: currentUser.address.country || ''
      });
    } else {
      setAddressModel({ street: '', city: '', state: '', zip: '', country: '' });
    }
  };

  const hasAddress = () => {
    const addr = currentUser?.address;
    return !!(addr && addr.street && addr.city);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordModel(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressModel(prev => ({ ...prev, [name]: value }));
  };

  const changePassword = async () => {
    if (!passwordModel.currentPassword || !passwordModel.newPassword || !passwordModel.confirmPassword) {
      Swal.fire({
        title: 'Missing Fields',
        text: 'Please fill in all password fields.',
        icon: 'warning',
        confirmButtonColor: '#000'
      });
      return;
    }

    if (passwordModel.newPassword !== passwordModel.confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'New passwords do not match.',
        icon: 'error',
        confirmButtonColor: '#000'
      });
      return;
    }

    if (passwordModel.newPassword.length < 6) {
      Swal.fire({
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        icon: 'warning',
        confirmButtonColor: '#000'
      });
      return;
    }

    const payload = {
      currentPassword: passwordModel.currentPassword,
      newPassword: passwordModel.newPassword
    };

    try {
      const updatedUser = await apiService.updateUser(currentUser._id, payload);
      setUser(updatedUser);
      setPasswordModel({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Swal.fire({
        title: 'Password Changed',
        text: 'Your password has been successfully updated.',
        icon: 'success',
        confirmButtonColor: '#000'
      });
    } catch (err) {
      console.error('Failed to change password', err);
      const errMsg = err.response?.data?.message || 'Failed to change password. Please check your current password.';
      Swal.fire({
        title: 'Error',
        text: errMsg,
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const saveAddress = async () => {
    if (!addressModel.street || !addressModel.city || !addressModel.state || !addressModel.zip || !addressModel.country) {
      Swal.fire({
        title: 'Missing Fields',
        text: 'Please, fill in all address fields!!',
        icon: 'warning',
        confirmButtonColor: '#000'
      });
      return;
    }

    try {
      const updatedUser = await apiService.updateUser(currentUser._id, { address: addressModel });
      setUser(updatedUser);
      setIsEditingAddress(false);
      setIsAddingAddress(false);
      Swal.fire({
        title: 'Address Saved',
        text: 'Your Address has been saved Successfully.',
        icon: 'success',
        confirmButtonColor: '#000'
      });
    } catch (err) {
      console.error('Failed to save address', err);
      Swal.fire({
        title: 'Error!!',
        text: 'Failed to save Address, Please try again!!',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const deleteAddress = () => {
    Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to remove your saved address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const emptyAddress = { street: '', city: '', state: '', zip: '', country: '' };
        try {
          const updatedUser = await apiService.updateUser(currentUser._id, { address: emptyAddress });
          setUser(updatedUser);
          setAddressModel(emptyAddress);
          Swal.fire({
            title: 'Address Deleted',
            text: 'Your address has been removed.',
            icon: 'success',
            confirmButtonColor: '#000'
          });
        } catch (err) {
          console.error('Failed to delete address', err);
        }
      }
    });
  };

  const openDeleteModal = () => {
    setDeleteConfirmText('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    try {
      await apiService.deleteUser(currentUser._id);
      setIsDeleteModalOpen(false);
      Swal.fire({
        title: 'Account Deleted',
        text: 'Your account has been deleted permanently. You will now be signed out.',
        icon: 'success',
        confirmButtonColor: '#000'
      }).then(() => {
        logout();
      });
    } catch (err) {
      console.error('Failed to delete account', err);
      Swal.fire({
        title: 'Deletion Failed',
        text: 'Could not delete account. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-24">
        <div className="lg:flex lg:gap-24">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-80 shrink-0 lg:border-r lg:border-gray-100 lg:pr-12">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 pt-12 lg:pt-0">
            {/* Header */}
            <div className="mb-12 border-b border-gray-100 pb-8">
              <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight">Account Settings</h1>
              <p className="mt-3 text-lg text-gray-500 font-light">Manage your password, shipping address, and account status.</p>
            </div>

            {/* Tabs navigation */}
            <div className="flex border-b border-gray-200 mb-8 gap-8">
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 font-sans transition-all duration-200 cursor-pointer ${
                  activeTab === 'security' ? 'border-black text-black' : 'border-transparent text-gray-400'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 font-sans transition-all duration-200 cursor-pointer ${
                  activeTab === 'address' ? 'border-black text-black' : 'border-transparent text-gray-400'
                }`}
              >
                Address Book
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 font-sans transition-all duration-200 cursor-pointer ${
                  activeTab === 'danger' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400'
                }`}
              >
                Danger Zone
              </button>
            </div>

            {currentUser && (
              <div className="space-y-12">
                {/* 1. Change Password Section */}
                {activeTab === 'security' && (
                  <div className="bg-white border border-gray-400 shadow-sm rounded-sm p-8 animate-fadeIn">
                    <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 pb-2 border-b border-gray-100">Security & Password</h2>

                    <div className="max-w-md space-y-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordModel.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 pr-12 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            {!showCurrentPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordModel.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Minimum 6 characters"
                            className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 pr-12 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            {!showNewPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordModel.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Re-type new password"
                            className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 pr-12 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            {!showConfirmPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={changePassword}
                        className="px-8 py-3 bg-gray-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors shadow-lg rounded-sm border border-gray-900 mt-2 cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Address Book Section */}
                {activeTab === 'address' && (
                  <div className="bg-white border border-gray-400 shadow-sm rounded-sm p-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                      <h2 className="text-xl font-serif text-gray-900 font-bold">Shipping Address</h2>
                      {!hasAddress() && !isAddingAddress && (
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="px-5 py-2 bg-gray-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors rounded-sm"
                        >
                          Add Address
                        </button>
                      )}
                    </div>

                    {/* Address Display Mode */}
                    {hasAddress() && !isEditingAddress && (
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm max-w-xl">
                          <div className="text-sm text-gray-500 font-light space-y-1">
                            <p className="text-base text-gray-900 font-normal mb-2">Saved Shipping Destination</p>
                            <p>{currentUser.fullname}</p>
                            <p>{currentUser.address.street}</p>
                            <p>{currentUser.address.city}, {currentUser.address.state}, {currentUser.address.zip}</p>
                            <p className="uppercase tracking-wider font-medium text-gray-700 mt-1">{currentUser.address.country}</p>
                            {currentUser.phone && <p className="pt-2 text-xs">Phone: {currentUser.phone}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setIsEditingAddress(true)}
                            className="px-6 py-2 border border-gray-900 text-gray-900 text-xs uppercase font-bold tracking-widest hover:bg-gray-900 hover:text-white transition-colors rounded-sm cursor-pointer"
                          >
                            Edit Address
                          </button>
                          <button
                            onClick={deleteAddress}
                            className="px-6 py-2 border border-red-600 text-red-600 text-xs uppercase font-bold tracking-widest hover:bg-red-600 hover:text-white transition-colors rounded-sm cursor-pointer"
                          >
                            Delete Address
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Address Edit / Add Inline Form */}
                    {(isEditingAddress || isAddingAddress) && (
                      <div className="max-w-xl space-y-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Street Address</label>
                          <textarea
                            name="street"
                            value={addressModel.street}
                            onChange={handleAddressChange}
                            placeholder="123 Main St"
                            className="w-full h-[90px] text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                            <input
                              type="text"
                              name="city"
                              value={addressModel.city}
                              onChange={handleAddressChange}
                              placeholder="New York"
                              className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                            />
                          </div>
                          <div>
                            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400">State / Province</label>
                            <input
                              type="text"
                              name="state"
                              value={addressModel.state}
                              onChange={handleAddressChange}
                              placeholder="NY"
                              className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">ZIP / Postal Code</label>
                            <input
                              type="text"
                              name="zip"
                              value={addressModel.zip}
                              onChange={handleAddressChange}
                              placeholder="10001"
                              className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                            <input
                              type="text"
                              name="country"
                              value={addressModel.country}
                              onChange={handleAddressChange}
                              placeholder="United States"
                              className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <button
                            onClick={saveAddress}
                            className="px-8 py-3 bg-gray-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors shadow-lg rounded-sm border border-gray-900 cursor-pointer"
                          >
                            Save Address
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingAddress(false);
                              setIsAddingAddress(false);
                              resetAddressModel();
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-500 hover:text-gray-900 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* No Address State */}
                    {!hasAddress() && !isAddingAddress && (
                      <div className="py-6 text-center border border-dashed border-gray-300 rounded-sm">
                        <p className="text-sm text-gray-500 font-light">No saved shipping address found.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Danger Zone */}
                {activeTab === 'danger' && (
                  <div className="bg-red-50/10 border border-red-300 shadow-sm rounded-sm p-8 animate-fadeIn">
                    <h2 className="text-xl font-serif text-red-700 mb-4 pb-2 border-b border-red-100 font-bold">Danger Zone</h2>
                    <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed max-w-xl">
                      Once you delete your account, your purchase history, profile settings, and wishlist will be permanently erased. This action is final and cannot be reversed.
                    </p>
                    <button
                      onClick={openDeleteModal}
                      className="px-8 py-3 bg-red-600 text-white text-xs uppercase font-bold tracking-widest hover:bg-red-700 transition-colors shadow-lg rounded-sm border border-red-600 cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Deletion Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal}></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white border border-red-300 shadow-2xl rounded-sm overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-red-50/20">
              <h3 className="text-xl font-serif text-red-700 font-bold">Delete Account</h3>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                This will permanently close your account and delete your access immediately. To proceed with the deletion, please type the word "<strong className="text-red-700 font-bold">DELETE</strong>" in the box below.
              </p>

              <div>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full text-base text-gray-900 font-light border border-gray-300 focus:border-red-600 focus:outline-none px-3 py-2 bg-transparent transition-colors placeholder-gray-300 rounded-sm mt-1 uppercase"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
              <button onClick={closeDeleteModal} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-red-700 transition-all shadow-lg rounded-sm border border-red-600 cursor-pointer"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
