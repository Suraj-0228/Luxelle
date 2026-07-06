import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const toastService = useToast();
  const [cartItems, setCartItems] = useState(() => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  });
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const res = await apiService.getTaxes();
      if (res && res.success && res.data) {
        setTaxes(res.data);
      }
    } catch (err) {
      console.error('Error fetching taxes from DB, using fallback defaults:', err);
      setTaxes([
        { name: 'GST Tax', rate: 0.18, type: 'percentage', code: 'gst' },
        { name: 'Import Duty', rate: 0.05, type: 'percentage', code: 'import_duty' },
        { name: 'Processing Fee', rate: 150, type: 'flat', code: 'processing_fee' }
      ]);
    }
  };

  const count = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cartItems]);

  // Tax rates
  const gstRate = useMemo(() => taxes.find(t => t.code === 'gst')?.rate ?? 0.18, [taxes]);
  const importDutyRate = useMemo(() => taxes.find(t => t.code === 'import_duty')?.rate ?? 0.05, [taxes]);
  const processingFeeAmount = useMemo(() => taxes.find(t => t.code === 'processing_fee')?.rate ?? 150, [taxes]);

  // Tax computations
  const gstTax = useMemo(() => subtotal * gstRate, [subtotal, gstRate]);
  const importDuty = useMemo(() => subtotal * importDutyRate, [subtotal, importDutyRate]);
  const processingFee = useMemo(() => (subtotal > 0 ? processingFeeAmount : 0), [subtotal, processingFeeAmount]);

  const stateTax = gstTax; // compatibility alias

  const totalPrice = useMemo(() => subtotal + gstTax + importDuty + processingFee, [subtotal, gstTax, importDuty, processingFee]);

  const addToCart = (product) => {
    const colorToUse = product.selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const productToAdd = { ...product, selectedColor: colorToUse };

    const existing = cartItems.find(i => i.product._id === productToAdd._id && i.product.selectedColor === colorToUse);

    if (existing) {
      if (existing.quantity + 1 > productToAdd.stock) {
        toastService.show(`Cannot add more. Only ${productToAdd.stock} items in stock.`, 'error');
        return;
      }
      setCartItems(items =>
        items.map(i => (i.product._id === productToAdd._id && i.product.selectedColor === colorToUse)
          ? { ...i, quantity: i.quantity + 1 } : i)
      );
      toastService.show(`Increased quantity for ${productToAdd.name}`, 'info');
      return;
    }

    if (productToAdd.stock < 1) {
      toastService.show(`This item is out of stock.`, 'error');
      return;
    }

    setCartItems(items => [...items, { product: productToAdd, quantity: 1 }]);
    toastService.show(`${productToAdd.name} added to cart`, 'success');
  };

  const removeFromCart = (productId, selectedColor) => {
    setCartItems(items => items.filter(i => !(i.product._id === productId && i.product.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId, quantity, selectedColor) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }

    const item = cartItems.find(i => i.product._id === productId && i.product.selectedColor === selectedColor);
    if (item && quantity > item.product.stock) {
      toastService.show(`Cannot add more. Max stock reached (${item.product.stock}).`, 'error');
      return;
    }

    setCartItems(items =>
      items.map(i => (i.product._id === productId && i.product.selectedColor === selectedColor)
        ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      taxes,
      count,
      subtotal,
      gstRate,
      importDutyRate,
      processingFeeAmount,
      gstTax,
      importDuty,
      processingFee,
      stateTax,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchTaxes
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
