import React, { useState } from 'react';
import type { PageRoute, AdminTab } from '../types';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  CreditCard, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  Download,
  AlertCircle
} from 'lucide-react';

interface AdminPanelPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Agency Verification State
  const [agencies, setAgencies] = useState([
    { id: 'AGY-101', name: 'Himalayan Footprints', owner: 'Vikram Dorjee', region: 'Sikkim', status: 'APPROVED', gstin: '11AAAAA0000A1Z5' },
    { id: 'AGY-102', name: 'Kanchenjunga Local Escapes', owner: 'Karma Sherpa', region: 'Sikkim', status: 'APPROVED', gstin: '11BBBBB0000B1Z2' },
    { id: 'AGY-103', name: 'Shimla Snow Line Travels', owner: 'Rajesh Sharma', region: 'Shimla', status: 'PENDING_REVIEW', gstin: '02CCCCC0000C1Z8' },
  ]);

  const handleApproveAgency = (id: string) => {
    setAgencies(agencies.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a)));
  };

  const handleRejectAgency = (id: string) => {
    setAgencies(agencies.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a)));
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Platform Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'verify-agencies', label: 'Verify Agencies (KYC)', icon: <UserCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'users', label: 'Manage Users', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { id: 'bookings-escrow', label: 'Bookings & Escrow', icon: <CreditCard className="w-4 h-4 text-amber-400" /> },
    { id: 'reports', label: 'Financial Reports', icon: <BarChart3 className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-5 space-y-6 flex-shrink-0">
        
        {/* Admin Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-white truncate">Super Admin</h4>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">Global Platform Control</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit to Main Website
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white capitalize">
              Admin Portal — {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Admin System Mode
            </span>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-64 bg-slate-950 p-5 space-y-6 flex flex-col justify-between border-r border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Admin Control</span>
                  <button onClick={() => setMobileSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${
                        activeTab === item.id ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-xs text-slate-400">
                <LogOut className="w-4 h-4" /> Main Website
              </button>
            </div>
          </div>
        )}

        {/* MAIN PANEL VIEWS */}
        <main className="p-4 sm:p-8 space-y-8 flex-grow overflow-y-auto">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Platform GMV</span>
                  <div className="text-3xl font-black text-white">₹48.5L</div>
                  <span className="text-[11px] text-emerald-400 font-semibold block">+24% vs last month</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Platform 10% Fee Earned</span>
                  <div className="text-3xl font-black text-purple-400">₹4.85L</div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Net Revenue</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Verified Agencies</span>
                  <div className="text-3xl font-black text-white">52</div>
                  <span className="text-[11px] text-blue-400 font-semibold block">Sikkim & Shimla Pilots</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">Escrow Held</span>
                  <div className="text-3xl font-black text-amber-400">₹8.40L</div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Razorpay Protected</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">System Actions Needing Attention</h3>
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">1 Pending Agency KYC Application</span>
                      <span className="text-[11px] text-slate-400">Shimla Snow Line Travels submitted GSTIN & Tourism License</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('verify-agencies')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
                  >
                    Review Application
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 2. VERIFY AGENCIES */}
          {activeTab === 'verify-agencies' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Agency KYC Verification Portal</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">Agency ID</th>
                        <th className="pb-3">Agency Name</th>
                        <th className="pb-3">Owner</th>
                        <th className="pb-3">Region</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {agencies.map((agency) => (
                        <tr key={agency.id}>
                          <td className="py-3 font-mono text-slate-400">{agency.id}</td>
                          <td className="py-3 font-bold text-white">{agency.name}</td>
                          <td className="py-3 text-slate-300">{agency.owner}</td>
                          <td className="py-3 text-slate-300">{agency.region}</td>
                          <td className="py-3">
                            {agency.status === 'APPROVED' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                Approved
                              </span>
                            )}
                            {agency.status === 'PENDING_REVIEW' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                Pending KYC
                              </span>
                            )}
                            {agency.status === 'REJECTED' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-2">
                            {agency.status === 'PENDING_REVIEW' && (
                              <>
                                <button
                                  onClick={() => handleApproveAgency(agency.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectAgency(agency.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {agency.status === 'APPROVED' && (
                              <span className="text-[11px] text-slate-500">Verified</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Platform Users & Roles</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-bold text-white block">Rohan Verma</span>
                    <span className="text-[10px] text-slate-400">rohan@example.com • Traveller</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Active</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-bold text-white block">Vikram Dorjee (Himalayan Footprints)</span>
                    <span className="text-[10px] text-slate-400">vikram@himalayan.com • Agency Owner</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. BOOKINGS & ESCROW */}
          {activeTab === 'bookings-escrow' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Razorpay Escrow Operations</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-blue-400 font-bold block">TRV-2026-SK892</span>
                    <p className="text-slate-300">Traveller: Rohan Verma • Agency: Himalayan Footprints</p>
                    <span className="text-[10px] text-slate-400 block pt-1">Amount: ₹42,000 (Escrow Held)</span>
                  </div>
                  <button
                    onClick={() => alert('Razorpay Escrow Released to Agency Wallet!')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500"
                  >
                    Release Escrow
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Platform Financial Reports</h2>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl">
                  <div>
                    <span className="font-bold text-white block">August 2026 Revenue Report</span>
                    <span className="text-[10px] text-slate-400">GMV: ₹48,500,000 • Platform Fee: ₹4,850,000</span>
                  </div>
                  <button
                    onClick={() => alert('Exporting CSV Financial Report...')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
