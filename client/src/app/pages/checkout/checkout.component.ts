import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
    private fb = inject(FormBuilder);
    private cartService = inject(CartService);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
    }

    cartItems = this.cartService.cartItems;
    totalPrice = this.cartService.totalPrice;
    subtotal = this.cartService.subtotal;
    stateTax = this.cartService.stateTax;
    importDuty = this.cartService.importDuty;
    processingFee = this.cartService.processingFee;

    isSubmitting = signal(false);
    errorMsg = signal('');
    activePaymentTab = signal('COD');
    currentStep = signal<'shipping' | 'payment'>('shipping');
    showMobileSummary = false;

    toggleMobileSummary() {
        this.showMobileSummary = !this.showMobileSummary;
    }

    checkoutForm = this.fb.group({
        shippingAddress: this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['India', Validators.required]
        }),
        paymentMethod: ['COD', Validators.required]
    });

    proceedToPayment() {
        const shippingGroup = this.checkoutForm.get('shippingAddress');
        if (shippingGroup?.valid) {
            this.currentStep.set('payment');
        } else {
            shippingGroup?.markAllAsTouched();
        }
    }

    backToShipping() {
        this.currentStep.set('shipping');
    }

    setPaymentMethod(method: string) {
        this.activePaymentTab.set(method);
        this.checkoutForm.patchValue({ paymentMethod: method });
    }

    onSubmit() {
        if (this.checkoutForm.invalid) return;

        this.isSubmitting.set(true);
        const formValue = this.checkoutForm.value;

        const orderData = {
            user: this.authService.currentUser()._id,
            items: this.cartItems().map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount: this.totalPrice(),
            shippingAddress: formValue.shippingAddress,
            billingAddress: formValue.shippingAddress, // Simplified for demo
            paymentMethod: formValue.paymentMethod
        };

        this.orderService.createOrder(orderData).subscribe({
            next: (res) => {
                this.cartService.clearCart();
                this.router.navigate(['/order-success'], { state: { orderId: res.data._id } });
            },
            error: (err) => {
                this.errorMsg.set(err.error.error || 'Failed to place order');
                this.isSubmitting.set(false);
            }
        });
    }
}
