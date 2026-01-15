import { Component, OnInit, signal, inject } from '@angular/core';
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

    private authService = inject(AuthService);
    private orderService = inject(OrderService);

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user && user._id) {
            this.orderService.getOrders(user._id).subscribe({
                next: (res: any) => {
                    this.orders.set(res.data);
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
}
