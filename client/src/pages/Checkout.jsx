import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const { cartItems, totalPrice, subtotal, gstTax, importDuty, processingFee, gstRate, importDutyRate, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toastService = useToast();

  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' | 'payment'
  const [activePaymentTab, setActivePaymentTab] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});

  const hasStoredAddress = useMemo(() => {
    return !!(
      currentUser &&
      currentUser.address &&
      (currentUser.address.street || currentUser.address.city || currentUser.address.zip)
    );
  }, [currentUser]);

  const useStoredAddress = () => {
    console.log('useStoredAddress triggered. currentUser:', currentUser);
    
    const hasAddress = currentUser && currentUser.address && 
      (currentUser.address.street || currentUser.address.city || currentUser.address.state || currentUser.address.zip);
      
    if (hasAddress) {
      console.log('currentUser.address exists:', currentUser.address);
      const newAddress = {
        fullName: currentUser.fullname || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        street: currentUser.address.street || '',
        city: currentUser.address.city || '',
        state: currentUser.address.state || '',
        zip: currentUser.address.zip || '',
        country: currentUser.address.country || 'India'
      };
      console.log('Setting shipping address to:', newAddress);
      setShippingAddress(newAddress);
      setErrors({});
      toastService.show('Saved address loaded successfully', 'success');
    } else {
      console.warn('currentUser or address is missing. currentUser:', currentUser);
      toastService.show('No saved address found. Please update your profile settings first.', 'error');
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatExpiryDate = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setCard(prev => ({ ...prev, expiry: value }));
  };

  const validateShipping = () => {
    const errs = {};
    if (!shippingAddress.fullName) errs.fullName = 'Full Name is required';
    if (!shippingAddress.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errs.email = 'Invalid email address';
    } else if (!shippingAddress.email.endsWith('@gmail.com')) {
      errs.email = 'Invalid email format. Must be a Gmail address containing "@", "gmail", and ".com"';
    }
    if (!shippingAddress.phone) {
      errs.phone = 'Phone is required';
    } else if (!/^[0-9]{10}$/.test(shippingAddress.phone)) {
      errs.phone = 'Phone must be exactly 10 digits';
    }
    if (!shippingAddress.street) errs.street = 'Address is required';
    if (!shippingAddress.city) errs.city = 'City is required';
    if (!shippingAddress.state) errs.state = 'State is required';
    if (!shippingAddress.zip) {
      errs.zip = 'Postal Code is required';
    } else if (!/^[0-9]{6}$/.test(shippingAddress.zip)) {
      errs.zip = 'Postal Code must be exactly 6 digits';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs = {};
    if (activePaymentTab === 'UPI') {
      if (!upiId) {
        errs.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9.-]+@upi$/.test(upiId)) {
        errs.upiId = 'Invalid UPI ID. Must end with @upi';
      }
    } else if (activePaymentTab === 'Card') {
      if (!card.number) {
        errs.cardNumber = 'Card number is required';
      } else if (!/^[0-9]{16}$/.test(card.number)) {
        errs.cardNumber = 'Card number must be 16 digits';
      }
      if (!card.expiry) {
        errs.cardExpiry = 'Expiry is required';
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(card.expiry)) {
        errs.cardExpiry = 'Invalid expiry date (MM/YY)';
      }
      if (!card.cvc) {
        errs.cardCvc = 'CVC is required';
      } else if (!/^[0-9]{3,4}$/.test(card.cvc)) {
        errs.cardCvc = 'CVC must be 3-4 digits';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const proceedToPayment = () => {
    if (validateShipping()) {
      setCurrentStep('payment');
    }
  };

  const backToShipping = () => {
    setCurrentStep('shipping');
  };

  const handlePaymentMethodChange = (method) => {
    setActivePaymentTab(method);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const orderData = {
      user: currentUser._id,
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        selectedColor: item.product.selectedColor
      })),
      totalAmount: totalPrice,
      shippingAddress: shippingAddress,
      billingAddress: shippingAddress, // Simplified for demo
      paymentMethod: activePaymentTab
    };

    try {
      const res = await apiService.createOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { orderId: res.data._id } });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to place order');
      setIsSubmitting(false);
    }
  };

  const gstPercentage = Math.round(gstRate * 100);
  const importDutyPercentage = Math.round(importDutyRate * 100);

  // Dynamic QR Code link containing amount
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=luxelle@upi&pn=Luxelle%20Inc&am=${totalPrice.toFixed(2)}&cu=INR`;

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 py-10">
      {/* Right Column: Order Summary (Visible on Desktop) */}
      <div className="hidden lg:block bg-gray-50 border-l border-gray-400 px-12 py-16 lg:order-2 sticky top-0 h-screen overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems.map((item, idx) => (
                <li key={`${item.product._id}-${idx}`} className="py-6 flex space-x-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-md object-cover object-center border border-gray-200 bg-white"
                    />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-500 text-white text-xs font-bold flex items-center justify-center shadow-sm ring-2 ring-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-auto">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.brand}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.product.material}</p>
                  </div>
                  <p className="font-medium text-gray-900">₹{item.product.price}</p>
                </li>
              ))}
            </ul>
          </div>

          <dl className="text-sm font-medium text-gray-500 space-y-4 mt-10 pt-10 border-t border-gray-500">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-gray-900">₹{subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>GST ({gstPercentage}%)</dt>
              <dd className="text-gray-900">₹{gstTax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Import Duty ({importDutyPercentage}%)</dt>
              <dd className="text-gray-900">₹{importDuty.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Processing Fee</dt>
              <dd className="text-gray-900">₹{processingFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="text-gray-900">Free</dd>
            </div>
            <div className="flex justify-between border-t border-gray-500 pt-6 items-center">
              <dt className="text-base text-gray-900">Total</dt>
              <dd className="text-2xl font-serif font-bold text-gray-900">₹{totalPrice.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Left Column: Checkout Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:order-1">
        <div className="mx-auto w-full max-w-lg lg:w-[480px]">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Checkout</h2>
            <div className="mt-2 text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Link to="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
              <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className={`transition-colors ${currentStep === 'shipping' ? 'text-gray-900 font-medium' : ''}`}>Information</span>
              <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className={`transition-colors ${currentStep === 'payment' ? 'text-gray-900 font-medium' : ''}`}>Payment</span>
            </div>
          </div>

          {/* Mobile Order Summary Toggle */}
          <div className="lg:hidden mb-10 bg-gray-50 p-6 rounded-sm border border-gray-900">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowMobileSummary(!showMobileSummary)}>
              <div className="flex items-center text-sm font-medium text-yellow-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {showMobileSummary ? 'Hide' : 'Show'} order summary
                <svg className={`w-4 h-4 ml-1 transform transition-transform ${showMobileSummary ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">₹{totalPrice.toFixed(2)}</p>
            </div>

            {showMobileSummary && (
              <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
                <div className="flow-root">
                  <ul role="list" className="-my-4 divide-y divide-gray-200">
                    {cartItems.map((item, idx) => (
                      <li key={`${item.product._id}-${idx}`} className="py-4 flex space-x-4">
                        <div className="relative flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-md object-cover object-center bg-white" />
                          <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-auto">
                          <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                          <p className="text-xs text-gray-500">{item.product.brand}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">₹{item.product.price}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <dl className="text-sm font-medium text-gray-500 space-y-2 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="text-gray-900">₹{subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Taxes & Fees</dt>
                    <dd className="text-gray-900">₹{(gstTax + importDuty + processingFee).toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 p-4 rounded-md text-red-700 text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* STEP 1: Shipping Address */}
            {currentStep === 'shipping' && (
              <div className="animate-fadeIn">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={useStoredAddress}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:text-gray-600 flex items-center gap-1.5 transition-colors border-b border-gray-900 pb-0.5 bg-transparent border-0 outline-none cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>
                        Use Stored Address
                      </button>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Please login to checkout</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.email && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</div>}
                    </div>

                    <div className="sm:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Shipping Address</h3>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.fullName && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</div>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="street" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address</label>
                      <textarea                      
                        id="street"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.street && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.street}</div>}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.city && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.city}</div>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">State / Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.state && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.state}</div>}
                    </div>

                    <div>
                      <label htmlFor="zip" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={shippingAddress.zip}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.zip && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.zip}</div>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                      />
                      {errors.phone && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</div>}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 flex items-center justify-between">
                  <Link to="/cart" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Return to Cart
                  </Link>
                  <button
                    type="button"
                    onClick={proceedToPayment}
                    className="bg-gray-900 border border-transparent rounded-sm shadow-sm py-4 px-8 text-sm font-bold uppercase tracking-widest text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {currentStep === 'payment' && (
              <div className="animate-fadeIn">
                {/* Review Shipping */}
                <div className="bg-gray-50 border border-gray-400 rounded-sm p-4 mb-8 text-sm text-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact</span>
                      <span className="text-gray-900 font-medium">{shippingAddress.email}</span>
                    </div>
                    <button type="button" onClick={backToShipping} className="text-xs font-bold uppercase text-gray-600 hover:text-gray-900 cursor-pointer duration-200">Change</button>
                  </div>
                  <div className="flex justify-between items-start border-t border-gray-400 pt-2">
                    <div>
                      <span className="block text-xs font-bold uppercase text-gray-500 mb-1">Ship to</span>
                      <span className="text-gray-900">{shippingAddress.street}, {shippingAddress.city}</span>
                    </div>
                    <button type="button" onClick={backToShipping} className="text-xs font-bold uppercase text-gray-600 hover:text-gray-900 cursor-pointer duration-200">Change</button>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h3>
                <fieldset>
                  <legend className="sr-only">Payment type</legend>
                  <div className="space-y-4">
                    {/* Card */}
                    <div className={`relative flex items-start p-4 border rounded-sm ${activePaymentTab === 'Card' ? 'border-black bg-gray-50' : 'border-gray-400'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="payment-card"
                          name="payment-method"
                          type="radio"
                          checked={activePaymentTab === 'Card'}
                          onChange={() => handlePaymentMethodChange('Card')}
                          className="focus:ring-black h-4 w-4 text-black border-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm w-full">
                        <label htmlFor="payment-card" className="font-medium text-gray-700 cursor-pointer w-full block">Credit or Debit Card</label>
                        {activePaymentTab === 'Card' && (
                          <div className="mt-4 text-gray-500 transition-all duration-300">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <input
                                  type="text"
                                  name="number"
                                  placeholder="Card number"
                                  value={card.number}
                                  onChange={handleCardChange}
                                  className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                                />
                                {errors.cardNumber && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.cardNumber}</div>}
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    value={card.expiry}
                                    onChange={formatExpiryDate}
                                    className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                                  />
                                  {errors.cardExpiry && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.cardExpiry}</div>}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="cvc"
                                    placeholder="CVC"
                                    value={card.cvc}
                                    onChange={handleCardChange}
                                    className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                                  />
                                  {errors.cardCvc && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.cardCvc}</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* UPI */}
                    <div className={`relative flex items-start p-4 border rounded-sm ${activePaymentTab === 'UPI' ? 'border-black bg-gray-50' : 'border-gray-400'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="payment-upi"
                          name="payment-method"
                          type="radio"
                          checked={activePaymentTab === 'UPI'}
                          onChange={() => handlePaymentMethodChange('UPI')}
                          className="focus:ring-black h-4 w-4 text-black border-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm w-full">
                        <label htmlFor="payment-upi" className="font-medium text-gray-700 cursor-pointer w-full block">UPI</label>
                        {activePaymentTab === 'UPI' && (
                          <div className="mt-4 text-gray-500 overflow-hidden transition-all duration-300">
                            <div className="grid grid-cols-1 gap-4">
                              <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-sm bg-gray-50">
                                <p className="text-xs text-gray-500 mb-2 uppercase font-bold">Scan to Pay</p>
                                <img
                                  src={qrCodeUrl}
                                  alt="UPI QR Code"
                                  className="w-48 h-48 object-contain bg-white p-2 rounded-sm shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Enter UPI ID</label>
                                <input
                                  type="text"
                                  placeholder="example@upi"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="block w-full border border-gray-400 text-gray-900 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm py-3 px-4 bg-white"
                                />
                                {errors.upiId && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.upiId}</div>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COD */}
                    <div className={`relative flex items-start p-4 border rounded-sm ${activePaymentTab === 'COD' ? 'border-black bg-gray-50' : 'border-gray-400'}`}>
                      <div className="flex items-center h-5">
                        <input
                          id="payment-cod"
                          name="payment-method"
                          type="radio"
                          checked={activePaymentTab === 'COD'}
                          onChange={() => handlePaymentMethodChange('COD')}
                          className="focus:ring-black h-4 w-4 text-black border-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="payment-cod" className="font-medium text-gray-700 cursor-pointer">Cash on Delivery</label>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="pt-6 mt-6 flex items-center justify-between border-t border-gray-200">
                  <button type="button" onClick={backToShipping} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Return to shipping
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 border border-transparent rounded-sm shadow-sm py-4 px-8 text-sm font-bold uppercase tracking-widest text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
