import React, { useState } from 'react';
import { 
  Ticket, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ShoppingBag 
} from 'lucide-react';
import { Coupon } from '../types';
import { MOCK_COUPONS } from '../data/mockData';

interface CouponsViewProps {
  onApplyCoupon?: (coupon: Coupon) => void;
  onBack: () => void;
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  onApplyCoupon,
  onBack,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (coupon: Coupon) => {
    if (onApplyCoupon) onApplyCoupon(coupon);
    setAppliedCode(coupon.code);
    setTimeout(() => setAppliedCode(null), 3000);
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
            <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Offers &amp; Promo Codes</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Save more on every 8-minute grocery delivery
            </span>
          </div>
        </div>

        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F5ECD5]/30 text-amber-950 font-['Clash_Display',sans-serif]">
          {MOCK_COUPONS.length} Active
        </span>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {MOCK_COUPONS.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          const isApplied = appliedCode === coupon.code;

          return (
            <div
              key={coupon.id}
              className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:bg-white/80 transition-all flex flex-col justify-between"
            >
              {/* Top coupon header */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/40 border-b border-dashed border-amber-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-[#085E2B]" />
                    <span className="font-bold text-sm text-[#121212] tracking-wider font-['Clash_Display',sans-serif]">
                      {coupon.code}
                    </span>
                  </div>

                  {coupon.tag && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#085E2B] text-white font-['Clash_Display',sans-serif]">
                      {coupon.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#085E2B] font-['Clash_Display',sans-serif]">
                  {coupon.title}
                </h3>
              </div>

              {/* Coupon details */}
              <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {coupon.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Min order value: ₹{coupon.minOrderValue} · {coupon.expiryDate}
                  </p>
                </div>

                {/* Actions row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs py-1 cursor-pointer font-['Clash_Display',sans-serif]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#085E2B] stroke-[3]" />
                        <span className="text-[#085E2B]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleApply(coupon)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                      isApplied
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#085E2B] border border-emerald-200'
                    }`}
                  >
                    {isApplied ? 'Applied to Cart!' : 'Apply Code'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
