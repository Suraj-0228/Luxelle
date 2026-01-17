import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin()) {
        return true;
    }

    // If logged in but not admin, maybe redirect to home? 
    // If not logged in, login page.
    if (authService.isLoggedIn()) {
        router.navigate(['/']);
        return false;
    }

    router.navigate(['/login']);
    return false;
};
