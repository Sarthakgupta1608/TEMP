import React from 'react';
import { DESTINATIONS } from '../data/mockData';
import type { PageRoute } from '../types';
import { MapPin, Calendar, Star, Sparkles } from 'lucide-react';

interface DestinationsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-blue-600 dark:text-blue-400">
          <MapPin className="w-4 h-4" /> Pilot Regions
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Discover Himalayan <span className="ai-gradient-text">Destinations</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Book verified local agencies operating natively in Sikkim, Gangtok, Shimla, and surrounding Himalayan valleys.
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DESTINATIONS.map((dest) => (
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
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {dest.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span>Best Time to Visit: {dest.bestTimeToVisit}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-400 block">Top Experiences</span>
                  <div className="flex flex-wrap gap-2">
                    {dest.popularActivities.map((act, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        • {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800/60 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting Package</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{dest.startingPrice.toLocaleString()}</span>
              </div>

              <button
                onClick={() => onNavigate('ai-planner')}
                className="px-5 py-3 rounded-xl text-xs font-bold text-white ai-gradient-bg shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Create Request</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
