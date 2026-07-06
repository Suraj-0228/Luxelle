import React from 'react';

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24">
        <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight mb-4">Shipping & Returns</h1>
        <p className="text-gray-500 font-light text-base mb-12">Learn about our shipping times, delivery rates, and returns policies.</p>

        <div className="space-y-12">
          {/* Shipping Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif">Shipping Policies</h2>
            <p className="text-sm text-gray-600 font-light mt-4 leading-relaxed">
              Every Luxelle order is hand-inspected, carefully packed in our signature boxes, and shipped via premium courier networks to ensure safety.
            </p>
            
            <div className="overflow-x-auto mt-6">
              <table className="table-auto w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                    <th className="p-3 border-b border-gray-200">Destination</th>
                    <th className="p-3 border-b border-gray-200">Timeframe</th>
                    <th className="p-3 border-b border-gray-200">Processing Fee</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-light">
                  <tr className="border-b border-gray-100">
                    <td className="p-3">India (National)</td>
                    <td className="p-3">2 – 5 Business Days</td>
                    <td className="p-3">₹150 Flat Fee</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">International Shipping</td>
                    <td className="p-3">7 – 12 Business Days</td>
                    <td className="p-3">₹1,500 Flat Fee</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Returns Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif">Returns & Exchanges</h2>
            <p className="text-sm text-gray-600 font-light mt-4 leading-relaxed">
              We offer a 30-day return policy for all purchases. Items must be in original, unused condition with all tags and protective films attached, and in their original packaging.
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2 text-sm text-gray-600 font-light">
              <li>Initiate a return request via the Support Center or email us at support@luxelle.com.</li>
              <li>Carefully pack the product in its original Luxelle box.</li>
              <li>We will arrange a complimentary return pick-up (applicable to national returns).</li>
              <li>Refunds are processed within 5-7 business days of inspection, credited to your original payment method.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
