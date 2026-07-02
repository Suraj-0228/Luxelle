import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-press',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-white mt-5">
        <!-- Hero Banner -->
        <div class="relative h-[45vh] bg-gray-900 flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-black/45 z-10"></div>
            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600'); filter: grayscale(100%) opacity(30%);"></div>
            <div class="relative z-20 text-center px-6 max-w-3xl">
                <h1 class="text-4xl md:text-6xl font-serif text-white font-bold tracking-tight mb-4">Press Room</h1>
                <p class="text-gray-300 text-lg md:text-xl font-light tracking-wide">Editorial highlights, brand news, and featured collection coverages.</p>
            </div>
        </div>

        <!-- News Grid -->
        <div class="max-w-6xl mx-auto px-6 sm:px-12 py-16 md:py-24">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Press 1 -->
                <div class="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div class="p-6">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Vogue</span>
                        <h3 class="text-lg font-serif font-bold text-gray-900 mt-2 mb-4">"Luxelle Redefines Timeless Couture Elegance"</h3>
                        <p class="text-sm text-gray-500 font-light mb-6">A deep dive into the handmade leather collections and organic local sourcing behind Luxelle’s latest summer releases.</p>
                        <a href="javascript:void(0)" class="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">Read Article</a>
                    </div>
                </div>

                <!-- Press 2 -->
                <div class="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div class="p-6">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">GQ Magazine</span>
                        <h3 class="text-lg font-serif font-bold text-gray-900 mt-2 mb-4">"The Exquisite Calibers of Luxelle Chronographs"</h3>
                        <p class="text-sm text-gray-500 font-light mb-6">An expert evaluation of the mechanical movements and premium materials utilized in Luxelle’s Day-Date watches.</p>
                        <a href="javascript:void(0)" class="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">Read Article</a>
                    </div>
                </div>

                <!-- Press 3 -->
                <div class="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div class="p-6">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harper's Bazaar</span>
                        <h3 class="text-lg font-serif font-bold text-gray-900 mt-2 mb-4">"Luxelle's Sustainability Leap Sets New Benchmark"</h3>
                        <p class="text-sm text-gray-500 font-light mb-6">Highlighting the brand's shift towards upcycled leather accessories and eco-conscious boutique manufacturing practices.</p>
                        <a href="javascript:void(0)" class="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">Read Article</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class PressComponent {}
