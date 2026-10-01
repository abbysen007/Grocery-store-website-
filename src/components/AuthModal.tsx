import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, ShieldCheck, CheckCircle2, User, LogOut, Package, MapPin } from 'lucide-react';
import { FreshitLogo } from './FreshitLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userName?: string;
  userPhone?: string;
  onLogin: (name: string, phone: string) => void;
  onLogout: () => void;
  onViewOrders: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  userName,
  userPhone,
  onLogin,
  onLogout,
  onViewOrders,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [name, setName] = useState('Aarav Sharma');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['5', '8', '2', '0']);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name || 'Freshit Shopper', `+91 ${phoneNumber}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 font-['Satoshi',sans-serif]"
          >
            {/* Top Brand Banner */}
            <div className="p-6 bg-[#F5ECD5]/75 backdrop-blur-md border-b border-amber-300/60 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-800 hover:text-black rounded-full hover:bg-black/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <FreshitLogo size="md" />
              </div>
              <h2 className="text-xl font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-snug">
                India's 8-Minute Grocery App
              </h2>
              <p className="text-xs font-medium text-slate-800 mt-0.5">
                Log in or sign up to check out and track fast deliveries
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoggedIn ? (
                /* Profile & Account View */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-[#085E2B] text-white flex items-center justify-center font-bold text-lg font-['Clash_Display',sans-serif]">
                      {userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#121212] font-['Clash_Display',sans-serif]">{userName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{userPhone}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onViewOrders();
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-bold text-[#121212] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-[#085E2B]" />
                        <span className="font-['Clash_Display',sans-serif]">My Orders &amp; Live Tracking</span>
                      </div>
                      <span className="text-xs text-slate-400">View</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : step === 'phone' ? (
                /* Phone Number Step */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                      Mobile Number
                    </label>
                    <div className="flex items-center h-11 rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#085E2B] focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <span className="px-3 bg-slate-50 text-xs font-bold text-slate-600 border-r border-slate-200 h-full flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full h-full px-3 text-sm font-bold tracking-wider focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-sm shadow-sm transition-all cursor-pointer font-['Clash_Display',sans-serif]"
                  >
                    Continue with OTP
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#085E2B]" />
                    <span>Instant verification via SMS OTP</span>
                  </div>
                </form>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">
                      Enter the 4-digit verification code sent to
                    </p>
                    <p className="text-sm font-bold text-[#121212] mt-0.5 font-['Clash_Display',sans-serif]">
                      +91 {phoneNumber}
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newOtp = [...otp];
                          newOtp[idx] = val;
                          setOtp(newOtp);
                        }}
                        className="w-12 h-12 text-center text-xl font-bold font-['Clash_Display',sans-serif] rounded-xl border-2 border-[#085E2B] bg-emerald-50/40 focus:outline-hidden"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-sm shadow-sm transition-all cursor-pointer font-['Clash_Display',sans-serif]"
                  >
                    Verify & Login
                  </button>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Change Number
                    </button>
                    <span className="font-bold text-[#085E2B] cursor-pointer">Resend OTP</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
