import React, { useState } from 'react';
import type { PageRoute, TravellerTab } from '../types';
import { PACKAGES, QUOTES } from '../data/mockData';
import { 
  LayoutDashboard, 
  MapPin, 
  FileText, 
  Sparkles, 
  Heart, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  Star, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Download, 
  Send, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

interface TravellerDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TravellerDashboardPage: React.FC<TravellerDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TravellerTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agency', text: 'Tashi Delek! Welcome to Gangtok. Your driver Tenzin will meet you at Bagdogra Airport.', time: '10:30 AM' },
    { sender: 'user', text: 'Hi! Is Nathula Pass permit included in the Innova Crysta booking?', time: '10:32 AM' },
    { sender: 'agency', text: 'Yes, 100%! We submitted your ILP & Nathula permits yesterday. Please carry 2 passport photos.', time: '10:35 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Notifications State
  const [notifications] = useState([
    { id: 1, title: 'New Quote Received!', desc: 'Royal Silk Route Voyages submitted a ₹51,000 quote for Sikkim 5D/4N.', time: '15m ago', read: false },
    { id: 2, title: 'Payment Escrow Secured', desc: 'Razorpay held ₹42,000 safely for booking TRV-2026-SK892.', time: '2h ago', read: true },
    { id: 3, title: 'Permit Approved', desc: 'Nathula Pass Protected Area Permit granted by Gangtok Administration.', time: '1d ago', read: true },
  ]);

  // Wishlist State
  const [wishlist] = useState(PACKAGES.slice(0, 2));

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: inputMessage, time: 'Just now' }]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'agency', text: 'Got it! Our local Gangtok team will take care of everything.', time: 'Just now' },
      ]);
    }, 1000);
  };

  const navItems: { id: TravellerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'trips', label: 'My Trips', icon: <Calendar className="w-4 h-4" /> },
    { id: 'requests', label: 'Trip Requests', icon: <FileText className="w-4 h-4" /> },
    { id: 'ai-planner', label: 'AI Planner', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'payments', label: 'Payments & Escrow', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'messages', label: 'Agency Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4 text-amber-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-5 space-y-6 flex-shrink-0">
        
        {/* User Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Rohan Verma"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-white truncate">Rohan Verma</h4>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">Verified Traveller</span>
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout / Switch Portal */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit to Main Website
          </button>
        </div>

      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
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
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => onNavigate('ai-planner')}
              className="px-4 py-2 rounded-full text-xs font-bold text-white ai-gradient-bg shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>

        </header>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-64 bg-slate-950 p-5 space-y-6 flex flex-col justify-between border-r border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Traveller Portal</span>
                  <button onClick={() => setMobileSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${
                        activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-xs text-slate-400">
                <LogOut className="w-4 h-4" /> Back to Main Site
              </button>
            </div>
          </div>
        )}

        {/* SUB-MODULE VIEW PANELS */}
        <main className="p-4 sm:p-8 space-y-8 flex-grow overflow-y-auto">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Active Requests</span>
                  <div className="text-3xl font-black text-white">1</div>
                  <span className="text-[11px] text-emerald-400 block font-semibold">3 Quotes Received</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Booked Trips</span>
                  <div className="text-3xl font-black text-white">1</div>
                  <span className="text-[11px] text-blue-400 block font-semibold">5D/4N Sikkim (Oct 15)</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Escrow Secured</span>
                  <div className="text-3xl font-black text-white">₹42,000</div>
                  <span className="text-[11px] text-purple-400 block font-semibold">Held via Razorpay</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Saved</span>
                  <div className="text-3xl font-black text-rose-400">₹14,200</div>
                  <span className="text-[11px] text-slate-400 block font-semibold">vs OTA Middleman Fees</span>
                </div>
              </div>

              {/* Active Trip Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                    Upcoming Confirmed Trip
                  </span>
                  <h3 className="text-xl font-bold text-white">5D/4N Enchanting Sikkim & Nathula Expedition</h3>
                  <p className="text-xs text-slate-300">
                    Booked with <strong>Himalayan Footprints Local Agency</strong> • Travel Dates: <strong>15th Oct – 20th Oct 2026</strong>
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md whitespace-nowrap"
                >
                  View Booking Voucher
                </button>
              </div>

              {/* Quotes Received Quick Comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Live Quotes for Sikkim Request</h3>
                  <button onClick={() => onNavigate('compare-quotes')} className="text-xs text-blue-400 font-bold flex items-center gap-1">
                    Compare Matrix <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {QUOTES.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{q.agencyName}</span>
                        <span className="text-xs font-black text-rose-400">₹{q.totalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{q.hotelCategory} • {q.vehicleType}</p>
                      <button
                        onClick={() => onNavigate('compare-quotes')}
                        className="w-full py-2 rounded-xl text-xs font-bold text-blue-400 bg-slate-800 hover:bg-slate-700"
                      >
                        Review Quotation
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. MY TRIPS */}
          {activeTab === 'trips' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">My Trips History & Itineraries</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase text-emerald-400">Confirmed Booking (Code: TRV-2026-SK892)</span>
                    <h3 className="text-lg font-bold text-white">5D/4N Sikkim & Gangtok Expedition</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Dates</span>
                    <span className="font-bold text-white">15 Oct – 20 Oct 2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Driver</span>
                    <span className="font-bold text-white">Tenzin Norbu (+91 98320 11223)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Vehicle</span>
                    <span className="font-bold text-white">Toyota Innova Crysta (SK-01-PA-8890)</span>
                  </div>
                </div>

                {/* Day-by-Day Timeline */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 block">Itinerary Timeline</span>
                  {QUOTES[0].itinerary.map((item) => (
                    <div key={item.day} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-blue-400 block">Day {item.day}: {item.title}</span>
                      <p className="text-slate-400 text-[11px]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. TRIP REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">My Active Trip Requests</h2>
                <button
                  onClick={() => onNavigate('ai-planner')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white ai-gradient-bg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Request
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                    <MapPin className="w-4 h-4" /> Sikkim & Gangtok
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300">
                    3 Quotes Received
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Travel Window</span>
                    <span className="font-bold text-white">15 Oct – 20 Oct</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Group Size</span>
                    <span className="font-bold text-white">3 Adults</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Budget Per Head</span>
                    <span className="font-bold text-white">₹18,000</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status</span>
                    <span className="font-bold text-emerald-400">Quotes Ready</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('compare-quotes')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
                  >
                    Compare Quotes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. AI PLANNER EMBEDDED */}
          {activeTab === 'ai-planner' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">AI Trip Intent Extractor</h2>
                <p className="text-xs text-slate-400">Create a new structured trip request using OpenAI</p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Launch the full AI Trip Planner Wizard to specify custom dates, vehicles, permits, and hotel preferences.
                </p>
                <button
                  onClick={() => onNavigate('ai-planner')}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white ai-gradient-bg shadow-xl"
                >
                  Launch Full AI Wizard
                </button>
              </div>
            </div>
          )}

          {/* 5. WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Saved Travel Packages</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <img src={pkg.coverImage} alt={pkg.title} className="w-full h-40 object-cover rounded-xl" />
                    <h3 className="font-bold text-sm text-white">{pkg.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{pkg.destination}</span>
                      <span className="font-bold text-white">₹{pkg.pricePerPerson.toLocaleString()} / head</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Confirmed Bookings & Vouchers</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-bold">Booking Code: TRV-2026-SK892</span>
                    <h3 className="text-lg font-bold text-white">Himalayan Footprints Local Agency</h3>
                  </div>
                  <button
                    onClick={() => alert('Downloading PDF Voucher for TRV-2026-SK892...')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Voucher PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Paid</span>
                    <span className="font-bold text-white">₹42,000</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Payment Mode</span>
                    <span className="font-bold text-white">Razorpay UPI</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Escrow Status</span>
                    <span className="font-bold text-emerald-400">Funds Secured</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hotel Check-In</span>
                    <span className="font-bold text-white">15 Oct 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Razorpay Payment & Escrow History</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">Transaction ID</th>
                        <th className="pb-3">Booking Ref</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-3 font-mono">pay_Pz901189201</td>
                        <td className="py-3 font-mono text-blue-400">TRV-2026-SK892</td>
                        <td className="py-3 font-bold text-white">₹42,000</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            Escrow Hold
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">07 Aug 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-xl font-bold text-white">Chat with Himalayan Footprints Agency</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs max-w-sm ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Type message to agency..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 9. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Notifications</h2>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">{n.title}</h4>
                      <p className="text-xs text-slate-400">{n.desc}</p>
                      <span className="text-[10px] text-slate-500 block">{n.time}</span>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-white">Review Your Experience</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                {reviewSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs text-center font-bold">
                    Thank you! Your verified review has been published.
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setReviewSubmitted(true); }} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Rating</label>
                      <div className="flex items-center gap-2 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`w-6 h-6 cursor-pointer ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Feedback for Agency</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="How was the driver, hotel, and permit coordination?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold">
                      Submit Verified Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 11. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-white">Account Settings</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name</label>
                  <input type="text" defaultValue="Rohan Verma" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Email</label>
                  <input type="email" defaultValue="rohan@example.com" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800" />
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">Save Settings</button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
