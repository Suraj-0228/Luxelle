import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { currentUser } = useAuth();
  const toastService = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [fullname, setFullname] = useState(currentUser?.fullname || '');
  const [fullnameError, setFullnameError] = useState('');

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!fullname.trim()) {
      setFullnameError('Full Name is required');
      return;
    }
    setFullnameError('');
    // Mock API call / save action
    toastService.show('Profile updated successfully', 'success');
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveNotifications = () => {
    toastService.show('Preferences saved', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-left">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">Settings</h2>
        <p className="text-gray-400 z-10 relative">Manage your profile and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Account Settings</h3>
          </div>
          <div className="flex flex-col p-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-start h-auto py-4 px-6 border-none shadow-none rounded-lg transition-all text-left group cursor-pointer ${
                activeTab === 'profile' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-5 h-5 mr-3 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-gray-400'}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-sm">Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-start h-auto py-4 px-6 border-none shadow-none rounded-lg transition-all text-left group mt-1 cursor-pointer ${
                activeTab === 'notifications' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-5 h-5 mr-3 transition-colors ${activeTab === 'notifications' ? 'text-white' : 'text-gray-400'}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="font-medium text-sm">Notifications</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-10 rounded-xl shadow-lg border border-gray-100 min-h-[500px] w-full">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Personal Information</h3>
                  <p className="text-gray-500 mt-1 text-sm">Update your personal details and contact info.</p>
                </div>
                <div className="avatar placeholder">
                  <div className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-serif">
                    <span>{fullname.charAt(0) || 'A'}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl">
                <div className="grid grid-cols-1 gap-6">
                  <div className="form-control">
                    <label className="label pl-0"><span className="label-text font-bold text-gray-700 text-sm">Full Name</span></label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="input input-bordered px-4 w-full h-12 text-sm text-gray-900 bg-white border-2 border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-0 rounded-lg transition-all"
                    />
                    {fullnameError && <div className="text-red-500 text-xs mt-1">{fullnameError}</div>}
                  </div>
                  <div className="form-control">
                    <label className="label pl-0"><span className="label-text font-bold text-gray-700 text-sm">Email Address</span></label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="input input-bordered px-4 w-full h-12 text-sm bg-white border-2 border-gray-200 text-gray-500 rounded-lg"
                      readOnly
                    />
                    <label className="label pl-0 pt-2">
                      <span className="label-text-alt text-red-600 font-bold flex items-center gap-1 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email cannot be changed for security reasons
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="btn bg-gray-900 hover:bg-black text-white px-8 h-12 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto border-0 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="animate-fadeIn">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900">Notification Preferences</h3>
                <p className="text-gray-500 mt-1 text-sm">Manage how you receive updates and alerts.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div>
                    <span className="block font-bold text-gray-900 text-lg mb-1">Email Notifications</span>
                    <p className="text-sm text-gray-500">Receive daily summaries and critical alerts via email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div>
                    <span className="block font-bold text-gray-900 text-lg mb-1">Push Notifications</span>
                    <p className="text-sm text-gray-500">Get real-time updates on new orders and user signups.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div>
                    <span className="block font-bold text-gray-900 text-lg mb-1">Marketing Emails</span>
                    <p className="text-sm text-gray-500">Receive news about Luxelle features and updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketing}
                      onChange={() => handleNotificationChange('marketing')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveNotifications}
                    className="btn bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg shadow-lg border-0 cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
