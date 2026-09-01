import React, { useState } from 'react';
import { QUOTES } from '../data/mockData';
import type { QuoteItem, PageRoute } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Car, 
  Hotel, 
  CreditCard, 
  X,
  Check
} from 'lucide-react';

interface CompareQuotesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ onNavigate }) => {
  const [selectedQuoteForBooking, setSelectedQuoteForBooking] = useState<QuoteItem | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const handleCompleteBooking = () => {
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-purple-600 dark:text-purple-400">
          <Sparkles className="w-4 h-4 text-amber-400" /> AI Quote Comparison Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Compare Agency <span className="ai-gradient-text">Quotations</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          Review 3 live itemized quotes received from verified local Gangtok agencies for your 5D/4N Sikkim Trip Request.
        </p>
      </div>

      {/* SIDE-BY-SIDE QUOTE COMPARISON GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {QUOTES.map((quote) => {
          const isBestValue = quote.aiMatchScore >= 95;
          return (
            <div
              key={quote.id}
              className={`glass-card rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                isBestValue ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/10' : ''
              }`}
            >
              {isBestValue && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI Recommendation (#1 Best Value)
                </div>
              )}

              <div className="space-y-6 pt-2">
                {/* Agency Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img src={quote.agencyLogo} alt={quote.agencyName} className="w-10 h-10 rounded-2xl object-cover" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{quote.agencyName}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Local Agency
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{quote.agencyRating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">({quote.agencyReviews} reviews)</span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase font-bold text-gray-500">Total Quote Price</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">₹{quote.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 text-right">₹{quote.pricePerPerson.toLocaleString()} per person (3 pax)</div>
                </div>

                {/* AI Summary Banner */}
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Analysis (Match Score {quote.aiMatchScore}%)
                  </span>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    {quote.aiRecommendationReason}
                  </p>
                </div>

                {/* Hotel & Vehicle Matrix */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                    <span className="font-bold text-gray-500 flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-blue-500" /> Accommodation
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white block">{quote.hotelCategory}</span>
                    <span className="text-[11px] text-gray-500 block">({quote.hotelNames.join(', ')})</span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                    <span className="font-bold text-gray-500 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-rose-500" /> Dedicated Vehicle
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white block">{quote.vehicleType}</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">Key Inclusions</span>
                  <div className="space-y-1.5 text-xs">
                    {quote.includedActivities.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">Exclusions</span>
                  <div className="space-y-1.5 text-xs">
                    {quote.excludedItems.map((exc, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Booking Trigger CTA */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button
                  onClick={() => { setSelectedQuoteForBooking(quote); setBookingSuccess(false); }}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    isBestValue ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Book This Quotation</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RAZORPAY ESCROW BOOKING MODAL */}
      {selectedQuoteForBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative border border-gray-200 dark:border-gray-800 animate-in zoom-in duration-200">
            
            <button
              onClick={() => setSelectedQuoteForBooking(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed & Escrow Held!</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Booking Code: <strong className="text-blue-600">TRV-2026-SK892</strong>. Your payment of ₹{selectedQuoteForBooking.totalPrice.toLocaleString()} is securely held in Razorpay Escrow.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setSelectedQuoteForBooking(null); onNavigate('home'); }}
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400">Razorpay Escrow Checkout</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Booking with {selectedQuoteForBooking.agencyName}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trip Request</span>
                    <span className="font-bold text-gray-900 dark:text-white">5D/4N Sikkim & Gangtok</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accommodation</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedQuoteForBooking.hotelCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedQuoteForBooking.vehicleType}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold text-sm">
                    <span>Total Amount Payable</span>
                    <span className="text-blue-600 dark:text-blue-400">₹{selectedQuoteForBooking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Your money remains safe in Escrow until you check into your hotel in Gangtok.</span>
                </div>

                <button
                  onClick={handleCompleteBooking}
                  className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize Razorpay Payment</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
