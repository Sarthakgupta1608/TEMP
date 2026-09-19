import React, { useState, useEffect } from 'react';
import { PACKAGES } from '../data/mockData';
import type { PackageItem, PageRoute } from '../types';
import { Package, Star, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface ExplorePackagesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ExplorePackagesPage: React.FC<ExplorePackagesPageProps> = ({ onNavigate }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [packageList, setPackageList] = useState<PackageItem[]>(PACKAGES);

  useEffect(() => {
    let isMounted = true;
    ApiClient.fetchPackages(selectedDestination, maxPrice).then((data) => {
      if (isMounted && Array.isArray(data)) {
        setPackageList(data);
      }
    });
    return () => { isMounted = false; };
  }, [selectedDestination, maxPrice]);

  const filteredPackages = packageList.filter((pkg) => {
    const matchesDest = selectedDestination === 'All' || pkg.destination.includes(selectedDestination);
    const matchesPrice = pkg.pricePerPerson <= maxPrice;
    return matchesDest && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-blue-600 dark:text-blue-400">
          <Package className="w-4 h-4" /> Ready-Made Local Packages
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Explore Verified <span className="ai-gradient-text">Himalayan Packages</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pre-built itineraries crafted and published directly by local travel agencies in Sikkim and Shimla.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Destination Selector */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Destination Region</label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">All Regions (Sikkim & Shimla)</option>
            <option value="Sikkim">Sikkim & Gangtok</option>
            <option value="Shimla">Shimla & Kufri</option>
          </select>
        </div>

        {/* Max Budget Range */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            <span>Max Budget Per Person</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">₹{maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={35000}
            step={2500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Create Custom Request Trigger */}
        <div className="md:text-right pt-2 md:pt-0">
          <button
            onClick={() => onNavigate('ai-planner')}
            className="w-full md:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white ai-gradient-bg shadow-md active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Need Custom Plan? Use AI Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
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
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </div>
              </div>

              <div className="p-6 space-y-4">
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
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  ₹{pkg.pricePerPerson.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <button
                onClick={() => setSelectedPkg(pkg)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95 transition-all"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PACKAGE DETAILS MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setSelectedPkg(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {selectedPkg.destination}
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {selectedPkg.title}
              </h2>
            </div>

            <div className="relative h-60 rounded-2xl overflow-hidden">
              <img src={selectedPkg.coverImage} alt={selectedPkg.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
                <span className="text-gray-400 font-semibold block">Accommodations</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedPkg.includedAccommodations}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
                <span className="text-gray-400 font-semibold block">Transport Vehicle</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedPkg.transportType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Key Package Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPkg.highlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Price</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{selectedPkg.pricePerPerson.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedPkg(null);
                  onNavigate('ai-planner');
                }}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600"
              >
                Customize This Package
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
