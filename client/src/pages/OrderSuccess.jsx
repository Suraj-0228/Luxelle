import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-10 sm:p-16 border border-gray-400 shadow-xl relative overflow-hidden">
        {/* Decorative bg element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

        <div className="text-center">
          {/* Elegant Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full border-2 border-green-500 mb-8 animate-fadeIn">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Transaction Completed</p>
          <h2 className="text-4xl font-serif font-medium text-gray-900 mb-6">Thank you for your order.</h2>

          <div className="space-y-4 mb-10 text-gray-600 font-light">
            <p>We are delighted to confirm your purchase.</p>
            <p>A confirmation email has been sent to your inbox with the details of your order. We will notify you once your items are shipped.</p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gray-300 mx-auto mb-10"></div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="group relative px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-lg hover:bg-black"
            >
              <span className="relative z-10">Continue Shopping</span>
            </Link>
            <Link
              to="/orders"
              className="px-8 py-3 border border-gray-300 hover:border-gray-900 duration-300 text-gray-900 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              View My Orders
            </Link>
          </div>

          <p className="mt-12 text-xs text-gray-400 font-light">
            Order ID: <span className="font-medium text-gray-600">#{orderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
