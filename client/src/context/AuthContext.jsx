import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.isAdmin || false;

  useEffect(() => {
    if (currentUser && currentUser._id) {
      refreshUser(currentUser._id);
    }
  }, []);

  const refreshUser = async (userId) => {
    try {
      const updatedUser = await apiService.getUserById(userId);
      // Ensure we preserve the token from current state if backend doesn't return it in refresh
      const token = currentUser?.token;
      const userToSet = { ...updatedUser, token: token || updatedUser.token };
      setUser(userToSet);
    } catch (err) {
      console.error('Failed to refresh user profile data', err);
    }
  };

  const loginUser = async (credentials) => {
    const user = await apiService.login(credentials);
    setUser(user);
    return user;
  };

  const registerUser = async (userData) => {
    return await apiService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const setUser = (user) => {
    if (user) {
      const token = user.token || currentUser?.token;
      const userToSet = { ...user, token };
      localStorage.setItem('user', JSON.stringify(userToSet));
      setCurrentUser(userToSet);
    } else {
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn,
      isAdmin,
      login: loginUser,
      register: registerUser,
      logout,
      setUser,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
