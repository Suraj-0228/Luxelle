import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product: any;
  Math = Math; // For random rating mock if needed

  private cartService = inject(CartService);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product);
  }

  addToWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const user = this.authService.currentUser();

    if (user && user._id) {
      this.apiService.addToWishlist(user._id, this.product._id).subscribe({
        next: () => this.toastService.show('Product added to wishlist!', 'success'),
        error: (err) => console.error('Error adding to wishlist', err)
      });
    } else {
      this.toastService.show('Please sign in to wish.', 'info');
    }
  }
}
