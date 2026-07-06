import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function ProfileSidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-4 py-3 text-sm transition-all duration-300 border-l-[3px] border-transparent rounded-r-lg ${
      isActive
        ? 'bg-white/5 text-white border-primary shadow-inner'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  const isActive = (path, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  return (
    <div className="w-full h-full lg:min-h-[600px] py-10 px-8 bg-gray-900 text-white rounded-sm shadow-xl">
      {/* Member Identity Card */}
      <div className="mb-10 text-center pb-8 border-b border-gray-800">
        <div className="relative inline-block mb-4">
          <div className="h-20 w-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto border-2 border-white/30">
            <span className="text-3xl font-serif text-white font-medium">
              {currentUser?.fullname?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Welcome Back</p>
          <h3 className="text-xl font-serif text-white leading-tight mb-3 mx-auto max-w-[200px]">{currentUser?.fullname}</h3>
          <span className="inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-gray-900 bg-white px-3 py-1 rounded-full">
            Premium Member
          </span>
        </div>
      </div>

      {/* Navigation Suite */}
      <nav className="space-y-2">
        {/* Dashboard */}
        <NavLink to="/profile" className={navLinkClass} end>
          <svg
            className={`w-5 h-5 transition-colors group-hover:text-primary ${isActive('/profile', true) ? 'text-primary' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="font-medium tracking-wide">Dashboard</span>
        </NavLink>

        {/* Wishlist */}
        <NavLink to="/wishlist" className={navLinkClass}>
          <svg
            className={`w-5 h-5 transition-colors group-hover:text-red-600 ${isActive('/wishlist') ? 'text-primary' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium tracking-wide">My Wishlist</span>
        </NavLink>

        {/* Order History */}
        <NavLink to="/orders" className={navLinkClass}>
          <svg
            className={`w-5 h-5 transition-colors group-hover:text-emerald-500 ${isActive('/orders') ? 'text-emerald-500' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-medium tracking-wide">Order History</span>
        </NavLink>

        {/* Settings */}
        <NavLink to="/profile/settings" className={navLinkClass}>
          <svg
            className={`w-5 h-5 transition-colors group-hover:text-cyan-700 ${isActive('/profile/settings') ? 'text-cyan-700' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium tracking-wide">Settings</span>
        </NavLink>

        {/* Sign Out */}
        <div className="pt-6 mt-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-4 px-4 py-3 text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 rounded-lg cursor-pointer"
          >
            <svg className="w-5 h-5 transition-colors group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium tracking-wide">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
