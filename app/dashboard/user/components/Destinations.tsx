"use client";

import React, { useState, useEffect, useRef } from "react";
import { SkeletonCard } from "./SkeletonCard";

interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: string;
}

const Destinations = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);

  const fetchItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/servise/destinations?page=${page}`);
      const data = await res.json();

      if (res.ok) {
        setItems((prev) => [...prev, ...data.data]);
        setHasMore(data.hasMore);
        setPage((prev) => prev + 1);
      } else {
        setError(data.error || "Failed to fetch items");
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
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, page]);

  return (
    <section className="py-24 bg-white px-6 max-lg:bg-transparent max-lg:mobile-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Prime Destinations</h2>
          <p className="text-4xl md:text-5xl font-black text-black tracking-tighter">GLOBAL HOTSPOTS</p>
        </div>

        {/* Cinematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl max-lg:mobile-transparent cursor-pointer">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">Featured</span>
                    <h3 className="text-3xl font-black mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 max-w-md">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black mb-1">${item.price}</div>
                    <div className="text-xs font-bold bg-white/20 backdrop-blur px-2 py-1 rounded-lg">⭐ {item.rating}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Skeleton Loaders */}
          {loading && (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="h-[400px] bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={fetchItems} className="px-6 py-2 bg-black text-white rounded-full font-bold">Try Again</button>
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

export default Destinations;
