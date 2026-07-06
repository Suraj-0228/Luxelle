import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
  const toastService = useToast();

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = () => {
    apiService.getAllOrders()
      .then(res => {
        setOrders(res.data || []);
      })
      .catch(() => toastService.show('Failed to load orders', 'error'));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = orders;

    // 1. Filter by status tab
    if (filterStatus !== 'All') {
      result = result.filter(o => o.orderStatus === filterStatus);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o._id.toLowerCase().includes(q) ||
        o.user?.fullname?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, filterStatus, searchQuery]);

  // Computed Stats
  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0), [orders]);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiService.updateOrderStatus(id, newStatus);
      toastService.show('Order status updated', 'success');
      loadOrders();
    } catch (err) {
      toastService.show('Failed to update status', 'error');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 className="text-4xl font-serif font-bold mb-2 z-10 relative">Orders Management</h2>
        <p className="text-gray-400 z-10 relative">Overview of your store's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Total Revenue</div>
              <div className="stat-value text-gray-900 font-serif text-2xl mt-1">₹{totalRevenue.toFixed(2)}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">Lifetime earnings</div>
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
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Total Orders</div>
              <div className="stat-value text-gray-900 font-serif text-2xl mt-1">{totalOrders}</div>
              <div className="stat-desc text-xs text-gray-400 mt-1">All time</div>
            </div>
            <div className="text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.06 0l1.97 1.97a.75.75 0 010 1.06l-4.72 4.72M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Pending</div>
              <div className="stat-value text-amber-600 font-serif text-2xl mt-1">{pendingOrders}</div>
              <div className="stat-desc text-xs text-amber-500 mt-1">Needs attention</div>
            </div>
            <div className="text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats shadow bg-white text-gray-800 border border-gray-100 rounded-lg">
          <div className="stat p-5 flex items-center justify-between">
            <div>
              <div className="stat-title text-gray-500 font-sans tracking-wide text-xs uppercase">Completed</div>
              <div className="stat-value text-green-600 font-serif text-2xl mt-1">{completedOrders}</div>
              <div className="stat-desc text-xs text-green-500 mt-1">Shipped & Delivered</div>
            </div>
            <div className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="tabs tabs-boxed bg-gray-100 p-1 flex rounded-lg">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('Processing')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'Processing' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilterStatus('Shipped')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'Shipped' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilterStatus('Delivered')}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-md border-0 cursor-pointer ${
                filterStatus === 'Delivered' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 bg-transparent'
              }`}
            >
              Delivered
            </button>
          </div>

          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered border-2 border-gray-300 w-full p-2 pl-10 bg-gray-50 focus:bg-white transition-colors text-sm text-gray-900 rounded-lg"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 text-left">Order Details</th>
                <th className="text-left">Ordering Date</th>
                <th className="text-left">Total Amount</th>
                <th className="text-left">Status</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors border-b border-gray-55 last:border-0 group">
                  <td className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-gray-200 text-gray-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xs">
                          {order.user?.fullname?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 transition-colors">{order.user?.fullname || order.user?.email || 'Guest User'}</div>
                        <div className="text-xs opacity-50">#{order._id} | {order.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-sm">
                    {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    <br />
                    <span className="text-xs opacity-50">{new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="font-bold font-serif text-lg">₹{order.totalAmount}</td>
                  <td>
                    <div className={`badge gap-2 py-1 px-3.5 rounded-full font-medium text-xs border-0 inline-block ${
                      order.orderStatus === 'Processing' || order.orderStatus === 'Pending'
                        ? 'bg-blue-50 text-blue-600'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-yellow-50 text-yellow-600'
                        : order.orderStatus === 'Delivered'
                        ? 'bg-green-50 text-green-600'
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {order.orderStatus}
                    </div>
                  </td>
                  <td className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="btn btn-square btn-ghost btn-sm text-gray-500 hover:bg-gray-100 border-0 p-2 cursor-pointer rounded"
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <select
                        value={order.orderStatus}
                        disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="select select-bordered select-sm w-full max-w-[130px] bg-white border border-gray-300 hover:border-yellow-600 focus:border-yellow-600 text-xs px-2 py-1 rounded cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        {order.orderStatus === 'Cancelled' && <option value="Cancelled">Cancelled</option>}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No orders found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative w-11/12 max-w-3xl bg-white text-gray-800 p-0 rounded-2xl shadow-2xl z-10 transition-transform duration-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-serif font-bold text-2xl tracking-wide">Order Details</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Order #{selectedOrder._id} • {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <button onClick={closeDetailsModal} className="text-white hover:text-white/80 bg-transparent border-0 outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto flex-1 text-left">
              {/* Customer Info */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Customer</h4>
                  <p className="font-bold text-gray-900">{selectedOrder.user?.fullname || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                  {(selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone) && (
                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.fullName}
                    <br />
                    {selectedOrder.shippingAddress?.street}
                    <br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}
                    <br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <h4 className="font-serif font-bold text-xl mb-4 border-b border-gray-100 pb-2">Items</h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={`${item.product?._id}-${idx}`} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                    <div className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      <img src={item.product?.image} alt={item.product?.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-gray-900">{item.product?.name || 'Product Unavailable'}</h5>
                          <p className="text-sm text-gray-500">{item.product?.brand}</p>
                          {item.selectedColor && (
                            <p className="text-sm font-medium text-gray-600 mt-1">
                              Color: <span className="text-gray-900">{item.selectedColor}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{item.product?.price}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrder.subtotal || selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Tax (18%)</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.shippingCost > 0 && (
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Processing Fee</span>
                      <span>₹{selectedOrder.shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-serif font-bold text-gray-900 pt-2 border-t border-gray-900">
                    <span>Total</span>
                    <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 m-0 rounded-b-2xl">
              <button
                type="button"
                onClick={closeDetailsModal}
                className="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 px-6 py-2 font-bold rounded-lg shadow-lg border-0 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
