import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
        // Initialize disabled state for payment fields (default is COD)
        setTimeout(() => {
            this.checkoutForm.get('upiId')?.disable();
            this.checkoutForm.get('card')?.disable();
        });
    }

    cartItems = this.cartService.cartItems;
    totalPrice = this.cartService.totalPrice;
    subtotal = this.cartService.subtotal;
    stateTax = this.cartService.stateTax;
    importDuty = this.cartService.importDuty;
    processingFee = this.cartService.processingFee;

    gstRate = computed(() => Math.round(this.cartService.gstRate() * 100));
    importDutyRate = computed(() => Math.round(this.cartService.importDutyRate() * 100));

    isSubmitting = signal(false);
    errorMsg = signal('');
    activePaymentTab = signal('COD');
    currentStep = signal<'shipping' | 'payment'>('shipping');
    showMobileSummary = false;

    user = this.authService.currentUser;

    hasStoredAddress = computed(() => {
        const u = this.user();
        return !!(u && u.address && u.address.street && u.address.city);
    });

    useStoredAddress() {
        const u = this.user();
        if (u && u.address) {
            this.checkoutForm.get('shippingAddress')?.patchValue({
                fullName: u.fullname || '',
                email: u.email || '',
                phone: u.phone || '',
                street: u.address.street || '',
                city: u.address.city || '',
                state: u.address.state || '',
                zip: u.address.zip || '',
                country: u.address.country || 'India'
            });
        }
    }

    toggleMobileSummary() {
        this.showMobileSummary = !this.showMobileSummary;
    }

    checkoutForm = this.fb.group({
        shippingAddress: this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, this.gmailValidator]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
            country: ['India', Validators.required]
        }),
        paymentMethod: ['COD', Validators.required],
        upiId: ['', Validators.pattern('^[a-zA-Z0-9.-]+@upi$')],
        card: this.fb.group({
            number: ['', Validators.pattern('^[0-9]{16}$')],
            expiry: ['', Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')],
            cvc: ['', Validators.pattern('^[0-9]{3,4}$')]
        })
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

        const upiControl = this.checkoutForm.get('upiId');
        const cardGroup = this.checkoutForm.get('card');

        // Reset validators first to clear previous required state
        upiControl?.clearValidators();
        upiControl?.setValidators(Validators.pattern('^[a-zA-Z0-9.-]+@upi$'));

        cardGroup?.get('number')?.clearValidators();
        cardGroup?.get('number')?.setValidators(Validators.pattern('^[0-9]{16}$'));

        cardGroup?.get('expiry')?.clearValidators();
        cardGroup?.get('expiry')?.setValidators(Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$'));

        cardGroup?.get('cvc')?.clearValidators();
        cardGroup?.get('cvc')?.setValidators(Validators.pattern('^[0-9]{3,4}$'));

        if (method === 'UPI') {
            upiControl?.addValidators(Validators.required);
            upiControl?.enable();
            cardGroup?.disable();
        } else if (method === 'Card') {
            cardGroup?.enable();
            cardGroup?.get('number')?.addValidators(Validators.required);
            cardGroup?.get('expiry')?.addValidators(Validators.required);
            cardGroup?.get('cvc')?.addValidators(Validators.required);
            upiControl?.disable();
        } else {
            upiControl?.disable();
            cardGroup?.disable();
        }

        upiControl?.updateValueAndValidity();
        cardGroup?.get('number')?.updateValueAndValidity();
        cardGroup?.get('expiry')?.updateValueAndValidity();
        cardGroup?.get('cvc')?.updateValueAndValidity();
        cardGroup?.updateValueAndValidity();
    }

    onSubmit() {
        if (this.checkoutForm.invalid) return;

        this.isSubmitting.set(true);
        const formValue = this.checkoutForm.value;

        const orderData = {
            user: this.authService.currentUser()._id,
            items: this.cartItems().map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                selectedColor: item.product.selectedColor
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
    gmailValidator(control: AbstractControl): ValidationErrors | null {
        const email = control.value;
        if (!email) return null;
        if (email.endsWith('@gmail.com')) {
            return null;
        }
        return { gmailInvalid: true };
    }

    formatExpiryDate(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 4) {
            value = value.substring(0, 4);
        }

        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }

        // Handle case where user ends with slash and hits backspace (handled naturally by replacing \D)

        input.value = value;
        this.checkoutForm.get('card.expiry')?.setValue(value, { emitEvent: false });
    }
}
