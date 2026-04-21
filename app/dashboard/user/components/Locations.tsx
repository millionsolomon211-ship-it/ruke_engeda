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

const Locations = () => {
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
      const res = await fetch(`/api/servise/locations?page=${page}`);
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
    <section id="destinations" className="py-24 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Featured</h2>
            <p className="text-4xl md:text-5xl font-black text-black tracking-tighter">POPULAR DESTINATIONS</p>
          </div>
          <p className="text-gray-500 max-w-sm">
            Hand-picked locations for the ultimate travel experience perfectly suited for your next adventure.
          </p>
        </div>

        {/* Grid of items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  ⭐ {item.rating}
                </div>
                <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                  ${item.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">{item.description}</p>
                <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {/* Skeleton Loaders */}
          {loading && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button
              onClick={fetchItems}
              className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* End of content */}
        {!hasMore && !loading && items.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium italic">You've reached the end of the world ✨</p>
          </div>
        )}

        {/* Visibility sensor */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </section>
  );
};

export default Locations;
