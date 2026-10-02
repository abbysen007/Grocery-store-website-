import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  IndianRupee,
  ShieldAlert,
  CheckCircle2,
  FileText,
  MapPin,
  X,
  Plus
} from 'lucide-react';
import { AdminCustomer } from '../../../types/admin';
import { Order } from '../../../types';

interface CustomersPageProps {
  customers: AdminCustomer[];
  onUpdateCustomers: (customers: AdminCustomer[]) => void;
  orders: Order[];
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  onUpdateCustomers,
  orders,
  onLogAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [newNote, setNewNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, searchQuery]);

  // Toggle Account Suspend / Activate
  const handleToggleStatus = (cust: AdminCustomer) => {
    const nextStatus: 'active' | 'suspended' = cust.status === 'active' ? 'suspended' : 'active';
    const reason = nextStatus === 'suspended' ? 'Administrative security review' : undefined;

    const updated: AdminCustomer[] = customers.map((c) =>
      c.id === cust.id ? { ...c, status: nextStatus, suspensionReason: reason } : c
    );

    onUpdateCustomers(updated);
    if (selectedCustomer && selectedCustomer.id === cust.id) {
      setSelectedCustomer({ ...selectedCustomer, status: nextStatus, suspensionReason: reason });
    }

    if (onLogAction) {
      onLogAction('Customer Status Changed', cust.id, `${cust.name} set to ${nextStatus}`);
    }
    showToast(`Account for ${cust.name} marked as ${nextStatus.toUpperCase()}`);
  };

  // Add Internal Staff Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;

    const note = `${newNote.trim()} (by Admin Staff, ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
    const updatedNotes = [...(selectedCustomer.internalNotes || []), note];

    const updated: AdminCustomer[] = customers.map((c) =>
      c.id === selectedCustomer.id ? { ...c, internalNotes: updatedNotes } : c
    );

    onUpdateCustomers(updated);
    setSelectedCustomer({ ...selectedCustomer, internalNotes: updatedNotes });
    setNewNote('');
    showToast('Internal note saved');
  };

  // Customer's order list
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.address?.label?.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
        o.address?.receiverPhone === selectedCustomer.phone
    );
  }, [orders, selectedCustomer]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-['Clash_Display',sans-serif] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name, mobile or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Registered Shoppers:{' '}
          <span className="font-bold text-slate-900">{customers.length}</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803D] font-bold text-xs flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.email || 'Mobile user'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.phone}</td>

                  <td className="py-3 px-4 text-slate-500">{c.registrationDate}</td>

                  <td className="py-3 px-4 font-bold text-slate-900">{c.totalOrders}</td>

                  <td className="py-3 px-4 font-bold text-[#16A34A]">₹{c.totalSpent}</td>

                  <td className="py-3 px-4 text-slate-500">{c.lastOrderDate || '—'}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        c.status === 'active'
                          ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#15803D] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE DOSSIER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                    {selectedCustomer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>Registered {selectedCustomer.registrationDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Completed Orders</span>
                <span className="text-lg font-black text-slate-900 font-['Clash_Display',sans-serif]">
                  {selectedCustomer.totalOrders}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Total Spend (LTV)</span>
                <span className="text-lg font-black text-[#16A34A] font-['Clash_Display',sans-serif]">
                  ₹{selectedCustomer.totalSpent}
                </span>
              </div>
            </div>

            {/* Delivery Addresses */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block font-['Clash_Display',sans-serif]">
                Saved Delivery Addresses
              </span>
              {selectedCustomer.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">{addr.label}</span>
                    <p className="text-slate-600 mt-0.5">{addr.address}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {addr.area}, WB - {addr.pincode}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block font-['Clash_Display',sans-serif]">
                Internal Staff Notes (Admin Only)
              </span>

              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedCustomer.internalNotes?.length === 0 ? (
                  <p className="text-slate-400 italic">No notes recorded yet.</p>
                ) : (
                  selectedCustomer.internalNotes?.map((note, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px]"
                    >
                      {note}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add confidential customer note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#16A34A]"
                />
                <button
                  type="submit"
                  className="px-3 h-9 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Account Suspension / Reactivation Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedCustomer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  selectedCustomer.status === 'active'
                    ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {selectedCustomer.status === 'active' ? 'Suspend Customer Account' : 'Reactivate Account'}
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
