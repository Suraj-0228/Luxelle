import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  subtotal = this.cartService.subtotal;
  stateTax = this.cartService.stateTax;
  importDuty = this.cartService.importDuty;
  processingFee = this.cartService.processingFee;

  updateQuantity(id: string, newQty: number) {
    this.cartService.updateQuantity(id, newQty);
  }

  remove(id: string) {
    this.cartService.removeFromCart(id);
  }
}
