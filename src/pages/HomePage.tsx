import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { DESTINATIONS, PACKAGES, TESTIMONIALS, FAQS } from '../data/mockData';
import { 
  Sparkles, 
  MapPin, 
  CalendarDays, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Star, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  Award
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Quick Search Bar State
  const [selectedDest, setSelectedDest] = useState('Sikkim & Gangtok');
  const [travelerCount, setTravelerCount] = useState('2 Travellers');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient Gradient Background Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-rose-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Pilot Launch Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-blue-500/30 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Pilot Launching in <strong>Sikkim</strong> & <strong>Shimla</strong></span>
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">Live</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Stop Paying Middleman Fees.{' '}
            <span className="ai-gradient-text">Book Directly</span> with Local Agencies.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Post your custom trip request. Get transparent competitive quotes from verified local travel agencies. Compared & summarized by AI.
          </p>

          {/* AIRBNB-STYLE SEARCH & AI WIZARD CARD */}
          <div className="max-w-4xl mx-auto pt-4">
            <div className="glass-card rounded-3xl p-3 sm:p-4 shadow-2xl border-gray-200/80 dark:border-gray-800">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                
                {/* Destination Dropdown */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <label className="block text-[11px] uppercase font-extrabold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> Destination
                  </label>
                  <select 
                    value={selectedDest} 
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="w-full bg-transparent font-bold text-gray-900 dark:text-white text-sm focus:outline-none cursor-pointer mt-1"
                  >
                    <option value="Sikkim & Gangtok" className="dark:bg-gray-900">Sikkim & Gangtok</option>
                    <option value="Shimla & Kufri" className="dark:bg-gray-900">Shimla & Kufri</option>
                    <option value="Manali & Solang" className="dark:bg-gray-900">Manali & Solang</option>
                    <option value="Leh Ladakh" className="dark:bg-gray-900">Leh Ladakh</option>
                  </select>
                </div>

                {/* Dates Picker Simulation */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <label className="block text-[11px] uppercase font-extrabold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-500" /> Travel Dates
                  </label>
                  <span className="block font-bold text-gray-900 dark:text-white text-sm mt-1">
                    Flexible / Oct 2026
                  </span>
                </div>

                {/* Travellers Selector */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <label className="block text-[11px] uppercase font-extrabold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-rose-500" /> Travellers
                  </label>
                  <select 
                    value={travelerCount} 
                    onChange={(e) => setTravelerCount(e.target.value)}
                    className="w-full bg-transparent font-bold text-gray-900 dark:text-white text-sm focus:outline-none cursor-pointer mt-1"
                  >
                    <option value="1 Traveller" className="dark:bg-gray-900">Solo Traveller</option>
                    <option value="2 Travellers" className="dark:bg-gray-900">Couple (2 Pax)</option>
                    <option value="4 Travellers" className="dark:bg-gray-900">Family (4 Pax)</option>
                    <option value="8+ Travellers" className="dark:bg-gray-900">Group (8+ Pax)</option>
                  </select>
                </div>

                {/* AI Trip Request CTA Button */}
                <button
                  onClick={() => onNavigate('ai-planner')}
                  className="w-full h-full py-4 px-6 rounded-2xl text-white font-bold text-sm ai-gradient-bg hover:opacity-95 shadow-xl shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                  <span>Start AI Trip Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>
          </div>

          {/* Social Proof Counters */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span><strong>50+</strong> Verified Agencies</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              <span>Avg. <strong>30% Savings</strong> vs OTAs</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span><strong>4.9/5</strong> Customer Rating</span>
            </div>
          </div>

        </div>
      </section>


      {/* PILOT DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Explore Destinations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Current Pilot Destinations
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('destinations')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onNavigate('ai-planner')}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.heroImage} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white bg-slate-900/60 backdrop-blur-md border border-white/20">
                    {dest.state}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-black/40 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {dest.rating}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{dest.tagline}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span>{dest.agencyCount} Local Agencies</span>
                  <span>{dest.packageCount}+ Packages</span>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting From</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">₹{dest.startingPrice.toLocaleString()}</span>
                  </div>
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* HOW IT WORKS (4-STEP WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500">Transparent Marketplace</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            How Traveller Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Four simple steps to get custom travel quotes directly from native agency operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 text-left space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl">
              01
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit Trip Request</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Enter your dates, group size, budget, vehicle choice, and special activity preferences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 text-left space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl">
              02
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verified Agency Match</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Our AI routes your request directly to 20+ verified local travel agencies in Gangtok or Shimla.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 text-left space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xl">
              03
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Quote Comparison</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Receive 3–5 customized quotations. AI compares hotel ratings, permits, and inclusions side-by-side.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-3xl p-6 text-left space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
              04
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Escrow Payment Booking</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Book your preferred agency with Razorpay Escrow protection. Funds are held until your trip begins.
            </p>
          </div>

        </div>
      </section>


      {/* FEATURED LOCAL PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Ready-Made Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Featured Local Packages
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('packages')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.slice(0, 3).map((pkg) => (
            <div 
              key={pkg.id} 
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56">
                  <img src={pkg.coverImage} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {pkg.destination}
                  </div>
                  {pkg.originalPrice && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      SAVE {Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Agency Meta */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={pkg.agencyLogo} alt={pkg.agencyName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-gray-800 dark:text-gray-200">{pkg.agencyName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{pkg.agencyRating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                    {pkg.title}
                  </h3>

                  <div className="space-y-1.5 pt-2">
                    {pkg.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800/60 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Price / Person</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₹{pkg.pricePerPerson.toLocaleString()}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{pkg.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('compare-quotes')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                >
                  View Quotes
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* WHY TRAVELLER VS OTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Disrupting Travel Booking
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
              Why Traveller Beats Traditional Portals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-3 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <h4 className="font-bold text-rose-600 dark:text-rose-400 text-sm uppercase">Traditional OTAs & Aggregators</h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">❌ 30-40% hidden middleman commissions</li>
                  <li className="flex items-center gap-2">❌ Rigid pre-set non-customisable packages</li>
                  <li className="flex items-center gap-2">❌ Sub-contracted driver & local permit hassles</li>
                  <li className="flex items-center gap-2">❌ Unhelpful call centers in case of emergency</li>
                </ul>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm uppercase">Traveller AI Marketplace</h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">✅ Direct zero-middleman agency pricing</li>
                  <li className="flex items-center gap-2">✅ 100% customisable trip requests</li>
                  <li className="flex items-center gap-2">✅ Verified local Sikkim & Shimla experts</li>
                  <li className="flex items-center gap-2">✅ Razorpay Escrow & AI Quote Matrix</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">Real Traveller Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Loved by Travellers Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.location} • <span className="text-emerald-500 font-semibold">{t.quoteSaved}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* BECOME AN AGENCY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
              <Building2 className="w-4 h-4" /> Agency Partner Network
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Are You a Local Travel Agency in Sikkim or Shimla?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join 50+ verified local travel agencies receiving high-intent trip request leads directly from travellers. Zero listing setup fees.
            </p>
          </div>

          <button
            onClick={() => onNavigate('become-agency')}
            className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-white/10 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Register Your Agency</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>


      {/* FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Everything you need to know about booking with Traveller</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="glass-card rounded-2xl p-5 cursor-pointer transition-colors"
                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{faq.question}</h3>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>

                {isOpen && (
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-2 border-t border-gray-100 dark:border-gray-800">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
