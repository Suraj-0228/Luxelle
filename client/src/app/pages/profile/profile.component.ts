import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ApiService } from '../../services/api.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ProfileSidebarComponent, FormsModule, RouterLink],
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    private apiService = inject(ApiService);

    user = this.authService.currentUser;
    ordersCount = signal(0);
    wishlistCount = signal(0);
    isLoading = signal(true);

    isEditing = signal(false);
    editData = {
        fullname: '',
        username: '',
        email: '',
        phone: ''
    };
    
    styleProfile = signal(localStorage.getItem('styleProfile') || 'Classic Luxury');
    memberSince = signal('2025');

    ngOnInit() {
        if (this.user()) {
            this.editData = {
                fullname: this.user()!.fullname || '',
                username: this.user()!.username || '',
                email: this.user()!.email || '',
                phone: this.user()!.phone || ''
            };

            if (this.user()!.createdAt) {
                const date = new Date(this.user()!.createdAt);
                this.memberSince.set(date.getFullYear().toString());
            }

            this.orderService.getOrders(this.user()._id).subscribe({
                next: (res: any) => {
                    const count = res.data ? res.data.length : 0;
                    this.ordersCount.set(count);
                },
                error: (err) => {
                    this.ordersCount.set(0);
                }
            });

            this.apiService.getWishlist(this.user()._id).subscribe({
                next: (res: any) => {
                    const count = res.products ? res.products.length : 0;
                    this.wishlistCount.set(count);
                },
                error: (err) => {
                    this.wishlistCount.set(0);
                }
            });
        }
    }

    toggleEdit() {
        this.isEditing.update(v => !v);
        if (!this.isEditing() && this.user()) {
            // Reset if cancelled
            this.editData = {
                fullname: this.user()!.fullname || '',
                username: this.user()!.username || '',
                email: this.user()!.email || '',
                phone: this.user()!.phone || ''
            };
        }
    }

    saveProfile() {
        if (!this.user()) return;

        this.apiService.updateUser(this.user()!._id, this.editData).subscribe({
            next: (updatedUser) => {
                // Properly update the auth service state (signal + localStorage)
                this.authService.setUser(updatedUser);
                this.toggleEdit(); // Close modal
                Swal.fire({
                    title: 'Profile Updated',
                    text: 'Your luxury profile details have been securely saved.',
                    icon: 'success',
                    confirmButtonColor: '#000',
                    confirmButtonText: 'Excellent'
                });
            },
            error: (err) => {
                console.error('Failed to update profile', err);
                Swal.fire({
                    title: 'Update Failed',
                    text: 'Failed to update your personal details. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Acknowledge'
                });
            }
        });
    }

    setStyleProfile(style: string) {
        this.styleProfile.set(style);
        localStorage.setItem('styleProfile', style);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Style Aesthetic: ${style}`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }

    logout() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Sign Out'
        }).then((result) => {
            if (result.isConfirmed) {
                this.authService.logout();
            }
        });
    }
}
