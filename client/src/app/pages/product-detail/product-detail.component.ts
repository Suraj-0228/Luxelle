import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: any;

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isInWishlist = computed(() => this.product ? this.wishlistService.isInWishlist(this.product._id)() : false);
  selectedColor: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProductById(id).subscribe(data => {
        this.product = data;
        if (this.product.colors && this.product.colors.length > 0) {
          this.selectedColor = this.product.colors[0];
        }
      });
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Please login to add items to your bag', 'error');
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      const productToAdd = { ...this.product, selectedColor: this.selectedColor };
      this.cartService.addToCart(productToAdd);
    }
  }

  toggleWishlist() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Please login to manage your wishlist', 'error');
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }
}
