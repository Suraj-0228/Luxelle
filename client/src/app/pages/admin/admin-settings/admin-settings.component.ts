import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">Settings</h2>
        <p class="text-gray-400 z-10 relative">Manage your profile and preferences</p>
    </div>

    <div class="flex flex-col md:flex-row gap-8 items-start">
        <!-- Sidebar Tabs -->
        <div class="w-full md:w-72 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 class="font-bold text-gray-400 uppercase tracking-wider text-xs">Account Settings</h3>
            </div>
            <div class="flex flex-col p-2">
                <button (click)="activeTab.set('profile')" 
                    [class.bg-gray-900]="activeTab() === 'profile'" 
                    [class.text-white]="activeTab() === 'profile'"
                    [class.text-gray-600]="activeTab() !== 'profile'"
                    class="btn flex items-center justify-start h-auto py-4 px-6 border-none shadow-none rounded-lg transition-all text-left group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                        [class.text-white]="activeTab() === 'profile'" 
                        [class.text-gray-400]="activeTab() !== 'profile'"
                        class="w-5 h-5 mr-3 transition-colors"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span class="font-medium">Profile Information</span>
                </button>
                 <button (click)="activeTab.set('notifications')" 
                    [class.bg-gray-900]="activeTab() === 'notifications'" 
                    [class.text-white]="activeTab() === 'notifications'"
                    [class.text-gray-600]="activeTab() !== 'notifications'"
                    class="btn flex items-center justify-start h-auto py-4 px-6 border-none shadow-none rounded-lg transition-all text-left group mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                        [class.text-white]="activeTab() === 'notifications'" 
                        [class.text-gray-400]="activeTab() !== 'notifications'"
                        class="w-5 h-5 mr-3 transition-colors"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                    <span class="font-medium">Notifications</span>
                </button>
            </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-white p-10 rounded-xl shadow-lg border border-gray-100 min-h-[500px]">
            
            <!-- Profile Tab -->
            <div *ngIf="activeTab() === 'profile'" class="fade-in">
                <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h3 class="text-2xl font-serif font-bold text-gray-900">Personal Information</h3>
                        <p class="text-gray-500 mt-1">Update your personal details and contact info.</p>
                    </div>
                    <div class="avatar placeholder">
                        <div class="bg-gray-900 pl-[17.6px] text-white rounded-full w-12 text-xl font-serif">
                             <span>{{ profileForm.get('fullname')?.value?.charAt(0) }}</span>
                        </div>
                    </div>
                </div>
                
                <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="space-y-8 max-w-2xl">
                    <div class="grid grid-cols-1 gap-6">
                        <div class="form-control">
                            <label class="label pl-0"><span class="label-text font-bold text-gray-700 text-base">Full Name</span></label>
                            <input type="text" formControlName="fullname" class="input input-bordered px-4 w-full h-12 text-base bg-white border-2 border-gray-200 focus:border-gray-900 focus:ring-0 rounded-lg transition-all" />
                            <div *ngIf="profileForm.get('fullname')?.touched && profileForm.get('fullname')?.invalid" class="text-red-500 text-xs mt-1">
                                <span *ngIf="profileForm.get('fullname')?.errors?.['required']">Full Name is required</span>
                            </div>
                        </div>
                        <div class="form-control">
                            <label class="label pl-0"><span class="label-text font-bold text-gray-700 text-base">Email Address</span></label>
                            <input type="email" formControlName="email" class="input input-bordered px-4 w-full h-12 text-base bg-gray-50 border-2 border-gray-200 text-gray-500 rounded-lg" readonly />
                            <label class="label pl-0 pt-2"><span class="label-text-alt text-gray-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg> Email cannot be changed for security reasons</span></label>
                        </div>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-100">
                        <button type="submit" class="btn bg-gray-900 hover:bg-black text-white px-8 h-12 text-base rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">Save Changes</button>
                    </div>
                </form>
            </div>

             <!-- Notifications Tab -->
            <div *ngIf="activeTab() === 'notifications'" class="fade-in">
                <div class="mb-8 border-b border-gray-100 pb-6">
                    <h3 class="text-2xl font-serif font-bold text-gray-900">Notification Preferences</h3>
                    <p class="text-gray-500 mt-1">Manage how you receive updates and alerts.</p>
                </div>

                <div class="space-y-6 max-w-2xl">
                    <div class="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                        <div>
                            <span class="block font-bold text-gray-900 text-lg mb-1">Email Notifications</span>
                            <p class="text-sm text-gray-500">Receive daily summaries and critical alerts via email.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" checked>
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                    
                    <div class="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                        <div>
                            <span class="block font-bold text-gray-900 text-lg mb-1">Push Notifications</span>
                            <p class="text-sm text-gray-500">Get real-time updates on new orders and user signups.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" checked>
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                     <div class="flex items-start justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                        <div>
                            <span class="block font-bold text-gray-900 text-lg mb-1">Marketing Emails</span>
                            <p class="text-sm text-gray-500">Receive news about Luxelle features and updates.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                    
                    <div class="pt-6 border-t border-gray-100 flex justify-end">
                        <button class="btn bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg shadow-lg" (click)="toastService.show('Preferences saved', 'success')">Save Preferences</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  `
})
export class AdminSettingsComponent {
    authService = inject(AuthService);
    apiService = inject(ApiService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    activeTab = signal('profile');

    profileForm: FormGroup;

    constructor() {
        const user = this.authService.currentUser();

        this.profileForm = this.fb.group({
            fullname: [user?.fullname || '', Validators.required],
            email: [user?.email || '', [Validators.required, Validators.email]]
        });
    }

    onSaveProfile() {
        if (this.profileForm.valid) {
            // Mock API call
            this.toastService.show('Profile updated successfully', 'success');
        }
    }
}
