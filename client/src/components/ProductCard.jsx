import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const toastService = useToast();
  const navigate = useNavigate();

  const isProductInWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      toastService.show('Please login to add items to your bag', 'error');
      navigate('/login');
      return;
    }

    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      toastService.show('Please login to manage your wishlist', 'error');
      navigate('/login');
      return;
    }

    toggleWishlist(product);
  };

  return (
    <div className="group relative cursor-pointer block">
      {/* Image Container with Overlays */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4 rounded-sm">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-white px-2 py-1 text-[10px] uppercase font-bold tracking-widest text-gray-900 border border-gray-100 shadow-sm">
            New
          </span>
        )}

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors ${
              isProductInWishlist ? 'text-red-500 hover:text-red-500' : 'text-gray-900'
            }`}
          >
            {isProductInWishlist ? (
              // Filled Heart (Active)
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Outline Heart (Default)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Add to Bag Button (Slide Up) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 w-full bg-gray-900 text-white py-3 text-xs font-bold uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black"
        >
          Add to Bag
        </button>
      </div>

      {/* Product Info */}
      <div className="text-left px-5">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand || 'Luxelle'}</p>
          {/* Mock Rating Stars */}
          <div className="flex items-center">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] text-gray-500 ml-1">4.5</span>
          </div>
        </div>

        <h3 className="text-sm font-serif text-gray-900 mb-1 truncate hover:text-gray-600 transition-colors">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>

        <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
      </div>
    </div>
  );
}
