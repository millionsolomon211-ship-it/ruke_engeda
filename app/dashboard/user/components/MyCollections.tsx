"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Booking {
  _id: string;
  locationName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  wantCard: boolean;
  bookingTime: string;
}

interface Favorite {
  _id: string;
  locationId: string;
  locationName: string;
  image: string;
}

const MyCollections = ({ onBack }: { onBack: () => void }) => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "favorites">("bookings");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const [bookingsRes, favoritesRes] = await Promise.all([
            fetch('/api/bookings'),
            fetch('/api/favorites')
          ]);
          
          if (bookingsRes.ok) setBookings(await bookingsRes.json());
          if (favoritesRes.ok) setFavorites(await favoritesRes.json());
        } catch (err) {
          console.error("Error fetching collections:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  const getImageUrl = (imgName: string) => {
    if (!imgName || imgName === "noname") return `${backendUrl}/img/region/nopic.jpg`;
    if (imgName.startsWith("http")) return imgName;
    return `${backendUrl}/img/locations/${imgName}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-24 px-6 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div>
            <button 
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back to Explore
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">My Collections</h1>
          </div>

          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "bookings" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab("favorites")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "favorites" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {activeTab === "bookings" ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.length > 0 ? bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{booking.locationName}</h3>
                  <div className="flex flex-wrap gap-4 text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                    {booking.wantCard && (
                      <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Physical Card Included
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-slate-900">${booking.totalPrice}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-[40px] py-24 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-lg mb-2">No bookings found</p>
                <button onClick={onBack} className="text-indigo-600 font-black uppercase text-sm tracking-widest">Start your journey today</button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.length > 0 ? favorites.map((fav) => (
              <div key={fav._id} className="group relative h-[400px] rounded-[32px] overflow-hidden shadow-lg cursor-pointer">
                <img 
                  src={getImageUrl(fav.image)} 
                  alt={fav.locationName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{fav.locationName}</h3>
                </div>
              </div>
            )) : (
              <div className="col-span-full bg-white rounded-[40px] py-24 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-lg mb-2">Your favorites list is empty</p>
                <button onClick={onBack} className="text-indigo-600 font-black uppercase text-sm tracking-widest">Explore and heart destinations</button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCollections;
