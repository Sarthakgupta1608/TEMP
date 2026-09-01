import React from 'react';
import type { PageRoute } from '../types';
import { Compass, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-blue-600 dark:text-blue-400">
          <Compass className="w-4 h-4" /> Our Story & Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Empowering Local Agencies, <span className="ai-gradient-text">Delighting Travellers</span>.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
          Traveller was founded with a simple goal: eliminate middleman travel portals and build an AI-powered marketplace where travellers get direct competitive quotes from native local destination experts.
        </p>
      </div>

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">50+</span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Verified Local Agencies</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-rose-500">₹45L+</span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Saved by Travellers</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-purple-500">2,500+</span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quotes Generated</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-emerald-500">4.9/5</span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Strict 4-Step KYC</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Every local agency on Traveller undergoes government tourism registration checks, tax verification, and physical office audits before receiving customer leads.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Matrix Intelligence</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Our AI engine normalizes hotel ratings, transport vehicle models, and permit fees across multiple quotes, saving hours of manual comparison.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Supporting Local Economies</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            By booking directly with native Sikkimese and Himachali agencies, your travel funds stay directly within local Himalayan communities.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-card rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ready for your next trip?</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">Create a custom trip request in under 60 seconds and compare direct quotes.</p>
        <button
          onClick={() => onNavigate('ai-planner')}
          className="px-6 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Start AI Trip Request</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
