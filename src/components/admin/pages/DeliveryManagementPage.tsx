import React, { useState } from 'react';
import {
  Navigation,
  Bike,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Phone,
  ShieldCheck,
  Search,
  ChevronRight,
  X
} from 'lucide-react';
import { Order } from '../../../types';
import { DeliveryPartner } from '../../../types/admin';

interface DeliveryManagementPageProps {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  riders: DeliveryPartner[];
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const DeliveryManagementPage: React.FC<DeliveryManagementPageProps> = ({
  orders,
  onUpdateOrders,
  riders,
  onLogAction,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'unassigned'>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Deliveries categorized
  const activeDeliveries = orders.filter((o) => o.status === 'on_the_way');
  const unassignedOrders = orders.filter((o) => (o.status === 'placed' || o.status === 'packing') && !o.deliveryPartner);
  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  const displayedList =
    activeTab === 'active'
      ? activeDeliveries
      : activeTab === 'unassigned'
      ? unassignedOrders
      : completedDeliveries;

  // Assign or Reassign Rider
  const handleAssignRider = (orderId: string, rider: DeliveryPartner) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'on_the_way' as Order['status'],
          deliveryPartner: {
            name: rider.name,
            phone: rider.phone,
            vehicleNumber: rider.vehicleNumber,
            rating: rider.rating,
          },
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: 'on_the_way',
        deliveryPartner: {
          name: rider.name,
          phone: rider.phone,
          vehicleNumber: rider.vehicleNumber,
          rating: rider.rating,
        },
      });
    }

    setIsReassignOpen(false);
    if (onLogAction) {
      onLogAction('Rider Assigned in Dispatch', orderId, `Dispatched to ${rider.name}`);
    }
    showToast(`Order #${orderId} dispatched to ${rider.name}`);
  };

  // Mark Order Delivered
  const handleMarkDelivered = (orderId: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'delivered' as Order['status'], etaMinutes: 0 } : o));
    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'delivered', etaMinutes: 0 });
    }
    if (onLogAction) {
      onLogAction('Delivery Marked Completed', orderId, 'Confirmed delivery at doorstep');
    }
    showToast(`Order #${orderId} marked as DELIVERED successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-['Clash_Display',sans-serif] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Geofence Status Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#16A34A] animate-ping" />
            <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              Live 25 km Geofence Dispatch Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Flagship Hub: Kuntighat - Magra Rd, Naya Sarai (WB 712513) · Target 8-minute SLA
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {[
            { id: 'active', label: `Active In-Transit (${activeDeliveries.length})` },
            { id: 'unassigned', label: `Unassigned (${unassignedOrders.length})` },
            { id: 'completed', label: `Delivered Today (${completedDeliveries.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Trip Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Trips List */}
        <div className="lg:col-span-2 space-y-3">
          {displayedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              No {activeTab} delivery trips at this moment.
            </div>
          ) : (
            displayedList.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-2xl border p-4.5 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-[#16A34A] border-transparent' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        #{order.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 uppercase">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mt-1">
                      {order.address?.area} ({order.address?.label})
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {order.address?.address}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>{order.items.length} items (₹{order.grandTotal})</span>
                      <span>•</span>
                      <span>ETA: {order.etaMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                  {order.deliveryPartner ? (
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {order.deliveryPartner.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {order.deliveryPartner.vehicleNumber}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                        setIsReassignOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
                    >
                      Dispatch Rider
                    </button>
                  )}

                  {order.status === 'on_the_way' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkDelivered(order.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#15803D] hover:bg-emerald-100 font-bold text-[11px]"
                    >
                      Confirm Drop
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Live Hub & 25 km Geofence Map Simulation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span>Chandrahati Hub 25 km Geofence</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#15803D] border border-emerald-200">
              Active Geofence
            </span>
          </div>

          <div className="h-48 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
            <iframe
              title="Hub Map"
              width="100%"
              height="100%"
              loading="lazy"
              src="https://maps.google.com/maps?q=22.993125,88.385500&hl=en&z=12&output=embed"
              className="w-full h-full border-0"
            />
            <div className="absolute top-2 left-2 bg-[#14532D] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>25 km Delivery Radius Zone</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between pb-1 border-b border-slate-100">
              <span>Dark Store Pincode:</span>
              <span className="font-mono font-bold text-slate-900">712513 (WB)</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-100">
              <span>Active Fleet on Duty:</span>
              <span className="font-bold text-slate-900">
                {riders.filter((r) => r.availability === 'online' || r.availability === 'busy').length} riders
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Transit Time:</span>
              <span className="font-bold text-[#16A34A]">6.2 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH / REASSIGN RIDER MODAL */}
      {isReassignOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                  Assign Rider to #{selectedOrder.id}
                </h4>
                <p className="text-xs text-slate-500">Destination: {selectedOrder.address?.area}</p>
              </div>
              <button onClick={() => setIsReassignOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {riders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleAssignRider(selectedOrder.id, r)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{r.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {r.vehicleType} ({r.vehicleNumber})
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]">
                    Dispatch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
