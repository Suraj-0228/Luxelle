import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const {
    cartItems,
    subtotal,
    gstRate,
    importDutyRate,
    gstTax,
    importDuty,
    processingFee,
    totalPrice,
    updateQuantity,
    removeFromCart
  } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const gstPercentage = Math.round(gstRate * 100);
  const importDutyPercentage = Math.round(importDutyRate * 100);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-12">Shopping Bag</h1>

        {cartItems.length > 0 ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            {/* Cart Items List */}
            <section className="lg:col-span-7">
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product._id}-${item.product.selectedColor || ''}-${idx}`} className="flex py-10">
                    <div className="flex-shrink-0 w-24 h-32 rounded-sm overflow-hidden sm:w-32 sm:h-40 bg-gray-50">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-6 flex-1 flex flex-col justify-between">
                      <div className="sm:grid sm:grid-cols-2 sm:gap-x-6">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-gray-900">
                              <Link to={`/product/${item.product._id}`} className="hover:text-gray-600 transition-colors">
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 font-light uppercase tracking-wide">
                            {item.product.brand || 'LUXELLE'}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 font-light">{item.product.material}</p>
                          {item.product.selectedColor && (
                            <p className="mt-1 text-sm text-gray-500 font-light">Color: {item.product.selectedColor}</p>
                          )}
                          <p className="mt-4 text-base font-medium text-gray-900">₹{item.product.price}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-400">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.product.selectedColor)}
                                className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-3 py-2 text-gray-900 font-medium text-sm w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.product.selectedColor)}
                                className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              onClick={() => removeFromCart(item.product._id, item.product.selectedColor)}
                              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <section className="mt-16 bg-gray-50 px-8 py-10 lg:mt-0 lg:col-span-5 sticky top-8 rounded-sm border border-gray-400">
              <h2 className="text-xl font-serif font-medium text-gray-900 mb-8">Order Summary</h2>

              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600 font-light">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500 font-light">GST ({gstPercentage}%)</dt>
                  <dd className="text-sm font-medium text-gray-500">+₹{gstTax.toFixed(2)}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500 font-light">Import Duty ({importDutyPercentage}%)</dt>
                  <dd className="text-sm font-medium text-gray-500">+₹{importDuty.toFixed(2)}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500 font-light">Processing Fee</dt>
                  <dd className="text-sm font-medium text-gray-500">+₹{processingFee.toFixed(2)}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-500 pt-4 mt-4">
                  <dt className="text-sm text-gray-600 font-light">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
                </div>

                <div className="border-t border-gray-500 pt-6 flex items-center justify-between">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">₹{totalPrice.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gray-900 text-white py-4 px-8 text-sm font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-md"
                >
                  Proceed to Checkout
                </button>
                <p className="mt-4 text-xs text-center text-gray-500 font-light">Secure checkout. Free shipping on qualified items.</p>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Your bag is currently empty</h2>
            <p className="text-gray-500 font-light mb-10 max-w-sm mx-auto">Browse our latest collections and find something you love.</p>
            <Link
              to="/shop"
              className="inline-block bg-white border border-gray-900 text-gray-900 py-3 px-8 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Discover New Arrivals
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
