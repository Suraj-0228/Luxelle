import React, { useState } from 'react';

export default function FAQ() {
  const [activeIndexes, setActiveIndexes] = useState([]);

  const toggle = (index) => {
    setActiveIndexes(current =>
      current.includes(index) ? current.filter(i => i !== index) : [...current, index]
    );
  };

  const isOpen = (index) => activeIndexes.includes(index);

  const faqs = [
    {
      q: 'Are Luxelle watches covered by warranty?',
      a: 'Yes, all mechanical movements and caliber parts inside Luxelle watches are protected under our comprehensive 2-year international warranty. The warranty commences on the day of delivery and covers craftsmanship flaws or structural mechanism errors. It does not cover strap wear, water damage due to unsealed crowns, or modifications done by uncertified workshops.'
    },
    {
      q: 'How do I track my order?',
      a: 'Once checkout is finalized and the warehouse completes processing, an dispatch notification email containing a live tracking link and airway bill number will be sent to your Gmail address. Customers can also track the real-time fulfillment status of purchases under the "My Orders" profile panel.'
    },
    {
      q: 'Can I cancel or change my shipping address?',
      a: 'Order cancellation is fully supported in the UI prior to the package being marked as Shipped. Once the status transitions to Shipped or Delivered, cancellation is no longer possible. To make immediate changes to a shipping address, please contact support@luxelle.com before dispatch has occurred.'
    },
    {
      q: 'What is the processing fee on national orders?',
      a: 'All national shipments within India incur a flat shipping and handling fee of ₹150. This fee is automatically added to the billing breakdown during checkout to cover secure transport, logistics tracking, and premium double-walled signature packaging.'
    },
    {
      q: 'How is GST calculated on the products?',
      a: 'Luxelle products are subject to a standard 18% Goods and Services Tax (GST), along with a 5% import duty for internationally sourced components. These taxes are calculated dynamically and displayed transparently in your cart summary, checkout sheet, and PDF invoice.'
    },
    {
      q: 'Are the materials sustainably sourced?',
      a: 'Absolutely. All watches utilize certified recycled metals and sustainable premium minerals. Our leather bags are manufactured in partnership with LWG-certified (Leather Working Group) tanneries that adhere strictly to clean water treatment, zero toxic chemical emissions, and circular leather upcycling processes.'
    }
  ];

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24">
        <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-500 font-light text-base mb-12 text-center">Explore detailed answers about order tracking, warranty parameters, and shipping policies.</p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full p-5 text-left font-serif font-bold text-gray-900 bg-gray-50 hover:bg-gray-100/70 transition-colors flex justify-between items-center outline-none hover:cursor-pointer"
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 text-gray-500 ${isOpen(index) ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen(index) && (
                <div className="p-5 border-t border-gray-100 text-sm text-gray-600 font-light leading-relaxed bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
