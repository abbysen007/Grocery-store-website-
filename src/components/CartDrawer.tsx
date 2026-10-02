import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Bike, 
  Heart,
  ChevronRight,
  BellOff,
  DoorClosed,
  PhoneOff
} from 'lucide-react';
import { CartItem, UserAddress } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  currentAddress: UserAddress;
  onProceedToCheckout: (tipAmount: number, notes: string[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  currentAddress,
  onProceedToCheckout,
}) => {
  const [selectedTip, setSelectedTip] = useState<number>(10);
  const [activeInstructions, setActiveInstructions] = useState<string[]>([]);

  // Bill calculations
  const itemTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 149;
  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const deliveryFee = itemTotal === 0 ? 0 : isFreeDelivery ? 0 : 25;
  const handlingFee = itemTotal === 0 ? 0 : 4;
  const grandTotal = itemTotal + deliveryFee + handlingFee + selectedTip;

  const toggleInstruction = (instruction: string) => {
    setActiveInstructions((prev) =>
      prev.includes(instruction) ? prev.filter((i) => i !== instruction) : [...prev, instruction]
    );
  };

  const handleCheckout = () => {
    onProceedToCheckout(selectedTip, activeInstructions);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Slide-in Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white/85 backdrop-blur-2xl shadow-2xl flex flex-col justify-between border-l border-white/60"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#085E2B] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      My Cart
                    </h2>
                    <span className="text-xs text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      {items.length} {items.length === 1 ? 'item' : 'items'} in basket
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Clear Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {items.length === 0 ? (
                  /* Empty Cart State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold font-['Clash_Display',sans-serif] text-slate-800 mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mb-6 font-['Satoshi',sans-serif]">
                      Explore fresh groceries, daily pantry staples, snacks, and more delivered in 8 minutes.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#085E2B] text-white hover:bg-[#064821] font-['Clash_Display',sans-serif] font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Delivery ETA & Address Banner */}
                    <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#085E2B] text-white flex items-center justify-center shrink-0">
                          <Bike className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 font-['Clash_Display',sans-serif]">
                            <span>Delivery in {currentAddress.eta}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#085E2B]"></span>
                            <span className="text-[11px] font-semibold text-[#085E2B]">Superfast</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate max-w-[210px] font-['Satoshi',sans-serif]">
                            Ship to: {currentAddress.area}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Free Delivery Threshold Meter */}
                    <div className="p-3 rounded-2xl bg-[#F5ECD5]/40 border border-[#E7D7B5] text-xs">
                      {isFreeDelivery ? (
                        <div className="flex items-center gap-1.5 text-[#085E2B] font-bold font-['Clash_Display',sans-serif]">
                          <span>🎉 You unlocked FREE Delivery!</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5 font-['Satoshi',sans-serif]">
                            <span>Add ₹{freeDeliveryThreshold - itemTotal} more for FREE Delivery</span>
                            <span className="text-[#085E2B] font-['Clash_Display',sans-serif]">₹{itemTotal}/₹{freeDeliveryThreshold}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#085E2B] rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (itemTotal / freeDeliveryThreshold) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400">
                        Items in Basket
                      </h3>

                      {items.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-black/[0.04] hover:border-black/10 transition-colors bg-white shadow-freshit"
                        >
                          {/* Image */}
                          <div className="w-14 h-14 rounded-xl bg-slate-50 p-1.5 flex items-center justify-center shrink-0">
                            <img
                              src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                              alt={product.name}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold font-['Satoshi',sans-serif] text-[#121212] truncate">
                              {product.name}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium block font-['Satoshi',sans-serif]">
                              {product.weight}
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xs font-bold font-['Clash_Display',sans-serif] text-[#121212] tabular-nums">
                                ₹{product.price * quantity}
                              </span>
                              {quantity > 1 && (
                                <span className="text-[10px] text-slate-400 font-['Satoshi',sans-serif]">
                                  (₹{product.price} each)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center bg-[#085E2B] text-white rounded-xl px-1.5 py-0.5 shadow-2xs font-bold text-xs shrink-0">
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums font-['Clash_Display',sans-serif]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Instructions Chips */}
                    <div className="pt-2">
                      <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400 mb-2">
                        Delivery Instructions
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Leave at door', icon: DoorClosed },
                          { label: 'Avoid ringing bell', icon: BellOff },
                          { label: 'Do not call', icon: PhoneOff },
                        ].map((inst) => {
                          const IconComp = inst.icon;
                          const active = activeInstructions.includes(inst.label);
                          return (
                            <button
                              key={inst.label}
                              onClick={() => toggleInstruction(inst.label)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                active
                                  ? 'border-[#085E2B] bg-emerald-50 text-[#085E2B] font-bold'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                              }`}
                            >
                              <IconComp className="w-4 h-4 mb-1" />
                              <span className="text-[10px] leading-tight font-['Satoshi',sans-serif]">{inst.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tip for Delivery Partner */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-['Satoshi',sans-serif]">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>Tip your delivery partner</span>
                        </div>
                        <span className="text-[11px] text-slate-400">100% goes to partner</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[0, 10, 20, 30, 50].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setSelectedTip(amount)}
                            className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                              selectedTip === amount
                                ? 'border-[#085E2B] bg-[#085E2B] text-white shadow-2xs'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {amount === 0 ? 'No tip' : `₹${amount}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bill Details Breakdown */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <h3 className="font-bold text-[#121212] uppercase tracking-wide text-[11px] mb-2 font-['Clash_Display',sans-serif]">
                        Bill Details
                      </h3>

                      <div className="flex justify-between text-slate-600 font-['Satoshi',sans-serif]">
                        <span>Items Total</span>
                        <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{itemTotal}</span>
                      </div>

                      <div className="flex justify-between text-slate-600 font-['Satoshi',sans-serif]">
                        <span>Handling Charge</span>
                        <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{handlingFee}</span>
                      </div>

                      <div className="flex justify-between text-slate-600 font-['Satoshi',sans-serif]">
                        <span>Delivery Fee</span>
                        {deliveryFee === 0 ? (
                          <span className="font-bold text-[#085E2B] uppercase text-[11px] font-['Clash_Display',sans-serif]">
                            FREE
                          </span>
                        ) : (
                          <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{deliveryFee}</span>
                        )}
                      </div>

                      {selectedTip > 0 && (
                        <div className="flex justify-between text-slate-600 font-['Satoshi',sans-serif]">
                          <span>Delivery Partner Tip</span>
                          <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{selectedTip}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#121212]">
                        <span className="font-['Clash_Display',sans-serif]">To Pay</span>
                        <span className="text-[#085E2B] text-base tabular-nums font-['Clash_Display',sans-serif]">₹{grandTotal}</span>
                      </div>
                    </div>

                    {/* Cancellation Policy / Guarantee */}
                    <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-100/70 text-[11px] text-slate-500 font-['Satoshi',sans-serif]">
                      <ShieldCheck className="w-4 h-4 text-[#085E2B] shrink-0 mt-0.5" />
                      <span>
                        Guaranteed genuine groceries. No-questions-asked refund or exchange if you are not 100% satisfied.
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer with Sticky Proceed to Pay */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-white/75 backdrop-blur-xl shadow-lg">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-semibold text-[11px] font-['Satoshi',sans-serif]">Deliver to</span>
                      <span className="font-bold text-slate-800 truncate max-w-[220px] font-['Satoshi',sans-serif]">
                        {currentAddress.area}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-semibold text-[11px] font-['Satoshi',sans-serif]">Total</span>
                      <span className="font-bold text-lg text-[#121212] block tabular-nums leading-none font-['Clash_Display',sans-serif]">
                        ₹{grandTotal}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-sm flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Proceed to Pay (₹{grandTotal})</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
