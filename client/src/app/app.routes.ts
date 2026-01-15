import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Fashion Store - Home' },
    { path: 'shop', component: ShopComponent, title: 'Fashion Store - Shop' },
    { path: 'product/:id', component: ProductDetailComponent, title: 'Product Details', canActivate: [authGuard] },
    { path: 'cart', component: CartComponent, title: 'Shopping Cart' },
    { path: 'checkout', component: CheckoutComponent, title: 'Checkout', canActivate: [authGuard] },
    { path: 'order-success', component: OrderSuccessComponent, title: 'Order Confirmed' },
    { path: 'login', component: LoginComponent, title: 'Sign In' },
    { path: 'register', component: RegisterComponent, title: 'Create Account' },
    { path: 'profile', component: ProfileComponent, title: 'My Profile', canActivate: [authGuard] },
    { path: 'profile/address', loadComponent: () => import('./pages/address-book/address-book.component').then(m => m.AddressBookComponent), title: 'Address Book', canActivate: [authGuard] },
    { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'My Wishlist', canActivate: [authGuard] },
    { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent), title: 'My Orders', canActivate: [authGuard] },
    { path: 'about', component: AboutComponent, title: 'About Us' },
    { path: 'contact', component: ContactComponent, title: 'Contact Us' },
    { path: '**', redirectTo: '' }
];
