"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookingsClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push("/auth/login");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
          ? "bg-white shadow-md py-3 text-black"
          : "bg-transparent py-5 text-white"
        } lg:bg-transparent lg:text-white lg:py-6`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          RUKE<span className="text-teal-500 font-extrabold">.</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          <Link href="/#destinations" className="text-sm font-semibold uppercase hover:text-teal-400 transition-colors tracking-widest">
            Destinations
          </Link>
          <Link href="/bookings" onClick={handleBookingsClick} className="text-sm font-semibold uppercase hover:text-teal-400 transition-colors tracking-widest">
            Bookings
          </Link>
          <Link href="/about" className="text-sm font-semibold uppercase hover:text-teal-400 transition-colors tracking-widest">
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-80">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-6 py-2 rounded-full border border-current text-sm font-bold hover:bg-white hover:text-black transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-6 py-2 text-sm font-bold hover:opacity-80 transition-opacity"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-teal-600 text-white rounded-full text-sm font-bold hover:bg-teal-700 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-black bg-white/10 p-2 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white text-black absolute top-full left-0 right-0 shadow-xl border-t animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col p-6 gap-6">
            <Link href="/#destinations" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Destinations</Link>
            <Link href="/bookings" onClick={(e) => { setIsMobileMenuOpen(false); handleBookingsClick(e); }} className="text-lg font-bold">Bookings</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">About</Link>
            <hr />
            {session ? (
              <button onClick={() => signOut()} className="text-left text-lg font-bold text-red-500">Sign Out</button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 border border-black rounded-full font-bold">Login</Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-teal-600 text-white rounded-full font-bold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
