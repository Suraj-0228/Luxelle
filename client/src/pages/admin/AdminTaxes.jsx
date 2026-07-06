import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import Swal from 'sweetalert2';

export default function AdminTaxes() {
  const toastService = useToast();
  const { fetchTaxes } = useCart();

  const [taxesList, setTaxesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'percentage',
    rate: 0
  });

  const [errors, setErrors] = useState({});

  const loadTaxes = () => {
    apiService.getTaxes()
      .then(res => {
        setTaxesList(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching taxes', err);
        toastService.show('Failed to fetch taxes', 'error');
      });
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newVal = name === 'rate' ? Number(value) : value;

    setForm(prev => {
      const updated = { ...prev, [name]: newVal };

      // Validate on change
      const errs = { ...errors };
      if (name === 'name') {
        if (!value.trim()) errs.name = 'Tax Name is required.';
        else delete errs.name;
      }
      if (name === 'code') {
        if (!value.trim()) {
          errs.code = 'Tax Code is required.';
        } else if (!/^[a-z0-9_]+$/.test(value)) {
          errs.code = 'Tax Code must be lowercase, alphanumeric, and may contain underscores (e.g. gst, import_duty).';
        } else {
          delete errs.code;
        }
      }
      if (name === 'rate') {
        if (updated.type === 'flat') {
          if (newVal < 100 || newVal > 200) {
            errs.rate = 'Flat fee must be between 100 and 200.';
          } else {
            delete errs.rate;
          }
        } else {
          if (newVal < 0) {
            errs.rate = 'Rate must be a positive number.';
          } else {
            delete errs.rate;
          }
        }
      }
      setErrors(errs);
      return updated;
    });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setForm(prev => {
      const updated = { ...prev, type };
      const errs = { ...errors };

      // Validate rate using new type
      if (type === 'flat') {
        if (updated.rate < 100 || updated.rate > 200) {
          errs.rate = 'Flat fee must be between 100 and 200.';
        } else {
          delete errs.rate;
        }
      } else {
        if (updated.rate < 0) {
          errs.rate = 'Rate must be a positive number.';
        } else {
          delete errs.rate;
        }
      }
      setErrors(errs);
      return updated;
    });
  };

  const openModal = (tax = null) => {
    setIsModalOpen(true);
    setErrors({});
    if (tax) {
      setIsEditing(true);
      setCurrentId(tax._id);
      setForm({
        name: tax.name || '',
        code: tax.code || '',
        type: tax.type || 'percentage',
        rate: tax.rate || 0
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setForm({
        name: '',
        code: '',
        type: 'percentage',
        rate: 0
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validate all
    const errs = {};
    if (!form.name.trim()) errs.name = 'Tax Name is required.';
    if (!form.code.trim()) {
      errs.code = 'Tax Code is required.';
    } else if (!/^[a-z0-9_]+$/.test(form.code)) {
      errs.code = 'Tax Code must be lowercase, alphanumeric, and may contain underscores.';
    }

    if (form.type === 'flat') {
      if (form.rate < 100 || form.rate > 200) {
        errs.rate = 'Flat fee must be between 100 and 200.';
      }
    } else {
      if (form.rate < 0) {
        errs.rate = 'Rate must be a positive number.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      if (isEditing && currentId) {
        await apiService.updateTax(currentId, form);
        toastService.show('Tax rule updated successfully', 'success');
      } else {
        await apiService.createTax(form);
        toastService.show('Tax rule created successfully', 'success');
      }
      loadTaxes();
      fetchTaxes(); // Update active session taxes
      closeModal();
    } catch (err) {
      console.error('Error updating/creating tax', err);
      toastService.show(err.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const handleDeleteTax = (id) => {
    Swal.fire({
      title: 'Delete Tax Rule?',
      text: 'Are you sure you want to delete this tax rule?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteTax(id);
          toastService.show('Tax rule deleted successfully', 'success');
          loadTaxes();
          fetchTaxes(); // Update active session taxes
        } catch (err) {
          console.error('Error deleting tax', err);
          toastService.show('Failed to delete tax rule', 'error');
        }
      }
    });
  };

  const isFormInvalid = !form.name.trim() || !form.code.trim() || Object.keys(errors).length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-left">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">Tax Management</h2>
        <p className="text-gray-400 z-10 relative">Manage GST, import duties, and processing fees applied during checkout</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">All Taxes</h3>
          <button
            onClick={() => openModal()}
            className="btn bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 shadow-md border-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Tax Rule
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6">Tax Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Rate / Amount</th>
                <th class="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {taxesList.map(tax => (
                <tr key={tax._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="pl-6 py-4 font-bold text-gray-900">{tax.name}</td>
                  <td className="font-mono text-sm text-gray-550">{tax.code}</td>
                  <td className="capitalize">{tax.type}</td>
                  <td className="font-bold">
                    {tax.type === 'percentage' ? `${Math.round(tax.rate * 100)}%` : `₹${tax.rate}`}
                  </td>
                  <td className="pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(tax)}
                        className="btn btn-square btn-ghost text-blue-600 hover:bg-blue-50 border-0 p-2 cursor-pointer rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTax(tax._id)}
                        className="btn btn-square btn-ghost text-red-600 hover:bg-red-50 border-0 p-2 cursor-pointer rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {taxesList.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">No tax configurations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">{isEditing ? 'Edit Tax Rule' : 'Add Tax Rule'}</h3>
              <button onClick={closeModal} className="text-white/70 hover:text-white bg-transparent border-0 outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Tax Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full text-gray-900 border-2 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all rounded-lg h-12 text-sm px-3 bg-white"
                    placeholder="e.g. GST Tax"
                  />
                  {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Tax Code</label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleInputChange}
                    required
                    readOnly={isEditing}
                    className="block w-full text-gray-900 border-2 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all rounded-lg h-12 text-sm px-3 bg-white read-only:bg-gray-100 read-only:cursor-not-allowed"
                    placeholder="e.g. gst"
                  />
                  {errors.code && <div className="text-red-550 text-xs mt-1">{errors.code}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleTypeChange}
                    className="block w-full text-gray-900 border-2 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all rounded-lg h-12 text-sm px-3 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[position:right_1rem_center] bg-no-repeat"
                  >
                    <option value="percentage">Percentage (Multiplier, e.g. 0.18 for 18%)</option>
                    <option value="flat">Flat Amount (Fixed Fee, e.g. 150)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                    {form.type === 'percentage' ? 'Rate Multiplier (e.g. 0.18 for 18%)' : 'Flat Amount (e.g. 150, must be between 100-200)'}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    name="rate"
                    value={form.rate}
                    onChange={handleInputChange}
                    required
                    className="block w-full text-gray-900 border-2 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all rounded-lg h-12 text-sm px-3 bg-white"
                    placeholder="0.18"
                  />
                  {errors.rate && <div className="text-red-550 text-xs mt-1">{errors.rate}</div>}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="btn btn-ghost hover:bg-gray-250 border-0 bg-transparent cursor-pointer px-4 py-2 rounded">Cancel</button>
                  <button
                    type="submit"
                    disabled={isFormInvalid}
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
