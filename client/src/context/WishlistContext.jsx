import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser, isLoggedIn } = useAuth();
  const toastService = useToast();
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    loadWishlist();
  }, [currentUser]);

  const loadWishlist = async () => {
    if (!currentUser || !currentUser._id) {
      setWishlistIds(new Set());
      return;
    }

    try {
      const res = await apiService.getWishlist(currentUser._id);
      if (res && res.products) {
        const ids = new Set(res.products.map(p => p._id));
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error('Error loading wishlist', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (product) => {
    if (!currentUser || !currentUser._id) {
      toastService.show('Please sign in to add to wishlist', 'info');
      return;
    }

    const isIn = wishlistIds.has(product._id);

    if (isIn) {
      try {
        await apiService.removeFromWishlist(currentUser._id, product._id);
        setWishlistIds(ids => {
          const newIds = new Set(ids);
          newIds.delete(product._id);
          return newIds;
        });
        toastService.show('Removed from wishlist', 'info');
      } catch (err) {
        console.error('Error removing from wishlist', err);
        toastService.show('Failed to remove from wishlist', 'error');
      }
    } else {
      try {
        await apiService.addToWishlist(currentUser._id, product._id);
        setWishlistIds(ids => {
          const newIds = new Set(ids);
          newIds.add(product._id);
          return newIds;
        });
        toastService.show('Added to wishlist', 'success');
      } catch (err) {
        console.error('Error adding to wishlist', err);
        toastService.show('Failed to add to wishlist', 'error');
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser || !currentUser._id) return;

    try {
      await apiService.removeFromWishlist(currentUser._id, productId);
      setWishlistIds(ids => {
        const newIds = new Set(ids);
        newIds.delete(productId);
        return newIds;
      });
      toastService.show('Removed from wishlist', 'info');
    } catch (err) {
      console.error('Error removing from wishlist', err);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      loadWishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
