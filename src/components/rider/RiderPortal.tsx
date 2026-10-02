import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight,
  Store,
  DollarSign,
  User,
  Power,
  RotateCcw,
  ExternalLink,
  X,
  Volume2,
  Check
} from 'lucide-react';
import { Order } from '../../types';
import { DeliveryPartner } from '../../types/admin';
import { AdminDataService } from '../../services/adminState';

interface RiderPortalProps {
  onBackToStore: () => void;
  onOpenAdmin?: () => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
}

export const RiderPortal: React.FC<RiderPortalProps> = ({
  onBackToStore,
  onOpenAdmin,
  orders,
  onUpdateOrders,
}) => {
  // Load registered fleet riders
  const [riders, setRiders] = useState<DeliveryPartner[]>(() => AdminDataService.getRiders());
  
  // Currently active rider logged in
  const [activeRiderId, setActiveRiderId] = useState<string>(() => {
    return riders[0]?.id || 'rider-01';
  });

  const activeRider = useMemo(() => {
    return riders.find((r) => r.id === activeRiderId) || riders[0];
  }, [riders, activeRiderId]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'queue' | 'active' | 'completed'>('active');

  // Helpers for polymorphic order/address fields
  const getOrderTotal = (o: Order) => o.grandTotal ?? o.total ?? 0;
  const getOrderDate = (o: Order) => o.date ?? o.createdAt ?? 'Today';
  const getCustomerName = (o: Order) => o.address?.receiverName ?? o.address?.name ?? 'Customer';
  const getPaymentMethod = (o: Order) => o.paymentDetails?.method ?? o.paymentMethod ?? 'Online UPI';
  const isCodOrder = (o: Order) => {
    const m = String(getPaymentMethod(o)).toLowerCase();
    return m.includes('cash') || m.includes('cod');
  };

  // Confirmation Modal state for completing delivery
  const [deliveringOrder, setDeliveringOrder] = useState<Order | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [codCollected, setCodCollected] = useState(false);

  // Reassign Modal state
  const [reassignOrder, setReassignOrder] = useState<Order | null>(null);
  const [reassignReason, setReassignReason] = useState('Vehicle breakdown');

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Toggle Rider Online / Offline Shift
  const handleToggleShift = () => {
    const nextAvail = activeRider.availability === 'online' ? 'offline' : 'online';
    const updated = riders.map((r) =>
      r.id === activeRider.id ? { ...r, availability: nextAvail as any } : r
    );
    setRiders(updated);
    AdminDataService.saveRiders(updated);
    AdminDataService.logActivity(
      'Rider Shift Status',
      activeRider.id,
      `${activeRider.name} switched shift to ${nextAvail.toUpperCase()}`,
      'rider'
    );
    showToast(`${activeRider.name} is now ${nextAvail === 'online' ? 'ONLINE (Ready for Dispatches)' : 'OFFLINE (On Break)'}`);
  };

  // Orders in transit for THIS rider
  const riderActiveOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === 'on_the_way' || o.status === 'packing') &&
        o.deliveryPartner?.name === activeRider?.name
    );
  }, [orders, activeRider]);

  // Incoming / Available orders waiting to be accepted by rider
  const availableQueueOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === 'placed' || o.status === 'packing') &&
        (!o.deliveryPartner || o.deliveryPartner.name === activeRider?.name)
    );
  }, [orders, activeRider]);

  // Completed orders by THIS rider
  const riderCompletedOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === 'delivered' &&
        (o.deliveryPartner?.name === activeRider?.name || !o.deliveryPartner)
    );
  }, [orders, activeRider]);

  // Accept an assigned or queued delivery
  const handleAcceptDelivery = (order: Order) => {
    if (activeRider.availability === 'offline') {
      showToast('Please toggle your status to ONLINE first to accept orders!');
      return;
    }

    const updated = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'on_the_way' as const,
          etaMinutes: 6,
          deliveryPartner: {
            name: activeRider.name,
            phone: activeRider.phone,
            vehicleNumber: activeRider.vehicleNumber,
            rating: activeRider.rating,
          },
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    AdminDataService.saveOrders(updated);
    AdminDataService.logActivity(
      'Delivery Accepted by Rider',
      order.id,
      `Order #${order.id} accepted by ${activeRider.name} (${activeRider.vehicleNumber})`,
      'rider'
    );
    showToast(`Accepted Order #${order.id}! Route navigation is ready.`);
    setActiveTab('active');
  };

  // Update trip milestone
  const handleUpdateMilestone = (orderId: string, milestone: string) => {
    showToast(milestone);
    AdminDataService.logActivity(
      'Delivery Milestone',
      orderId,
      `${activeRider.name}: ${milestone}`,
      'rider'
    );
  };

  // Open Confirm Delivery Modal
  const handleOpenConfirmDelivery = (order: Order) => {
    setDeliveringOrder(order);
    setEnteredOtp('');
    setOtpError('');
    setCodCollected(!isCodOrder(order));
  };

  // Finalize delivery confirmation
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringOrder) return;

    // Verify OTP (default verification code is last 4 digits of order id or 1234 or empty)
    const expectedOtp = deliveringOrder.id.replace(/\D/g, '').slice(-4) || '1234';
    if (enteredOtp.trim() && enteredOtp.trim() !== expectedOtp && enteredOtp.trim() !== '1234') {
      setOtpError(`Invalid customer handover OTP. Expected demo code: ${expectedOtp}`);
      return;
    }

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const updated: Order[] = orders.map((o) => {
      if (o.id === deliveringOrder.id) {
        return {
          ...o,
          status: 'delivered' as const,
          etaMinutes: 0,
          deliveredAt: now,
          paymentDetails: o.paymentDetails
            ? { ...o.paymentDetails, status: 'successful' as const }
            : undefined,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    AdminDataService.saveOrders(updated);

    // Update rider completed deliveries count
    const updatedRiders = riders.map((r) => {
      if (r.id === activeRider.id) {
        return {
          ...r,
          completedDeliveries: r.completedDeliveries + 1,
          currentDeliveryStatus: 'idle' as const,
        };
      }
      return r;
    });
    setRiders(updatedRiders);
    AdminDataService.saveRiders(updatedRiders);

    AdminDataService.logActivity(
      'Delivery Completed',
      deliveringOrder.id,
      `Handover verified by ${activeRider.name}. Order #${deliveringOrder.id} marked DELIVERED at ${now}.`,
      'rider'
    );

    showToast(`🎉 Order #${deliveringOrder.id} delivered successfully! ₹${45 + (deliveringOrder.tip || 0)} payout credited.`);
    setDeliveringOrder(null);
  };

  // Handle reassigning / rejecting an order due to emergency
  const handleReassignOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignOrder) return;

    const updated = orders.map((o) => {
      if (o.id === reassignOrder.id) {
        return {
          ...o,
          status: 'placed' as const,
          deliveryPartner: undefined,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    AdminDataService.saveOrders(updated);
    AdminDataService.logActivity(
      'Order Reassigned by Rider',
      reassignOrder.id,
      `${activeRider.name} returned Order #${reassignOrder.id} to dispatch hub pool. Reason: ${reassignReason}`,
      'rider'
    );
    showToast(`Order #${reassignOrder.id} returned to Dark Store dispatch hub.`);
    setReassignOrder(null);
  };

  // Shift earnings calculation
  const todayEarnings = useMemo(() => {
    const basePay = riderCompletedOrders.length * 45; // ₹45 per 8-min drop
    const tips = riderCompletedOrders.reduce((sum, o) => sum + (o.tip || 0), 0);
    return {
      basePay,
      tips,
      total: basePay + tips,
    };
  }, [riderCompletedOrders]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Satoshi',sans-serif] flex flex-col selection:bg-[#085E2B] selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Rider Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#085E2B] to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Clash_Display',sans-serif] font-bold text-sm sm:text-base text-white tracking-tight">
                    Freshit Rider Express
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Fleet Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Dark Store Hub: Kuntighat - Magra Rd (25 km Geofence)
                </p>
              </div>
            </div>

            {/* Quick Mobile Back */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={onBackToStore}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Storefront
              </button>
            </div>
          </div>

          {/* Center/Right: Rider Identity & Controls */}
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Rider Selector */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={activeRiderId}
                onChange={(e) => setActiveRiderId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-hidden cursor-pointer"
              >
                {riders.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name} ({r.vehicleType})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-0.5 text-amber-400 text-[11px] font-bold pl-1 border-l border-slate-700">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{activeRider.rating}</span>
              </div>
            </div>

            {/* Online / Offline Shift Toggle */}
            <button
              onClick={handleToggleShift}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRider.availability === 'online'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{activeRider.availability === 'online' ? 'Online (Active)' : 'Offline (Break)'}</span>
            </button>

            {/* Switch to Store or Admin */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={onBackToStore}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Customer Store
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dispatch</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Rider KPI Dashboard Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Deliveries Today
              </span>
              <span className="text-base font-bold font-['Clash_Display',sans-serif] text-white">
                {riderCompletedOrders.length} Drops
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Today's Payout
              </span>
              <span className="text-base font-bold font-['Clash_Display',sans-serif] text-emerald-400">
                ₹{todayEarnings.total}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Average ETA
              </span>
              <span className="text-base font-bold font-['Clash_Display',sans-serif] text-blue-300">
                7.4 Mins
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Customer Rating
              </span>
              <span className="text-base font-bold font-['Clash_Display',sans-serif] text-amber-300">
                {activeRider.rating} ★ (100% On-Time)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Active Trips</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-black/40">
              {riderActiveOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Hub Dispatch Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-black/40">
              {availableQueueOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Delivered History</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-black/40">
              {riderCompletedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Tab Contents */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex-1">
        {/* ACTIVE TRIPS TAB */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {riderActiveOrders.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <Bike className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white font-['Clash_Display',sans-serif]">
                  No active delivery trip in progress
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You are currently idle and ready for new drops. Check the Hub Dispatch Queue to accept incoming orders!
                </p>
                {availableQueueOrders.length > 0 && (
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950"
                  >
                    <span>View {availableQueueOrders.length} Available Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {riderActiveOrders.map((order) => {
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${order.address.address}, ${order.address.area}, ${order.address.city} ${order.address.pincode}`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl border-b border-l border-emerald-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span>Live Delivery · ETA {order.etaMinutes || 6} mins</span>
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-['Clash_Display',sans-serif] text-lg font-bold text-white">
                              Order #{order.id}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                              ₹{getOrderTotal(order)}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Placed at {getOrderDate(order)} · {order.items.length} items ({order.items.reduce((s, i) => s + i.quantity, 0)} units)
                          </span>
                        </div>
                      </div>

                      {/* Customer & Address Details */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-slate-200">
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>{getCustomerName(order)}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-normal">
                              {order.address.label}
                            </span>
                          </div>

                          <a
                            href={`tel:${order.address.phone}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>Call Customer</span>
                          </a>
                        </div>

                        <div className="flex items-start gap-2 text-slate-300 pt-1 border-t border-slate-800/80">
                          <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="leading-snug">
                            <p className="font-medium">{order.address.address}</p>
                            <p className="text-[11px] text-slate-400">
                              {order.address.area}, {order.address.city} - {order.address.pincode}
                            </p>
                          </div>
                        </div>

                        {/* Navigation Button */}
                        <div className="pt-1">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-950 transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Open Live GPS Navigation (Google Maps)</span>
                            <ExternalLink className="w-3 h-3 text-blue-200 ml-1" />
                          </a>
                        </div>
                      </div>

                      {/* Items Overview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Bag Contents ({order.items.length} products):
                        </span>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-xs">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-slate-300 py-0.5 border-b border-slate-800/40 text-[11px]"
                            >
                              <span className="truncate max-w-[200px]">
                                {item.product.name} ({item.product.weight})
                              </span>
                              <span className="font-bold text-slate-200">
                                {item.quantity}x · ₹{item.product.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Milestone progression buttons */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateMilestone(order.id, 'Arrived at Store Hub - Picking package')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Store className="w-3 h-3 text-amber-400" />
                          <span>At Store Hub</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateMilestone(order.id, 'Order picked up from Hub - In transit to customer')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Bike className="w-3 h-3 text-emerald-400" />
                          <span>Out for Delivery</span>
                        </button>
                      </div>

                      {/* Primary Actions: Confirm Handover / Reassign */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setReassignOrder(order)}
                          className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Emergency Reassign</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenConfirmDelivery(order)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#085E2B] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Confirm Handover & Deliver</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* HUB DISPATCH QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Clash_Display',sans-serif]">
                  Dark Store Dispatch Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Ready orders from Kuntighat - Magra Rd store within active 25 km geofence
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-1 rounded-lg">
                {availableQueueOrders.length} Ready to Dispatch
              </span>
            </div>

            {availableQueueOrders.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">All orders dispatched!</h4>
                <p className="text-xs text-slate-400">
                  New orders from nearby Hooghly customers will appear here the instant they check out.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableQueueOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-3.5 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-['Clash_Display',sans-serif] font-bold text-sm text-white">
                            Order #{order.id}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {order.items.length} items · ₹{getOrderTotal(order)}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                          {order.status === 'packing' ? 'Packing at Hub' : 'Ready for Pick'}
                        </span>
                      </div>

                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{getCustomerName(order)}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {order.address.address}, {order.address.area}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between pt-1 border-t border-slate-800">
                          <span>Payment: {getPaymentMethod(order)}</span>
                          <span>Delivery: 8 Mins</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptDelivery(order)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Accept Delivery Assignment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DELIVERED HISTORY TAB */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Clash_Display',sans-serif]">
                  Completed Deliveries Today
                </h3>
                <p className="text-xs text-slate-400">
                  {riderCompletedOrders.length} completed drops · ₹{todayEarnings.total} earned
                </p>
              </div>
            </div>

            {riderCompletedOrders.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <Package className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No deliveries completed yet today</h4>
                <p className="text-xs text-slate-400">
                  Completed orders will show your drop confirmation, tips, and timestamps here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {riderCompletedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['Clash_Display',sans-serif] font-bold text-sm text-white">
                          Order #{order.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          at {order.deliveredAt || order.createdAt}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium">
                        {getCustomerName(order)} · {order.address.address}, {order.address.area}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        {order.items.length} items · Total ₹{getOrderTotal(order)} · {getPaymentMethod(order)}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <span className="text-slate-400 text-[11px]">Rider Payout:</span>
                      <span className="text-base font-bold font-['Clash_Display',sans-serif] text-emerald-400">
                        +₹{45 + (order.tip || 0)}
                      </span>
                      {order.tip && order.tip > 0 && (
                        <span className="text-[10px] text-amber-300 font-semibold">
                          (incl. ₹{order.tip} customer tip)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. CONFIRM DELIVERY MODAL */}
      {deliveringOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDelivery}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-['Clash_Display',sans-serif]">
                  Confirm Customer Handover
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeliveringOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-slate-200">
                <span>Order #{deliveringOrder.id}</span>
                <span>₹{getOrderTotal(deliveringOrder)}</span>
              </div>
              <p className="text-slate-400">
                Customer: <strong className="text-slate-200">{getCustomerName(deliveringOrder)}</strong> ({deliveringOrder.address.phone})
              </p>
              <p className="text-slate-400">
                Drop: {deliveringOrder.address.address}, {deliveringOrder.address.area}
              </p>
            </div>

            {/* If Cash on Delivery, prompt cash collection */}
            {isCodOrder(deliveringOrder) && (
              <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-600/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Cash on Delivery (COD) Collection</span>
                </div>
                <p className="text-amber-200/90 text-[11px]">
                  Please collect exact cash from customer before handing over the Freshit grocery bag:
                </p>
                <div className="text-xl font-bold font-['Clash_Display',sans-serif] text-white">
                  Collect ₹{getOrderTotal(deliveringOrder)}
                </div>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codCollected}
                    onChange={(e) => setCodCollected(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    I have received ₹{getOrderTotal(deliveringOrder)} cash in full
                  </span>
                </label>
              </div>
            )}

            {/* Handover OTP Verification */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Customer Handover 4-Digit PIN / OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value);
                  setOtpError('');
                }}
                placeholder="Enter 4-digit code (or 1234)"
                className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-widest text-lg font-bold focus:border-emerald-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-500 block">
                Verification demo PIN: <strong>{deliveringOrder.id.replace(/\D/g, '').slice(-4) || '1234'}</strong> (or 1234)
              </span>
              {otpError && (
                <p className="text-xs text-rose-400 font-semibold">{otpError}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeliveringOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCodOrder(deliveringOrder) && !codCollected}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Complete Delivery</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. EMERGENCY REASSIGN MODAL */}
      {reassignOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReassignOrder}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Clash_Display',sans-serif]">
                  Reassign Order to Store Hub
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReassignOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Need to surrender Order #{reassignOrder.id}? It will be returned immediately to the Kuntighat - Magra Rd dark store queue for another rider to fulfill.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400">
                Reason for Reassignment:
              </label>
              <select
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200"
              >
                <option value="Vehicle breakdown / flat tyre">Vehicle breakdown / flat tyre</option>
                <option value="Severe waterlogging / roadblock">Severe waterlogging / roadblock</option>
                <option value="Customer unreachable on phone">Customer unreachable on phone</option>
                <option value="Medical emergency">Medical emergency</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setReassignOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-950"
              >
                Confirm Reassign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
