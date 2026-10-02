import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  Eye,
  Printer,
  ChevronRight,
  User,
  MapPin,
  Phone,
  IndianRupee,
  AlertCircle,
  X,
  FileText,
  RotateCcw,
  Check,
  Send,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../../../types';
import { DeliveryPartner } from '../../../types/admin';

interface OrdersPageProps {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  riders: DeliveryPartner[];
  onLogAction?: (action: string, entityId: string, details: string) => void;
  initialFilter?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onUpdateOrders,
  riders,
  onLogAction,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter || 'all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.address?.label && o.address.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.address?.area && o.address.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.deliveryPartner?.name && o.deliveryPartner.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Order status transition lifecycle validation
  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          etaMinutes: nextStatus === 'delivered' ? 0 : o.etaMinutes,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus, etaMinutes: nextStatus === 'delivered' ? 0 : selectedOrder.etaMinutes });
    }

    if (onLogAction) {
      onLogAction('Order Status Transition', orderId, `Order transitioned to ${nextStatus}`);
    }
    showToast(`Order #${orderId} marked as ${nextStatus.replace('_', ' ').toUpperCase()}`);
  };

  // Assign Rider
  const handleAssignRider = (orderId: string, rider: DeliveryPartner) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: (o.status === 'placed' || o.status === 'packing' ? 'on_the_way' : o.status) as Order['status'],
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
        deliveryPartner: {
          name: rider.name,
          phone: rider.phone,
          vehicleNumber: rider.vehicleNumber,
          rating: rider.rating,
        },
      });
    }

    setIsAssignModalOpen(false);
    if (onLogAction) {
      onLogAction('Rider Assigned', orderId, `Assigned ${rider.name} (${rider.vehicleNumber})`);
    }
    showToast(`Assigned ${rider.name} to order #${orderId}`);
  };

  // Cancel Order
  const handleConfirmCancel = () => {
    if (!selectedOrder) return;
    const reason = cancelReason.trim() || 'Store administrative cancellation';

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: 'cancelled' as Order['status'],
          etaMinutes: 0,
          paymentDetails: o.paymentDetails ? { ...o.paymentDetails, status: 'refunded' as const } : undefined,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    setSelectedOrder({ ...selectedOrder, status: 'cancelled', etaMinutes: 0 });
    setIsCancelModalOpen(false);
    setCancelReason('');

    if (onLogAction) {
      onLogAction('Order Cancelled', selectedOrder.id, `Reason: ${reason}`);
    }
    showToast(`Order #${selectedOrder.id} has been cancelled`);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-['Clash_Display',sans-serif] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order ID, customer, area, rider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'placed', label: 'Placed' },
            { id: 'packing', label: 'Preparing' },
            { id: 'on_the_way', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Hub Area</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Lifecycle</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No orders match your current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    placed: 'bg-blue-50 text-blue-800 border-blue-200',
                    packing: 'bg-amber-50 text-amber-800 border-amber-300',
                    on_the_way: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                    delivered: 'bg-slate-100 text-slate-700 border-slate-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.placedTimestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block truncate max-w-[160px]">
                          {order.address?.label || 'Direct Customer'}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                          {order.address?.area}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-semibold block">
                          {order.items.length} product{order.items.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">
                          {order.items.map((i) => `${i.quantity}x ${i.product.title}`).join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{order.grandTotal}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentDetails?.status === 'successful'
                                ? 'bg-emerald-500'
                                : order.paymentDetails?.status === 'refunded'
                                ? 'bg-purple-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {order.paymentDetails?.method || 'UPI'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            statusColors[order.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.deliveryPartner ? (
                          <div className="flex items-center gap-1.5">
                            <Bike className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                              {order.deliveryPartner.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#16A34A] hover:bg-emerald-50 transition-colors"
                          title="View Order Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL & ACTION DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                    Order #{selectedOrder.id}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-[#15803D] border border-emerald-200">
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed at{' '}
                  {new Date(selectedOrder.placedTimestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Print Order Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lifecycle Status Stepper */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-['Clash_Display',sans-serif]">
                Update Order Lifecycle State
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  disabled={selectedOrder.status === 'cancelled'}
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'placed')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedOrder.status === 'placed'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  1. Placed
                </button>

                <button
                  disabled={selectedOrder.status === 'cancelled'}
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'packing')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedOrder.status === 'packing'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  2. Preparing
                </button>

                <button
                  disabled={selectedOrder.status === 'cancelled'}
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'on_the_way')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedOrder.status === 'on_the_way'
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  3. Out for Delivery
                </button>

                <button
                  disabled={selectedOrder.status === 'cancelled'}
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedOrder.status === 'delivered'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-800'
                  }`}
                >
                  4. Delivered
                </button>
              </div>

              {selectedOrder.status !== 'cancelled' && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bike className="w-4 h-4" />
                    <span>{selectedOrder.deliveryPartner ? 'Change Rider' : 'Assign Delivery Partner'}</span>
                  </button>

                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order</span>
                  </button>
                </div>
              )}
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-['Clash_Display',sans-serif]">
                Order Items ({selectedOrder.items.length})
              </span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.product.imageUrl}
                        alt={it.product.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{it.product.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {it.product.weight} · ₹{it.product.price} each
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-600 block">Qty: {it.quantity}</span>
                      <span className="font-bold text-slate-900">
                        ₹{it.product.price * it.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown & Customer Delivery Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block font-['Clash_Display',sans-serif]">
                  Delivery Address:
                </span>
                <p className="font-semibold text-slate-800">{selectedOrder.address?.label}</p>
                <p className="text-slate-600 leading-relaxed">{selectedOrder.address?.address}</p>
                <p className="text-slate-500 font-mono">
                  {selectedOrder.address?.area}, PIN {selectedOrder.address?.pincode}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block font-['Clash_Display',sans-serif]">
                  Settlement Breakdown:
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Rider Tip:</span>
                  <span>₹{selectedOrder.tip}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1 text-sm">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN RIDER SELECTION MODAL */}
      {isAssignModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#16A34A]" />
                <span>Assign Verified Delivery Partner</span>
              </h4>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {riders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleAssignRider(selectedOrder.id, r)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                          r.availability === 'online'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.availability}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.vehicleType} · {r.vehicleNumber} · {r.completedDeliveries} trips
                    </p>
                  </div>
                  <button className="px-3 py-1 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER REASON DIALOG */}
      {isCancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-rose-700 font-['Clash_Display',sans-serif] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Confirm Order Cancellation</span>
              </h4>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel Order #{selectedOrder.id}? Any paid amount will be marked for immediate refund reversal.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Reason for Cancellation (Required for audit log):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Item out of stock / Customer requested cancellation"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
