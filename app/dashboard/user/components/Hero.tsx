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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Slider */}
      <div className="slider-container absolute inset-0">
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
        <div className="slider-overlay absolute inset-0 bg-black/40" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24 py-32">
        <div className="max-w-3xl">
          <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.9] mb-8 tracking-tighter drop-shadow-2xl">
            EXPLORE<br />
            THE <span className="text-teal-400">WORLD.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-lg font-medium leading-relaxed drop-shadow-lg">
            Embark on a journey to the most breathtaking destinations on Earth. Your next adventure starts here.
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-teal-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-teal-400 transition-all shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:-translate-y-1"
            >
              Start Journey
            </button>
            <button 
              onClick={() => document.getElementById('about-snippet')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
