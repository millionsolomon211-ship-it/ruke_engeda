"use client";
import React, { useState, useEffect } from "react";

interface BookingModalProps {
  location: {
    _id: string;
    name: string;
    price: number;
  };
  onClose: () => void;
  onConfirm: (bookingData: any) => Promise<void>;
}

const BookingModal = ({ location, onClose, onConfirm }: BookingModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wantCard, setWantCard] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalPrice(diffDays * (location.price || 0));
    } else {
      setTotalPrice(location.price || 0);
    }
  }, [startDate, endDate, location.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      locationId: location._id,
      locationName: location.name,
      startDate,
      endDate,
      totalPrice,
      wantCard,
      bookingTime: new Date().toISOString()
    };

    await onConfirm(payload);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Book Your Trip</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-slate-500 mb-8 font-medium">
            Experience the beauty of <span className="text-indigo-600 font-bold">{location.name}</span>. Select your travel dates to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Date</label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Date</label>
                <input 
                  type="date" 
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <input 
                type="checkbox" 
                id="wantCard"
                checked={wantCard}
                onChange={(e) => setWantCard(e.target.checked)}
                className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-indigo-200"
              />
              <label htmlFor="wantCard" className="text-sm font-bold text-indigo-900 cursor-pointer">
                I want a physical membership/guide card (+ $10)
              </label>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-3xl font-black text-slate-900">${totalPrice + (wantCard ? 10 : 0)}</p>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
