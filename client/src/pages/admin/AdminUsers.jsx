import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

export default function AdminUsers() {
  const toastService = useToast();

  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = () => {
    apiService.getUsers()
      .then(data => setUsers(data))
      .catch(() => toastService.show('Failed to load users', 'error'));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Filter by Status/Role
    if (filterStatus === 'Admins') {
      result = result.filter(u => u.isAdmin);
    } else if (filterStatus === 'Blocked') {
      result = result.filter(u => u.isBlocked);
    }

    // 2. Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.fullname?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [users, filterStatus, searchQuery]);

  // Computed Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;

  const toggleBlock = async (user) => {
    const newStatus = !user.isBlocked;
    try {
      await apiService.updateUser(user._id, { isBlocked: newStatus });
      toastService.show(`User ${newStatus ? 'blocked' : 'unblocked'}`, 'success');
      loadUsers();
    } catch (err) {
      toastService.show('Failed to update status', 'error');
    }
  };

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: 'Delete User?',
      text: 'Are you sure you want to delete this user? This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteUser(id);
          toastService.show('User deleted', 'success');
          loadUsers();
        } catch (err) {
          toastService.show('Failed to delete user', 'error');
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">User Management</h2>
        <p className="text-gray-400 z-10 relative">Manage access and user roles</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Total Users</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">{totalUsers}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Registered accounts</div>
            </div>
            <div className="text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0112.75 21.5h-1.5a2.25 2.25 0 01-2.25-2.263V19.13m-4.121-1.22c.451.81.996 1.545 1.621 2.18M4.5 19.128a9.38 9.38 0 01-2.625.372 9.336 9.336 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M9 16.279A8.986 8.986 0 005.625 18H5.25a2.25 2.25 0 01-2.25-2.263v-3.486c0-.986.756-1.815 1.74-1.92a8.905 8.905 0 015.71 0c.983.104 1.74.934 1.74 1.92v3.487a2.25 2.25 0 01-2.25 2.263h-.375c-.886 0-1.72-.279-2.4-.786z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Active Users</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">{activeUsers}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Currently active</div>
            </div>
            <div className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Blocked</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">{blockedUsers}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Restricted accounts</div>
            </div>
            <div className="text-red-650">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="tabs tabs-boxed bg-gray-100 p-1 flex rounded-lg">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilterStatus('Admins')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'Admins' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setFilterStatus('Blocked')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'Blocked' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              Blocked
            </button>
          </div>

          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered border-2 border-gray-300 w-full p-2 pl-10 bg-gray-50 focus:bg-white transition-colors text-sm text-gray-900 rounded-lg"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 text-left">User Profile</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">Status</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors border-b border-gray-55 last:border-0 group">
                  <td className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-gray-200 text-gray-600 rounded-full w-12 h-12 shadow-sm border border-gray-100 flex items-center justify-center font-bold text-lg">
                          {user.fullname?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors text-lg">{user.fullname}</div>
                        <div className="text-xs opacity-50">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-gray-600">{user.email}</td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      user.isAdmin ? 'bg-gray-900 text-white border border-gray-900' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={`font-medium ${user.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="pr-6 text-right">
                    {!user.isAdmin ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleBlock(user)}
                          className={`btn mx-2 btn-square btn-ghost border-0 p-2 cursor-pointer rounded ${
                            user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={user.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {user.isBlocked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn mx-2 btn-square btn-ghost text-red-650 hover:bg-red-50 border-0 p-2 cursor-pointer rounded"
                          title="Delete User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
