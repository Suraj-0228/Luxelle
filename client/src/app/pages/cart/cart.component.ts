import { Component, inject, computed } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  subtotal = this.cartService.subtotal;
  stateTax = this.cartService.stateTax;
  importDuty = this.cartService.importDuty;
  processingFee = this.cartService.processingFee;

  gstRate = computed(() => Math.round(this.cartService.gstRate() * 100));
  importDutyRate = computed(() => Math.round(this.cartService.importDutyRate() * 100));

  updateQuantity(id: string, newQty: number, selectedColor?: string) {
    this.cartService.updateQuantity(id, newQty, selectedColor);
  }

  remove(id: string, selectedColor?: string) {
    this.cartService.removeFromCart(id, selectedColor);
  }

  proceedToCheckout() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
