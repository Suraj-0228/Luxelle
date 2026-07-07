import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const valueProps = [
    {
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      title: 'Free Worldwide Shipping',
      description: 'On all orders over ₹10,000'
    },
    {
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      title: 'Premium Quality',
      description: 'Handcrafted with excellence'
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Secure Payments',
      description: '100% protected transactions'
    }
  ];

  const categories = [
    {
      title: 'Luxury Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', // Black luxury bag
      link: '/shop?category=Bags',
      size: 'large'
    },
    {
      title: 'Timeless Watches',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', // Dark watch
      link: '/shop?category=Watches',
      size: 'small'
    },
    {
      title: 'Premium Belts',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop', // Belt
      link: '/shop?category=Belts',
      size: 'small'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] w-full mt-5 bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background Gradient/Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/e2/02/cc/e202cc42f69f6b2512d2d24f3dd93aed.jpg"
            alt="Luxury Fashion"
            className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium tracking-widest text-white/90 uppercase mb-6 backdrop-blur-sm">
            Spring Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Redefine Your <br /> <span className="italic text-white underline">Elegance</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Curated pieces for the modern visionary. Experience luxury in every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/latest"
              className="px-8 py-4 bg-white text-gray-900 text-sm tracking-widest uppercase font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-2xl min-w-[200px]"
            >
              Shop Latest
            </Link>
            <Link
              to="/shop"
              className="px-8 py-4 border border-white text-white text-sm tracking-widest uppercase font-bold hover:bg-white/10 transition-all backdrop-blur-sm min-w-[180px]"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="p-6 group border border-gray-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-900 mb-4 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={prop.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-sm text-gray-500 font-light">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid (Bento Style) */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 my-32">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span className="text-yellow-600 font-bold tracking-[0.3em] text-xs uppercase mb-4">Curated For You</span>
          <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 drop-shadow-sm">The Collections</h2>
          <div className="w-16 h-0.5 bg-black"></div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto md:h-[700px]">
          {/* Large Item (Left) */}
          <div className="relative group overflow-hidden md:col-span-2 lg:col-span-2 h-[500px] md:h-full cursor-pointer rounded-sm shadow-2xl">
            <img
              src={categories[0].image}
              alt={categories[0].title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 brightness-90 group-hover:brightness-100"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60"></div>

            {/* Content */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end items-start text-left">
              <span className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                Signature Series
              </span>
              <h3 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-none tracking-tight shadow-black drop-shadow-lg">
                {categories[0].title}
              </h3>
              <Link
                to={categories[0].link}
                className="group/btn inline-flex items-center gap-3 text-white text-sm font-bold tracking-[0.2em] uppercase overflow-hidden border-b border-white/30 pb-2 hover:border-white transition-all duration-500"
              >
                <span className="transform group-hover/btn:translate-x-1 transition-transform">Explore Collection</span>
              </Link>
            </div>
          </div>

          {/* Stacked Items (Right) */}
          <div className="flex flex-col gap-6 h-full">
            {categories.slice(1).map((cat, idx) => (
              <div key={idx} className="relative group overflow-hidden flex-1 cursor-pointer rounded-sm shadow-xl h-[400px] md:h-auto">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 brightness-75 group-hover:brightness-90"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>

                {/* Centered Float Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 border-[1px] border-white/0 group-hover:border-white/20 m-6 transition-all duration-700">
                  <h3 className="text-3xl font-serif text-white mb-4 transform translate-y-2 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-lg">
                    {cat.title}
                  </h3>
                  <Link
                    to={cat.link}
                    className="text-xs text-white font-bold tracking-[0.2em] border-b border-transparent group-hover:border-white pb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
