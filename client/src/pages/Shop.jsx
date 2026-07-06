import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'default';

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedSort, setSelectedSort] = useState(sortParam);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹1000', min: 0, max: 100, value: '0-1000' },
    { label: '₹1000 - ₹3000', min: 100, max: 300, value: '1000-3000' },
    { label: '₹3000 - ₹5000', min: 300, max: 500, value: '3000-5000' },
    { label: 'Over ₹5000', min: 500, max: Infinity, value: '5000-inf' }
  ];

  // Fetch Categories
  useEffect(() => {
    apiService.getCategories()
      .then(data => {
        setCategories(['All', ...data.map(c => c.name)]);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Fetch Products
  useEffect(() => {
    apiService.getProducts()
      .then(data => {
        setAllProducts(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Filter Products
  useEffect(() => {
    let filtered = [...allProducts];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (selectedPriceRange !== 'All') {
      const range = priceRanges.find(r => r.value === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(p => {
          const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // 4. Sort Filter
    if (selectedSort === 'newest') {
      filtered = filtered.sort((a, b) => {
        return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset page on filter
  }, [allProducts, selectedCategory, searchQuery, selectedPriceRange, selectedSort]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-900 text-white my-5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
            alt="Boutique Header"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Collection</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Search */}
            <div className="md:col-span-12 lg:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-3 text-gray-900 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-900 sm:text-sm transition-shadow"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-6 lg:col-span-3 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 text-gray-900 text-sm border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none rounded-sm bg-white cursor-pointer appearance-none transition-colors"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Filter */}
            <div className="md:col-span-6 lg:col-span-3 relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 text-gray-900 text-sm border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none rounded-sm bg-white cursor-pointer appearance-none transition-colors"
              >
                {priceRanges.map((range, idx) => (
                  <option key={idx} value={range.value}>{range.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-4">
            <span>Showing {paginatedProducts.length} of {filteredProducts.length} results</span>
            {(selectedCategory !== 'All' || selectedPriceRange !== 'All' || searchQuery) && (
              <span className="text-yellow-600 font-medium">Filters applied</span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {paginatedProducts.map(product => (
            <div key={product._id} className="pb-5 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm transition-colors ${
                    currentPage === page ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
