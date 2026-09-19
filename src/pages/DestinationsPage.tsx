import React, { useState } from 'react';
import { DESTINATIONS } from '../data/mockData';
import type { PageRoute } from '../types';
import { MapPin, Calendar, Star, Search, ArrowRight } from 'lucide-react';

interface DestinationsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = DESTINATIONS.filter((dest) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q) ||
      dest.tagline.toLowerCase().includes(q) ||
      dest.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-rose-600 dark:text-rose-400">
          <MapPin className="w-4 h-4 text-rose-500" /> Pilot Regions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Discover Himalayan <span className="ai-gradient-text">Destinations</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Book verified local agencies operating natively in Sikkim, Gangtok, Shimla, Manali, and surrounding Himalayan valleys.
        </p>

        {/* DESTINATION SEARCH INPUT BAR */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            placeholder="Search destination (e.g. Gangtok, Shimla, Manali, Ladakh)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-xl shadow-rose-500/5"
          />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-72 overflow-hidden">
                <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {dest.state}
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-black/40 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {dest.rating}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-extrabold">{dest.name}</h3>
                  <p className="text-xs text-slate-300 mt-1">{dest.tagline}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dest.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span>Best Time to Visit: {dest.bestTimeToVisit}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{dest.agencyCount} Native Local Agencies</span>
                  <span>{dest.packageCount}+ Verified Packages</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('ai-planner')}
                className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white btn-primary-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Custom Trip for {dest.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
