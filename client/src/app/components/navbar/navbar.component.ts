import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private cartService = inject(CartService);
  public authService = inject(AuthService);

  cartCount = this.cartService.count;
  user = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn;

  isMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
  }
}

