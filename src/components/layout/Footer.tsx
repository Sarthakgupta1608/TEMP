import React from 'react';
import type { PageRoute } from '../../types';
import { Compass, ShieldCheck, Award, Heart, Mail, Send, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl ai-gradient-bg flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Traveller
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India’s 1st AI-powered travel marketplace connecting travellers directly with verified local destination agencies in Sikkim, Shimla, Manali & Ladakh.
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Verified Agencies
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-amber-400" />
                Razorpay Escrow Protection
              </div>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-white transition-colors">
                  Explore Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-white transition-colors">
                  Pilots: Sikkim & Shimla
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-planner')} className="hover:text-white transition-colors text-purple-400 font-medium flex items-center gap-1">
                  AI Trip Request Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare-quotes')} className="hover:text-white transition-colors">
                  Compare Quotations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('become-agency')} className="hover:text-white transition-colors text-rose-400 font-medium">
                  Become a Local Agency
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">
                  Travel Blog & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Stay Updated</h4>
            <p className="text-xs text-slate-400">
              Get exclusive local agency deals and mountain travel guides in your inbox.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 text-rose-500" />
              Headquartered in Gangtok & Shimla
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Traveller Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for authentic travel experiences.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
