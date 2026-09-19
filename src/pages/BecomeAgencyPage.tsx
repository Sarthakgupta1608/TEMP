import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { Building2, ArrowRight, X } from 'lucide-react';

interface BecomeAgencyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const BecomeAgencyPage: React.FC<BecomeAgencyPageProps> = ({ onNavigate }) => {
  const [monthlyQuotes, setMonthlyQuotes] = useState<number>(15);
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(25000);
  const [showRegModal, setShowRegModal] = useState<boolean>(false);

  const estimatedEarnings = Math.round(monthlyQuotes * avgTicketPrice * 0.90);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-rose-500">
          <Building2 className="w-4 h-4" /> Agency Partner Portal
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Grow Your Local Travel Agency with <span className="ai-gradient-text">Verified Leads</span>.
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
          Stop relying on expensive ads. Receive high-intent customized trip requests directly from travellers planning trips to Sikkim, Gangtok, Shimla, and Himachal Pradesh.
        </p>

        <button
          onClick={() => setShowRegModal(true)}
          className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Register Agency Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* EARNINGS ESTIMATOR WIDGET */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-slate-900/20 border border-blue-500/20">
        <div className="text-center max-w-md mx-auto mb-8 space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Agency Revenue Estimator</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Calculate potential monthly revenue on Traveller Marketplace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
                <span>Bookings Closed / Month</span>
                <span className="text-blue-600 font-extrabold">{monthlyQuotes} Trips</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={monthlyQuotes}
                onChange={(e) => setMonthlyQuotes(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
                <span>Average Package Price</span>
                <span className="text-blue-600 font-extrabold">₹{avgTicketPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={60000}
                step={5000}
                value={avgTicketPrice}
                onChange={(e) => setAvgTicketPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center space-y-2 bg-slate-900 text-white shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Estimated Monthly Revenue</span>
            <span className="text-4xl font-black text-emerald-400">₹{estimatedEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-[11px] text-slate-400 block pt-2">*After 10% platform commission</span>
          </div>

        </div>
      </div>

      {/* KYC VERIFICATION WORKFLOW */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">4-Step Agency KYC Audit</h2>
          <p className="text-xs text-gray-500">We maintain 100% traveller trust by strictly verifying all partner agencies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs flex items-center justify-center">01</span>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Govt Tourism License</h4>
            <p className="text-xs text-gray-500">Upload Sikkim or Himachal Pradesh state tourism registration certificate.</p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 font-bold text-xs flex items-center justify-center">02</span>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">GST / Business PAN</h4>
            <p className="text-xs text-gray-500">Provide tax verification for transparent invoice generation.</p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs flex items-center justify-center">03</span>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Bank Account Proof</h4>
            <p className="text-xs text-gray-500">Cancelled cheque or bank letterhead for Razorpay Escrow payouts.</p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center">04</span>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Local Physical Office</h4>
            <p className="text-xs text-gray-500">Ground verification of your operational office in Gangtok, Shimla, or Manali.</p>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 space-y-4 relative border border-gray-200 dark:border-gray-800 animate-in zoom-in duration-200">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register Travel Agency</h3>
              <p className="text-xs text-gray-500">Start receiving Sikkim & Shimla leads within 24 hours.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowRegModal(false); onNavigate('signup'); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Company / Agency Name</label>
                <input type="text" required placeholder="e.g. Sikkim Mountain Escapes" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">Owner Contact Email</label>
                <input type="email" required placeholder="owner@agency.com" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">Primary Operating Region</label>
                <select className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <option>Sikkim & Gangtok</option>
                  <option>Shimla & Kufri</option>
                  <option>Manali & Kullu</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold bg-rose-500 hover:bg-rose-600 shadow-md">
                Proceed to KYC Document Upload
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
