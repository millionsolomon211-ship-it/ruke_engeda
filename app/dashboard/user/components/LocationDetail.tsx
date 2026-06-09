"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BookingModal from "./BookingModal";

interface Location {
  _id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  rating?: string;
}

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
}

const LocationDetail = ({ location, onBack }: LocationDetailProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const backendUrl = process.env.BACKEND_URL || "https://service-lime-gamma.vercel.app";

  const getImageUrl = (imgName: string) => {
    if (!imgName || imgName === "noname") return `${backendUrl}/img/region/nopic.jpg`;
    if (imgName.startsWith("http")) return imgName;
    return `${backendUrl}/img/locations/${imgName}`;
  };

  useEffect(() => {
    if (session) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((fav: any) => fav.locationId === location._id));
          }
        })
        .catch(err => console.error("Error fetching favorites:", err));
    }
  }, [session, location._id]);

  const confirmBooking = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        alert("Trip booked successfully! Check your bookings.");
        setShowBookingModal(false);
      } else {
        alert("Failed to book trip. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const handleBookClick = () => {
    if (!session) return router.push('/auth/login');
    setShowBookingModal(true);
  };

  const toggleFavorite = async () => {
    if (!session) return router.push('/auth/login');

    setIsFavoriting(true);
    const action = isFavorite ? 'remove' : 'add';
    
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          locationId: location._id,
          locationName: location.name,
          image: location.image
        })
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-teal-600 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-teal-600 transition-colors">
               <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            Back to Explorations
          </button>

          <button 
            onClick={toggleFavorite}
            disabled={isFavoriting}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              isFavorite 
                ? "bg-red-50 text-red-500 border border-red-100" 
                : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
            }`}
          >
            <svg className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
            <img 
              src={getImageUrl(location.image)} 
              alt={location.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${backendUrl}/img/region/nopic.jpg`;
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">Destination Detail</span>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">{location.name}</h1>
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed mb-12">
              <p>{location.description}</p>
              <p>
                Experience the magic of {location.name} like never before. Our curated tours offer deep immersion into the local culture and landscapes.
              </p>
            </div>

            <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[32px] border border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Starting Price</p>
                <p className="text-4xl font-black">${location.price || "Contact Us"}</p>
              </div>
              <button 
                onClick={handleBookClick}
                className="px-10 py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-teal-700 transition-all shadow-xl hover:-translate-y-1"
              >
                Book Experience
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          location={{ _id: location._id, name: location.name, price: location.price || 0 }}
          onClose={() => setShowBookingModal(false)}
          onConfirm={confirmBooking}
        />
      )}
    </section>
  );
};

export default LocationDetail;
