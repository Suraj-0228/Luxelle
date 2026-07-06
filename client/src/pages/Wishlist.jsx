import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Swal from 'sweetalert2';

export default function Wishlist() {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      apiService.getWishlist(currentUser._id)
        .then(res => {
          if (res && res.products) {
            setWishlistItems(res.products);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching wishlist', err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleRemove = (productId) => {
    if (!currentUser) return;
    // Call Context to update database & localStorage sync
    toggleWishlist({ _id: productId });
    // Remove locally from state
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
  };

  const handleAddToBag = (product) => {
    addToCart({ ...product, selectedColor: product.colors?.[0] || '' });
    Swal.fire({
      title: 'Added to Bag',
      text: `${product.name} has been added to your shopping bag.`,
      icon: 'success',
      confirmButtonColor: '#111827'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-24">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight">My Wishlist</h1>
              <p className="mt-3 text-lg text-gray-500 font-light">Your curated collection of favorites.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-24">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500 font-light text-sm tracking-wide">Loading your favorites...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-white px-6 py-24 text-center rounded-sm shadow-sm border border-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-serif font-medium text-gray-900">Your wishlist is empty</h3>
              <p className="mt-2 text-gray-500 font-light">Browse our collection and save your favorites.</p>
              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-block bg-gray-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
              {wishlistItems.map(product => (
                <div key={product._id} className="group relative bg-white rounded-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100">
                  {/* Image Container */}
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[15rem] w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm text-gray-700 font-medium relative">
                      <Link to={`/product/${product._id}`} className="hover:text-gray-900 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand || 'LUXELLE'}</p>
                    <div className="mt-4 flex-1 flex items-end justify-between">
                      <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToBag(product);
                      }}
                      className="mt-4 w-full bg-gray-900 text-white py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors relative z-10"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
