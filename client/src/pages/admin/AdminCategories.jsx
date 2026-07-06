import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

export default function AdminCategories() {
  const toastService = useToast();

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');

  const loadCategories = () => {
    apiService.getCategories()
      .then(data => setCategories(data))
      .catch(() => toastService.show('Failed to load categories', 'error'));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (cat = null) => {
    setIsModalOpen(true);
    if (cat) {
      setIsEditing(true);
      setCurrentId(cat._id);
      setName(cat.name || '');
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setName('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (isEditing && currentId) {
        await apiService.updateCategory(currentId, { name });
        toastService.show('Category updated', 'success');
      } else {
        await apiService.createCategory({ name });
        toastService.show('Category created', 'success');
      }
      closeModal();
      loadCategories();
    } catch (err) {
      toastService.show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteCategory = (id) => {
    Swal.fire({
      title: 'Remove Category?',
      text: 'Are you sure? This will not affect existing products but the category will be removed from future selection.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteCategory(id);
          toastService.show('Category removed', 'success');
          loadCategories();
        } catch (err) {
          toastService.show('Failed to remove category', 'error');
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-left">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">Category Management</h2>
        <p className="text-gray-400 z-10 relative">Create and organize your product collections</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">All Categories</h3>
          <button
            onClick={() => openModal()}
            className="btn bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 border-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6">Category Name</th>
                <th>Created At</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories.map(cat => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="pl-6 py-4 font-bold text-gray-900">{cat.name}</td>
                  <td>{new Date(cat.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(cat)}
                        className="btn btn-square btn-ghost text-emerald-600 hover:bg-blue-50 border-0 p-2 cursor-pointer rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="btn btn-ghost text-red-600 hover:bg-red-50 border-0 p-2 cursor-pointer rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">{isEditing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={closeModal} className="text-white/70 hover:text-white bg-transparent border-0 outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <form onSubmit={onSubmit}>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-gray-700">Category Name</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input input-bordered border-2 mt-1 px-3 w-full bg-white text-gray-900 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all rounded-lg h-12 text-sm"
                    placeholder="e.g. Purses"
                  />
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="btn btn-ghost hover:bg-gray-250 border-0 bg-transparent cursor-pointer px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 hover:cursor-pointer ml-3 px-6 py-2.5 font-bold rounded-lg shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
