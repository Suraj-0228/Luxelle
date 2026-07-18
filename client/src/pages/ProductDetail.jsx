import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Swal from 'sweetalert2';

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

  // Review states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setFormError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please write a comment.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await apiService.addProductReview(product._id, { rating, comment });
      Swal.fire({
        title: 'Review Submitted',
        text: 'Your review has been successfully added.',
        icon: 'success',
        confirmButtonColor: '#111827'
      });
      setProduct(response.product);
      setRating(0);
      setComment('');
      setIsReviewModalOpen(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
      const errMsg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      setFormError(errMsg);
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      (product.rating || 0) >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400 font-light">
                ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
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
                className="flex-1 bg-gray-900 text-white py-4 px-8 text-sm font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Add to Bag
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`bg-white border border-gray-200 py-4 px-6 hover:bg-gray-50 transition-colors tooltip cursor-pointer ${
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

      {/* Reviews Section */}
      <div className="mt-24 pt-12 border-t border-gray-150">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column: Summary */}
          <div>
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-6">Customer Reviews</h3>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-5xl font-light text-gray-900">{(product.rating || 0).toFixed(1)}</span>
              <div>
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4.5 h-4.5 ${
                        (product.rating || 0) >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Based on {product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'}</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Reviews List */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => {
                  const initial = review.name ? review.name.charAt(0).toUpperCase() : 'U';
                  return (
                    <div key={review._id} className="bg-white border border-gray-200/80 p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3.5">
                          {/* Circular Initial Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-800 text-sm font-serif">
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-green-700 bg-green-50 rounded-sm uppercase">
                                Verified
                              </span>
                            </div>
                            <span className="block text-[10px] text-gray-400 font-light uppercase tracking-widest mt-0.5">
                              {new Date(review.createdAt || review.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Rating Stars on Right */}
                        <div className="flex items-center space-x-0.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p className="text-gray-600 text-sm font-light leading-relaxed pl-13 pr-4">
                        "{review.comment}"
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm font-light italic">No reviews yet for this product.</p>
              )}
            </div>

            {/* Write a Review Section */}
            <div className="pt-8 border-t border-gray-100">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-sm cursor-pointer shadow-md hover:shadow-lg"
                  >
                    Write a Review
                  </button>

                  {/* Review Form Modal */}
                  {isReviewModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                      <div className="bg-white rounded-sm border border-gray-150 shadow-2xl max-w-lg w-full overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                          <h4 className="text-xl font-serif font-medium text-gray-900">Write a Review</h4>
                          <button
                            onClick={() => {
                              setIsReviewModalOpen(false);
                              setRating(0);
                              setComment('');
                              setFormError('');
                            }}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6">
                          {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-sm text-xs mb-4 border border-red-100 font-semibold">
                              {formError}
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                            <div className="flex items-center space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => {
                                    setRating(star);
                                    if (formError) setFormError('');
                                  }}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="focus:outline-none cursor-pointer"
                                >
                                  <svg
                                    className={`w-7 h-7 transition-colors duration-150 ${
                                      (hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comment</label>
                            <textarea
                              rows="4"
                              value={comment}
                              onChange={(e) => {
                                setComment(e.target.value);
                                if (formError) setFormError('');
                              }}
                              placeholder="Share your thoughts about this product..."
                              className="w-full text-sm text-gray-900 font-light border border-gray-300 focus:border-black focus:outline-none px-3 py-2 bg-white transition-colors placeholder-gray-300 rounded-sm"
                            ></textarea>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setIsReviewModalOpen(false);
                                setRating(0);
                                setComment('');
                                setFormError('');
                              }}
                              className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors bg-white text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSubmitReview}
                              disabled={isSubmitting}
                              className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-sm cursor-pointer disabled:opacity-50"
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-50/50 p-6 rounded-sm border border-gray-100 text-center max-w-xl">
                  <p className="text-gray-500 text-sm font-light mb-4">You must be signed in to leave a review.</p>
                  <Link to="/login" className="inline-block px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-sm">
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
