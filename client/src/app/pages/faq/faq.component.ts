import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-white animate-fadeIn">
        <div class="max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24">
            <h1 class="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight mb-4 text-center">Frequently Asked Questions</h1>
            <p class="text-gray-500 font-light text-base mb-12 text-center">Explore detailed answers about order tracking, warranty parameters, and shipping policies.</p>

            <div class="space-y-6">
                <!-- FAQ Item 1 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(0)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>Are Luxelle watches covered by warranty?</span>
                        <svg [class.rotate-180]="isOpen(0)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(0)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        Yes, all mechanical movements and caliber parts inside Luxelle watches are protected under our comprehensive 2-year international warranty. The warranty commences on the day of delivery and covers craftsmanship flaws or structural mechanism errors. It does not cover strap wear, water damage due to unsealed crowns, or modifications done by uncertified workshops.
                    </div>
                </div>

                <!-- FAQ Item 2 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(1)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>How do I track my order?</span>
                        <svg [class.rotate-180]="isOpen(1)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(1)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        Once checkout is finalized and the warehouse completes processing, an dispatch notification email containing a live tracking link and airway bill number will be sent to your Gmail address. Customers can also track the real-time fulfillment status of purchases under the "My Orders" profile panel.
                    </div>
                </div>

                <!-- FAQ Item 3 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(2)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>Can I cancel or change my shipping address?</span>
                        <svg [class.rotate-180]="isOpen(2)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(2)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        Order cancellation is fully supported in the UI prior to the package being marked as Shipped. Once the status transitions to Shipped or Delivered, cancellation is no longer possible. To make immediate changes to a shipping address, please contact support&#64;luxelle.com before dispatch has occurred.
                    </div>
                </div>

                <!-- FAQ Item 4 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(3)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>What is the processing fee on national orders?</span>
                        <svg [class.rotate-180]="isOpen(3)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(3)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        All national shipments within India incur a flat shipping and handling fee of ₹150. This fee is automatically added to the billing breakdown during checkout to cover secure transport, logistics tracking, and premium double-walled signature packaging.
                    </div>
                </div>

                <!-- FAQ Item 5 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(4)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>How is GST calculated on the products?</span>
                        <svg [class.rotate-180]="isOpen(4)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(4)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        Luxelle products are subject to a standard 18% Goods and Services Tax (GST), along with a 5% import duty for internationally sourced components. These taxes are calculated dynamically and displayed transparently in your cart summary, checkout sheet, and PDF invoice.
                    </div>
                </div>

                <!-- FAQ Item 6 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <button (click)="toggle(5)" class="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer">
                        <span>Are the materials sustainably sourced?</span>
                        <svg [class.rotate-180]="isOpen(5)" class="w-5 h-5 transition-transform duration-200 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div *ngIf="isOpen(5)" class="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                        Absolutely. All watches utilize certified recycled metals and sustainable premium minerals. Our leather bags are manufactured in partnership with LWG-certified (Leather Working Group) tanneries that adhere strictly to clean water treatment, zero toxic chemical emissions, and circular leather upcycling processes.
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class FAQComponent {
    activeIndexes = signal<number[]>([]);

    toggle(index: number) {
        this.activeIndexes.update(current => 
            current.includes(index) ? current.filter(i => i !== index) : [...current, index]
        );
    }

    isOpen(index: number): boolean {
        return this.activeIndexes().includes(index);
    }
}
