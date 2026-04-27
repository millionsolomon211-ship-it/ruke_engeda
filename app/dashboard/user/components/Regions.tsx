"use client";
import React, { useState, useEffect, useRef } from "react";
import { SkeletonCard } from "./SkeletonCard";

interface Region {
  _id: string;
  name: string;
  capital: string;
  image: string;
}

interface RegionsProps {
  onSelect: (region: Region) => void;
}

const Regions = ({ onSelect }: RegionsProps) => {
  const [items, setItems] = useState<Region[]>([]);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);
  const limit = 3;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://service-lime-gamma.vercel.app"; // Used for images

  const fetchItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const currentOffset = offsetRef.current;
      const res = await fetch(`/api/regions?offset=${currentOffset}&lim=${limit}`);
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

          // Check if we have more based on total or backend flag
          if (data.hasMore === false || newItems.length < limit) {
            setHasMore(false);
          }
        }
      } else {
        setError(data.error || "Failed to fetch regions");
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
    const name = imgName === "noname" || !imgName ? "nopic.jpg" : imgName;
    return `${backendUrl}/img/region/${name}`;
  };

  return (
    <section id="regions" className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Explore Ethiopia</h2>
            <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">BEAUTIFUL REGIONS</p>
          </div>
          <p className="text-slate-500 max-w-sm text-lg leading-relaxed font-medium">
            Discover the diverse cultures and breathtaking landscapes across the regions of Ethiopia.
          </p>
        </div>

        {/* Grid of items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((region) => (
            <div key={region._id} className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col h-full transform hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={getImageUrl(region.image)}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${backendUrl}/img/region/nopic.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Capital City</p>
                  <p className="text-xl font-bold">{region.capital}</p>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{region.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                    <svg className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="Arrow-right 17 8l4 4m0 0l-4 4m4-4H3"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-500 text-base leading-relaxed mb-8 flex-grow">
                  Explore the unique heritage, vibrant traditions, and natural wonders of the {region.name} region.
                </p>
                <button 
                  onClick={() => onSelect(region)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-200 transition-all duration-300"
                >
                  View Attractions
                </button>
              </div>
            </div>
          ))}

          {/* Skeleton Loaders */}
          {loading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm h-[500px] animate-pulse">
                  <div className="w-full h-72 bg-slate-200 rounded-2xl mb-6"></div>
                  <div className="h-8 bg-slate-200 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6 mb-8"></div>
                  <div className="h-14 bg-slate-200 rounded-2xl w-full"></div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-800 text-xl font-bold mb-2">{error}</p>
            <p className="text-slate-500 mb-8">Something went wrong while loading the regions.</p>
            <button
              onClick={() => fetchItems()}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* End of content */}
        {!hasMore && !loading && items.length > 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-[2px] bg-slate-200 mx-auto mb-8"></div>
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">All regions discovered</p>
          </div>
        )}

        {/* Visibility sensor */}
        <div ref={loaderRef} className="h-20" />
      </div>
    </section>
  );
};

export default Regions;
