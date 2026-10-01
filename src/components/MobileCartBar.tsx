import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface MobileCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="md:hidden fixed bottom-3 left-3 right-3 z-30"
        >
          <button
            onClick={onOpenCart}
            className="w-full h-14 bg-[#085E2B] hover:bg-[#064821] text-white rounded-2xl px-4 flex items-center justify-between shadow-xl ring-2 ring-emerald-900/30 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100 font-['Clash_Display',sans-serif]">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </div>
                <div className="text-base font-bold tabular-nums leading-tight font-['Clash_Display',sans-serif]">
                  ₹{cartTotal}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-sm font-['Clash_Display',sans-serif]">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
