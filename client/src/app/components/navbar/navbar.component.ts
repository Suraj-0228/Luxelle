import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
  isLoggedInProp = this.authService.isLoggedIn;

  isMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(val => !val);
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  logout() {
    Swal.fire({
      title: 'Are You Sure?',
      text: "You will be Logged out of Your Account!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.isUserMenuOpen.set(false);
      }
    });
  }
}
