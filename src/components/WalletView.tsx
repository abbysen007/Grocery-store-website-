import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  ArrowLeft, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  CheckCircle2, 
  X,
  CreditCard
} from 'lucide-react';
import { UserWallet, WalletTransaction } from '../types';

interface WalletViewProps {
  wallet: UserWallet;
  onTopUp: (amount: number) => void;
  onBack: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  wallet,
  onTopUp,
  onBack,
}) => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(250);

  const handleConfirmTopUp = () => {
    onTopUp(topUpAmount);
    setIsTopUpOpen(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Freshit Money &amp; Wallet</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Instant 1-tap checkout balance &amp; cashback
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsTopUpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Top Up</span>
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-[#121212]/90 via-slate-900/90 to-emerald-950/90 backdrop-blur-xl border border-white/10 text-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#F5ECD5] font-bold block mb-1 font-['Clash_Display',sans-serif]">
              Total Active Balance
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-['Clash_Display',sans-serif] text-white tabular-nums">
              ₹{wallet.balance}
            </div>
            <span className="text-[11px] text-emerald-200 mt-1 block font-medium">
              Applicable automatically at 8-min grocery checkout
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white text-xs font-bold shadow-xs cursor-pointer transition-transform active:scale-95 font-['Clash_Display',sans-serif]"
            >
              + Add Money
            </button>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold font-['Clash_Display',sans-serif]">
              Promo Cashback
            </span>
            <span className="font-bold text-[#F5ECD5] text-sm tabular-nums font-['Clash_Display',sans-serif]">
              ₹{wallet.cashback}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold font-['Clash_Display',sans-serif]">
              Gift Card Credit
            </span>
            <span className="font-bold text-white text-sm tabular-nums font-['Clash_Display',sans-serif]">
              ₹{wallet.giftCards}
            </span>
          </div>
        </div>
      </div>

      {/* Perks Banner */}
      <div className="p-3.5 rounded-2xl bg-[#FEF8E7]/60 backdrop-blur-md border border-amber-300/60 text-xs text-amber-950 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="font-bold">
            Zero Payment Gateway Failures: 1-click checkout with Freshit Money
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-['Clash_Display',sans-serif]">
          Recent Wallet Activity
        </h3>

        <div className="space-y-2">
          {wallet.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 hover:bg-white/80 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'credit'
                      ? 'bg-emerald-100 text-[#085E2B]'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <span className="font-bold text-[#121212] block text-xs">
                    {tx.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {tx.date}
                  </span>
                </div>
              </div>

              <span
                className={`font-bold font-['Clash_Display',sans-serif] text-sm tabular-nums ${
                  tx.type === 'credit' ? 'text-[#085E2B]' : 'text-[#121212]'
                }`}
              >
                {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {isTopUpOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTopUpOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 space-y-4 z-10 font-['Satoshi',sans-serif]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Top Up Wallet</h3>
                <button
                  onClick={() => setIsTopUpOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                  Enter Amount
                </label>
                <div className="relative flex items-center h-12 rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#085E2B]">
                  <span className="pl-3.5 pr-1 font-bold text-slate-400 text-lg">₹</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full h-full px-2 text-base font-bold font-['Clash_Display',sans-serif] tabular-nums focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Quick Pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer font-['Clash_Display',sans-serif] ${
                      topUpAmount === amt
                        ? 'border-[#085E2B] bg-emerald-50 text-[#085E2B]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirmTopUp}
                className="w-full py-3 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs shadow-xs cursor-pointer transition-all font-['Clash_Display',sans-serif]"
              >
                Add ₹{topUpAmount} to Freshit Money
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
