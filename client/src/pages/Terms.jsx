import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24">
        <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight mb-2">Terms of Service</h1>
        <p className="text-gray-400 font-light text-sm mb-12">Last Updated: July 2, 2026</p>

        <div className="space-y-10 text-sm text-gray-600 font-light leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">1. Introduction & Scope</h2>
            <p className="mb-4">
              Welcome to Luxelle ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your use of our e-commerce platform and boutique website located at luxelle.com, including any mobile web interfaces, user account configurations, catalog search utilities, checkout sheets, and invoice download modules.
            </p>
            <p>
              By accessing our pages, creating a personalized profile, or placing orders, you signify your full agreement and consent to be bound by these legal terms, policies, and guidelines. If you do not agree, please discontinue using our website.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">2. Account Registration & Security</h2>
            <p className="mb-4">
              To place orders, access order histories, or manage address books, users are required to register a private account. You represent and warrant that all inputs provided (such as name, email address, and billing coordinates) are authentic, accurate, and kept up-to-date.
            </p>
            <p>
              You are entirely responsible for safeguarding your password credentials. Any activities or order transactions performed under your authenticated account are deemed to be authorized by you. We reserve the absolute right to terminate accounts, cancel outstanding orders, or refuse services in our sole discretion if fraud, duplicate profiles, or credential sharing is detected.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">3. Product Details, Pricing, & Taxes</h2>
            <p className="mb-4">
              Luxelle specializes in premium couture apparel, bags, and luxury mechanical chronographs. While we take maximum care to display true item descriptions, dimensions, watch calibers, and materials, minor color variations may occur depending on screen resolutions.
            </p>
            <p className="mb-4">
              All catalog prices are listed in Indian Rupees (INR - ₹) and exclude taxes, which are computed dynamically before final payment. A standard **18% Goods and Services Tax (GST)** and a **5% Import Duty** are assessed based on product category rules. 
            </p>
            <p>
              We reserve the right to modify prices, discontinue products, or correct typographical errors in the catalog at any time. If an order is placed on an item with incorrect pricing details, we will contact you to align or cancel the order.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">4. Payment Processing & Gateways</h2>
            <p className="mb-4">
              All transactions are encrypted securely through SSL integrations. We support major Credit/Debit Cards, UPI transfers (validated using verified @upi tags), and Cash on Delivery (COD) frameworks. 
            </p>
            <p>
              By providing billing details, you represent that you have legal authorization to use the selected payment instrument. In the event of payment gateway failures, transaction declines, or double debits, Luxelle will assist in matching logs with banking networks, but liability is governed by the corresponding financial merchant’s policies.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">5. Intellectual Property Rights</h2>
            <p>
              All elements displayed on the platform—including the "Luxelle" wordmark, serif logos, boutique banner images, product designs, website source code, CSS styles, custom graphics, and downloadable invoices—are the exclusive intellectual property of Luxelle Inc. and protected under trademark, copyright, and patent laws. Copying, distributing, or scraping content for commercial purposes without explicit permission is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">6. Limitation of Liability</h2>
            <p>
              Under no circumstances shall Luxelle, its directors, watchmakers, or logistics partners be liable for any indirect, incidental, or consequential damages (including loss of profits, data corruption, or delivery delays due to national strikes/weather events) arising from your purchase or use of the website.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">7. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms, along with your use of the website and any purchased orders, are governed exclusively by the laws of India. Any legal disputes or claims arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the state courts located in Surat, Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
