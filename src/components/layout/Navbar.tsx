import React, { useState } from 'react';
import type { PageRoute } from '../../types';
import { 
  Compass, 
  Sparkles, 
  Building2, 
  Package, 
  MapPin, 
  BookOpen, 
  Info, 
  Phone, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  UserCheck, 
  LogIn,
  Layers,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sessions, logout } = useAuth();

  const navLinks: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: 'Traveller App', route: 'traveller-dashboard', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" /> },
    { label: 'Agency Portal', route: 'agency-dashboard', icon: <Building2 className="w-4 h-4 text-rose-400" /> },
    { label: 'Admin Portal', route: 'admin-panel', icon: <ShieldAlert className="w-4 h-4 text-purple-400" /> },
    { label: 'Explore Packages', route: 'packages', icon: <Package className="w-4 h-4" /> },
    { label: 'Destinations', route: 'destinations', icon: <MapPin className="w-4 h-4" /> },
    { label: 'AI Planner', route: 'ai-planner', icon: <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" /> },
    { label: 'Compare Quotes', route: 'compare-quotes', icon: <Layers className="w-4 h-4" /> },
    { label: 'Become an Agency', route: 'become-agency', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Blog', route: 'blog', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'About', route: 'about', icon: <Info className="w-4 h-4" /> },
    { label: 'Contact', route: 'contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const hasAnySession = Boolean(sessions.traveller || sessions.agency || sessions.admin);

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl ai-gradient-bg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent">
                Traveller
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">
                AI Travel Marketplace
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 5).map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions (Sessions & Theme toggle) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Active Sessions Pills */}
            {sessions.traveller && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate max-w-[130px]">
                  {sessions.traveller.profile?.fullName || sessions.traveller.email.split('@')[0]} (Traveller)
                </span>
                <button
                  onClick={() => logout('traveller')}
                  className="hover:text-red-500 ml-1 p-0.5 rounded cursor-pointer transition-colors"
                  title="Log out traveller session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {sessions.agency && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-700/60 text-xs font-semibold text-rose-700 dark:text-rose-300 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-rose-500" />
                <span className="truncate max-w-[140px]">
                  {sessions.agency.agency?.companyName || sessions.agency.profile?.fullName || 'Agency'} (Agency)
                </span>
                <button
                  onClick={() => logout('agency')}
                  className="hover:text-red-500 ml-1 p-0.5 rounded cursor-pointer transition-colors"
                  title="Log out agency session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {sessions.admin && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/60 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                <span>Admin</span>
                <button
                  onClick={() => logout('admin')}
                  className="hover:text-red-500 ml-1 p-0.5 rounded cursor-pointer transition-colors"
                  title="Log out admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!hasAnySession && (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Log In
                </button>

                <button
                  onClick={() => onNavigate('signup')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
          
          {/* Active mobile sessions */}
          {hasAnySession && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Sessions</span>
              {sessions.traveller && (
                <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <span>{sessions.traveller.profile?.fullName || sessions.traveller.email} (Traveller)</span>
                  <button onClick={() => logout('traveller')} className="text-red-500 text-xs font-bold">Logout</button>
                </div>
              )}
              {sessions.agency && (
                <div className="flex items-center justify-between text-xs text-rose-500 font-semibold">
                  <span>{sessions.agency.agency?.companyName || sessions.agency.email} (Agency)</span>
                  <button onClick={() => logout('agency')} className="text-red-500 text-xs font-bold">Logout</button>
                </div>
              )}
              {sessions.admin && (
                <div className="flex items-center justify-between text-xs text-purple-500 font-semibold">
                  <span>Super Admin</span>
                  <button onClick={() => logout('admin')} className="text-red-500 text-xs font-bold">Logout</button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left ${
                  currentRoute === link.route
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
            {!hasAnySession ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-center text-sm font-bold text-white bg-rose-500 shadow-md shadow-rose-500/20"
                >
                  Create Free Account
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};
