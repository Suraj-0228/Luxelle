import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">Product Inventory</h2>
        <p class="text-gray-400 z-10 relative">Manage your catalog and stock</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Total Products</div>
                <div class="stat-value text-gray-900 font-serif">{{ totalProducts() }}</div>
                <div class="stat-desc">Items in catalog</div>
            </div>
        </div>
        
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Avg. Price</div>
                <div class="stat-value text-gray-900 font-serif">{{ avgPrice() | currency }}</div>
                <div class="stat-desc">across all items</div>
            </div>
        </div>

        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Categories</div>
                <div class="stat-value text-gray-900 font-serif">{{ totalCategories() }}</div>
                <div class="stat-desc">Active collections</div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Toolbar -->
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative">
                <input type="text" placeholder="Search products..." class="input input-bordered border-2 border-gray-300 w-full max-w-xs p-2 pl-10 bg-gray-50 focus:bg-white transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
             <button class="flex items-center gap-2 btn bg-gray-900 hover:bg-black text-white border-none duration-300 mx-4 px-4 py-2 font-bold rounded-lg" (click)="openModal()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                Add Product
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead class="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
                    <tr>
                        <th class="py-4 pl-6">Product Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th class="pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr *ngFor="let product of paginatedProducts()" class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                        <td class="pl-6 py-4">
                            <div class="flex items-center gap-4">
                                <div class="avatar shadow-sm rounded-xl">
                                    <div class="mask mask-squircle w-16 h-16">
                                        <img [src]="product.image" [alt]="product.name" />
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">{{ product.name }}</div>
                                    <div class="text-xs opacity-50 truncate max-w-[200px]">{{ product.description }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                             <span class="badge badge-outline badge-sm">{{ product.category }}</span>
                        </td>
                        <td class="font-bold font-serif text-lg">{{ product.price | currency }}</td>
                        <td class="pr-6 text-right">
                           <div class="join">
                                <button class="btn mx-1 btn-square btn-ghost text-blue-600 join-item hover:bg-blue-50" (click)="openModal(product)" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <button class="btn mx-1 btn-square btn-ghost text-red-600 join-item hover:bg-red-50" (click)="deleteProduct(product._id)" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                           </div>
                        </td>
                    </tr>
                     <tr *ngIf="products().length === 0">
                        <td colspan="4" class="text-center py-12 text-gray-400">
                            No products found. Add one to get started.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50" *ngIf="totalPages() > 1">
            <span class="text-sm text-gray-500 font-medium">
                Showing {{ (currentPage() - 1) * itemsPerPage + 1 }} - {{ (currentPage() * itemsPerPage) > totalProducts() ? totalProducts() : (currentPage() * itemsPerPage) }} 
                of {{ totalProducts() }} products
            </span>
            <div class="join shadow-sm bg-gray-500/10 flex items-center">
                <button class="join-item text-gray-900 font-bold" 
                        [disabled]="currentPage() === 1" 
                        (click)="changePage(currentPage() - 1)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button class="join-item bg-white text-gray-900 font-bold pointer-events-none px-4">
                    Page {{ currentPage() }}
                </button>
                <button class="join-item text-gray-900 font-bold" 
                        [disabled]="currentPage() === totalPages()" 
                        (click)="changePage(currentPage() + 1)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div role="dialog" id="product_modal" class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 opacity-0 pointer-events-none" [class.opacity-100]="isModalOpen()" [class.opacity-0]="!isModalOpen()" [class.pointer-events-auto]="isModalOpen()" [class.pointer-events-none]="!isModalOpen()">
      <div class="modal-box w-11/12 max-w-4xl bg-white text-gray-800 p-0 rounded-2xl shadow-2xl relative z-10 scale-100 transition-transform duration-200 flex flex-col max-h-[90vh]" [class.scale-100]="isModalOpen()" [class.scale-95]="!isModalOpen()">
        
        <!-- Modal Header -->
        <div class="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-serif font-bold text-2xl tracking-wide">{{ isEditing() ? 'Edit Product' : 'Add New Product' }}</h3>
                <p class="text-sm text-gray-400 mt-1">Fill in the details below to {{ isEditing() ? 'update the' : 'add a new' }} product.</p>
            </div>
            <button (click)="closeModal()" class="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="p-8 overflow-y-auto flex-1">
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="flex flex-col lg:flex-row gap-8">
                
                <!-- Left Column: Form Fields -->
                <div class="flex-1 space-y-6">
                    <div class="form-control w-full">
                        <label class="label pl-1"><span class="label-text font-bold text-gray-700">Product Name</span></label>
                        <input type="text" formControlName="name" placeholder="e.g. Diamond Stud Earrings" class="input input-bordered border-2 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" />
                        <div *ngIf="productForm.get('name')?.touched && productForm.get('name')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                            <span *ngIf="productForm.get('name')?.errors?.['required']">Product Name is required</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="form-control w-full">
                            <label class="label pl-1"><span class="label-text font-bold text-gray-700">Brand</span></label>
                            <input type="text" formControlName="brand" placeholder="e.g. Luxelle" class="input input-bordered border-2 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" />
                            <div *ngIf="productForm.get('brand')?.touched && productForm.get('brand')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                                <span *ngIf="productForm.get('brand')?.errors?.['required']">Brand is required</span>
                            </div>
                        </div>
                        <div class="form-control w-full">
                            <label class="label pl-1"><span class="label-text font-bold text-gray-700">Price</span></label>
                            <input type="number" formControlName="price" class="input input-bordered border-2 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" />
                            <div *ngIf="productForm.get('price')?.touched && productForm.get('price')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                                <span *ngIf="productForm.get('price')?.errors?.['required']">Price is required</span>
                                <span *ngIf="productForm.get('price')?.errors?.['min']">Price must be a positive number</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-control w-full">
                        <label class="label pl-1"><span class="label-text font-bold text-gray-700">Category</span></label>
                        <select formControlName="category" class="select select-bordered border-2 px-3 w-full bg-white border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all rounded-lg h-12">
                            <option value="" disabled selected>Select Category</option>
                            <option value="Bags">Bags</option>
                            <option value="Watches">Watches</option>
                            <option value="Sunglasses">Sunglasses</option>
                            <option value="Belts">Belts</option>
                        </select>
                         <div *ngIf="productForm.get('category')?.touched && productForm.get('category')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                            <span *ngIf="productForm.get('category')?.errors?.['required']">Category is required</span>
                        </div>
                    </div>

                    <div class="form-control w-full">
                        <label class="label pl-1"><span class="label-text font-bold text-gray-700">Description</span></label>
                        <textarea formControlName="description" placeholder="Describe the product features and materials..." class="textarea textarea-bordered border-2 px-3 w-full h-24 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg text-base py-3 leading-relaxed resize-none"></textarea>
                        <div *ngIf="productForm.get('description')?.touched && productForm.get('description')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                            <span *ngIf="productForm.get('description')?.errors?.['required']">Description is required</span>
                        </div>
                    </div>

                     <div class="form-control w-full">
                        <label class="label pl-1"><span class="label-text font-bold text-gray-700">Image URL</span></label>
                        <input type="text" formControlName="image" placeholder="https://..." class="input input-bordered border-2 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" />
                        <div *ngIf="productForm.get('image')?.touched && productForm.get('image')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                            <span *ngIf="productForm.get('image')?.errors?.['required']">Image URL is required</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Image Preview -->
                <div class="w-full lg:w-72 flex flex-col gap-2 shrink-0">
                    <label class="label pl-1"><span class="label-text font-bold text-gray-700">Preview</span></label>
                    <div class="w-full aspect-square rounded-xl border-2 border-dashed border-gray-900 bg-gray-50 flex items-center justify-center overflow-hidden relative group transition-colors">
                        <img *ngIf="productForm.get('image')?.value" [src]="productForm.get('image')?.value" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                        <div *ngIf="!productForm.get('image')?.value" class="text-center p-6 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <span class="text-sm font-medium">Image preview</span>
                        </div>
                    </div>
                </div>

            </form>
        </div>

        <!-- Modal Actions (Fixed Footer) -->
        <div class="modal-action p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 m-0">
             <button type="button" class="btn btn-ghost hover:bg-gray-200 rounded-lg text-gray-600" (click)="closeModal()">Cancel</button>
             <button type="button" class="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 hover:cursor-pointer ml-3 px-6 py-2 font-bold rounded-lg shadow-lg" (click)="onSubmit()" [disabled]="productForm.invalid">
                {{ isEditing() ? 'Update Product' : 'Add Product' }}
            </button>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent {
    apiService = inject(ApiService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    products = signal<any[]>([]);
    currentPage = signal(1);
    itemsPerPage = 6;
    isModalOpen = signal(false);
    isEditing = signal(false);
    currentId: string | null = null;

    // Computed Stats
    totalProducts = computed(() => this.products().length);
    avgPrice = computed(() => {
        const ps = this.products();
        if (ps.length === 0) return 0;
        return ps.reduce((acc, p) => acc + (p.price || 0), 0) / ps.length;
    });
    totalCategories = computed(() => {
        const categories = this.products().map(p => p.category).filter(Boolean);
        return new Set(categories).size;
    });

    totalPages = computed(() => Math.ceil(this.products().length / this.itemsPerPage));

    paginatedProducts = computed(() => {
        const start = (this.currentPage() - 1) * this.itemsPerPage;
        return this.products().slice(start, start + this.itemsPerPage);
    });

    productForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        brand: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        category: ['', Validators.required],
        image: ['', Validators.required]
    });

    constructor() {
        this.loadProducts();
    }

    loadProducts() {
        this.apiService.getProducts().subscribe({
            next: (data) => this.products.set(data),
            error: () => this.toastService.show('Failed to load products', 'error')
        });
    }

    openModal(product: any = null) {
        this.isModalOpen.set(true);
        if (product) {
            this.isEditing.set(true);
            this.currentId = product._id;
            this.productForm.patchValue(product);
        } else {
            this.isEditing.set(false);
            this.currentId = null;
            this.productForm.reset();
        }
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    onSubmit() {
        if (this.productForm.invalid) return;

        const data = this.productForm.value;
        const request = this.isEditing() && this.currentId
            ? this.apiService.updateProduct(this.currentId, data)
            : this.apiService.createProduct(data);

        request.subscribe({
            next: () => {
                this.toastService.show(this.isEditing() ? 'Product updated' : 'Product created', 'success');
                this.closeModal();
                this.loadProducts();
            },
            error: () => this.toastService.show('Operation failed', 'error')
        });
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.apiService.deleteProduct(id).subscribe({
                next: () => {
                    this.toastService.show('Product deleted', 'success');
                    this.loadProducts();
                },
                error: () => this.toastService.show('Failed to delete product', 'error')
            });
        }
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
        }
    }
}
