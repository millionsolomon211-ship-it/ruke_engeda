"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SplashCursor from '@/components/SplashCursor';
import Navbar from "./dashboard/user/components/Navbar";
import Hero from "./dashboard/user/components/Hero";
import Locations from "./dashboard/user/components/Locations";
import Regions from "./dashboard/user/components/Regions";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const userStatus = (session?.user as any)?.status;
      if (userStatus === "admin" || userStatus === "master") {
        router.push("/dashboard/admin");
      }
    }
  }, [session, status, router]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <SplashCursor />
      <Navbar />

      <main className="relative z-10">
        {/* Full screen Hero section - imported from dashboard/user */}
        <Hero />

        {/* Global Hotspots Locations section */}
        <Locations />
        
        {/* Infinite scroll Regions section */}
        <Regions />


        {/* About Section Snippet */}
        <section id="about-snippet" className="py-24 bg-white px-6 max-lg:bg-transparent max-lg:mobile-transparent">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Our Story</h2>
              <p className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-8 leading-tight">
                CRAFTING MEMORIES<br />
                ACROSS THE GLOBE
              </p>
              <p className="text-gray-600 mb-8 leading-loose text-lg">
                RUKE is a premium tourism platform dedicated to connecting travelers with unique, authentic, and unforgettable locations.
              </p>
              <button className="px-8 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl">
                Read Our Story
              </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 h-[500px]">
              <div className="rounded-2xl overflow-hidden mt-12 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Travel" />
              </div>
              <div className="rounded-2xl overflow-hidden mb-12 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Beach" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black mb-6">RUKE<span className="text-teal-500">.</span></h2>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Leading the way in premium travel experiences. Connect with us to explore the unseen corners of the world.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-6 uppercase text-sm tracking-widest">Connect</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} RUKE Tourism. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
