import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Latest() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getProducts()
      .then(data => {
        // Sort by newest based on createdAt or fallback to _id
        const sorted = data.sort((a, b) => {
          return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
        }).slice(0, 4);
        setProducts(sorted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching latest products:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Latest Products Page Banner */}
      <div className="relative bg-black py-16 sm:py-24 mt-5">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/8f/fa/a4/8ffaa4682a9392dbcd9c3f48e42c852f.jpg"
            alt="Latest Collection Banner"
            className="w-full h-full object-cover opacity-50 filter grayscale"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-white font-bold tracking-[0.3em] text-xs uppercase mb-4 animate-[fadeIn_1s_ease-out]">
            New Arrivals
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
            Latest Arrival Products
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-200 font-light">
            Discover the newest additions to our curated selection of luxury fashion.
          </p>
        </div>
      </div>

      {/* Products Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <div key={product._id} className="pb-5 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-lg">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-4 text-lg font-serif font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-sm text-gray-500 font-light">Check back later for new arrivals.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
