import React from 'react';

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white mt-5">
      {/* Hero Banner */}
      <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/70/c3/d4/70c3d46e6b28d737ccb43baacc740024.jpg')",
            filter: 'grayscale(100%) opacity(40%)'
          }}
        ></div>
        <div className="relative z-20 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-tight mb-4">Sustainability</h1>
          <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide">
            Crafting a premium future through responsible luxury and circular craftsmanship.
          </p>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">Designed with Conscience</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              At Luxelle, we believe that true luxury should be timeless and responsible. Every leather bag, every watch caliber, and every thread of couture is selected with a focus on longevity, local heritage preservation, and minimizing environmental impact.
            </p>
            <p className="text-gray-600 font-light leading-relaxed">
              We work exclusively with certified tanneries, eco-conscious artisans, and carbon-neutral logistics networks to deliver premium items that you can wear with pride.
            </p>
          </div>
          <div className="bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100 space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-900 text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">100% Circular Goal</h3>
                <p className="text-sm text-gray-500 font-light mt-1">Striving towards zero waste by upcycling leather cuts and offering premium restoration programs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-900 text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Fair Trade & Craft Heritage</h3>
                <p className="text-sm text-gray-500 font-light mt-1">Honoring watchmakers and sewing artisans with fair compensation and safe working environments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
