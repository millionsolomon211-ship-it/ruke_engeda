"use client";
import React from "react";

const About = () => {
  return (
    <section id="about" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Our Story</h2>
          <p className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-8 leading-tight">
            CRAFTING UNFORGETTABLE<br />
            ADVENTURES IN ETHIOPIA
          </p>
          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              RUKE is more than just a tourism platform. It is a gateway to the hidden gems, ancient cultures, and breathtaking landscapes of Ethiopia. Our mission is to connect travelers with authentic experiences that leave a lasting impact.
            </p>
            <p>
              From the rugged Simien Mountains to the spiritual heart of Lalibela, we curate the most professional and immersive journeys, ensuring every detail is handled with care.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-black text-teal-600">500+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Destinations</p>
            </div>
            <div>
              <p className="text-3xl font-black text-teal-600">10k+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Happy Travelers</p>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-6 h-[600px]">
          <div className="rounded-[40px] overflow-hidden mt-20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Ethiopian Landscape"
            />
          </div>
          <div className="rounded-[40px] overflow-hidden mb-20 shadow-2xl">
            <img
              src="https://substackcdn.com/image/fetch/$s_!N2-p!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fee68270c-9bdb-4c06-acd0-a08203081eff_1984x1323.jpeg"
              className="w-full h-full object-cover"
              alt="Cultural Heritage"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
