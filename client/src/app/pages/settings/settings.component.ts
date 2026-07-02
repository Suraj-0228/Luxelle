import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, ProfileSidebarComponent],
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
    private authService = inject(AuthService);
    private apiService = inject(ApiService);
    private router = inject(Router);

    user = this.authService.currentUser;

    passwordModel = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    addressModel = {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    };

    isEditingAddress = signal(false);
    isAddingAddress = signal(false);
    isDeleteModalOpen = signal(false);
    deleteConfirmText = signal('');
    activeTab = signal('security');

    showCurrentPassword = signal(false);
    showNewPassword = signal(false);
    showConfirmPassword = signal(false);

    ngOnInit() {
        this.resetAddressModel();
    }

    resetAddressModel() {
        if (this.user() && this.user()!.address) {
            this.addressModel = {
                street: this.user()!.address.street || '',
                city: this.user()!.address.city || '',
                state: this.user()!.address.state || '',
                zip: this.user()!.address.zip || '',
                country: this.user()!.address.country || ''
            };
        } else {
            this.addressModel = { street: '', city: '', state: '', zip: '', country: '' };
        }
    }

    hasAddress(): boolean {
        const addr = this.user()?.address;
        return !!(addr && addr.street && addr.city);
    }

    changePassword() {
        if (!this.passwordModel.currentPassword || !this.passwordModel.newPassword || !this.passwordModel.confirmPassword) {
            Swal.fire({
                title: 'Missing Fields',
                text: 'Please fill in all password fields.',
                icon: 'warning',
                confirmButtonColor: '#000'
            });
            return;
        }

        if (this.passwordModel.newPassword !== this.passwordModel.confirmPassword) {
            Swal.fire({
                title: 'Password Mismatch',
                text: 'New passwords do not match.',
                icon: 'error',
                confirmButtonColor: '#000'
            });
            return;
        }

        if (this.passwordModel.newPassword.length < 6) {
            Swal.fire({
                title: 'Weak Password',
                text: 'Password must be at least 6 characters long.',
                icon: 'warning',
                confirmButtonColor: '#000'
            });
            return;
        }

        const payload = {
            currentPassword: this.passwordModel.currentPassword,
            newPassword: this.passwordModel.newPassword
        };

        this.apiService.updateUser(this.user()!._id, payload).subscribe({
            next: (updatedUser) => {
                this.authService.setUser(updatedUser);
                this.passwordModel = { currentPassword: '', newPassword: '', confirmPassword: '' };
                Swal.fire({
                    title: 'Password Changed',
                    text: 'Your password has been successfully updated.',
                    icon: 'success',
                    confirmButtonColor: '#000'
                });
            },
            error: (err) => {
                console.error('Failed to change password', err);
                const errMsg = err.error?.message || 'Failed to change password. Please check your current password.';
                Swal.fire({
                    title: 'Error',
                    text: errMsg,
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        });
    }

    saveAddress() {
        if (!this.addressModel.street || !this.addressModel.city || !this.addressModel.state || !this.addressModel.zip || !this.addressModel.country) {
            Swal.fire({
                title: 'Missing Fields',
                text: 'Please fill in all address fields.',
                icon: 'warning',
                confirmButtonColor: '#000'
            });
            return;
        }

        const payload = {
            address: this.addressModel
        };

        this.apiService.updateUser(this.user()!._id, payload).subscribe({
            next: (updatedUser) => {
                this.authService.setUser(updatedUser);
                this.isEditingAddress.set(false);
                this.isAddingAddress.set(false);
                Swal.fire({
                    title: 'Address Saved',
                    text: 'Your address has been saved successfully.',
                    icon: 'success',
                    confirmButtonColor: '#000'
                });
            },
            error: (err) => {
                console.error('Failed to save address', err);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to save address. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        });
    }

    deleteAddress() {
        Swal.fire({
            title: 'Delete Address?',
            text: 'Are you sure you want to remove your saved address?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                const emptyAddress = { street: '', city: '', state: '', zip: '', country: '' };
                this.apiService.updateUser(this.user()!._id, { address: emptyAddress }).subscribe({
                    next: (updatedUser) => {
                        this.authService.setUser(updatedUser);
                        this.addressModel = emptyAddress;
                        Swal.fire({
                            title: 'Address Deleted',
                            text: 'Your address has been removed.',
                            icon: 'success',
                            confirmButtonColor: '#000'
                        });
                    },
                    error: (err) => {
                        console.error('Failed to delete address', err);
                    }
                });
            }
        });
    }

    openDeleteModal() {
        this.deleteConfirmText.set('');
        this.isDeleteModalOpen.set(true);
    }

    closeDeleteModal() {
        this.isDeleteModalOpen.set(false);
    }

    confirmDeleteAccount() {
        if (this.deleteConfirmText() !== 'DELETE') return;

        this.apiService.deleteUser(this.user()!._id).subscribe({
            next: () => {
                this.isDeleteModalOpen.set(false);
                Swal.fire({
                    title: 'Account Deleted',
                    text: 'Your account has been deleted permanently. You will now be signed out.',
                    icon: 'success',
                    confirmButtonColor: '#000'
                }).then(() => {
                    this.authService.logout();
                });
            },
            error: (err) => {
                console.error('Failed to delete account', err);
                Swal.fire({
                    title: 'Deletion Failed',
                    text: 'Could not delete account. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        });
    }
}
// Touched to trigger reload
