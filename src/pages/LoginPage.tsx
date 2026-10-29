import React, { useState } from 'react';
import type { PageRoute } from '../types';
import { Compass, LogIn, Lock, Mail, CheckCircle2, Building2, User, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { PortalRole } from '../services/apiClient';

interface LoginPageProps {
  onNavigate: (route: PageRoute) => void;
  initialRole?: PortalRole;
  returnRoute?: PageRoute;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialRole = 'traveller', returnRoute }) => {
  const { login } = useAuth();
  const [authRole, setAuthRole] = useState<PortalRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(authRole, { email, password });
      setIsSuccess(true);
      setTimeout(() => {
        if (returnRoute) {
          onNavigate(returnRoute);
        } else if (authRole === 'traveller') {
          onNavigate('traveller-dashboard');
        } else if (authRole === 'agency') {
          onNavigate('agency-dashboard');
        } else {
          onNavigate('admin-panel');
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
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
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <button
            type="button"
            onClick={() => { setAuthRole('traveller'); setErrorMsg(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'traveller'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Traveller
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('agency'); setErrorMsg(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'agency'
                ? 'bg-white dark:bg-gray-900 text-rose-500 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Agency
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('admin'); setErrorMsg(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'admin'
                ? 'bg-white dark:bg-gray-900 text-purple-500 shadow-md'
                : 'text-gray-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Login Successful!</h3>
            <p className="text-xs text-gray-500">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl text-white font-bold shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authRole === 'traveller'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : authRole === 'agency'
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {loading
                  ? 'Signing in...'
                  : `Sign In as ${
                      authRole === 'traveller' ? 'Traveller' : authRole === 'agency' ? 'Agency Operator' : 'Admin'
                    }`}
              </span>
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
