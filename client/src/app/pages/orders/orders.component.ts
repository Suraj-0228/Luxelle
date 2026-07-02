import { Component, OnInit, signal, inject, computed } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ProfileSidebarComponent } from '../../components/profile-sidebar/profile-sidebar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
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
    private cartService = inject(CartService);

    selectedOrder = signal<any | null>(null);
    isDetailsModalOpen = signal<boolean>(false);

    viewOrderDetails(order: any) {
        this.selectedOrder.set(order);
        this.isDetailsModalOpen.set(true);
    }

    closeDetailsModal() {
        this.selectedOrder.set(null);
        this.isDetailsModalOpen.set(false);
    }

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
        Swal.fire({
            title: 'Cancel Order?',
            text: 'Are you sure you want to cancel this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it'
        }).then((result) => {
            if (result.isConfirmed) {
                this.orderService.cancelOrder(order._id).subscribe({
                    next: (res: any) => {
                        const updatedOrders = this.orders().map(o => {
                            if (o._id === order._id) {
                                return { ...o, orderStatus: 'Cancelled' };
                            }
                            return o;
                        });
                        this.orders.set(updatedOrders);
                        Swal.fire({
                            title: 'Cancelled!',
                            text: 'Your order has been cancelled successfully.',
                            icon: 'success',
                            confirmButtonColor: '#111827'
                        });
                    },
                    error: (err: any) => {
                        console.error('Error cancelling order', err);
                        Swal.fire({
                            title: 'Error',
                            text: err.error?.error || 'Failed to cancel order.',
                            icon: 'error',
                            confirmButtonColor: '#111827'
                        });
                    }
                });
            }
        });
    }

    async downloadInvoice(order: any) {
        const taxes = this.cartService.taxes();
        let gstRate = 0.18; // default 18% GST
        let importDutyRate = 0.05; // default 5%
        let processingFeeAmount = 150; // default 150

        const gstTaxObj = taxes.find(t => t.code === 'gst');
        const importDutyObj = taxes.find(t => t.code === 'import_duty');
        const processingFeeObj = taxes.find(t => t.code === 'processing_fee');

        if (gstTaxObj) gstRate = gstTaxObj.rate;
        if (importDutyObj) importDutyRate = importDutyObj.rate;
        if (processingFeeObj) processingFeeAmount = processingFeeObj.rate;

        const orderSubtotal = order.items.reduce((sum: number, item: any) => sum + (item.quantity * (item.product?.price || 0)), 0);
        const gstTax = orderSubtotal * gstRate;
        const importDuty = orderSubtotal * importDutyRate;
        const processingFee = orderSubtotal > 0 ? processingFeeAmount : 0;

        // Ensure total is displayed exactly, falling back to calculation if somehow missing
        const displayedTotal = order.totalAmount || (orderSubtotal + gstTax + importDuty + processingFee).toFixed(2);

        let printContents = `
            <div style="font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif; width: 800px; padding: 50px; background: #ffffff; color: #1f2937; box-sizing: border-box;">
                <div style="border: 1px solid #e5e7eb; padding: 45px; background: #ffffff; position: relative; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Decorative Top Black Border Bar -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #111827;"></div>

                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px;">
                        <div>
                            <h1 style="margin: 0; font-size: 40px; letter-spacing: 5px; font-family: 'Playfair Display', 'Georgia', serif; font-weight: 500; text-transform: uppercase; color: #111827; line-height: 1;">Luxelle</h1>
                            <p style="margin: 8px 0 0; color: #4b5563; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Maison de Couture</p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Playfair Display', 'Georgia', serif; font-weight: 600;">Invoice</h2>
                            <div style="font-size: 12px; color: #4b5563; line-height: 1.6; font-weight: 300;">
                                <p style="margin: 0;">Invoice ID: <strong style="color: #111827; font-family: monospace; font-size: 13px;">#${order._id.substring(order._id.length - 8).toUpperCase()}</strong></p>
                                <p style="margin: 0;">Date: <span style="color: #111827; font-weight: 400;">${new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                                <p style="margin: 0;">Status: <span style="display: inline-block; background: #f3f4f6; color: #111827; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 2px 8px; border-radius: 9999px; margin-top: 4px;">${order.orderStatus}</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Client and Bill info grid -->
                    <div style="display: flex; justify-content: space-between; margin-bottom: 50px; gap: 40px;">
                        <div style="flex: 1;">
                            <p style="margin: 0 0 12px; font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 2px; text-transform: uppercase;">Shipping & Billing Destination</p>
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; line-height: 1.6; color: #4b5563; font-weight: 300;">
                                <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #111827; letter-spacing: 0.5px;">${order.shippingAddress.fullName}</p>
                                <p style="margin: 0;">${order.shippingAddress.street}</p>
                                <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                                <p style="margin: 0; text-transform: uppercase; font-weight: 400; color: #111827; font-size: 12px; margin-top: 2px;">${order.shippingAddress.country}</p>
                            </div>
                        </div>
                        <div style="width: 250px; text-align: right;">
                            <p style="margin: 0 0 12px; font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 2px; text-transform: uppercase;">Customer Details</p>
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 13px; line-height: 1.6; color: #4b5563; font-weight: 300;">
                                <p style="margin: 0; font-weight: 500; color: #111827;">${order.user?.fullname || order.shippingAddress.fullName}</p>
                                <p style="margin: 0; font-family: monospace;">${order.user?.email || 'Client'}</p>
                                ${order.shippingAddress.phone ? `<p style="margin: 4px 0 0; font-size: 12px;">Phone No.: ${order.shippingAddress.phone}</p>` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #111827;">
                                <th style="padding: 0 0 12px 0; text-align: left; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase;">Item Description</th>
                                <th style="padding: 0 0 12px 0; text-align: center; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 100px;">Color</th>
                                <th style="padding: 0 0 12px 0; text-align: center; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 80px;">Qty</th>
                                <th style="padding: 0 0 12px 0; text-align: right; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 120px;">Unit Price</th>
                                <th style="padding: 0 0 12px 0; text-align: right; font-size: 11px; font-weight: 600; color: #111827; letter-spacing: 1.5px; text-transform: uppercase; width: 120px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map((item: any) => `
                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                    <td style="padding: 18px 0; vertical-align: middle;">
                                        <span style="display: block; font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;">${item.product?.name || 'Item'}</span>
                                        <span style="display: inline-block; font-size: 10px; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">${item.product?.brand || 'LUXELLE'}</span>
                                    </td>
                                    <td style="padding: 18px 0; text-align: center; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">${item.selectedColor || '-'}</td>
                                    <td style="padding: 18px 0; text-align: center; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">${item.quantity}</td>
                                    <td style="padding: 18px 0; text-align: right; vertical-align: middle; font-size: 13px; color: #4b5563; font-weight: 300;">₹${item.product?.price?.toFixed(2) || '0.00'}</td>
                                    <td style="padding: 18px 0; text-align: right; vertical-align: middle; font-size: 14px; font-weight: 500; color: #111827;">₹${(item.quantity * (item.product?.price || 0)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Totals and Footer Grid -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
                        <!-- Thank You message & terms -->
                        <div style="max-w: 300px; font-size: 11px; line-height: 1.6; color: #9ca3af; font-weight: 300;">
                            <p style="margin: 0; font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; color: #111827; margin-bottom: 6px; font-weight: 700;">Thank you for your purchase.</p>
                            <p style="margin: 0;">For inquiries regarding return policy or customer service, please visit our online concierge or contact support@luxelle.com.</p>
                        </div>

                        <!-- Summary Block -->
                        <div style="width: 380px; background: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; border-radius: 2px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                                <span>Subtotal</span>
                                <span style="font-weight: 400; color: #111827;">₹${orderSubtotal.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                                <span>GST (${(gstRate * 100).toFixed(0)}%)</span>
                                <span style="font-weight: 400; color: #111827;">₹${gstTax.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                                <span>Import Duty (${(importDutyRate * 100).toFixed(0)}%)</span>
                                <span style="font-weight: 400; color: #111827;">₹${importDuty.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                                <span>Processing Fee</span>
                                <span style="font-weight: 400; color: #111827;">₹${processingFee.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; color: #4b5563; font-weight: 300; align-items: center;">
                                <span>Shipping & Handling</span>
                                <span style="color: #111827; font-weight: 500; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; flex-shrink: 0; margin-left: 10px;">Complimentary</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #111827; align-items: center;">
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111827; white-space: nowrap; margin-right: 15px;">Total Amount</span>
                                <span style="font-size: 22px; font-family: 'Playfair Display', 'Georgia', serif; color: #111827; font-weight: 600; line-height: 1; white-space: nowrap; flex-shrink: 0;">₹${Number(displayedTotal).toFixed(2)}</span>
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
            Swal.fire({
                title: 'Error',
                text: 'Could not generate PDF invoice. Please try again.',
                icon: 'error',
                confirmButtonColor: '#111827'
            });
        } finally {
            document.body.removeChild(container);
        }
    }
}
