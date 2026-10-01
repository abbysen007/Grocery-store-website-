import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Clock, 
  RotateCcw, 
  FileText, 
  MapPin, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Bike, 
  ArrowLeft,
  ShoppingBag,
  Download,
  Receipt
} from 'lucide-react';
import { Order } from '../types';
import { FreshitLogo } from './FreshitLogo';

interface OrderHistoryViewProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onBack: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onReorder,
  onTrackOrder,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'delivered'>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<Order | null>(null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'ongoing') return ord.status !== 'delivered';
    if (activeTab === 'delivered') return ord.status === 'delivered';
    return true;
  });

  const handleReorderClick = (order: Order) => {
    onReorder(order);
    setReorderedId(order.id);
    setTimeout(() => setReorderedId(null), 2500);
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
            <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Your Orders</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              {orders.length} total orders placed
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold font-['Clash_Display',sans-serif]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#121212] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ongoing'
                ? 'bg-white text-[#121212] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-white text-[#121212] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-[#121212] mb-1 font-['Clash_Display',sans-serif]">No orders found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
            {activeTab === 'ongoing'
              ? 'You have no deliveries currently in progress.'
              : 'Browse our catalog of fresh fruits, milk, snacks & daily staples.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((ord) => {
            const isOngoing = ord.status !== 'delivered';

            return (
              <div
                key={ord.id}
                className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:bg-white/80 transition-all space-y-3"
              >
                {/* Top Card Row */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">
                      Order #{ord.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">· {ord.date}</span>
                  </div>

                  {isOngoing ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#085E2B] font-bold text-[10px] border border-emerald-200 animate-pulse font-['Clash_Display',sans-serif]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#085E2B]"></span>
                      On the way (8 mins)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#085E2B] font-bold text-[10px] font-['Clash_Display',sans-serif]">
                      <CheckCircle2 className="w-3 h-3 text-[#085E2B]" />
                      Delivered
                    </span>
                  )}
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {ord.items.slice(0, 4).map((it, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0"
                      >
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-slate-800 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                          {it.quantity}
                        </span>
                      </div>
                    ))}
                    {ord.items.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                        +{ord.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block font-medium">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-sm font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">
                      ₹{ord.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedOrderDetails(ord)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1 font-['Clash_Display',sans-serif]"
                  >
                    <span>View Bill & Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <div className="flex items-center gap-2">
                    {isOngoing ? (
                      <button
                        onClick={() => onTrackOrder(ord)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer font-['Clash_Display',sans-serif]"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReorderClick(ord)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                          reorderedId === ord.id
                            ? 'bg-[#085E2B] text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#085E2B] border border-emerald-200'
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{reorderedId === ord.id ? 'Added to Cart!' : 'Reorder'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Order Breakdown Modal */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDetails(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-10 max-h-[85vh] flex flex-col font-['Satoshi',sans-serif]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                <div>
                  <h3 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">
                    Order Details #{selectedOrderDetails.id.slice(-6).toUpperCase()}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedOrderDetails.date} · Placed via Freshit Instant
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Status banner */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#085E2B]" />
                    <span className="font-bold text-emerald-950 font-['Clash_Display',sans-serif]">
                      {selectedOrderDetails.status === 'delivered'
                        ? 'Order Delivered Successfully'
                        : 'Order In Transit to Destination'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#085E2B] font-['Clash_Display',sans-serif]">8 Mins Dispatch</span>
                </div>

                {/* Delivery details */}
                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block font-['Clash_Display',sans-serif]">
                    Delivered to
                  </span>
                  <p className="font-bold text-[#121212]">{selectedOrderDetails.address.label}</p>
                  <p className="text-slate-500 text-[11px]">{selectedOrderDetails.address.address}</p>
                </div>

                {/* Items itemized list */}
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2 font-['Clash_Display',sans-serif]">
                    Purchased Items ({selectedOrderDetails.items.length})
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {selectedOrderDetails.items.map((it, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between gap-3 bg-white">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={it.product.image}
                            alt={it.product.name}
                            className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-1"
                          />
                          <div>
                            <span className="font-bold text-[#121212] block text-xs">
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {it.product.weight}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">
                          ₹{it.product.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total</span>
                    <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{selectedOrderDetails.itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Handling Fee</span>
                    <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{selectedOrderDetails.handlingFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-[#085E2B] font-['Clash_Display',sans-serif]">
                      {selectedOrderDetails.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderDetails.deliveryFee}`}
                    </span>
                  </div>
                  {selectedOrderDetails.tip > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Rider Tip</span>
                      <span className="font-bold text-[#121212] font-['Clash_Display',sans-serif]">₹{selectedOrderDetails.tip}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#121212] font-['Clash_Display',sans-serif]">
                    <span>Total Paid</span>
                    <span className="text-[#085E2B]">₹{selectedOrderDetails.grandTotal}</span>
                  </div>
                </div>

                {/* Payment info */}
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>
                    Payment Mode: {selectedOrderDetails.paymentDetails?.providerTitle || 'Online UPI'}
                  </span>
                  <span>Txn: {selectedOrderDetails.paymentDetails?.transactionId || 'TXN-901842'}</span>
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => setShowInvoiceModal(selectedOrderDetails)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer font-['Clash_Display',sans-serif]"
                >
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Invoice</span>
                </button>

                <button
                  onClick={() => {
                    handleReorderClick(selectedOrderDetails);
                    setSelectedOrderDetails(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs shadow-xs cursor-pointer font-['Clash_Display',sans-serif]"
                >
                  Reorder All Items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 space-y-4 z-10 font-['Satoshi',sans-serif]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <FreshitLogo size="sm" />
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-['Clash_Display',sans-serif]">
                    Official Tax Invoice
                  </span>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Invoice No:</span>
                  <span className="font-mono font-bold text-[#121212]">
                    INV-{showInvoiceModal.id.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GSTIN:</span>
                  <span className="font-mono text-[#121212]">07AAACF8912P1ZK</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-[#121212]">{showInvoiceModal.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold text-[#121212]">
                    {showInvoiceModal.address.receiverName || 'Aarav Sharma'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                {showInvoiceModal.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="font-bold tabular-nums text-[#121212] font-['Clash_Display',sans-serif]">
                      ₹{it.product.price * it.quantity}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#121212] font-['Clash_Display',sans-serif]">
                  <span>Grand Total</span>
                  <span className="text-[#085E2B]">₹{showInvoiceModal.grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowInvoiceModal(null);
                }}
                className="w-full py-3 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs font-['Clash_Display',sans-serif]"
              >
                <Download className="w-4 h-4" />
                <span>Save Invoice PDF</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
