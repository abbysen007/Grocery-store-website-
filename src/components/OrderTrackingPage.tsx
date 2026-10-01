import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bike, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Package, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Check, 
  HelpCircle, 
  Store, 
  Home, 
  Sparkles, 
  ShoppingBag, 
  RotateCcw 
} from 'lucide-react';
import { Order } from '../types';
import { PartnerChatModal } from './PartnerChatModal';
import { FreshitLogo } from './FreshitLogo';

interface OrderTrackingPageProps {
  order: Order | null;
  onBackToHome: () => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  order,
  onBackToHome,
  onCancelOrder,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(480); // 8 minutes
  const [activeStep, setActiveStep] = useState(2); // 0: Placed, 1: Packed, 2: Out for Delivery, 3: Delivered
  const [isItemsAccordionOpen, setIsItemsAccordionOpen] = useState(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [helpTopicModal, setHelpTopicModal] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!order || activeStep === 3) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order, activeStep]);

  // Simulated live step progression over time so user witnesses the experience
  useEffect(() => {
    const timer1 = setTimeout(() => {
      // automatically move forward if placed
      if (activeStep < 2) setActiveStep(2);
    }, 5000);

    return () => clearTimeout(timer1);
  }, [activeStep]);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-['Satoshi',sans-serif]">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-['Clash_Display',sans-serif] text-slate-800 mb-2">No active order found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          You don't have an ongoing delivery right now. Place an order to track it live in 8 minutes.
        </p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 rounded-xl bg-[#085E2B] text-white font-['Clash_Display',sans-serif] font-bold text-xs shadow-sm hover:bg-[#064821] cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const steps = [
    { title: 'Order Placed', desc: 'Received at dark store', time: '0m ago' },
    { title: 'Order Packed at Dark Store', desc: 'Safely packed & quality inspected', time: '2m ago' },
    { title: `Out for Delivery with ${order.deliveryPartner?.name || 'Vikram Singh'}`, desc: 'Rider is on electric scooter', time: 'Now' },
    { title: 'Delivered', desc: 'At your doorstep', time: 'In ~6 mins' },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-24 font-['Satoshi',sans-serif]">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <FreshitLogo size="sm" />

            <span className="h-4 w-px bg-slate-200 hidden sm:inline-block" />

            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block font-['Clash_Display',sans-serif]">
              Order #{order.id.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Action to order more or view status */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#121212] transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#085E2B]" />
            <span>Order More</span>
          </button>
        </div>
      </header>

      {/* Main Tracking Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Prominent Live Countdown Card */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 font-['Clash_Display',sans-serif]">
                  Live Grocery Dispatch
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white font-['Clash_Display',sans-serif]">
                  ⚡ 8 Mins Dark Store Network
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Clash_Display',sans-serif] tracking-tight text-white">
                {activeStep === 3
                  ? 'Order Delivered!'
                  : `Arriving in ${minutes}m ${seconds < 10 ? `0${seconds}` : seconds}s`}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1">
                {activeStep === 3
                  ? 'Hope you enjoy your fresh groceries!'
                  : `Delivery Partner Vikram Singh is heading to ${order.address.area}`}
              </p>
            </div>

            {/* Interactive Step Switcher to simulate milestones */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shrink-0">
              <span className="block text-[10px] uppercase font-bold text-emerald-300 mb-1.5 px-1 font-['Clash_Display',sans-serif]">
                Simulate Delivery Status
              </span>
              <div className="flex gap-1">
                {['Placed', 'Packed', 'On Way', 'Delivered'].map((label, idx) => (
                  <button
                    key={label}
                    onClick={() => {
                      setActiveStep(idx);
                      if (idx === 3) setSecondsRemaining(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                      activeStep === idx
                        ? 'bg-[#085E2B] text-white shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-emerald-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Map / Visual Route Tracker Container */}
        <div className="bg-white rounded-3xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#085E2B] flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                  Live GPS Route Tracker
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Raghunathpur Central Dark Store (PIN 712513) → {order.address.area}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#085E2B] border border-[#085E2B]/20 font-['Clash_Display',sans-serif]">
              Optimal Express Path
            </span>
          </div>

          {/* Visual Route Canvas */}
          <div className="relative w-full h-48 sm:h-56 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
            {/* Stylized Map Grid / Roads */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Simulated Road Path */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 60 140 Q 200 60, 380 120 T 700 90"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 60 140 Q 200 60, 380 120 T 700 90"
                fill="none"
                stroke="#085E2B"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Dark Store Node (Start) */}
            <div className="absolute left-6 sm:left-12 bottom-8 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold font-['Clash_Display',sans-serif] text-slate-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                Dark Store
              </span>
            </div>

            {/* Moving Delivery Scooter */}
            <motion.div
              animate={{
                x: activeStep === 0 ? -120 : activeStep === 1 ? -60 : activeStep === 2 ? 20 : 180,
                y: activeStep === 3 ? 0 : [0, -3, 0],
              }}
              transition={{ duration: 1.5, repeat: activeStep < 3 ? Infinity : 0 }}
              className="absolute z-10 flex flex-col items-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#085E2B] text-white flex items-center justify-center shadow-lg ring-4 ring-[#085E2B]/20">
                <Bike className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-[#121212] mt-1 bg-[#F5ECD5] px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap font-['Clash_Display',sans-serif]">
                {activeStep === 3 ? 'Delivered 🎉' : `${minutes} mins away`}
              </span>
            </motion.div>

            {/* Customer Home Node (Destination) */}
            <div className="absolute right-6 sm:right-12 top-8 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-[#F5ECD5] text-slate-900 flex items-center justify-center shadow-md ring-4 ring-amber-400/30">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold font-['Clash_Display',sans-serif] text-slate-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                Your Doorstep
              </span>
            </div>
          </div>
        </div>

        {/* 3. Delivery Partner Info Card & Stepper (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Partner Profile Card (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
              <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400">
                Your Delivery Partner
              </h3>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold font-['Clash_Display',sans-serif] text-xl flex items-center justify-center shadow-sm">
                  VS
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold font-['Clash_Display',sans-serif] text-base text-[#121212]">
                      {order.deliveryPartner?.name || 'Vikram Singh'}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                      ★ 4.9
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {order.deliveryPartner?.vehicleNumber || 'DL-03-EK-4819'} · Electric Scooter
                  </p>

                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ Verified EV Rider · 1,420+ Deliveries
                  </span>
                </div>
              </div>

              {/* Call & Chat Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href="tel:9876543210"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Connecting masked call with ${order.deliveryPartner?.name || 'Vikram'}...`);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#085E2B]" />
                  <span>Call Rider</span>
                </a>

                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#085E2B] font-bold text-xs border border-[#085E2B]/20 transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-black/[0.04] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 font-['Clash_Display',sans-serif]">
                <MapPin className="w-4 h-4 text-[#085E2B]" />
                <span>Delivering To: {order.address.label}</span>
              </div>
              <p className="text-slate-600 font-medium leading-snug pl-5">
                {order.address.address}
              </p>
            </div>
          </div>

          {/* Right Column: Status Stepper & Milestones (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
              <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400">
                Milestone Progress
              </h3>

              <div className="space-y-6 relative pl-6 border-l-2 border-emerald-200 ml-3">
                {steps.map((st, idx) => {
                  const isDone = idx <= activeStep;
                  const isCurrent = idx === activeStep;

                  return (
                    <div key={st.title} className="relative">
                      {/* Checkpoint Badge */}
                      <div
                        className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${
                          isDone ? 'bg-[#085E2B]' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <h4
                            className={`text-sm font-bold font-['Clash_Display',sans-serif] leading-tight ${
                              isCurrent
                                ? 'text-[#085E2B]'
                                : isDone
                                ? 'text-[#121212]'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {st.desc}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                          {st.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Ordered Items Summary Accordion */}
        <div className="bg-white rounded-3xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div
            onClick={() => setIsItemsAccordionOpen(!isItemsAccordionOpen)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#085E2B]" />
              <h3 className="text-sm sm:text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">
                Items in This Order ({order.items.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#085E2B] tabular-nums">
                ₹{order.grandTotal}
              </span>
              {isItemsAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </div>

          {/* Accordion Body */}
          <AnimatePresence>
            {isItemsAccordionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 mt-3 border-t border-slate-100 space-y-3"
              >
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100"
                        />
                        <div>
                          <span className="font-bold text-[#121212] block">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.product.weight}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold font-['Clash_Display',sans-serif] text-[#121212] tabular-nums">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Paid Bill Breakdown */}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{order.itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling Fee</span>
                    <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{order.handlingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-[#085E2B] font-['Clash_Display',sans-serif]">
                      {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                    </span>
                  </div>
                  {order.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Rider Tip</span>
                      <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{order.tip}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#121212]">
                    <span className="font-['Clash_Display',sans-serif]">Amount Paid via {order.paymentDetails?.providerTitle || 'Online'}</span>
                    <span className="text-[#085E2B] font-['Clash_Display',sans-serif]">₹{order.grandTotal}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Support & Help Options */}
        <div className="bg-white rounded-3xl border border-black/[0.04] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-3">
          <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400">
            Need Help with this Order?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'modify', label: 'I want to modify my order', icon: HelpCircle },
              { id: 'issue', label: 'Delivery or item issue', icon: AlertCircle },
              { id: 'cancel', label: 'Cancel order', icon: RotateCcw },
            ].map((topic) => {
              const IconComp = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setHelpTopicModal(topic.id)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-left font-['Clash_Display',sans-serif]"
                >
                  <IconComp className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rider Chat Modal */}
      <PartnerChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        partnerName={order.deliveryPartner?.name || 'Vikram Singh'}
        vehicleNumber={order.deliveryPartner?.vehicleNumber || 'DL-03-EK-4819'}
      />

      {/* Help Modal */}
      <AnimatePresence>
        {helpTopicModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpTopicModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 z-10"
            >
              <h3 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">
                {helpTopicModal === 'cancel'
                  ? 'Cancel Order'
                  : helpTopicModal === 'modify'
                  ? 'Modify Order Items'
                  : 'Report Delivery Issue'}
              </h3>

              <p className="text-xs text-slate-500 font-medium leading-relaxed font-['Satoshi',sans-serif]">
                {helpTopicModal === 'cancel'
                  ? 'Orders are dispatched within 2 minutes from the dark store. Are you sure you want to cancel this order?'
                  : helpTopicModal === 'modify'
                  ? 'Items are already packed at the Raghunathpur dark store. You can easily order extra items in another 8-minute delivery!'
                  : 'Our 24x7 customer support executive will review your order within 60 seconds and provide instant replacement or refund.'}
              </p>

              <div className="flex gap-2 pt-2">
                {helpTopicModal === 'cancel' ? (
                  <>
                    <button
                      onClick={() => setHelpTopicModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                    >
                      Keep Order
                    </button>
                    <button
                      onClick={() => {
                        onCancelOrder(order.id);
                        setHelpTopicModal(null);
                        onBackToHome();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Confirm Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setHelpTopicModal(null)}
                    className="w-full py-2.5 rounded-xl bg-[#085E2B] text-white text-xs font-bold"
                  >
                    Got it
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

