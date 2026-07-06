import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const toastService = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isProductInWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiService.getProductById(id)
        .then(data => {
          setProduct(data);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching product details:', err);
          setIsLoading(false);
        });
    }
  }, [id]);

  const selectColor = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toastService.show('Please login to add items to your bag', 'error');
      navigate('/login');
      return;
    }

    if (product) {
      const productToAdd = { ...product, selectedColor };
      addToCart(productToAdd);
    }
  };

  const handleToggleWishlist = () => {
    if (!isLoggedIn) {
      toastService.show('Please login to manage your wishlist', 'error');
      navigate('/login');
      return;
    }

    if (product) {
      toggleWishlist(product);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Product not found</h3>
        <Link to="/shop" className="text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-widest text-xs font-bold border-b border-yellow-600 pb-1">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-20">
      {/* Breadcrumbs */}
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
        {/* Image Section */}
        <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105 origin-center"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-900">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 flex flex-col h-full justify-center">
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
              {product.brand || 'LUXELLE COLLECTION'}
            </h3>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-gray-900">₹{product.price}</p>
          </div>

          <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-8 border-t border-b border-gray-100 mb-10">
            <div>
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Category</span>
              <span className="text-sm font-medium text-gray-900">{product.category}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Material</span>
              <span className="text-sm font-medium text-gray-900">{product.material || 'Premium Material'}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Availability</span>
              {product.stock > 0 ? (
                product.stock > 5 ? (
                  <span className="text-sm font-medium text-green-600">Available</span>
                ) : (
                  <span className="text-sm font-medium text-amber-600 animate-pulse">
                    Low Stock: Only {product.stock} left
                  </span>
                )
              ) : (
                <span className="text-sm font-medium text-red-600">Sold Out</span>
              )}
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Shipping</span>
              <span className="text-sm font-medium text-gray-900">Free Standard</span>
            </div>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-3">Color</span>
              <div className="flex items-center space-x-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => selectColor(color)}
                    className={`w-8 h-8 rounded-full border border-gray-200 focus:outline-none transition-all duration-200 ${
                      selectedColor === color ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-700 font-medium">{selectedColor}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-4 px-8 text-sm font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Add to Bag
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`bg-white border border-gray-200 py-4 px-6 hover:bg-gray-50 transition-colors tooltip ${
                  isProductInWishlist ? 'text-red-500 border-red-200' : 'text-gray-900'
                }`}
                aria-label="Add to Wishlist"
              >
                {isProductInWishlist ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="text-xs text-center text-gray-400 mt-2">Free 30-day returns. Secure checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
