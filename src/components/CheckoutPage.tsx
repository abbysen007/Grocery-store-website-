import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  Bike, 
  Heart, 
  DoorClosed, 
  BellOff, 
  PhoneOff, 
  AlertCircle, 
  ChevronRight,
  Lock,
  Edit3
} from 'lucide-react';
import { CartItem, UserAddress } from '../types';
import { AddressEditModal } from './AddressEditModal';
import { FreshitLogo } from './FreshitLogo';

interface CheckoutPageProps {
  cartItems: CartItem[];
  cartCount: number;
  currentAddress: UserAddress;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onSelectAddress: (address: UserAddress) => void;
  onBackToShopping: () => void;
  onProceedToPayment: (tip: number, notes: string[]) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  cartCount,
  currentAddress,
  onUpdateQuantity,
  onSelectAddress,
  onBackToShopping,
  onProceedToPayment,
}) => {
  const [selectedTip, setSelectedTip] = useState<number>(10);
  const [activeInstructions, setActiveInstructions] = useState<string[]>(['Leave at door']);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Calculations
  const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 149;
  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const deliveryFee = itemTotal === 0 ? 0 : isFreeDelivery ? 0 : 25;
  const handlingFee = itemTotal === 0 ? 0 : 4;
  const grandTotal = itemTotal + deliveryFee + handlingFee + selectedTip;

  const toggleInstruction = (inst: string) => {
    setActiveInstructions((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const handleProceed = () => {
    onProceedToPayment(selectedTip, activeInstructions);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold font-['Clash_Display',sans-serif] text-slate-800 mb-2">
          Your cart is currently empty
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 font-['Satoshi',sans-serif]">
          Add fresh veggies, dairy staples, or snacks from the catalog to proceed with your 8-minute delivery.
        </p>
        <button
          onClick={onBackToShopping}
          className="px-6 py-3 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Explore Fresh Groceries
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-24 font-['Satoshi',sans-serif]">
      {/* 1. Simplified Checkout Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToShopping}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Back to Catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={onBackToShopping}
              className="cursor-pointer"
            >
              <FreshitLogo size="sm" />
            </button>

            <span className="h-4 w-px bg-slate-200 hidden sm:inline-block" />

            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block font-['Clash_Display',sans-serif]">
              Review &amp; Delivery
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 8-min badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-[#085E2B]/20 text-[11px] font-bold text-[#085E2B] font-['Clash_Display',sans-serif]">
              <span className="w-2 h-2 rounded-full bg-[#085E2B] animate-pulse"></span>
              <span>Delivery in {currentAddress.eta}</span>
            </div>

            {/* Secure indicator */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Lock className="w-3.5 h-3.5 text-[#085E2B]" />
              <span>256-bit Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Address, Items & Delivery Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Delivery Address Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#085E2B] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      Delivering to: <span className="text-[#085E2B]">{currentAddress.label}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Estimated arrival in {currentAddress.eta}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#085E2B] hover:text-[#064821] hover:underline cursor-pointer font-['Satoshi',sans-serif]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change / Edit</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white/40 backdrop-blur-xs border border-white/60 text-xs">
                <p className="font-bold text-slate-800 text-xs leading-snug">
                  {currentAddress.houseNo ? `${currentAddress.houseNo}, ` : ''}
                  {currentAddress.apartmentRoad ? `${currentAddress.apartmentRoad}, ` : ''}
                  {currentAddress.area}
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {currentAddress.landmark ? `Landmark: ${currentAddress.landmark} · ` : ''}
                  Receiver: {currentAddress.receiverName || 'Aarav Sharma'} (+91 {currentAddress.receiverPhone || '9876543210'})
                </p>
              </div>
            </div>

            {/* Cart Items Review Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212]">
                    Review Basket Items ({cartCount})
                  </h3>
                </div>
                <button
                  onClick={onBackToShopping}
                  className="text-xs font-bold text-[#085E2B] hover:underline cursor-pointer font-['Satoshi',sans-serif]"
                >
                  + Add More Items
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0 border border-slate-100">
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

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#121212] truncate">
                        {product.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {product.weight}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#085E2B] text-white rounded-xl px-1.5 py-0.5 shadow-2xs font-bold text-xs shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums font-['Clash_Display',sans-serif]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[65px]">
                      <span className="text-xs font-bold font-['Clash_Display',sans-serif] text-[#121212] tabular-nums block">
                        ₹{product.price * quantity}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through tabular-nums">
                          ₹{product.originalPrice * quantity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white rounded-2xl border border-black/[0.04] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400 mb-3">
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
                      type="button"
                      onClick={() => toggleInstruction(inst.label)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        active
                          ? 'border-[#085E2B] bg-emerald-50 text-[#085E2B] font-bold ring-1 ring-emerald-500/20'
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

            {/* Delivery Partner Tip */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#121212] font-['Satoshi',sans-serif]">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Tip your delivery partner</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  100% goes to rider
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 10, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedTip(amount)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                      selectedTip === amount
                        ? 'border-[#085E2B] bg-[#085E2B] text-white shadow-2xs'
                        : 'border-white/60 hover:bg-white/60 text-slate-700 bg-white/40'
                    }`}
                  >
                    {amount === 0 ? 'No tip' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Bill Details, Cancellation Policy & Sticky Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            
            {/* Bill Details Box */}
            <div className="bg-white/65 backdrop-blur-md rounded-2xl border border-white/70 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3">
              <h3 className="font-bold font-['Clash_Display',sans-serif] text-[#121212] text-sm pb-2 border-b border-slate-100">
                Bill Details
              </h3>

              <div className="flex justify-between text-xs text-slate-600 font-['Satoshi',sans-serif]">
                <span>Items Total</span>
                <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600 font-['Satoshi',sans-serif]">
                <span>Handling Charge</span>
                <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{handlingFee}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600 font-['Satoshi',sans-serif]">
                <div className="flex items-center gap-1">
                  <span>Delivery Fee</span>
                  {isFreeDelivery && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Free Tier
                    </span>
                  )}
                </div>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-[#085E2B] uppercase text-xs font-['Clash_Display',sans-serif]">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{deliveryFee}</span>
                )}
              </div>

              {selectedTip > 0 && (
                <div className="flex justify-between text-xs text-slate-600 font-['Satoshi',sans-serif]">
                  <span>Delivery Partner Tip</span>
                  <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">₹{selectedTip}</span>
                </div>
              )}

              {/* Free delivery threshold encouragement */}
              {!isFreeDelivery && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center justify-between">
                  <span>Add ₹{freeDeliveryThreshold - itemTotal} more for FREE delivery</span>
                  <button
                    onClick={onBackToShopping}
                    className="font-bold text-[#085E2B] hover:underline"
                  >
                    Shop more
                  </button>
                </div>
              )}

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide font-['Clash_Display',sans-serif]">
                    Grand Total
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-bold font-['Clash_Display',sans-serif] text-[#085E2B] tabular-nums">
                  ₹{grandTotal}
                </span>
              </div>

              {/* Primary CTA */}
              <button
                onClick={handleProceed}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-sm flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <span className="flex items-center gap-1 text-emerald-100">
                  <span>₹{grandTotal}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </span>
              </button>
            </div>

            {/* Cancellation Policy Notice */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 font-['Satoshi',sans-serif]">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Cancellation Policy</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Orders cannot be cancelled once packed for delivery by the dark store. In case of quality issues or missing items, full refund or replacement is guaranteed immediately at your door.
              </p>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center font-['Satoshi',sans-serif]">
              <ShieldCheck className="w-4 h-4 text-[#085E2B]" />
              <span>Certified 100% Genuine Groceries</span>
            </div>

          </div>

        </div>
      </div>

      {/* Address Edit / Add Modal */}
      <AddressEditModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addressToEdit={currentAddress}
        onSaveAddress={onSelectAddress}
      />
    </div>
  );
};

