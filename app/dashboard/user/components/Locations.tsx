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

const Locations = () => {
  const [items, setItems] = useState<Location[]>([]);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);
  const limit = 3;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const fetchItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const currentOffset = offsetRef.current;
      const res = await fetch(`/api/locations?offset=${currentOffset}&lim=${limit}`);
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
        <div className="mb-12">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Prime Destinations</h2>
          <p className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">Global Hotspots</p>
        </div>

        {/* Cinematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item._id} className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer">
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
            <p className="text-gray-400 font-medium italic">That's all for our global hotspots ✨</p>
          </div>
        )}

        {/* Visibility sensor */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </section>
  );
};

export default Locations;
