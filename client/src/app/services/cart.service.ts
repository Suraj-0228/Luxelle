import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';

export interface CartItem {
  product: any;
  quantity: number;
}

export interface TaxConfig {
  _id?: string;
  name: string;
  rate: number;
  type: 'percentage' | 'flat';
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>(this.getCartFromStorage());
  private toastService = inject(ToastService);
  private http = inject(HttpClient);

  taxes = signal<TaxConfig[]>([]);

  count = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  // Dynamic rates from DB
  gstRate = computed(() => this.taxes().find(t => t.code === 'gst')?.rate ?? 0.18);
  importDutyRate = computed(() => this.taxes().find(t => t.code === 'import_duty')?.rate ?? 0.05);
  processingFeeAmount = computed(() => this.taxes().find(t => t.code === 'processing_fee')?.rate ?? 150);

  // Dynamic tax computations
  gstTax = computed(() => this.subtotal() * this.gstRate());
  importDuty = computed(() => this.subtotal() * this.importDutyRate());
  processingFee = computed(() => this.subtotal() > 0 ? this.processingFeeAmount() : 0);

  // Compatibility alias for existing templates
  stateTax = computed(() => this.gstTax());

  // Grand Total
  totalPrice = computed(() => this.subtotal() + this.gstTax() + this.importDuty() + this.processingFee());

  constructor() {
    effect(() => {
      this.saveCartToStorage(this.cartItems());
    });
    this.fetchTaxes();
  }

  fetchTaxes() {
    this.http.get<{ success: boolean, data: TaxConfig[] }>('http://localhost:5000/api/taxes').subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.taxes.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching taxes from DB, using fallback defaults:', err);
        this.taxes.set([
          { name: 'GST Tax', rate: 0.18, type: 'percentage', code: 'gst' },
          { name: 'Import Duty', rate: 0.05, type: 'percentage', code: 'import_duty' },
          { name: 'Processing Fee', rate: 150, type: 'flat', code: 'processing_fee' }
        ]);
      }
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
      // Ensure we have a selectedColor, default to first color if available and not set
      const colorToUse = product.selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

      // Create a product object that definitely has the selectedColor set
      const productToAdd = { ...product, selectedColor: colorToUse };

      const existing = items.find(i => i.product._id === productToAdd._id && i.product.selectedColor === colorToUse);

      if (existing) {
        if (existing.quantity + 1 > productToAdd.stock) {
          this.toastService.show(`Cannot add more. Only ${productToAdd.stock} items in stock.`, 'error');
          return items;
        }
        // Optional: Toast for quantity update
        this.toastService.show(`Increased quantity for ${productToAdd.name}`, 'info');
        return items.map(i => (i.product._id === productToAdd._id && i.product.selectedColor === colorToUse)
          ? { ...i, quantity: i.quantity + 1 } : i);
      }

      if (productToAdd.stock < 1) {
        this.toastService.show(`This item is out of stock.`, 'error');
        return items;
      }

      this.toastService.show(`${productToAdd.name} added to cart`, 'success');
      return [...items, { product: productToAdd, quantity: 1 }];
    });
  }

  removeFromCart(productId: string, selectedColor?: string) {
    this.cartItems.update(items => items.filter(i => !(i.product._id === productId && i.product.selectedColor === selectedColor)));
  }

  updateQuantity(productId: string, quantity: number, selectedColor?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, selectedColor);
      return;
    }

    this.cartItems.update(items => {
      const item = items.find(i => i.product._id === productId && i.product.selectedColor === selectedColor);
      if (item && quantity > item.product.stock) {
        this.toastService.show(`Cannot add more. Max stock reached (${item.product.stock}).`, 'error');
        return items; // Do not update
      }

      return items.map(i => (i.product._id === productId && i.product.selectedColor === selectedColor)
        ? { ...i, quantity } : i);
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
