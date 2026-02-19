import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="mb-8 p-8 bg-gray-900 text-white rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h2 class="text-4xl font-serif font-bold mb-2 z-10 relative">Orders Management</h2>
        <p class="text-gray-400 z-10 relative">Overview of your store's performance</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Total Revenue</div>
                <div class="stat-value text-gray-900 font-serif">{{ totalRevenue() | currency }}</div>
                <div class="stat-desc">Lifetime earnings</div>
            </div>
        </div>
        
        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Total Orders</div>
                <div class="stat-value text-gray-900 font-serif">{{ totalOrders() }}</div>
                <div class="stat-desc">All time</div>
            </div>
        </div>

        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Pending</div>
                <div class="stat-value text-gray-900 font-serif">{{ pendingOrders() }}</div>
                <div class="stat-desc text-warning">Needs attention</div>
            </div>
        </div>

        <div class="stats shadow bg-white text-gray-800 border border-gray-100">
            <div class="stat p-5">
                <div class="stat-figure text-success">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="stat-title text-gray-500 font-sans tracking-wide">Completed</div>
                <div class="stat-value text-gray-900 font-serif">{{ completedOrders() }}</div>
                 <div class="stat-desc text-success">Shipped & Delivered</div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Toolbar -->
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="tabs tabs-boxed bg-gray-100 p-1">
                <a class="tab transition-all mr-4 px-4 duration-300 hover:cursor-pointer" 
                   [class.tab-active]="filterStatus() === 'All'" 
                   [class.bg-white]="filterStatus() === 'All'"
                   [class.shadow-sm]="filterStatus() === 'All'"
                   (click)="setFilter('All')">All</a>
                <a class="tab transition-all mx-4 px-4 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Processing'" 
                   [class.bg-white]="filterStatus() === 'Processing'"
                   [class.text-warning]="filterStatus() === 'Processing'"
                    (click)="setFilter('Processing')">Processing</a>
                <a class="tab transition-all mx-4 px-4 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Shipped'"
                   [class.bg-white]="filterStatus() === 'Shipped'"
                   [class.text-primary]="filterStatus() === 'Shipped'"
                   (click)="setFilter('Shipped')">Shipped</a>
                 <a class="tab transition-all mx-4 px-4 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Delivered'"
                   [class.bg-white]="filterStatus() === 'Delivered'"
                   [class.text-success]="filterStatus() === 'Delivered'"
                   (click)="setFilter('Delivered')">Delivered</a>
            </div>
            
            <div class="relative">
                <input type="text" placeholder="Search orders..." class="input input-bordered border-2 border-gray-300 w-full max-w-xs p-2 pl-10 bg-gray-50 focus:bg-white transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead class="bg-gray-50 text-gray-600 font-serif text-sm uppercase tracking-wider">
                    <tr>
                        <th class="py-4 pl-6">Order Details</th>
                        <th>Ordering Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th class="pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr *ngFor="let order of filteredOrders()" class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                        <td class="pl-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="avatar placeholder">
                                    <div class="bg-neutral-focus text-neutral-content rounded-full ps-[14.5px] pb-[2px] w-10 bg-gray-200 text-gray-500">
                                        <span class="text-xs font-bold">{{ order.user?.fullname?.charAt(0) || 'U' }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 transition-colors">{{ order.user?.fullname || order.user?.email || 'Guest User' }}</div>
                                    <div class="text-xs opacity-50">#{{ order._id }} | {{ order.user?.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="font-medium">{{ order.orderDate | date:'mediumDate' }}<br/><span class="text-xs opacity-50">{{ order.orderDate | date:'shortTime' }}</span></td>
                        <td class="font-bold font-serif text-lg">{{ order.totalAmount | currency }}</td>
                        <td>
                             <div class="badge gap-2 py-3 px-4 rounded-full font-medium shadow-sm border-0" 
                                  [ngClass]="{
                                    'bg-blue-50 text-blue-600': order.orderStatus === 'Processing',
                                    'bg-yellow-50 text-yellow-600': order.orderStatus === 'Shipped',
                                    'bg-green-50 text-green-600': order.orderStatus === 'Delivered',
                                    'bg-red-50 text-red-600': order.orderStatus === 'Cancelled',
                                    'bg-gray-100 text-gray-600': order.orderStatus === 'Returned',
                                    'bg-purple-50 text-purple-600': order.orderStatus === 'Confirmed'
                                  }">
                                {{ order.orderStatus }}
                            </div>
                        </td>
                        <td class="pr-6 text-right">
                             <div class="flex items-center justify-end gap-2">
                                <button class="btn btn-square btn-ghost btn-sm text-gray-500 hover:bg-gray-100" (click)="viewOrderDetails(order)" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                 <select class="select select-bordered select-sm w-full max-w-[130px] bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                                        [ngModel]="order.orderStatus" 
                                        (ngModelChange)="updateStatus(order._id, $event)">
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                             </div>
                        </td>
                    </tr>
                    
                    <tr *ngIf="filteredOrders().length === 0">
                        <td colspan="5" class="text-center py-12 text-gray-400">
                            No orders found matching this filter.
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>

    <!-- Order Details Modal -->
    <div role="dialog" class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 opacity-0 pointer-events-none" 
         [class.opacity-100]="selectedOrder()" 
         [class.opacity-0]="!selectedOrder()" 
         [class.pointer-events-auto]="selectedOrder()" 
         [class.pointer-events-none]="!selectedOrder()">
      
      <div class="modal-box w-11/12 max-w-3xl bg-white text-gray-800 p-0 rounded-2xl shadow-2xl relative z-10 scale-100 transition-transform duration-200 flex flex-col max-h-[90vh]" 
           [class.scale-100]="selectedOrder()" 
           [class.scale-95]="!selectedOrder()">
        
        <!-- Modal Header -->
        <div class="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-serif font-bold text-2xl tracking-wide">Order Details</h3>
                <p class="text-sm text-gray-400 mt-1" *ngIf="selectedOrder()">
                    Order #{{ selectedOrder()._id }} • {{ selectedOrder().orderDate | date:'medium' }}
                </p>
            </div>
            <button (click)="closeDetailsModal()" class="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="p-8 overflow-y-auto flex-1" *ngIf="selectedOrder()">
            
            <!-- Customer Info -->
            <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Customer</h4>
                    <p class="font-bold text-gray-900">{{ selectedOrder().user?.fullname || 'Guest' }}</p>
                    <p class="text-sm text-gray-600">{{ selectedOrder().user?.email }}</p>
                </div>
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping Address</h4>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        {{ selectedOrder().shippingAddress?.fullName }}<br>
                        {{ selectedOrder().shippingAddress?.address }}<br>
                        {{ selectedOrder().shippingAddress?.city }}, {{ selectedOrder().shippingAddress?.postalCode }}<br>
                        {{ selectedOrder().shippingAddress?.country }}
                    </p>
                </div>
            </div>

            <!-- Order Items -->
            <h4 class="font-serif font-bold text-xl mb-4 border-b border-gray-100 pb-2">Items</h4>
            <div class="space-y-4">
                <div *ngFor="let item of selectedOrder().items" class="flex items-center gap-4 py-2">
                    <div class="avatar h-16 w-16 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                        <img [src]="item.product?.image" [alt]="item.product?.name" class="h-full w-full object-cover">
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <h5 class="font-bold text-gray-900">{{ item.product?.name || 'Product Unavailable' }}</h5>
                                <p class="text-sm text-gray-500">{{ item.product?.brand }}</p>
                                <p *ngIf="item.selectedColor" class="text-sm font-medium text-gray-600 mt-1">Color: <span class="text-gray-900">{{ item.selectedColor }}</span></p>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-gray-900">{{ item.product?.price | currency }}</p>
                                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <div class="w-full max-w-xs space-y-2">
                    <div class="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{{ (selectedOrder().subtotal || selectedOrder().totalAmount) | currency }}</span>
                    </div>
                    <div class="flex justify-between text-gray-600" *ngIf="selectedOrder().tax > 0">
                        <span>Tax (13%)</span>
                        <span>{{ selectedOrder().tax | currency }}</span>
                    </div>
                     <div class="flex justify-between text-gray-600" *ngIf="selectedOrder().shippingCost > 0">
                        <span>Processing Fee</span>
                        <span>{{ selectedOrder().shippingCost | currency }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-serif font-bold text-gray-900 pt-2 border-t border-gray-900">
                        <span>Total</span>
                        <span>{{ selectedOrder().totalAmount | currency }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 m-0 rounded-b-2xl">
             <button type="button" class="btn btn-primary bg-gray-900 text-white hover:bg-black duration-300 px-6 py-2 font-bold rounded-lg shadow-lg" (click)="closeDetailsModal()">Close</button>
        </div>
      </div>
    </div>
    `
})
export class AdminOrdersComponent {
    orderService = inject(OrderService);
    toastService = inject(ToastService);

    orders = signal<any[]>([]);
    filterStatus = signal<string>('All');

    // Computed Stats
    totalRevenue = computed(() => this.orders().reduce((acc, order) => acc + (order.totalAmount || 0), 0));
    totalOrders = computed(() => this.orders().length);
    pendingOrders = computed(() => this.orders().filter(o => o.orderStatus === 'Processing').length);
    completedOrders = computed(() => this.orders().filter(o => o.orderStatus === 'Delivered').length);

    // Filtered Orders
    filteredOrders = computed(() => {
        const status = this.filterStatus();
        if (status === 'All') return this.orders();
        return this.orders().filter(o => o.orderStatus === status);
    });

    constructor() {
        this.loadOrders();
    }

    loadOrders() {
        this.orderService.getAllOrders().subscribe({
            next: (response: any) => {
                this.orders.set(response.data || []);
            },
            error: () => this.toastService.show('Failed to load orders', 'error')
        });
    }

    setFilter(status: string) {
        this.filterStatus.set(status);
    }

    updateStatus(id: string, newStatus: string) {
        this.orderService.updateOrderStatus(id, newStatus).subscribe({
            next: () => {
                this.toastService.show('Order status updated', 'success');
                this.loadOrders();
            },
            error: () => this.toastService.show('Failed to update status', 'error')
        });
    }

    // Order Details Modal
    selectedOrder = signal<any>(null);

    viewOrderDetails(order: any) {
        this.selectedOrder.set(order);
    }

    closeDetailsModal() {
        this.selectedOrder.set(null);
    }
}
