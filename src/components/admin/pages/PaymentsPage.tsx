import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  IndianRupee,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { PaymentTransaction } from '../../../types/admin';

interface PaymentsPageProps {
  payments: PaymentTransaction[];
  onUpdatePayments: (payments: PaymentTransaction[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  payments,
  onUpdatePayments,
  onLogAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Customer pre-dispatch cancellation');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gatewayTxnId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, searchQuery, methodFilter, statusFilter]);

  // Execute Safe Idempotent Refund
  const handleProcessRefund = () => {
    if (!selectedTxn) return;

    if (selectedTxn.status === 'refunded') {
      alert('This transaction has already been refunded!');
      return;
    }

    const updated = payments.map((p) => {
      if (p.id === selectedTxn.id) {
        return {
          ...p,
          status: 'refunded' as PaymentTransaction['status'],
          refundAmount: p.amount,
          refundStatus: 'completed' as PaymentTransaction['refundStatus'],
          refundReason,
        };
      }
      return p;
    });

    onUpdatePayments(updated);
    if (onLogAction) {
      onLogAction('Refund Processed', selectedTxn.orderId, `Refunded ₹${selectedTxn.amount} (${refundReason})`);
    }

    showToast(`Refund of ₹${selectedTxn.amount} initiated successfully for #${selectedTxn.orderId}`);
    setSelectedTxn(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = 'TxnID,OrderID,Customer,Method,Amount,GatewayTxnID,Status,RefundAmount,Date\n';
    const rows = payments
      .map(
        (p) =>
          `"${p.id}","${p.orderId}","${p.customerName}","${p.method}",${p.amount},"${p.gatewayTxnId}","${p.status}",${p.refundAmount || 0},"${p.timestamp}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshit-settlements-${Date.now()}.csv`;
    a.click();
    showToast('Exported transaction settlement report');
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

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order ID, txn reference, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
          />
        </div>

        {/* Filters and Export */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="all">All Payment Methods</option>
            <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card">Debit / Credit Cards</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Settled / Successful</option>
            <option value="refunded">Refund Reversals</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Gateway Reference</th>
                <th className="py-3 px-4">Settled Amount</th>
                <th className="py-3 px-4">Transaction Status</th>
                <th className="py-3 px-4">Refund Audit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{p.orderId}</span>
                    <span className="text-[10px] text-slate-400">{p.timestamp}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block truncate">{p.customerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.customerPhone}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">{p.method}</td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 truncate max-w-[140px]">
                    {p.gatewayTxnId}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">₹{p.amount}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        p.status === 'successful'
                          ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                          : p.status === 'refunded'
                          ? 'bg-purple-50 text-purple-700 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {p.refundAmount ? (
                      <div>
                        <span className="text-purple-700 font-bold block">₹{p.refundAmount} Refunded</span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[150px]">
                          {p.refundReason}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {p.status === 'successful' ? (
                      <button
                        onClick={() => setSelectedTxn(p)}
                        className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND INITIATION DIALOG */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span>Initiate Idempotent Refund</span>
              </h3>
              <button onClick={() => setSelectedTxn(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
              <p className="font-bold">Order ID: #{selectedTxn.orderId}</p>
              <p>Customer: {selectedTxn.customerName}</p>
              <p className="text-sm font-black mt-1">Reversal Amount: ₹{selectedTxn.amount}</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Reason for Refund (Mandatory for audit reconciliation):
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden"
              >
                <option value="Customer pre-dispatch cancellation">Customer pre-dispatch cancellation</option>
                <option value="Fresh vegetable quality return">Fresh vegetable quality return</option>
                <option value="Item damaged in transit">Item damaged in transit</option>
                <option value="Duplicate payment refund">Duplicate payment refund</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessRefund}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
              >
                Execute Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
