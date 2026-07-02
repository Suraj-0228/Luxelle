import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">Category Management</h2>
        <p class="text-gray-400 z-10 relative">Create and organize your product collections</p>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">All Categories</h3>
            <button class="btn bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2" (click)="openModal()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                Add Category
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead class="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
                    <tr>
                        <th class="py-4 pl-6">Category Name</th>
                        <th>Created At</th>
                        <th class="pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr *ngFor="let cat of categories()" class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td class="pl-6 py-4 font-bold text-gray-900">{{ cat.name }}</td>
                        <td>{{ cat.createdAt | date:'mediumDate' }}</td>
                        <td class="pr-6 text-right">
                            <div class="flex justify-end gap-2">
                                <button class="btn btn-square btn-ghost text-blue-600 hover:bg-blue-50" (click)="openModal(cat)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <button class="btn btn-square btn-ghost text-red-600 hover:bg-red-50" (click)="deleteCategory(cat._id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="categories().length === 0">
                        <td colspan="3" class="text-center py-12 text-gray-400">No categories found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="bg-gray-900 p-6 text-white flex justify-between items-center">
                <h3 class="text-xl font-bold font-serif">{{ isEditing() ? 'Edit Category' : 'Add Category' }}</h3>
                <button (click)="closeModal()" class="text-white/70 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div class="p-8">
                <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
                    <div class="form-control">
                        <label class="label"><span class="label-text font-bold text-gray-700">Category Name</span></label>
                        <input type="text" formControlName="name" class="input input-bordered border-2 mt-1 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" placeholder="e.g. Purses" />
                    </div>
                    <div class="mt-8 flex justify-end gap-3">
                        <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 hover:cursor-pointer ml-3 px-6 py-2 font-bold rounded-lg shadow-lg" [disabled]="categoryForm.invalid">
                            {{ isEditing() ? 'Update' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `
})
export class AdminCategoriesComponent {
    apiService = inject(ApiService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    categories = signal<any[]>([]);
    isModalOpen = signal(false);
    isEditing = signal(false);
    currentId: string | null = null;

    categoryForm: FormGroup = this.fb.group({
        name: ['', Validators.required]
    });

    constructor() {
        this.loadCategories();
    }

    loadCategories() {
        this.apiService.getCategories().subscribe({
            next: (data) => this.categories.set(data),
            error: () => this.toastService.show('Failed to load categories', 'error')
        });
    }

    openModal(cat: any = null) {
        this.isModalOpen.set(true);
        if (cat) {
            this.isEditing.set(true);
            this.currentId = cat._id;
            this.categoryForm.patchValue({ name: cat.name });
        } else {
            this.isEditing.set(false);
            this.currentId = null;
            this.categoryForm.reset();
        }
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    onSubmit() {
        if (this.categoryForm.invalid) return;

        const request = this.isEditing() && this.currentId
            ? this.apiService.updateCategory(this.currentId, this.categoryForm.value)
            : this.apiService.createCategory(this.categoryForm.value);

        request.subscribe({
            next: () => {
                this.toastService.show(this.isEditing() ? 'Category updated' : 'Category created', 'success');
                this.closeModal();
                this.loadCategories();
            },
            error: (err) => this.toastService.show(err.error?.message || 'Operation failed', 'error')
        });
    }

    deleteCategory(id: string) {
        Swal.fire({
            title: 'Remove Category?',
            text: 'Are you sure? This will not affect existing products but the category will be removed from future selection.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.deleteCategory(id).subscribe({
                    next: () => {
                        this.toastService.show('Category removed', 'success');
                        this.loadCategories();
                    },
                    error: () => this.toastService.show('Failed to remove category', 'error')
                });
            }
        });
    }
}
