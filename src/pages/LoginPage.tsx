import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { Compass, LogIn, Lock, Mail, CheckCircle2, Building2, User } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [authRole, setAuthRole] = useState<'traveller' | 'agency'>('traveller');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('home');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      <div className="glass-card rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl ai-gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to your Traveller account</p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <button
            onClick={() => setAuthRole('traveller')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'traveller'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Traveller Account
          </button>

          <button
            onClick={() => setAuthRole('agency')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'agency'
                ? 'bg-white dark:bg-gray-900 text-rose-500 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Agency Portal
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Login Successful!</h3>
            <p className="text-xs text-gray-500">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Google OAuth Option */}
            <button
              type="button"
              onClick={() => { setIsSuccess(true); setTimeout(() => onNavigate('home'), 1500); }}
              className="w-full py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase tracking-wider">or sign in with email</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <div>
              <label className="block font-bold mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-bold shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
                authRole === 'traveller' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-500 hover:bg-rose-600'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as {authRole === 'traveller' ? 'Traveller' : 'Agency Operator'}</span>
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="font-bold text-blue-600 dark:text-blue-400">
            Sign up now
          </button>
        </div>

      </div>

    </div>
  );
};
