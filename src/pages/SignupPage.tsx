import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { UserCheck, User, Building2, CheckCircle2 } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [role, setRole] = useState<'traveller' | 'agency'>('traveller');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    region: 'Sikkim & Gangtok',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate(role === 'agency' ? 'become-agency' : 'ai-planner');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      
      <div className="glass-card rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl ai-gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-gray-500">Join Traveller Marketplace today</p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <button
            onClick={() => setRole('traveller')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'traveller'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Traveller
          </button>

          <button
            onClick={() => setRole('agency')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'agency'
                ? 'bg-white dark:bg-gray-900 text-rose-500 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Travel Agency
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Created!</h3>
            <p className="text-xs text-gray-500">Redirecting to setup...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
              />
            </div>

            {role === 'agency' && (
              <div>
                <label className="block font-bold mb-1">Agency / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Himalayan Footprints Tours"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-bold shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
                role === 'traveller' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>Complete {role === 'traveller' ? 'Traveller' : 'Agency'} Signup</span>
            </button>

          </form>
        )}

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-bold text-blue-600 dark:text-blue-400">
            Sign in
          </button>
        </div>

      </div>

    </div>
  );
};
