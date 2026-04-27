"use client";

import React, { useState, useEffect, useRef } from "react";
import { SkeletonCard } from "./SkeletonCard";

interface Location {
  _id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  rating?: string;
}

interface LocationsProps {
  regionName?: string;
  onSelect: (location: Location) => void;
  onBack?: () => void;
}

const Locations = ({ regionName, onSelect, onBack }: LocationsProps) => {
  const [items, setItems] = useState<Location[]>([]);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);
  const limit = 3;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://service-lime-gamma.vercel.app";

  // Reset state when regionName changes
  useEffect(() => {
    setItems([]);
    setOffset(0);
    offsetRef.current = 0;
    setHasMore(true);
    setError("");
  }, [regionName]);

  const fetchItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const currentOffset = offsetRef.current;
      const res = await fetch(`/api/locations?offset=${currentOffset}&lim=${limit}&region=${regionName || ""}`);
      const data = await res.json();

      if (res.ok) {
        const newItems = data.data || [];

        if (newItems.length === 0 || data.message === "nomore content") {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...newItems]);
          const nextOffset = currentOffset + newItems.length;
          offsetRef.current = nextOffset;
          setOffset(nextOffset);

          if (data.hasMore === false || newItems.length < limit) {
            setHasMore(false);
          }
        }
      } else {
        setError(data.error || "Failed to fetch locations");
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchItems();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loading, hasMore]);

  const getImageUrl = (imgName: string) => {
    if (!imgName || imgName === "noname") return `${backendUrl}/img/region/nopic.jpg`;
    if (imgName.startsWith("http")) return imgName;
    return `${backendUrl}/img/locations/${imgName}`;
  };

  return (
    <section id="locations" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        {regionName && (
          <button
            onClick={onBack}
            className="mb-12 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-teal-600 transition-colors"
          >
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            Back to Regions
          </button>
        )}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Prime Destinations</h2>
          <p className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">
            {regionName ? `${regionName} Highlights` : "Global Hotspots"}
          </p>
        </div>

        {/* Cinematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelect(item)}
              className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${backendUrl}/img/region/nopic.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">Location</span>
                    <h3 className="text-3xl font-black mb-3">{item.name}</h3>
                    <p className="text-sm text-gray-300 opacity-90 line-clamp-2 max-w-md mb-2">
                      {item.description}
                    </p>
                  </div>
                  {item.price && (
                    <div className="text-right">
                      <div className="text-2xl font-black mb-1">${item.price}</div>
                      {item.rating && <div className="text-xs font-bold bg-white/20 backdrop-blur px-2 py-1 rounded-lg inline-block">⭐ {item.rating}</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!loading && items.length === 0 && !error && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 12.414m0 0L9.172 8.172m4.242 4.242L8.172 16.657m4.242-4.242L16.657 8.172" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-500">No locations found yet in this region.</p>
              <p className="text-gray-400 mt-2">Check back later or explore another beautiful region!</p>
            </div>
          )}

          {/* Skeleton Loaders */}
          {loading && (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="h-[450px] bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={fetchItems} className="px-8 py-3 bg-black text-white rounded-full font-bold">Try Again</button>
          </div>
        )}

        {/* End of content */}
        {!hasMore && !loading && items.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium italic">That's all for our global hotspots</p>
          </div>
        )}

        {/* Visibility sensor */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </section>
  );
};

export default Locations;
