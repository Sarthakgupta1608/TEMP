import React, { useState, useEffect } from 'react';
import { QUOTES } from '../data/mockData';
import type { QuoteItem, PageRoute } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Car, 
  Hotel, 
  CreditCard, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface CompareQuotesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ onNavigate }) => {
  const { sessions } = useAuth();
  const [quoteList, setQuoteList] = useState<QuoteItem[]>(QUOTES);
  const [selectedQuoteForBooking, setSelectedQuoteForBooking] = useState<QuoteItem | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('TRV-2026-SK892');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    ApiClient.fetchQuotesForRequest().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setQuoteList(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleOpenBooking = (quote: QuoteItem) => {
    setBookingError('');
    setSelectedQuoteForBooking(quote);
  };

  const handleCompleteBooking = async () => {
    if (!sessions.traveller) {
      onNavigate('login');
      return;
    }

    if (!selectedQuoteForBooking) return;

    setIsBooking(true);
    setBookingError('');

    try {
      const res = await ApiClient.createBooking({
        quoteId: selectedQuoteForBooking.id,
        startDate: '2026-10-15',
        endDate: '2026-10-20',
        pax: 2,
      });
      setBookingCode(res?.bookingCode || 'TRV-2026-CONFIRMED');
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
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
          Review live itemized quotes received from verified local Gangtok agencies for your 5D/4N Sikkim Trip Request.
        </p>
      </div>

      {/* SIDE-BY-SIDE QUOTE COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {quoteList.map((quote, idx) => {
          const isHighestMatch = quote.aiMatchScore >= 95;

          return (
            <div
              key={quote.id || idx}
              className={`glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 hover:shadow-2xl ${
                isHighestMatch ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/10' : 'border border-gray-200 dark:border-gray-800'
              }`}
            >
              {isHighestMatch && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  AI Recommended Match
                </div>
              )}

              <div className="space-y-6">
                
                {/* Agency Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={quote.agencyLogo}
                    alt={quote.agencyName}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{quote.agencyName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-gray-800 dark:text-gray-200">{quote.agencyRating}</span>
                      <span>({quote.agencyReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₹{quote.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">Total for 2 Pax</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    ₹{quote.pricePerPerson.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / person (All taxes included)
                  </div>
                </div>

                {/* AI Score Badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs">
                  <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-500" /> AI Compatibility
                  </div>
                  <span className="font-extrabold text-purple-700 dark:text-purple-300 text-sm">{quote.aiMatchScore}%</span>
                </div>

                {/* Key Spec Badges */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Hotel className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-medium">{quote.hotelCategory}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Car className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{quote.vehicleType}</span>
                  </div>
                </div>

                {/* Included Highlights */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Inclusions</span>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {(Array.isArray(quote.includedActivities) ? quote.includedActivities : []).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleOpenBooking(quote)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                    isHighestMatch
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  Book with Escrow Protection
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
              onClick={() => {
                setSelectedQuoteForBooking(null);
                setBookingSuccess(false);
              }}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 cursor-pointer"
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
                  Booking Code: <strong className="text-blue-600 font-mono">{bookingCode}</strong>. Your payment of ₹{selectedQuoteForBooking.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })} is securely held in Razorpay Escrow.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedQuoteForBooking(null);
                      setBookingSuccess(false);
                      onNavigate('traveller-dashboard');
                    }}
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer"
                  >
                    View in Dashboard Bookings
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuoteForBooking(null);
                      setBookingSuccess(false);
                      onNavigate('home');
                    }}
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400">Razorpay Escrow Checkout</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Booking with {selectedQuoteForBooking.agencyName}</h3>
                </div>

                {!sessions.traveller ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3">
                    <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Traveller account required to complete booking and escrow hold.</span>
                    </div>
                    <button
                      onClick={() => onNavigate('login')}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      Sign In as Traveller to Continue
                    </button>
                  </div>
                ) : (
                  <>
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
                        <span className="text-blue-600 dark:text-blue-400">
                          ₹{selectedQuoteForBooking.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span>Your money remains safe in Escrow until you check into your hotel in Gangtok.</span>
                    </div>

                    {bookingError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
                        {bookingError}
                      </div>
                    )}

                    <button
                      onClick={handleCompleteBooking}
                      disabled={isBooking}
                      className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isBooking ? 'Processing Escrow Hold...' : 'Authorize Razorpay Payment'}</span>
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
