import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './profile-sidebar.component.html',
})
export class ProfileSidebarComponent {
    private authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
