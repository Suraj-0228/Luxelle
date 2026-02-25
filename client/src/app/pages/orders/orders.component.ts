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

    downloadInvoice(order: any) {
        let printContents = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
                    <div>
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">LUXELLE</h1>
                        <p style="margin: 5px 0 0; color: #666;">Luxury Fashion</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0; color: #333;">INVOICE</h2>
                        <p style="margin: 5px 0 0; color: #666;">Order #: ${order._id}</p>
                        <p style="margin: 5px 0 0; color: #666;">Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
                        <p style="margin: 5px 0 0; color: #666;">Status: ${order.orderStatus}</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <h3 style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Bill To:</h3>
                        <p style="margin: 0 0 5px;"><strong>${order.shippingAddress.fullName}</strong></p>
                        <p style="margin: 0 0 5px;">${order.shippingAddress.street}</p>
                        <p style="margin: 0 0 5px;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                        <p style="margin: 0 0 5px;">${order.shippingAddress.country}</p>
                        ${order.shippingAddress.phone ? `<p style="margin: 0 0 5px;">Phone: ${order.shippingAddress.phone}</p>` : ''}
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: left;">Item</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: center;">Color</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: right;">Price</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: center;">Qty</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item: any) => `
                            <tr>
                                <td style="padding: 12px 10px; border-bottom: 1px solid #dee2e6;">${item.product?.name || 'Unknown Item'}<br><small style="color: #666;">${item.product?.brand || ''}</small></td>
                                <td style="padding: 12px 10px; border-bottom: 1px solid #dee2e6; text-align: center;">${item.selectedColor || '-'}</td>
                                <td style="padding: 12px 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$${item.product?.price || 0}</td>
                                <td style="padding: 12px 10px; border-bottom: 1px solid #dee2e6; text-align: center;">${item.quantity}</td>
                                <td style="padding: 12px 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$${(item.quantity * (item.product?.price || 0)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="text-align: right;">
                    <h3 style="margin: 0; font-size: 20px;">Total Amount: $${order.totalAmount}</h3>
                    <p style="margin-top: 5px; color: #666; font-size: 12px;">Thank you for shopping with Luxelle.</p>
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Invoice - ' + order._id + '</title>');
            printWindow.document.write('</head><body >');
            printWindow.document.write(printContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            // Need a slight timeout to ensure styles load if there were any external ones, though inline is used here
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }, 250);
        } else {
            alert("Pop-up blocker is preventing the invoice from opening. Please allow pop-ups for this site.");
        }
    }
}
