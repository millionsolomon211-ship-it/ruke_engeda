"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SplashCursor from '@/components/SplashCursor';
import Navbar from "./dashboard/user/components/Navbar";
import Hero from "./dashboard/user/components/Hero";
import Locations from "./dashboard/user/components/Locations";
import Regions from "./dashboard/user/components/Regions";
import About from "./dashboard/user/components/About";
import LocationDetail from "./dashboard/user/components/LocationDetail";
import MyCollections from "./dashboard/user/components/MyCollections";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // View states
  const [view, setView] = useState<'home' | 'regions' | 'locations' | 'detail' | 'collections'>('home');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const userStatus = (session?.user as any)?.status;
      if (userStatus === "admin" || userStatus === "master") {
        router.push("/dashboard/admin");
      }
    }
  }, [session, status, router]);

  // Navigation handlers
  const handleNavigate = (newView: 'home' | 'regions' | 'about' | 'collections') => {
    if (newView === 'about') {
      setView('home');
      setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRegionSelect = (region: any) => {
    setSelectedRegion(region);
    setView('locations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <Hero onStartJourney={() => setView('regions')} />
            <About />
          </>
        );
      case 'regions':
        return <Regions onSelect={handleRegionSelect} />;
      case 'locations':
        return (
          <Locations 
            regionName={selectedRegion?.name} 
            onSelect={handleLocationSelect} 
            onBack={() => setView('regions')} 
          />
        );
      case 'detail':
        return (
          <LocationDetail 
            location={selectedLocation} 
            onBack={() => setView('locations')} 
          />
        );
      case 'collections':
        return <MyCollections onBack={() => setView('home')} />;
      default:
        return <Hero onStartJourney={() => setView('regions')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <SplashCursor />
      <Navbar onNavigate={handleNavigate} />

      <main className="relative z-10 flex-grow">
        {renderContent()}
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
