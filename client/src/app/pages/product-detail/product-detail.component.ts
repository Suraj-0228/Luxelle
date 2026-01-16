import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: any;
  private toastService = inject(ToastService);

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProductById(id).subscribe(data => this.product = data);
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  addToWishlist() {
    const user = this.authService.currentUser();
    if (this.product && user && user._id) {
      this.apiService.addToWishlist(user._id, this.product._id).subscribe({
        next: () => this.toastService.show('Product added to wishlist!', 'success'),
        error: (err) => console.error('Error adding to wishlist', err)
      });
    } else {
      this.toastService.show('Please sign in to add items to your wishlist.', 'info');
    }
  }
}
