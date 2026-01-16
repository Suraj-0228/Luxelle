import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ToastService } from './toast.service';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>(this.getCartFromStorage());
  private toastService = inject(ToastService);

  count = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  // Tax Calculations
  stateTax = computed(() => this.subtotal() * 0.08); // 8% State Tax
  importDuty = computed(() => this.subtotal() * 0.05); // 5% Import Duty
  processingFee = computed(() => 2.99); // Flat Processing Fee

  // Grand Total
  totalPrice = computed(() => this.subtotal() + this.stateTax() + this.importDuty() + this.processingFee());

  constructor() {
    effect(() => {
      this.saveCartToStorage(this.cartItems());
    });
  }

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  addToCart(product: any) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product._id === product._id);
      if (existing) {
        // Optional: Toast for quantity update
        this.toastService.show(`Increased quantity for ${product.name}`, 'info');
        return items.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      this.toastService.show(`${product.name} added to cart`, 'success');
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(i => i.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => items.map(i => i.product._id === productId ? { ...i, quantity } : i));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
