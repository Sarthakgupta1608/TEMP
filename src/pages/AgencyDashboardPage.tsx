import React, { useState } from 'react';
import type { PageRoute, AgencyTab } from '../types';
import { 
  Building2, 
  LayoutDashboard, 
  ShieldCheck, 
  Inbox, 
  PlusCircle, 
  CheckCircle2, 
  Wallet, 
  Star, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface AgencyDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AgencyDashboardPage: React.FC<AgencyDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AgencyTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quote Builder Form State
  const [quoteData, setQuoteData] = useState({
    requestId: 'REQ-8902',
    travellerName: 'Rohan Verma (3 Pax)',
    hotelCategory: '4-Star Mountain View Resort',
    hotelNames: 'Elgin Nor-Khill Gangtok & Lachung Retreat',
    vehicleType: 'Private Toyota Innova Crysta (Dedicated Driver)',
    totalPrice: 42000,
    inclusions: 'Nathula Pass Permit, Tsomgo Lake Excursion, Breakfast & Dinner',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Wallet State
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleCreateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  const navItems: { id: AgencyTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Agency Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'kyc', label: 'KYC & Verification', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'leads', label: 'Lead Request Inbox', icon: <Inbox className="w-4 h-4 text-blue-400" /> },
    { id: 'create-quote', label: 'Create Custom Quote', icon: <PlusCircle className="w-4 h-4 text-purple-400" /> },
    { id: 'bookings', label: 'Manage Bookings', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'wallet', label: 'Wallet & Payouts', icon: <Wallet className="w-4 h-4 text-amber-400" /> },
    { id: 'reviews', label: 'Customer Reviews', icon: <Star className="w-4 h-4 text-yellow-400" /> },
    { id: 'settings', label: 'Agency Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-5 space-y-6 flex-shrink-0">
        
        {/* Agency Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-white truncate">Himalayan Footprints</h4>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> KYC Verified
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit to Main Website
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white capitalize">
              Agency Portal — {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Local Agency (Sikkim)
            </span>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-64 bg-slate-950 p-5 space-y-6 flex flex-col justify-between border-r border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Agency Portal</span>
                  <button onClick={() => setMobileSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${
                        activeTab === item.id ? 'bg-rose-500 text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-xs text-slate-400">
                <LogOut className="w-4 h-4" /> Main Website
              </button>
            </div>
          </div>
        )}

        {/* MAIN PANEL VIEWS */}
        <main className="p-4 sm:p-8 space-y-8 flex-grow overflow-y-auto">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Leads Received</span>
                  <div className="text-3xl font-black text-white">28</div>
                  <span className="text-[11px] text-blue-400 font-semibold block">+6 new today</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Quotes Submitted</span>
                  <div className="text-3xl font-black text-white">22</div>
                  <span className="text-[11px] text-purple-400 font-semibold block">78% Response Rate</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Bookings Won</span>
                  <div className="text-3xl font-black text-emerald-400">14</div>
                  <span className="text-[11px] text-emerald-400 font-semibold block">63% Conversion</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Wallet Balance</span>
                  <div className="text-3xl font-black text-amber-400">₹1,66,000</div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Available for Payout</span>
                </div>
              </div>

              {/* Lead Inbox Quick Teaser */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Latest High-Intent Destination Lead</h3>
                  <button onClick={() => setActiveTab('create-quote')} className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    Build Quote <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Request #REQ-8902 • Rohan Verma (3 Adults)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">Matching Sikkim Agency</span>
                  </div>
                  <p className="text-slate-300">
                    5D/4N Gangtok & Nathula Pass. Dates: 15–20 Oct 2026. Budget: ₹18,000/head. Wants private Innova Crysta & 4-Star Resort.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* 2. KYC */}
          {activeTab === 'kyc' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Agency KYC & License Verification</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-5 h-5" /> KYC Verification Status: APPROVED
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">ID: SIK-KYC-9012</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">Sikkim Tourism License</span>
                      <span className="text-[10px] text-slate-400">Reg No: SK-TO-2024-88A</span>
                    </div>
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">GSTIN Certificate</span>
                      <span className="text-[10px] text-slate-400">GST: 11AAAAA0000A1Z5</span>
                    </div>
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">Bank Account & Razorpay Payout Proof</span>
                      <span className="text-[10px] text-slate-400">HDFC Bank • Gangtok Branch</span>
                    </div>
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. LEADS INBOX */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Destination Trip Request Leads</h2>

              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-blue-400">REQ-8902 • Received 10m ago</span>
                      <h3 className="text-lg font-bold text-white">Sikkim 5D/4N Custom Honeymoon Request</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('create-quote')}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md"
                    >
                      Submit Custom Quote
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Traveller</span>
                      <span className="font-bold text-white">Rohan Verma (3 Pax)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Travel Dates</span>
                      <span className="font-bold text-white">15 Oct – 20 Oct</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Budget Ceiling</span>
                      <span className="font-bold text-white">₹18,000 / head</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vehicle Preference</span>
                      <span className="font-bold text-white">Innova Crysta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. CREATE QUOTE */}
          {activeTab === 'create-quote' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Custom Quotation Builder</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                {quoteSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Quote Submitted to Traveller!</h3>
                    <p className="text-xs text-slate-400">
                      Your quote of ₹{quoteData.totalPrice.toLocaleString()} for REQ-8902 is now live in the traveller comparison matrix.
                    </p>
                    <button
                      onClick={() => setQuoteSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
                    >
                      Create Another Quote
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateQuoteSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Target Trip Request</label>
                      <input type="text" readOnly value={quoteData.requestId + " — " + quoteData.travellerName} className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold" />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Hotel Category & Properties</label>
                      <input
                        type="text"
                        value={quoteData.hotelNames}
                        onChange={(e) => setQuoteData({ ...quoteData, hotelNames: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Vehicle Guarantee</label>
                      <input
                        type="text"
                        value={quoteData.vehicleType}
                        onChange={(e) => setQuoteData({ ...quoteData, vehicleType: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Total Quote Amount (INR)</label>
                      <input
                        type="number"
                        value={quoteData.totalPrice}
                        onChange={(e) => setQuoteData({ ...quoteData, totalPrice: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Included Activities & Permits</label>
                      <textarea
                        rows={2}
                        value={quoteData.inclusions}
                        onChange={(e) => setQuoteData({ ...quoteData, inclusions: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold bg-rose-500 hover:bg-rose-600 shadow-lg">
                      Submit Custom Quotation
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 5. BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Active Agency Bookings</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-bold text-emerald-400">TRV-2026-SK892 • Traveller: Rohan Verma</span>
                    <h3 className="text-base font-bold text-white">5D/4N Sikkim & Gangtok Expedition</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                    Escrow Locked (₹42,000)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-400 block">Dates</span>
                    <span className="font-bold text-white">15 Oct – 20 Oct</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Driver Assigned</span>
                    <span className="font-bold text-white">Tenzin Norbu</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nathula Permit</span>
                    <span className="font-bold text-emerald-400">Approved</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Agency Payout</span>
                    <span className="font-bold text-white">₹37,800 (net)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Agency Ledger & Payouts</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Available Balance</span>
                    <span className="text-3xl font-black text-emerald-400">₹1,66,000</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Pending Escrow Hold</span>
                    <span className="text-3xl font-black text-amber-400">₹42,000</span>
                  </div>
                </div>

                {payoutRequested ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold text-center">
                    Payout Request Submitted! Funds will reflect in HDFC Bank account in 24 hours.
                  </div>
                ) : (
                  <button
                    onClick={() => setPayoutRequested(true)}
                    className="w-full py-3.5 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-500 shadow-md"
                  >
                    Request Payout to Bank (₹1,66,000)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 7. REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Customer Ratings & Reviews</h2>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Ananya & Rohan Verma</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-slate-300">
                    "Tenzin was an exceptional driver on the winding roads to Tsomgo Lake. Hotel Nor-Khill was luxury at its finest!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 8. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-white">Agency Profile & Settings</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Company Name</label>
                  <input type="text" defaultValue="Himalayan Footprints Tours" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Operating Region</label>
                  <input type="text" defaultValue="Sikkim & Gangtok" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800" />
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold">Update Agency Profile</button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
