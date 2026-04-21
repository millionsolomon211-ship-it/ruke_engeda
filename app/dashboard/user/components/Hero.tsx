"use client";

import React from "react";

const images = [
  "https://images.unsplash.com/photo-1664022379391-8b52fd2653f0?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1629995015838-ea0e985d8d1a?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1667401373119-f9af8c7ccf8e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1668003312545-f433059a0973?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1699535659313-c95cf8111235?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Background Slider (Desktop: Background, Mobile: Bottom/Separate) */}
      <div className="slider-container order-2 lg:order-1 h-[50vh] lg:h-full lg:absolute lg:inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            className="slide"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${i * 4}s`
            }}
          />
        ))}
        <div className="slider-overlay" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-center items-start px-6 lg:px-24 py-32 lg:py-0 w-full lg:w-1/2 order-1 lg:order-2">
        <h1 className="text-5xl lg:text-8xl font-black text-black lg:text-white leading-tight mb-6 tracking-tighter">
          EXPLORE<br />
          THE <span className="text-teal-500">WORLD.</span>
        </h1>
        <p className="text-lg lg:text-xl text-gray-700 lg:text-gray-200 mb-8 max-w-md font-medium leading-relaxed">
          Embark on a journey to the most breathtaking destinations on Earth. Your next adventure starts here.
        </p>
        <div className="flex gap-4">
          <button className="px-10 py-4 bg-teal-600 text-white rounded-full font-black uppercase text-sm tracking-widest hover:bg-teal-700 transition-all shadow-2xl">
            Start Journey
          </button>
          <button className="hidden sm:block px-10 py-4 border-2 border-black lg:border-white text-black lg:text-white rounded-full font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
