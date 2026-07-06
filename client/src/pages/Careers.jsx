import React from 'react';

export default function Careers() {
  return (
    <div className="min-h-screen bg-white mt-5">
      {/* Hero Banner */}
      <div className="relative h-[50vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600')",
            filter: 'grayscale(100%) opacity(30%)'
          }}
        ></div>
        <div className="relative z-20 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-tight mb-4">Join Luxelle</h1>
          <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide">
            Shape the future of luxury couture and horological masterpieces.
          </p>
        </div>
      </div>

      {/* Open Roles */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Opportunities</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Available Positions</h2>
          <p className="text-gray-500 font-light mt-3 max-w-xl mx-auto">
            We are always looking for visionaries, master artisans, and creative leaders to push boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Role 1 */}
          <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Artistry</span>
              <h3 className="text-xl font-bold text-gray-900 mt-4 font-serif">Master Watchmaker</h3>
              <p className="text-gray-500 text-sm font-light mt-2 mb-6">
                Assemble, test, and polish high-caliber watch movements. Expert knowledge of mechanical escapements required.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400 font-medium">Surat, India | Full-Time</span>
              <button className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-all">
                Apply Now
              </button>
            </div>
          </div>

          {/* Role 2 */}
          <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">E-Commerce</span>
              <h3 className="text-xl font-bold text-gray-900 mt-4 font-serif">Senior Frontend Engineer</h3>
              <p className="text-gray-500 text-sm font-light mt-2 mb-6">
                Build premium digital shopping experiences. Experience with Angular, Tailwind, and luxury UI design is a plus.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400 font-medium">Remote (India) | Full-Time</span>
              <button className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-all">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
