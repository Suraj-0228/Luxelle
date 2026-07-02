import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    private cartService = inject(CartService);
    private wishlistService = inject(WishlistService);

    wishlistItems = signal<any[]>([]);
    isLoading = signal(true);
    userId = '';

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user && user._id) {
            this.userId = user._id;
            this.fetchWishlist();
        } else {
            this.isLoading.set(false);
        }
    }

    fetchWishlist() {
        this.apiService.getWishlist(this.userId).subscribe({
            next: (res: any) => {
                if (res && res.products) {
                    // If products are populated
                    this.wishlistItems.set(res.products);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error fetching wishlist', err);
                this.isLoading.set(false);
            }
        });
    }

    removeFromWishlist(productId: string) {
        if (!this.userId) return;

        // Use service to sync global state
        this.wishlistService.removeFromWishlist(productId);

        // Remove locally from view
        this.wishlistItems.update(items => items.filter(item => item._id !== productId));
    }

    addToBag(product: any) {
        this.cartService.addToCart(product);
        // Optional: remove from wishlist after adding to bag?
        // for now, keep it.
        Swal.fire({
            title: 'Added to Bag',
            text: `${product.name} has been added to your shopping bag.`,
            icon: 'success',
            confirmButtonColor: '#111827'
        });
    }
}
