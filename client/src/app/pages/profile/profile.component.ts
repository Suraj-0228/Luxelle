import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, ProfileSidebarComponent],
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private orderService = inject(OrderService);

    user = this.authService.currentUser;
    orders = signal<any[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        // Profile logic
    }

    logout() {
        this.authService.logout();
    }
}
