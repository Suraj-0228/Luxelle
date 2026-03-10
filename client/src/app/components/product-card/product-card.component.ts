import { Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

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
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isInWishlist = computed(() => this.wishlistService.isInWishlist(this.product._id)());

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Please login to add items to your bag', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.product);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Please login to manage your wishlist', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.wishlistService.toggleWishlist(this.product);
  }
}
