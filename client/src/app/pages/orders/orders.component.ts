import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe, ProfileSidebarComponent],
    templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    orders = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    // Pagination
    currentPage = signal(1);
    itemsPerPage = 2;

    paginatedOrders = computed(() => {
        const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
        return this.orders().slice(startIndex, startIndex + this.itemsPerPage);
    });

    totalPages = computed(() => Math.ceil(this.orders().length / this.itemsPerPage));

    pageNumbers = computed(() => {
        return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
    });

    private authService = inject(AuthService);
    private orderService = inject(OrderService);

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user && user._id) {
            this.orderService.getOrders(user._id).subscribe({
                next: (res: any) => {
                    // Sort orders by date descending (newest first)
                    const sortedOrders = (res.data || []).sort((a: any, b: any) =>
                        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
                    );
                    this.orders.set(sortedOrders);
                    this.isLoading.set(false);
                },
                error: (err: any) => {
                    console.error('Error fetching orders', err);
                    this.isLoading.set(false);
                }
            });
        } else {
            this.isLoading.set(false);
        }
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}
