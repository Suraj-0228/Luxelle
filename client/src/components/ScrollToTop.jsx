import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getTitleFromPathname = (pathname) => {
  if (pathname === '/') return 'Luxelle | Luxury Fashion Store';
  
  // Admin Routes
  if (pathname.startsWith('/admin/')) {
    const sub = pathname.replace('/admin/', '');
    const capitalized = sub.charAt(0).toUpperCase() + sub.slice(1);
    return `Admin - ${capitalized} | Luxelle`;
  }
  if (pathname === '/admin') return 'Admin Dashboard | Luxelle';

  // Dynamic Product details
  if (pathname.startsWith('/product/')) return 'Product Details | Luxelle';

  // Specific user profile routes
  if (pathname === '/profile/address') return 'Address Book | Luxelle';
  if (pathname === '/profile/settings') return 'Account Settings | Luxelle';

  // Standard routes mapping
  const routeTitles = {
    '/shop': 'Shop',
    '/latest': 'Latest Arrivals',
    '/cart': 'Shopping Bag',
    '/checkout': 'Checkout',
    '/order-success': 'Order Confirmed',
    '/login': 'Sign In',
    '/register': 'Create Account',
    '/profile': 'My Profile',
    '/wishlist': 'My Wishlist',
    '/orders': 'My Orders',
    '/about': 'Our Story',
    '/contact': 'Contact Us',
    '/sustainability': 'Sustainability',
    '/careers': 'Careers',
    '/press': 'Press',
    '/shipping-returns': 'Shipping & Returns',
    '/faq': 'FAQ',
    '/terms': 'Terms & Conditions',
  };

  const title = routeTitles[pathname];
  return title ? `${title} | Luxelle` : 'Luxelle';
};

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = getTitleFromPathname(pathname);
  }, [pathname]);

  return null;
}
