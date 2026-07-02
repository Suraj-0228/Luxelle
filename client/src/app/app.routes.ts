import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { LatestComponent } from './pages/latest/latest.component';
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
import { adminGuard } from './guards/admin.guard';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Admin Pages
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/admin-orders.component';
import { AdminSettingsComponent } from './pages/admin/admin-settings/admin-settings.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories/admin-categories.component';
import { AdminTaxesComponent } from './pages/admin/admin-taxes/admin-taxes.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', component: AdminProductsComponent, title: 'Admin - Products' },
            { path: 'users', component: AdminUsersComponent, title: 'Admin - Users' },
            { path: 'orders', component: AdminOrdersComponent, title: 'Admin - Orders' },
            { path: 'categories', component: AdminCategoriesComponent, title: 'Admin - Categories' },
            { path: 'taxes', component: AdminTaxesComponent, title: 'Admin - Taxes' },
            { path: 'settings', component: AdminSettingsComponent, title: 'Admin - Settings' },
        ]
    },
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent, title: 'Luxelle - Home' },
            { path: 'shop', component: ShopComponent, title: 'Luxelle - Shop' },
            { path: 'latest', component: LatestComponent, title: 'Luxelle - Latest Collection' },
            { path: 'product/:id', component: ProductDetailComponent, title: 'Luxelle - Product Details' },
            { path: 'cart', component: CartComponent, title: 'Luxelle - Shopping Cart' },
            { path: 'checkout', component: CheckoutComponent, title: 'Luxelle - Checkout', canActivate: [authGuard] },
            { path: 'order-success', component: OrderSuccessComponent, title: 'Luxelle - Order Confirmed' },
            { path: 'login', component: LoginComponent, title: 'Luxelle - Sign In' },
            { path: 'register', component: RegisterComponent, title: 'Luxelle - Create Account' },
            { path: 'profile', component: ProfileComponent, title: 'Luxelle - My Profile', canActivate: [authGuard] },
            { path: 'profile/address', loadComponent: () => import('./pages/address-book/address-book.component').then(m => m.AddressBookComponent), title: 'Luxelle - Address Book', canActivate: [authGuard] },
            { path: 'profile/settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent), title: 'Luxelle - Settings', canActivate: [authGuard] }, // Touch settings component trigger
            { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'Luxelle - My Wishlist', canActivate: [authGuard] },
            { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent), title: 'Luxelle - My Orders', canActivate: [authGuard] },
            { path: 'about', component: AboutComponent, title: 'Luxelle - About Us' },
            { path: 'contact', component: ContactComponent, title: 'Luxelle - Contact Us' },
            { path: 'sustainability', loadComponent: () => import('./pages/sustainability/sustainability.component').then(m => m.SustainabilityComponent), title: 'Luxelle - Sustainability' },
            { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent), title: 'Luxelle - Careers' },
            { path: 'press', loadComponent: () => import('./pages/press/press.component').then(m => m.PressComponent), title: 'Luxelle - Press' },
            { path: 'shipping-returns', loadComponent: () => import('./pages/shipping-returns/shipping-returns.component').then(m => m.ShippingReturnsComponent), title: 'Luxelle - Shipping & Returns' },
            { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FAQComponent), title: 'Luxelle - FAQ' },
            { path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent), title: 'Luxelle - Terms of Service' },
        ]
    },
    { path: '**', redirectTo: '' }
];
