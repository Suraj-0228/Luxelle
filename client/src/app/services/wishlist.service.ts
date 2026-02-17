import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    // Store only IDs for quick lookup
    private wishlistIds = signal<Set<string>>(new Set());

    constructor() {
        this.loadWishlist();
    }

    loadWishlist() {
        const user = this.authService.currentUser();
        if (!user || !user._id) {
            this.wishlistIds.set(new Set());
            return;
        }

        this.apiService.getWishlist(user._id).subscribe({
            next: (res: any) => {
                if (res && res.products) {
                    const ids = new Set<string>(res.products.map((p: any) => p._id as string));
                    this.wishlistIds.set(ids);
                }
            },
            error: (err) => {
                console.error('Error loading wishlist', err);
            }
        });
    }

    isInWishlist(productId: string) {
        return computed(() => this.wishlistIds().has(productId));
    }

    toggleWishlist(product: any) {
        const user = this.authService.currentUser();
        if (!user || !user._id) {
            this.toastService.show('Please sign in to add to wishlist', 'info');
            return;
        }

        const currentIds = this.wishlistIds();
        const isIn = currentIds.has(product._id);

        if (isIn) {
            // Remove
            this.apiService.removeFromWishlist(user._id, product._id).subscribe({
                next: () => {
                    this.wishlistIds.update(ids => {
                        const newIds = new Set(ids);
                        newIds.delete(product._id);
                        return newIds;
                    });
                    this.toastService.show('Removed from wishlist', 'info');
                },
                error: (err) => {
                    console.error('Error removing from wishlist', err);
                    this.toastService.show('Failed to remove from wishlist', 'error');
                }
            });
        } else {
            // Add
            this.apiService.addToWishlist(user._id, product._id).subscribe({
                next: () => {
                    this.wishlistIds.update(ids => {
                        const newIds = new Set(ids);
                        newIds.add(product._id);
                        return newIds;
                    });
                    this.toastService.show('Added to wishlist', 'success');
                },
                error: (err) => {
                    console.error('Error adding to wishlist', err);
                    this.toastService.show('Failed to add to wishlist', 'error');
                }
            });
        }
    }

    // Method to manually remove (useful for Wishlist page where we might not want to toggle)
    removeFromWishlist(productId: string) {
        const user = this.authService.currentUser();
        if (!user || !user._id) return;

        this.apiService.removeFromWishlist(user._id, productId).subscribe({
            next: () => {
                this.wishlistIds.update(ids => {
                    const newIds = new Set(ids);
                    newIds.delete(productId);
                    return newIds;
                });
                this.toastService.show('Removed from wishlist', 'info');
            },
            error: (err) => {
                console.error('Error removing from wishlist', err);
            }
        });
    }
}
