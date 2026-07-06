import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) return;

    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        title: 'Sent!',
        text: 'Message sent successfully!',
        icon: 'success',
        confirmButtonColor: '#111827'
      });
      setContact({ name: '', email: '', message: '' }); // Reset
    }, 1500);
  };

  return (
    <div className="min-h-screen my-10 flex flex-col lg:flex-row bg-white">
      {/* Image Section (Left) - Fixed on Desktop */}
      <div className="lg:w-1/2 relative min-h-[40vh] lg:min-h-screen bg-gray-100 overflow-hidden group">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src="https://i.pinimg.com/1200x/57/8c/a0/578ca0c411afb34a2d68df95d3835eec.jpg"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          alt="Luxury Boutique Interior"
        />

        <div className="absolute bottom-0 left-0 p-8 lg:p-16 z-20 text-white">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-80">Est. 2024</p>
          <h2 className="font-serif text-4xl lg:text-5xl italic">Excellence in Service.</h2>
        </div>
      </div>

      {/* Content Section (Right) - Scrollable */}
      <div className="flex-1 flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 xl:px-32 bg-white relative">
        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Contact Us</span>
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 leading-tight">
              We'd love to hear <br /> from you.
            </h1>
          </div>

          {/* Contact Information with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mb-16">
            {/* Concierge */}
            <div className="group">
              <div className="flex items-center gap-3 mb-3 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <h3 className="font-serif text-lg">Concierge</h3>
              </div>
              <p className="text-gray-500 font-light text-sm leading-relaxed pl-8">
                <a href="mailto:concierge@luxelle.com" className="hover:text-black transition-colors">
                  concierge@luxelle.com
                </a>
                <br />
                +1 (800) LUX-ELLE
              </p>
            </div>

            {/* Boutique */}
            <div className="group">
              <div className="flex items-center gap-3 mb-3 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <h3 className="font-serif text-lg">Visit</h3>
              </div>
              <p className="text-gray-500 font-light text-sm leading-relaxed pl-8">
                123 Fashion Avenue
                <br />
                New York, NY 10001
              </p>
            </div>

            {/* Media */}
            <div className="group">
              <div className="flex items-center gap-3 mb-3 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
                <h3 className="font-serif text-lg">Press</h3>
              </div>
              <p className="text-gray-500 font-light text-sm leading-relaxed pl-8">
                <a href="mailto:press@luxelle.com" className="hover:text-black transition-colors">
                  press@luxelle.com
                </a>
              </p>
            </div>

            {/* Wholesale */}
            <div className="group">
              <div className="flex items-center gap-3 mb-3 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3 className="font-serif text-lg">Wholesale</h3>
              </div>
              <p className="text-gray-500 font-light text-sm leading-relaxed pl-8">
                <a href="mailto:wholesale@luxelle.com" className="hover:text-black transition-colors">
                  wholesale@luxelle.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-900 my-10"></div>

          {/* Message Form */}
          <div>
            <h2 className="font-serif text-2xl text-gray-900 mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="group relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contact.name}
                    onChange={handleChange}
                    required
                    className="peer w-full border-b border-gray-300 py-3 bg-transparent text-gray-900 focus:outline-none focus:border-black transition-colors placeholder-transparent"
                    placeholder="Full Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 cursor-text"
                  >
                    Full Name
                  </label>
                </div>

                {/* Email */}
                <div className="group relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    required
                    className="peer w-full border-b border-gray-300 py-3 bg-transparent text-gray-900 focus:outline-none focus:border-black transition-colors placeholder-transparent"
                    placeholder="Email Address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 cursor-text"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="group relative pt-4">
                <textarea
                  id="message"
                  rows="1"
                  name="message"
                  value={contact.message}
                  onChange={handleChange}
                  required
                  className="peer w-full border-b border-gray-300 py-3 bg-transparent text-gray-900 focus:outline-none focus:border-black transition-colors placeholder-transparent resize-none min-h-[50px] focus:min-h-[100px]"
                  placeholder="Your Message"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-0 top-0.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-7 peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-gray-900 cursor-text"
                >
                  Message
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || !contact.name || !contact.email || !contact.message}
                  className="group relative inline-flex items-center justify-start overflow-hidden px-8 py-4 bg-gray-900 text-white transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative text-xs font-bold uppercase tracking-[0.2em] mr-2">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  {!isSubmitting && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
