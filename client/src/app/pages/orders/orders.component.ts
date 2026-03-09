import { Component, OnInit, signal, inject, computed } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

    cancelOrder(order: any) {
        if (confirm('Are You Sure, You want to Cancel This Order??')) {
            this.orderService.cancelOrder(order._id).subscribe({
                next: (res: any) => {
                    const updatedOrders = this.orders().map(o => {
                        if (o._id === order._id) {
                            return { ...o, orderStatus: 'Cancelled' };
                        }
                        return o;
                    });
                    this.orders.set(updatedOrders);                    
                },
                error: (err: any) => {
                    console.error('Error cancelling order', err);
                    alert(err.error?.error || 'Failed to cancel order.');
                }
            });
        }
    }

    async downloadInvoice(order: any) {
        const orderSubtotal = order.items.reduce((sum: number, item: any) => sum + (item.quantity * (item.product?.price || 0)), 0);
        const stateTax = orderSubtotal * 0.08;
        const importDuty = orderSubtotal * 0.05;
        const processingFee = 2.99;

        // Ensure total is displayed exactly, falling back to calculation if somehow missing
        const displayedTotal = order.totalAmount || (orderSubtotal + stateTax + importDuty + processingFee).toFixed(2);

        let printContents = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 800px; padding: 40px; background: #ffffff; color: #1a1a1a; box-sizing: border-box;">
                <div style="border: 1px solid #e8e5df; padding: 40px; background: #fcfbf9;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                        <div>
                            <h1 style="margin: 0; font-size: 38px; letter-spacing: 6px; font-family: 'Georgia', serif; font-weight: normal; text-transform: uppercase; color: #111111;">Luxelle</h1>
                            <p style="margin: 8px 0 0; color: #8b7d6b; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;">Maison de Couture</p>
                        </div>
                        <div style="text-align: right; border-left: 1px solid #e8e5df; padding-left: 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #111111; font-size: 14px; letter-spacing: 4px; text-transform: uppercase; font-family: 'Georgia', serif; font-weight: normal;">Invoice</h2>
                            <div style="font-size: 11px; color: #555555; line-height: 1.6; letter-spacing: 1px;">
                                <p style="margin: 0;">No: <span style="color: #111111; font-family: monospace;">${order._id.substring(order._id.length - 8).toUpperCase()}</span></p>
                                <p style="margin: 0;">Date: <span style="color: #111111;">${new Date(order.orderDate).toLocaleDateString('en-US')}</span></p>
                                <p style="margin: 0;">Status: <span style="color: #111111; font-weight: 500;">${order.orderStatus}</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Client Info -->
                    <div style="margin-bottom: 40px;">
                        <p style="margin: 0 0 10px; font-size: 9px; color: #8b7d6b; letter-spacing: 2px; text-transform: uppercase;">Billed To</p>
                        <div style="border-top: 1px solid #111111; border-bottom: 1px solid #e8e5df; padding: 15px 0; display: flex; justify-content: space-between;">
                            <div style="width: 50%;">
                                <p style="margin: 0 0 5px; font-size: 13px; font-weight: bold; color: #111111; letter-spacing: 1px; text-transform: uppercase;">${order.shippingAddress.fullName}</p>
                                <p style="margin: 0; font-size: 12px; color: #444444;">${order.shippingAddress.street}</p>
                                <p style="margin: 0; font-size: 12px; color: #444444;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                                <p style="margin: 0; font-size: 12px; color: #444444;">${order.shippingAddress.country}</p>
                            </div>
                            <div style="width: 40%; text-align: right;">
                                <p style="margin: 0 0 5px; font-size: 11px; color: #444444; letter-spacing: 1px; text-transform: uppercase;">Contact</p>
                                ${order.shippingAddress.phone ? `<p style="margin: 0; font-size: 12px; color: #111111;">${order.shippingAddress.phone}</p>` : ''}
                                <p style="margin: 0; font-size: 12px; color: #111111;">${order.user?.email || 'Client'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                        <thead>
                            <tr>
                                <th style="padding: 0 0 10px 0; border-bottom: 1px solid #111111; text-align: left; font-size: 9px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase; font-weight: normal;">Item</th>
                                <th style="padding: 0 0 10px 0; border-bottom: 1px solid #111111; text-align: center; font-size: 9px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase; font-weight: normal;">Color</th>
                                <th style="padding: 0 0 10px 0; border-bottom: 1px solid #111111; text-align: center; font-size: 9px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase; font-weight: normal;">Qty</th>
                                <th style="padding: 0 0 10px 0; border-bottom: 1px solid #111111; text-align: right; font-size: 9px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase; font-weight: normal;">Price</th>
                                <th style="padding: 0 0 10px 0; border-bottom: 1px solid #111111; text-align: right; font-size: 9px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase; font-weight: normal;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map((item: any) => `
                                <tr>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #e8e5df;">
                                        <span style="display: block; font-size: 13px; font-weight: 500; color: #111111; margin-bottom: 2px;">${item.product?.name || 'Item'}</span>
                                        <span style="display: inline-block; font-size: 10px; color: #8b7d6b; letter-spacing: 1px; text-transform: uppercase;">${item.product?.brand || 'LUXELLE'}</span>
                                    </td>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #e8e5df; text-align: center; font-size: 12px; color: #444444;">${item.selectedColor || '-'}</td>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #e8e5df; text-align: center; font-size: 12px; color: #444444;">${item.quantity}</td>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #e8e5df; text-align: right; font-size: 12px; color: #444444;">$${item.product?.price?.toFixed(2) || '0.00'}</td>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #e8e5df; text-align: right; font-size: 13px; font-weight: 500; color: #111111;">$${(item.quantity * (item.product?.price || 0)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Totals Area -->
                    <div style="display: flex; justify-content: flex-end;">
                        <div style="width: 350px; background: #ffffff; border: 1px solid #e8e5df; padding: 25px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #444444;">
                                <span>Subtotal</span>
                                <span>$${orderSubtotal.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #444444;">
                                <span>State Tax (8%)</span>
                                <span>$${stateTax.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #444444;">
                                <span>Import Duty (5%)</span>
                                <span>$${importDuty.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #444444;">
                                <span>Processing Fee</span>
                                <span>$${processingFee.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #444444;">
                                <span>Shipping & Handling</span>
                                <span>Complimentary</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px solid #111111; align-items: flex-end;">
                                <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #111111;">Total (USD)</span>
                                <span style="font-size: 22px; font-family: 'Georgia', serif; color: #111111;">$${Number(displayedTotal).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '800px';
        container.innerHTML = printContents;
        document.body.appendChild(container);

        try {
            // Save the current scroll position so we can restore it later.
            // This is required because html2canvas uses the current viewport offset 
            //. for elements that are positioned absolutely or relatively.
            const originalScrollY = window.scrollY;
            window.scrollTo(0, 0);

            // Pass the firstElementChild (the 800px div) to html2canvas directly to ensure proper boundaries
            const elementToCapture = container.firstElementChild as HTMLElement;

            const canvas = await html2canvas(elementToCapture || container, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollY: 0,
                scrollX: 0
            });

            // Restore original scroll
            window.scrollTo(0, originalScrollY);

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();

            let pdfHeight = (canvas.height * pdfPageWidth) / canvas.width;
            let renderWidth = pdfPageWidth;

            // Strictly fit to a single page
            if (pdfHeight > pdfPageHeight) {
                const maxRatio = pdfPageHeight / pdfHeight;
                pdfHeight = pdfPageHeight;
                renderWidth = pdfPageWidth * maxRatio;
            }

            // Horizontally center if it was scaled down
            const xOffset = (pdfPageWidth - renderWidth) / 2;

            // Add on single page
            pdf.addImage(imgData, 'PNG', xOffset, 0, renderWidth, pdfHeight);

            pdf.save(`Luxelle_Invoice_${order._id.substring(order._id.length - 6)}.pdf`);
        } catch (error) {
            console.error('Error generating PDF', error);
            alert("Could not generate PDF invoice. Please try again.");
        } finally {
            document.body.removeChild(container);
        }
    }
}
