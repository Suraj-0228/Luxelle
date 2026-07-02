import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-shipping-returns',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-white">
        <div class="max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24">
            <h1 class="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight mb-4">Shipping & Returns</h1>
            <p class="text-gray-500 font-light text-base mb-12">Learn about our shipping times, delivery rates, and returns policies.</p>

            <div class="space-y-12">
                <!-- Shipping Section -->
                <div>
                    <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif">Shipping Policies</h2>
                    <p class="text-sm text-gray-600 font-light mt-4 leading-relaxed">
                        Every Luxelle order is hand-inspected, carefully packed in our signature boxes, and shipped via premium courier networks to ensure safety.
                    </p>
                    
                    <div class="overflow-x-auto mt-6">
                        <table class="table-auto w-full text-left text-sm border-collapse">
                            <thead>
                                <tr class="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                                    <th class="p-3 border-b border-gray-200">Destination</th>
                                    <th class="p-3 border-b border-gray-200">Timeframe</th>
                                    <th class="p-3 border-b border-gray-200">Processing Fee</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700 font-light">
                                <tr class="border-b border-gray-100">
                                    <td class="p-3">India (National)</td>
                                    <td class="p-3">2 – 5 Business Days</td>
                                    <td class="p-3">₹150 Flat Fee</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="p-3">International Shipping</td>
                                    <td class="p-3">7 – 12 Business Days</td>
                                    <td class="p-3">₹1,500 Flat Fee</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Returns Section -->
                <div>
                    <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif">Returns & Exchanges</h2>
                    <p class="text-sm text-gray-600 font-light mt-4 leading-relaxed">
                        We offer a 30-day return policy for all purchases. Items must be in original, unused condition with all tags and protective films attached, and in their original packaging.
                    </p>
                    <ol class="list-decimal pl-6 mt-4 space-y-2 text-sm text-gray-600 font-light">
                        <li>Initiate a return request via the Support Center or email us at support&#64;luxelle.com.</li>
                        <li>Carefully pack the product in its original Luxelle box.</li>
                        <li>We will arrange a complimentary return pick-up (applicable to national returns).</li>
                        <li>Refunds are processed within 5-7 business days of inspection, credited to your original payment method.</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    `
})
export class ShippingReturnsComponent {}
