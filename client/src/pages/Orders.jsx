import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import ProfileSidebar from '../components/ProfileSidebar';
import Swal from 'sweetalert2';

export default function Orders() {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const gstRate = useMemo(() => {
    const t = taxes.find(tax => tax.code === 'gst');
    return t ? t.rate : 0.18;
  }, [taxes]);

  const importDutyRate = useMemo(() => {
    const t = taxes.find(tax => tax.code === 'import_duty');
    return t ? t.rate : 0.05;
  }, [taxes]);

  const processingFeeAmount = useMemo(() => {
    const t = taxes.find(tax => tax.code === 'processing_fee');
    return t ? t.rate : 150;
  }, [taxes]);

  useEffect(() => {
    apiService.getTaxes()
      .then(res => setTaxes(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      apiService.getOrders(currentUser._id)
        .then(res => {
          const sortedOrders = (res.data || []).sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
          setOrders(sortedOrders);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching orders', err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
  }, [orders, currentPage]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
    setIsDetailsModalOpen(false);
  };

  const handleCancelOrder = (order) => {
    Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.cancelOrder(order._id);
          setOrders(prev => prev.map(o => {
            if (o._id === order._id) {
              return { ...o, orderStatus: 'Cancelled' };
            }
            return o;
          }));
          Swal.fire({
            title: 'Cancelled!',
            text: 'Your order has been cancelled successfully.',
            icon: 'success',
            confirmButtonColor: '#111827'
          });
        } catch (err) {
          console.error('Error cancelling order', err);
          Swal.fire({
            title: 'Error',
            text: err.response?.data?.error || 'Failed to cancel order.',
            icon: 'error',
            confirmButtonColor: '#111827'
          });
        }
      }
    });
  };

  const downloadInvoice = async (order) => {
    let gstRate = 0.18; // default 18% GST
    let importDutyRate = 0.05; // default 5%
    let processingFeeAmount = 150; // default 150

    const gstTaxObj = taxes.find(t => t.code === 'gst');
    const importDutyObj = taxes.find(t => t.code === 'import_duty');
    const processingFeeObj = taxes.find(t => t.code === 'processing_fee');

    if (gstTaxObj) gstRate = gstTaxObj.rate;
    if (importDutyObj) importDutyRate = importDutyObj.rate;
    if (processingFeeObj) processingFeeAmount = processingFeeObj.rate;

    const orderSubtotal = order.items.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0);
    const gstTax = orderSubtotal * gstRate;
    const importDuty = orderSubtotal * importDutyRate;
    const processingFee = orderSubtotal > 0 ? processingFeeAmount : 0;

    const displayedTotal = order.totalAmount || (orderSubtotal + gstTax + importDuty + processingFee).toFixed(2);

    let printContents = `
      <div style="font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif; width: 800px; padding: 50px; background: #ffffff; color: #1f2937; box-sizing: border-box;">
        <div style="border: 1px solid #e5e7eb; padding: 45px; background: #ffffff; position: relative; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Decorative Top Black Border Bar -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #111827;"></div>

          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px;">
            <div>
              <h1 style="margin: 0; font-size: 40px; letter-spacing: 5px; font-family: 'Playfair Display', 'Georgia', serif; font-weight: 500; text-transform: uppercase; color: #111827; line-height: 1;">Luxelle</h1>
              <p style="margin: 8px 0 0; color: #4b5563; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Maison de Couture</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Playfair Display', 'Georgia', serif; font-weight: 600;">Invoice</h2>
              <div style="font-size: 12px; color: #4b5563; line-height: 1.6; font-weight: 300;">
                <p style="margin: 0;">Invoice ID: <strong style="color: #111827; font-family: monospace; font-size: 13px;">#${order._id.substring(order._id.length - 8).toUpperCase()}</strong></p>
                <p style="margin: 0;">Date: <span style="color: #111827; font-weight: 400;">${new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                <p style="margin: 0;">Status: <span style="display: inline-block; background: #f3f4f6; color: #111827; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 2px 8px; border-radius: 9999px; margin-top: 4px;">${order.orderStatus}</span></p>
              </div>
            </div>
          </div>

          <!-- Client and Bill info grid -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 50px; gap: 40px;">
            <div style="flex: 1;">
              <p style="margin: 0 0 12px; font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 2px; text-transform: uppercase;">Shipping & Billing Destination</p>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; line-height: 1.6; color: #4b5563; font-weight: 300;">
                <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #111827; letter-spacing: 0.5px;">${order.shippingAddress.fullName}</p>
                <p style="margin: 0;">${order.shippingAddress.street}</p>
                <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                <p style="margin: 0; text-transform: uppercase; font-weight: 400; color: #111827; font-size: 12px; margin-top: 2px;">${order.shippingAddress.country}</p>
              </div>
            </div>
            <div style="width: 250px; text-align: right;">
              <p style="margin: 0 0 12px; font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 2px; text-transform: uppercase;">Customer Details</p>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; line-height: 1.6; color: #4b5563; font-weight: 300;">
                <p style="margin: 0; font-weight: 500; color: #111827;">${order.user?.fullname || order.shippingAddress.fullName}</p>
                <p style="margin: 0; font-family: monospace;">${order.user?.email || 'Client'}</p>
                ${order.shippingAddress.phone ? `<p style="margin: 4px 0 0; font-size: 12px;">Phone No.: ${order.shippingAddress.phone}</p>` : ''}
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px;">
            <thead>
              <tr style="border-bottom: 2px solid #111827;">
                <th style="padding: 0 0 12px 0; text-align: left; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase;">Item Description</th>
                <th style="padding: 0 0 12px 0; text-align: center; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 100px;">Color</th>
                <th style="padding: 0 0 12px 0; text-align: center; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 80px;">Qty</th>
                <th style="padding: 0 0 12px 0; text-align: right; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 120px;">Unit Price</th>
                <th style="padding: 0 0 12px 0; text-align: right; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 18px 0; vertical-align: middle;">
                    <span style="display: block; font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;">${item.product?.name || 'Item'}</span>
                    <span style="display: inline-block; font-size: 10px; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">${item.product?.brand || 'LUXELLE'}</span>
                  </td>
                  <td style="padding: 18px 0; text-align: center; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">${item.selectedColor || '-'}</td>
                  <td style="padding: 18px 0; text-align: center; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">${item.quantity}</td>
                  <td style="padding: 18px 0; text-align: right; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">₹${item.product?.price?.toFixed(2) || '0.00'}</td>
                  <td style="padding: 18px 0; text-align: right; vertical-align: middle; font-size: 14px; font-weight: 500; color: #111827;">₹${(item.quantity * (item.product?.price || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totals and Footer Grid -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
            <!-- Thank You message & terms -->
            <div style="max-w: 300px; font-size: 11px; line-height: 1.6; color: #9ca3af; font-weight: 300;">
              <p style="margin: 0; font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; color: #111827; margin-bottom: 6px; font-weight: 700;">Thank you for your purchase.</p>
              <p style="margin: 0;">For inquiries regarding return policy or customer service, please visit our online concierge or contact support@luxelle.com.</p>
            </div>

            <!-- Summary Block -->
            <div style="width: 380px; background: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; border-radius: 2px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                <span>Subtotal</span>
                <span style="font-weight: 400; color: #111827;">₹${orderSubtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                <span>GST (${(gstRate * 100).toFixed(0)}%)</span>
                <span style="font-weight: 400; color: #111827;">₹${gstTax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                <span>Import Duty (${(importDutyRate * 100).toFixed(0)}%)</span>
                <span style="font-weight: 400; color: #111827;">₹${importDuty.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                <span>Processing Fee</span>
                <span style="font-weight: 400; color: #111827;">₹${processingFee.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                <span>Shipping & Handling</span>
                <span style="color: #111827; font-weight: 500; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; flex-shrink: 0; margin-left: 10px;">Complimentary</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #111827; align-items: center;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111827; white-space: nowrap; margin-right: 15px;">Total Amount</span>
                <span style="font-size: 22px; font-family: 'Playfair Display', 'Georgia', serif; color: #111827; font-weight: 600; line-height: 1; white-space: nowrap; flex-shrink: 0;">₹${Number(displayedTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.zIndex = '-9999';
    container.style.opacity = '0.001';
    container.style.pointerEvents = 'none';
    container.innerHTML = printContents;
    document.body.appendChild(container);

    try {
      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      const elementToCapture = container.firstElementChild;

      const html2canvasFn = html2canvas.default || html2canvas;
      const canvas = await html2canvasFn(elementToCapture || container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0
      });

      window.scrollTo(0, originalScrollY);

      const imgData = canvas.toDataURL('image/png');

      const jsPDFClass = jsPDF.jsPDF || jsPDF;
      const pdf = new jsPDFClass('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      let pdfHeight = (canvas.height * pdfPageWidth) / canvas.width;
      let renderWidth = pdfPageWidth;

      if (pdfHeight > pdfPageHeight) {
        const maxRatio = pdfPageHeight / pdfHeight;
        pdfHeight = pdfPageHeight;
        renderWidth = pdfPageWidth * maxRatio;
      }

      const xOffset = (pdfPageWidth - renderWidth) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, 0, renderWidth, pdfHeight);
      pdf.save(`Luxelle_Invoice_${order._id.substring(order._id.length - 6)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      Swal.fire({
        title: 'Error',
        text: `Could not generate PDF invoice. Details: ${error.message || error}`,
        icon: 'error',
        confirmButtonColor: '#111827'
      });
    } finally {
      document.body.removeChild(container);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-24">
        <div className="lg:flex lg:gap-24">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0 lg:border-r lg:border-gray-100 lg:pr-12">
            <ProfileSidebar />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight">Order History</h1>
                <p className="mt-3 text-lg text-gray-500 font-light">View and track your past purchases.</p>
              </div>
              <Link
                to="/shop"
                className="inline-block text-sm font-medium text-gray-900 border-b border-gray-900 pb-0.5 hover:text-black hover:border-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-24">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500 font-light text-sm tracking-wide">Retrieving your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white px-6 py-24 text-center rounded-sm shadow-sm border border-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-4 text-lg font-serif font-medium text-gray-900">No orders yet</h3>
                <p className="mt-2 text-gray-500 font-light">Start your collection today.</p>
                <div className="mt-8">
                  <Link
                    to="/shop"
                    className="inline-block bg-gray-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                  >
                    Browse Collection
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {paginatedOrders.map(order => (
                  <div key={order._id} className="bg-white border border-gray-400 shadow-sm rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Order Header */}
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Placed</span>
                          <span className="text-sm font-medium text-gray-900">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order #</span>
                          <span className="text-sm font-medium text-gray-900 font-mono">{order._id.substring(order._id.length - 8)}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</span>
                          <span className="text-sm font-medium text-gray-900">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                          order.orderStatus === 'Pending' || order.orderStatus === 'Processing'
                            ? 'bg-gray-100 text-gray-800'
                            : order.orderStatus === 'Delivered' || order.orderStatus === 'Confirmed'
                            ? 'bg-green-50 text-green-700'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>

                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="ml-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-900 text-gray-900 rounded-sm hover:bg-gray-900 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          View
                        </button>

                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Shipped' && order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="ml-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-red-600 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <li key={`${item.product?._id}-${idx}`} className="py-6 flex items-center">
                              <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                                <img src={item.product?.image} alt={item.product?.name} className="h-full w-full object-cover object-center" />
                              </div>
                              <div className="ml-6 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    <Link to={`/product/${item.product?._id}`} className="hover:text-yellow-600 transition-colors">
                                      {item.product?.name || 'Product Unavailable'}
                                    </Link>
                                  </h4>
                                  <p className="mt-1 text-xs text-gray-500">{item.product?.brand || 'LUXELLE'}</p>
                                  {item.selectedColor && <p className="mt-1 text-xs text-gray-500">Color: {item.selectedColor}</p>}
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center gap-6">
                                  <p className="text-sm font-light text-gray-500">Qty {item.quantity}</p>
                                  <p className="text-sm font-medium text-gray-900">₹{item.product?.price}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 pb-12">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
              <div>
                <h3 className="text-xl font-bold font-serif">Order Details</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {selectedOrder._id}</p>
              </div>
              <button onClick={closeDetailsModal} className="text-white/70 hover:text-white bg-transparent border-0 outline-none hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 text-gray-800">
              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full inline-block ${
                    selectedOrder.orderStatus === 'Pending' || selectedOrder.orderStatus === 'Processing'
                      ? 'bg-gray-200 text-gray-800'
                      : selectedOrder.orderStatus === 'Delivered' || selectedOrder.orderStatus === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : selectedOrder.orderStatus === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedOrder.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Date</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment Method</span>
                  <span className="text-sm font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">Items Ordered</h4>
                <ul className="divide-y divide-gray-100 -my-4">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={`${item.product?._id}-${idx}`} className="py-4 flex items-center">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                        <img src={item.product?.image} alt={item.product?.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex-1 flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">{item.product?.name || 'Product Unavailable'}</h5>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5">{item.product?.brand || 'LUXELLE'}</p>
                          {item.selectedColor && <p className="text-xs text-gray-500 mt-0.5">Color: {item.selectedColor}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 font-serif">₹{item.product?.price}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">Shipping Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>{selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.zip}</p>
                    {selectedOrder.shippingAddress?.phone && (
                      <p className="text-xs text-gray-400 mt-2 font-mono">Phone: {selectedOrder.shippingAddress.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1.5 border-b border-gray-100">Billing Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-bold text-gray-900">{selectedOrder.billingAddress?.fullName}</p>
                    <p>{selectedOrder.billingAddress?.street}</p>
                    <p>{selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state}</p>
                    <p>{selectedOrder.billingAddress?.country} - {selectedOrder.billingAddress?.zip}</p>
                    {selectedOrder.billingAddress?.phone && (
                      <p className="text-xs text-gray-400 mt-2 font-mono">Phone: {selectedOrder.billingAddress.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {(() => {
                const subTotalVal = selectedOrder.items.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0);
                const gstTaxVal = subTotalVal * gstRate;
                const importDutyVal = subTotalVal * importDutyRate;
                const processingFeeVal = subTotalVal > 0 ? processingFeeAmount : 0;

                return (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pb-1.5 border-b border-gray-200 font-serif">Payment Breakdown</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">₹{subTotalVal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST Tax ({(gstRate * 100).toFixed(0)}%)</span>
                      <span className="font-medium text-gray-900">₹{gstTaxVal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Import Duty ({(importDutyRate * 100).toFixed(0)}%)</span>
                      <span className="font-medium text-gray-900">₹{importDutyVal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Fee</span>
                      <span className="font-medium text-gray-900">₹{processingFeeVal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total Paid</span>
                      <span className="font-serif">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeDetailsModal} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors bg-white text-gray-700 cursor-pointer">
                Close
              </button>
              {selectedOrder.orderStatus === 'Delivered' && (
                <button
                  onClick={() => {
                    downloadInvoice(selectedOrder);
                    closeDetailsModal();
                  }}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-gray-900 text-white rounded-sm hover:bg-black transition-colors inline-flex items-center gap-1.5 shadow-md border-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
