import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ExternalLink,
  Store,
  CheckCircle2
} from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { DEFAULT_STAFF } from '../../services/adminState';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState('admin@freshit.in');
  const [password, setPassword] = useState('freshit2026');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check staff
    const match = DEFAULT_STAFF.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (match) {
      onLoginSuccess(match);
    } else {
      setErrorMsg('Invalid staff credentials. Click a quick login preset below.');
    }
  };

  const handleQuickLogin = (staff: AdminUser) => {
    onLoginSuccess(staff);
  };

  return (
    <div className="min-h-screen bg-[#0F3E22] flex flex-col justify-center items-center p-4 relative font-['Satoshi',sans-serif]">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#16A34A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-emerald-900/20 relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
            F
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-['Clash_Display',sans-serif] tracking-tight">
            Freshit Store Control Center
          </h2>
          <p className="text-xs text-slate-500">
            Authorized Kirana Staff & Management Portal · Chandrahati Hub
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Access Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to Admin Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Role Login Presets */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center font-['Clash_Display',sans-serif]">
            Quick Role Presets
          </span>

          <div className="grid grid-cols-3 gap-2">
            {DEFAULT_STAFF.slice(0, 3).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleQuickLogin(st)}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all cursor-pointer group"
              >
                <span className="block font-bold text-slate-900 text-[11px] truncate group-hover:text-[#16A34A]">
                  {st.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-500 block truncate font-medium">
                  {st.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back to Customer Storefront */}
        <div className="pt-2 text-center">
          <button
            onClick={onBackToStore}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
