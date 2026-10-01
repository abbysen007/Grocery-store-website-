import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bike, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Package, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onCancelOrder,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(480); // 8 minutes countdown
  const [activeStep, setActiveStep] = useState(2); // 0: placed, 1: packing, 2: on the way, 3: arrived

  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const steps = [
    { title: 'Order Placed', desc: 'Received at Freshit Sector 29 Dark Store' },
    { title: 'Order Packed', desc: 'Quality checked & packed safely' },
    { title: 'Out for Delivery', desc: 'Rider is on the way to your door' },
    { title: 'Arrived', desc: 'Delivery completed in 8 minutes' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 font-['Satoshi',sans-serif]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#121212] to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#085E2B] animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-['Clash_Display',sans-serif]">
                Live Delivery Tracking
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-2xl font-bold font-['Clash_Display',sans-serif] tracking-tight">
                  Arriving in {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Order #{order.id.slice(-6).toUpperCase()} · {order.items.length} items
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Live Progress Bar with moving rider */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-2 font-['Clash_Display',sans-serif]">
                <span>Dark Store #42</span>
                <span className="text-[#085E2B]">En Route</span>
                <span>Your Doorstep</span>
              </div>

              {/* Progress track */}
              <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[#085E2B] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(95, ((480 - secondsRemaining) / 480) * 100 + 20)}%` }}
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-[#085E2B] text-white flex items-center justify-center shrink-0">
                  <Bike className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <span className="font-bold text-[#121212] block">
                    Your rider is cruising through Sector 29
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Expected arrival before 8 minutes deadline
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#085E2B] text-white font-bold text-base flex items-center justify-center shadow-xs font-['Clash_Display',sans-serif]">
                  VS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#121212] font-['Clash_Display',sans-serif]">Vikram Singh</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F5ECD5] border border-[#E5D5AE] text-slate-900 text-[10px] font-bold">
                      ★ 4.9
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Electric Scooter · DL-03-EK-4819
                  </span>
                </div>
              </div>

              <a
                href="tel:9876543210"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#121212] hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#085E2B]" />
                <span>Call Rider</span>
              </a>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Clash_Display',sans-serif]">
                Delivery Milestones
              </h3>

              <div className="space-y-3 relative pl-6 border-l-2 border-emerald-200 ml-2">
                {steps.map((step, idx) => {
                  const isDone = idx <= activeStep;
                  const isCurrent = idx === activeStep;

                  return (
                    <div key={step.title} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          isDone ? 'bg-[#085E2B]' : 'bg-slate-300'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="text-left">
                        <span
                          className={`text-xs font-bold block ${
                            isCurrent
                              ? 'text-[#085E2B]'
                              : isDone
                              ? 'text-[#121212]'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title} {isCurrent && '· In progress'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items Preview */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#121212] font-['Clash_Display',sans-serif]">
                <span>Items in this Order ({order.items.length})</span>
                <span className="text-[#085E2B] font-bold tabular-nums">
                  Paid ₹{order.grandTotal}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-1.5 flex items-center justify-between text-slate-700"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-[#121212]">{item.quantity}x</span>
                      <span className="truncate">{item.product.name}</span>
                    </div>
                    <span className="font-bold text-[#121212] tabular-nums shrink-0 font-['Clash_Display',sans-serif]">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Location confirmation */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#085E2B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#121212] block">Delivery Address:</span>
                <span>{order.address.address}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
              >
                Back to Shopping
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this order?')) {
                    onCancelOrder(order.id);
                    onClose();
                  }
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
