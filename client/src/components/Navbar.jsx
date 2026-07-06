import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

export default function Navbar() {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are You Sure?',
      text: "You will be Logged out of Your Account!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setIsUserMenuOpen(false);
        navigate('/login');
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-white tracking-tight hover:opacity-90 transition-opacity">
              LUXELLE
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-300'
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-300'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/latest"
              className={({ isActive }) =>
                `hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-300'
                }`
              }
            >
              Latest
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-300'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-300'
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative group p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-200 text-gray-900 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900 animate-scaleIn">
                  {count}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-800 text-white border border-gray-500 flex items-center justify-center font-serif font-bold group-hover:bg-gray-700 transition-colors">
                      {currentUser?.fullname?.charAt(0) || 'U'}
                    </div>
                    <svg className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Panel */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-sm shadow-xl bg-gray-900 border border-gray-800 ring-1 ring-black ring-opacity-5 origin-top-right animate-fade-in-down focus:outline-none z-50">
                      <div className="px-5 py-4 border-b border-gray-800">
                        <p class="text-xs text-gray-400 uppercase tracking-wider font-bold">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate mt-1">{currentUser?.fullname}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Profile
                        </Link>
                        <Link to="/wishlist" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          My Wishlist
                        </Link>
                        <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Orders
                        </Link>
                        <Link to="/profile/settings" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </Link>
                        <button onClick={handleLogout} className="group w-full flex items-center px-5 py-3 text-sm text-red-500 hover:bg-gray-800 hover:text-red-400 transition-colors text-left">
                          <svg className="mr-3 h-4 w-4 text-red-500/70 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="hidden md:block">
                  <Link to="/login" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-6 py-2 border border-primary-600 uppercase tracking-widest text-xs transition-all duration-200">
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={toggleMenu} type="button" className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Home</Link>
            <Link to="/shop" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Shop</Link>
            <Link to="/latest" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Latest</Link>
            <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">About</Link>
            <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Contact</Link>
          </div>

          {!isLoggedIn && (
            <div className="pt-4 pb-4 border-t border-gray-800">
              <div className="px-2 space-y-1">
                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Sign in</Link>
                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Create Account</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
