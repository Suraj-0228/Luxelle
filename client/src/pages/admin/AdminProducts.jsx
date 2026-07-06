import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

export default function AdminProducts() {
  const toastService = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Fields
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    colors: ''
  });

  const loadProducts = () => {
    apiService.getProducts()
      .then(data => setProducts(data))
      .catch(() => toastService.show('Failed to load products', 'error'));
  };

  const loadCategories = () => {
    apiService.getCategories()
      .then(data => setCategories(data))
      .catch(() => toastService.show('Failed to load categories', 'error'));
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Computed Stats
  const totalProducts = filteredProducts.length;
  const avgPrice = useMemo(() => {
    if (totalProducts === 0) return 0;
    return filteredProducts.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts;
  }, [filteredProducts, totalProducts]);

  const totalCategoriesCount = useMemo(() => {
    const cats = filteredProducts.map(p => p.category).filter(Boolean);
    return new Set(cats).size;
  }, [filteredProducts]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const openModal = (product = null) => {
    setIsModalOpen(true);
    if (product) {
      setIsEditing(true);
      setCurrentId(product._id);
      setForm({
        name: product.name || '',
        brand: product.brand || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || '',
        image: product.image || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : ''
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setForm({
        name: '',
        brand: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: '',
        colors: ''
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.description || !form.category || !form.image) return;

    // Process colors string -> array
    const data = { ...form };
    if (typeof data.colors === 'string') {
      data.colors = data.colors.split(',').map(c => c.trim()).filter(c => c.length > 0);
    }

    try {
      if (isEditing && currentId) {
        await apiService.updateProduct(currentId, data);
        toastService.show('Product updated', 'success');
      } else {
        await apiService.createProduct(data);
        toastService.show('Product created', 'success');
      }
      closeModal();
      loadProducts();
    } catch (err) {
      toastService.show('Operation failed', 'error');
    }
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: 'Delete Product?',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteProduct(id);
          toastService.show('Product deleted', 'success');
          loadProducts();
        } catch (err) {
          toastService.show('Failed to delete product', 'error');
        }
      }
    });
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const isFormInvalid = !form.name || !form.brand || !form.description || !form.category || !form.image;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">Product Inventory</h2>
        <p className="text-gray-400 z-10 relative">Manage your catalog and stock</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Total Products</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">{totalProducts}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Items in catalog</div>
            </div>
            <div className="text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Avg. Price</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">₹{avgPrice.toFixed(2)}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Across all items</div>
            </div>
            <div className="text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Categories</div>
              <div className="stat-value text-gray-900 font-serif text-3xl mt-1">{totalCategoriesCount}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Active collections</div>
            </div>
            <div className="text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 001.59 0l7.25-7.25a1.125 1.125 0 000-1.59l-9.581-9.581A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered border-2 border-gray-300 w-full p-2 pl-10 bg-gray-50 focus:bg-white transition-colors text-sm text-gray-900 rounded-lg"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 btn bg-gray-900 hover:bg-black text-white border-none duration-300 px-4 py-2.5 font-bold rounded-lg cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 text-left">Product Item</th>
                <th className="text-left">Category</th>
                <th className="text-left">Price</th>
                <th className="text-left">Stock</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {paginatedProducts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors border-b border-gray-55 last:border-0 group">
                  <td className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar shadow-sm rounded-xl">
                        <div className="mask mask-squircle w-16 h-16 overflow-hidden rounded-lg">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors text-lg">{product.name}</div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-sm px-2 py-0.5 border border-gray-400 rounded text-xs">{product.category}</span>
                  </td>
                  <td className="font-bold font-serif text-lg">₹{product.price}</td>
                  <td>
                    <div className="flex items-center">
                      {(product.stock || 0) === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">Out of Stock</span>
                      ) : (product.stock || 0) <= 5 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Low Stock: {product.stock}</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">Stock: {product.stock}</span>
                      )}
                    </div>
                  </td>
                  <td className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="btn mx-1 btn-square btn-ghost text-blue-600 hover:bg-blue-50 border-0 p-2 cursor-pointer rounded"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn mx-1 btn-square btn-ghost text-red-600 hover:bg-red-50 border-0 p-2 cursor-pointer rounded"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No products found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-500 font-medium">
              Showing { (currentPage - 1) * itemsPerPage + 1 } - { (currentPage * itemsPerPage) > totalProducts ? totalProducts : (currentPage * itemsPerPage) } of { totalProducts } products
            </span>
            <div className="join shadow-sm bg-gray-500/10 flex items-center gap-1 rounded overflow-hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1.5 text-gray-900 border-0 bg-transparent cursor-pointer disabled:opacity-30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-4 py-1.5 bg-white text-gray-900 font-bold border-0 pointer-events-none text-sm">
                Page {currentPage}
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1.5 text-gray-900 border-0 bg-transparent cursor-pointer disabled:opacity-30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative w-11/12 max-w-4xl bg-white text-gray-800 p-0 rounded-2xl shadow-2xl z-10 transition-transform duration-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-serif font-bold text-2xl tracking-wide">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-sm text-gray-400 mt-1">Fill in the details below to {isEditing ? 'update the' : 'add a new'} product.</p>
              </div>
              <button onClick={closeModal} className="text-white hover:text-white/80 bg-transparent border-0 outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto flex-1">
              <form onSubmit={onSubmit} className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Form Fields */}
                <div className="flex-1 space-y-6">
                  <div className="form-control w-full">
                    <label className="label pl-1"><span className="label-text font-bold text-gray-700">Product Name</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Diamond Stud Earrings"
                      required
                      className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label pl-1"><span class="label-text font-bold text-gray-700">Brand</span></label>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleInputChange}
                        placeholder="e.g. Luxelle"
                        required
                        className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label pl-1"><span className="label-text font-bold text-gray-700">Price</span></label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label pl-1"><span className="label-text font-bold text-gray-700">Stock</span></label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label pl-1"><span className="label-text font-bold text-gray-700">Category</span></label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      required
                      className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[position:right_1rem_center] bg-no-repeat"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control w-full">
                    <label className="label pl-1"><span className="label-text font-bold text-gray-700">Colors</span></label>
                    <input
                      type="text"
                      name="colors"
                      value={form.colors}
                      onChange={handleInputChange}
                      placeholder="e.g. Red, Blue, Green (Comma separated)"
                      className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                    />
                    <label className="label pl-1"><span className="label-text-alt text-gray-400 text-xs">Separate multiple colors with commas</span></label>
                  </div>

                  <div className="form-control w-full">
                    <label className="label pl-1"><span className="label-text font-bold text-gray-700">Description</span></label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Describe the product features and materials..."
                      required
                      className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-3 bg-white h-24 text-sm transition-all rounded-lg resize-none"
                    ></textarea>
                  </div>

                  <div className="form-control w-full">
                    <label className="label pl-1"><span className="label-text font-bold text-gray-700">Image URL</span></label>
                    <input
                      type="text"
                      name="image"
                      value={form.image}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      required
                      className="block w-full border-2 border-gray-300 focus:border-yellow-600 focus:outline-none px-3 py-2 bg-white transition-all rounded-lg h-12 text-sm"
                    />
                  </div>
                </div>

                {/* Right Column: Image Preview */}
                <div className="w-full lg:w-72 flex flex-col gap-2 shrink-0">
                  <label className="label pl-1"><span className="label-text font-bold text-gray-700">Preview</span></label>
                  <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-900 bg-gray-50 flex items-center justify-center overflow-hidden relative group transition-colors">
                    {form.image ? (
                      <img src={form.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                    ) : (
                      <div className="text-center p-6 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Image preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="modal-action p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 m-0 gap-3">
              <button onClick={closeModal} className="btn btn-ghost hover:bg-gray-250 rounded-lg text-gray-600 px-6 py-2.5 border-0 bg-transparent cursor-pointer">
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isFormInvalid}
                className="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 hover:cursor-pointer px-6 py-2.5 font-bold rounded-lg shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
