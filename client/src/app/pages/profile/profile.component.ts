import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ApiService } from '../../services/api.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ProfileSidebarComponent, FormsModule],
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
        email: ''
    };

    ngOnInit() {
        if (this.user()) {
            this.editData = {
                fullname: this.user()!.fullname,
                email: this.user()!.email
            };

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
                fullname: this.user()!.fullname,
                email: this.user()!.email
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
            },
            error: (err) => {
                console.error('Failed to update profile', err);
                alert('Failed to update profile. Please try again.');
            }
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
