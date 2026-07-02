import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-address-book',
    standalone: true,
    imports: [CommonModule, FormsModule, ProfileSidebarComponent],
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
                // Merge and update the AuthService state correctly using the 'user' localStorage key and signal
                const currentUserData = this.authService.currentUser() || {};
                const newData = { ...currentUserData, ...updatedUser };
                this.authService.setUser(newData);

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
