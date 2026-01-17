import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="h-screen w-64 bg-gray-900 text-gray-400 flex flex-col fixed left-0 top-0 border-r border-gray-800 shadow-2xl z-50">
      <!-- Logo -->
      <div class="p-8 flex items-center gap-3 border-b border-gray-800/50">
        <div class="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold font-serif text-xl">L</div>
        <div class="text-xl font-bold font-serif text-white tracking-wide">
          Luxelle <span class="text-xs font-sans font-normal opacity-50 block -mt-1 tracking-widest uppercase">Admin</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1">
        
        <p class="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2">Main Menu</p>

        <a routerLink="/admin/products" routerLinkActive="bg-white text-gray-900 shadow-lg shadow-white/10" 
           class="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group hover:bg-white/10 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-transform group-hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.251l4.135-4.135a2.25 2.25 0 013.182 0l-4.059 4.266-4.059-4.266a2.25 2.25 0 013.182 0l4.135 4.135M15.75 19.5v-3.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v3.75" />
            </svg>
          <span class="font-medium tracking-wide">Products</span>
        </a>

        <a routerLink="/admin/users" routerLinkActive="bg-white text-gray-900 shadow-lg shadow-white/10" 
           class="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group hover:bg-white/10 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-transform group-hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          <span class="font-medium tracking-wide">Users</span>
        </a>

        <a routerLink="/admin/orders" routerLinkActive="bg-white text-gray-900 shadow-lg shadow-white/10" 
           class="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group hover:bg-white/10 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-transform group-hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          <span class="font-medium tracking-wide">Orders</span>
        </a>

        <a routerLink="/admin/settings" routerLinkActive="bg-white text-gray-900 shadow-lg shadow-white/10" 
           class="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group hover:bg-white/10 hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-transform group-hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          <span class="font-medium tracking-wide">Settings</span>
        </a>
      </nav>

      <!-- Logout -->
      <div class="p-6 border-t border-gray-800 bg-black/20">
         <button (click)="logout()" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-900/30 text-red-500 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:-translate-x-1 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          <span class="font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  `
})
export class AdminSidebarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
