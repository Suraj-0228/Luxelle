import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-taxes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">Tax Management</h2>
        <p class="text-gray-400 z-10 relative">Manage GST, import duties, and processing fees applied during checkout</p>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">All Taxes</h3>
            <button class="btn bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 shadow-md" (click)="openModal()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                Add Tax Rule
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead class="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
                    <tr>
                        <th class="py-4 pl-6">Tax Name</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Rate / Amount</th>
                        <th class="pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr *ngFor="let tax of taxes()" class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td class="pl-6 py-4 font-bold text-gray-900">{{ tax.name }}</td>
                        <td class="font-mono text-sm text-gray-500">{{ tax.code }}</td>
                        <td class="capitalize">{{ tax.type }}</td>
                        <td class="font-bold">
                            {{ tax.type === 'percentage' ? (tax.rate * 100) + '%' : '₹' + tax.rate }}
                        </td>
                        <td class="pr-6 text-right">
                            <div class="flex justify-end gap-2">
                                <button class="btn btn-square btn-ghost text-blue-600 hover:bg-blue-50" (click)="openModal(tax)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <button class="btn btn-square btn-ghost text-red-600 hover:bg-red-50" (click)="deleteTax(tax._id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="taxes().length === 0">
                        <td colspan="5" class="text-center py-12 text-gray-400">No tax configurations found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="bg-gray-900 p-6 text-white flex justify-between items-center">
                <h3 class="text-xl font-bold font-serif">{{ isEditing() ? 'Edit Tax Rule' : 'Add Tax Rule' }}</h3>
                <button (click)="closeModal()" class="text-white/70 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div class="p-8">
                <form [formGroup]="taxForm" (ngSubmit)="onSubmit()">
                    <div class="space-y-4">
                        <div class="form-control">
                            <label class="label"><span class="label-text font-bold text-gray-700">Tax Name</span></label>
                            <input type="text" formControlName="name" class="input input-bordered border-2 mt-1 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" placeholder="e.g. GST Tax" />
                            <div *ngIf="taxForm.get('name')?.touched && taxForm.get('name')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                                <span *ngIf="taxForm.get('name')?.errors?.['required']">Tax Name is required.</span>
                            </div>
                        </div>
                        
                        <div class="form-control">
                            <label class="label"><span class="label-text font-bold text-gray-700">Tax Code</span></label>
                            <input type="text" formControlName="code" class="input input-bordered border-2 mt-1 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" placeholder="e.g. gst" [readOnly]="isEditing()" />
                            <div *ngIf="taxForm.get('code')?.touched && taxForm.get('code')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                                <span *ngIf="taxForm.get('code')?.errors?.['required']">Tax Code is required.</span>
                                <span *ngIf="taxForm.get('code')?.errors?.['pattern']">Tax Code must be lowercase, alphanumeric, and may contain underscores (e.g. gst, import_duty).</span>
                            </div>
                        </div>

                        <div class="form-control">
                            <label class="label"><span class="label-text font-bold text-gray-700">Type</span></label>
                            <select formControlName="type" class="select select-bordered border-2 mt-1 pl-4 pr-12 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[position:right_1rem_center] bg-no-repeat cursor-pointer">
                                <option value="percentage">Percentage (Multiplier, e.g. 0.18 for 18%)</option>
                                <option value="flat">Flat Amount (Fixed Fee, e.g. 150)</option>
                            </select>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-bold text-gray-700">
                                    {{ taxForm.get('type')?.value === 'percentage' ? 'Rate Multiplier (e.g. 0.18 for 18%)' : 'Flat Amount (e.g. 150, must be between 100-200)' }}
                                </span>
                            </label>
                            <input type="number" step="0.0001" formControlName="rate" class="input input-bordered border-2 mt-1 px-3 w-full bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-12" placeholder="0.18" />
                            <div *ngIf="taxForm.get('rate')?.touched && taxForm.get('rate')?.invalid" class="text-red-500 text-xs mt-1 pl-1">
                                <span *ngIf="taxForm.get('rate')?.errors?.['required']">Rate/Amount is required.</span>
                                <span *ngIf="taxForm.get('rate')?.errors?.['min'] && taxForm.get('type')?.value === 'flat'">Flat fee must be between 100 and 200.</span>
                                <span *ngIf="taxForm.get('rate')?.errors?.['max'] && taxForm.get('type')?.value === 'flat'">Flat fee must be between 100 and 200.</span>
                                <span *ngIf="taxForm.get('rate')?.errors?.['min'] && taxForm.get('type')?.value !== 'flat'">Rate must be a positive number.</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end gap-3">
                        <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 hover:cursor-pointer ml-3 px-6 py-2 font-bold rounded-lg shadow-lg" [disabled]="taxForm.invalid">
                            {{ isEditing() ? 'Update' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `
})
export class AdminTaxesComponent {
  apiService = inject(ApiService);
  toastService = inject(ToastService);
  cartService = inject(CartService);
  fb = inject(FormBuilder);

  taxes = signal<any[]>([]);
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentId: string | null = null;

  taxForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern('^[a-z0-9_]+$')]],
    type: ['percentage', Validators.required],
    rate: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    this.taxForm.get('type')?.valueChanges.subscribe(type => {
      const rateControl = this.taxForm.get('rate');
      if (type === 'flat') {
        rateControl?.setValidators([Validators.required, Validators.min(100), Validators.max(200)]);
      } else {
        rateControl?.setValidators([Validators.required, Validators.min(0)]);
      }
      rateControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadTaxes();
  }

  loadTaxes() {
    this.apiService.getTaxes().subscribe({
      next: (res: any) => {
        this.taxes.set(res.data || []);
      },
      error: (err) => {
        console.error('Error fetching taxes', err);
        this.toastService.show('Failed to fetch taxes', 'error');
      }
    });
  }

  openModal(tax?: any) {
    this.isModalOpen.set(true);
    if (tax) {
      this.isEditing.set(true);
      this.currentId = tax._id;
      this.taxForm.patchValue({
        name: tax.name,
        code: tax.code,
        type: tax.type,
        rate: tax.rate
      });
    } else {
      this.isEditing.set(false);
      this.currentId = null;
      this.taxForm.reset({
        name: '',
        code: '',
        type: 'percentage',
        rate: 0
      });
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.taxForm.reset();
  }

  onSubmit() {
    if (this.taxForm.invalid) {
      this.taxForm.markAllAsTouched();
      return;
    }

    const data = this.taxForm.value;

    if (this.isEditing() && this.currentId) {
      this.apiService.updateTax(this.currentId, data).subscribe({
        next: () => {
          this.toastService.show('Tax rule updated successfully', 'success');
          this.loadTaxes();
          this.cartService.fetchTaxes(); // Update active session taxes
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating tax', err);
          this.toastService.show(err.error?.error || 'Failed to update tax rule', 'error');
        }
      });
    } else {
      this.apiService.createTax(data).subscribe({
        next: () => {
          this.toastService.show('Tax rule created successfully', 'success');
          this.loadTaxes();
          this.cartService.fetchTaxes(); // Update active session taxes
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating tax', err);
          this.toastService.show(err.error?.error || 'Failed to create tax rule', 'error');
        }
      });
    }
  }

  deleteTax(id: string) {
    Swal.fire({
        title: 'Delete Tax Rule?',
        text: 'Are you sure you want to delete this tax rule?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#111827',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            this.apiService.deleteTax(id).subscribe({
                next: () => {
                    this.toastService.show('Tax rule deleted successfully', 'success');
                    this.loadTaxes();
                    this.cartService.fetchTaxes(); // Update active session taxes
                },
                error: (err) => {
                    console.error('Error deleting tax', err);
                    this.toastService.show('Failed to delete tax rule', 'error');
                }
            });
        }
    });
  }
}
