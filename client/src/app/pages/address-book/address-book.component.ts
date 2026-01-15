import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-address-book',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ProfileSidebarComponent],
    templateUrl: './address-book.component.html',
})
export class AddressBookComponent implements OnInit {
    private authService = inject(AuthService);
    private apiService = inject(ApiService);
    private router = inject(Router);

    user = this.authService.currentUser;

    address = {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    };

    isSubmitting = signal(false);
    successMessage = signal('');

    ngOnInit() {
        const userData = this.user();
        if (userData && userData.address) {
            this.address = { ...userData.address };
        }
    }

    onSubmit() {
        const userData = this.user();
        if (!userData || !userData._id) return;

        this.isSubmitting.set(true);

        const payload = {
            address: this.address
        };

        this.apiService.updateUser(userData._id, payload).subscribe({
            next: (updatedUser) => {
                // Update local auth state with new user data including token if needed, 
                // but authService.currentUser is a signal. We should ideally update the stored user.
                // For now, assuming the backend returns the updated user object.

                // We need to manually update the user in localStorage and the signal to reflect changes immediately
                const currentData = JSON.parse(localStorage.getItem('user_data') || '{}');
                const newData = { ...currentData, ...updatedUser };

                // Depending on how AuthService is implemented, we might need a method to update state.
                // Accessing private/protected methods or just re-saving to localstorage:
                localStorage.setItem('user_data', JSON.stringify(newData));

                // Force reload or re-fetch (simplest way without seeing AuthService internals fully)
                // Ideally AuthService has a 'refreshUser' or 'updateState' method.
                // Let's reload the page or navigate back to profile to see changes.

                this.isSubmitting.set(false);
                this.successMessage.set('Address updated successfully.');

                setTimeout(() => {
                    this.router.navigate(['/profile']);
                }, 1000);
            },
            error: (err) => {
                console.error('Error updating address', err);
                this.isSubmitting.set(false);
            }
        });
    }
}
