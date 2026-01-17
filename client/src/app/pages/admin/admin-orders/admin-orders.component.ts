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
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer" 
                   [class.tab-active]="filterStatus() === 'All'" 
                   [class.bg-white]="filterStatus() === 'All'"
                   [class.shadow-sm]="filterStatus() === 'All'"
                   (click)="setFilter('All')">All</a>
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Processing'" 
                   [class.bg-white]="filterStatus() === 'Processing'"
                   [class.text-warning]="filterStatus() === 'Processing'"
                    (click)="setFilter('Processing')">Processing</a>
                <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
                   [class.tab-active]="filterStatus() === 'Shipped'"
                   [class.bg-white]="filterStatus() === 'Shipped'"
                   [class.text-primary]="filterStatus() === 'Shipped'"
                   (click)="setFilter('Shipped')">Shipped</a>
                 <a class="tab transition-all mx-2 duration-300 hover:cursor-pointer"
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
                                    <div class="bg-neutral-focus text-neutral-content rounded-full w-10 bg-gray-200 text-gray-500">
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
                                <div class="w-2 h-2 rounded-full"
                                     [ngClass]="{
                                        'bg-blue-600': order.orderStatus === 'Processing',
                                        'bg-yellow-600': order.orderStatus === 'Shipped',
                                        'bg-green-600': order.orderStatus === 'Delivered',
                                        'bg-red-600': order.orderStatus === 'Cancelled',
                                        'bg-gray-600': order.orderStatus === 'Returned',
                                        'bg-purple-600': order.orderStatus === 'Confirmed'
                                     }"></div>
                                {{ order.orderStatus }}
                            </div>
                        </td>
                        <td class="pr-6 text-right">
                             <select class="select select-bordered select-sm w-full max-w-[140px] bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                                    [ngModel]="order.orderStatus" 
                                    (ngModelChange)="updateStatus(order._id, $event)">
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                            </select>
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
}
