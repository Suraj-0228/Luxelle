import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">User Management</h2>
        <p class="text-gray-400 z-10 relative">Manage access and user roles</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Total Users</div>
                <div class="stat-value text-gray-900 font-serif">{{ totalUsers() }}</div>
                <div class="stat-desc">Registered accounts</div>
            </div>
        </div>
        
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Active Users</div>
                <div class="stat-value text-gray-900 font-serif">{{ activeUsers() }}</div>
                <div class="stat-desc">Currently active</div>
            </div>
        </div>

        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Blocked</div>
                <div class="stat-value text-gray-900 font-serif">{{ blockedUsers() }}</div>
                <div class="stat-desc">Restricted accounts</div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Toolbar -->
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="tabs tabs-boxed bg-gray-100 p-1">
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'All'"
                   [class.bg-white]="filterStatus() === 'All'"
                   [class.shadow-sm]="filterStatus() === 'All'"
                   (click)="setFilter('All')">All Users</a>
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Admins'"
                   [class.bg-white]="filterStatus() === 'Admins'"
                   [class.text-primary]="filterStatus() === 'Admins'"
                   (click)="setFilter('Admins')">Admins</a>
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Blocked'"
                   [class.bg-white]="filterStatus() === 'Blocked'"
                   [class.text-error]="filterStatus() === 'Blocked'"
                   (click)="setFilter('Blocked')">Blocked</a>
            </div>

            <div class="relative">
                <input type="text" [(ngModel)]="searchQuery" placeholder="Search user..." class="input input-bordered border-2 border-gray-300 w-full max-w-xs p-2 pl-10 bg-gray-50 focus:bg-white transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead class="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
                    <tr>
                        <th class="py-4 pl-6">User Profile</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th class="pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr *ngFor="let user of filteredUsers()" class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                        <td class="pl-6 py-4">
                            <div class="flex items-center gap-4">
                                <div class="avatar placeholder">
                                    <div class="bg-gray-200 text-gray-600 rounded-full w-12 h-12 shadow-sm border border-gray-100 flex items-center justify-center">
                                        <span class="text-lg font-bold">{{ user.fullname?.charAt(0) || user.username?.charAt(0) || 'U' }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">{{ user.fullname }}</div>
                                    <div class="text-xs opacity-50">{{ user.username }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="font-medium text-gray-600">{{ user.email }}</td>
                        <td>
                             <span class="badge badge-lg gap-2" [ngClass]="user.isAdmin ? 'badge-primary badge-outline font-bold' : 'badge-ghost text-gray-500'">
                                {{ user.isAdmin ? 'Admin' : 'User' }}
                             </span>
                        </td>
                        <td>
                           <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full" [ngClass]="user.isBlocked ? 'bg-error' : 'bg-success'"></div>
                                <span class="font-medium" [ngClass]="user.isBlocked ? 'text-error' : 'text-success'">
                                    {{ user.isBlocked ? 'Blocked' : 'Active' }}
                                </span>
                           </div>
                        </td>
                        <td class="pr-6 text-right">
                           <div class="join" *ngIf="!user.isAdmin">
                                <button class="btn mx-2 btn-square btn-ghost join-item hover:bg-gray-100" 
                                        [ngClass]="user.isBlocked ? 'text-success' : 'text-warning'"
                                        (click)="toggleBlock(user)"
                                        [title]="user.isBlocked ? 'Unblock User' : 'Block User'">
                                    <!-- Lock Icon (Block) -->
                                    <svg *ngIf="!user.isBlocked" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <!-- Unlock Icon (Unblock) -->
                                    <svg *ngIf="user.isBlocked" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </button>
                                <button class="btn mx-2 btn-square btn-ghost text-red-600 join-item hover:bg-red-50" (click)="deleteUser(user._id)" title="Delete User">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                           </div>
                           <span *ngIf="user.isAdmin" class="text-xs text-gray-400 italic">Protected</span>
                        </td>
                    </tr>
                     <tr *ngIf="filteredUsers().length === 0">
                        <td colspan="5" class="text-center py-12 text-gray-400">
                            No users found matching your filters.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  `
})
export class AdminUsersComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);

  users = signal<any[]>([]);
  filterStatus = signal('All');
  searchQuery = signal('');

  // Computed Stats
  totalUsers = computed(() => this.users().length);
  activeUsers = computed(() => this.users().filter(u => !u.isBlocked).length);
  blockedUsers = computed(() => this.users().filter(u => u.isBlocked).length);

  filteredUsers = computed(() => {
    let result = this.users();
    const status = this.filterStatus();
    const query = this.searchQuery().toLowerCase();

    // 1. Filter by Status/Role
    if (status === 'Admins') {
      result = result.filter(u => u.isAdmin);
    } else if (status === 'Blocked') {
      result = result.filter(u => u.isBlocked);
    }

    // 2. Filter by Search
    if (query) {
      result = result.filter(u =>
        u.fullname?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query)
      );
    }

    return result;
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.toastService.show('Failed to load users', 'error')
    });
  }

  setFilter(status: string) {
    this.filterStatus.set(status);
  }

  toggleBlock(user: any) {
    const newStatus = !user.isBlocked;
    this.apiService.updateUser(user._id, { isBlocked: newStatus }).subscribe({
      next: () => {
        this.toastService.show(`User ${newStatus ? 'blocked' : 'unblocked'}`, 'success');
        this.loadUsers();
      },
      error: () => this.toastService.show('Failed to update status', 'error')
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.show('User deleted', 'success');
          this.loadUsers();
        },
        error: () => this.toastService.show('Failed to delete user', 'error')
      });
    }
  }
}
