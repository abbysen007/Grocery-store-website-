import React, { useState } from 'react';
import {
  HeadphonesIcon,
  Search,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  User,
  X
} from 'lucide-react';
import { SupportTicket } from '../../../types/admin';

interface CustomerSupportPageProps {
  tickets: SupportTicket[];
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const CustomerSupportPage: React.FC<CustomerSupportPageProps> = ({
  tickets,
  onUpdateTickets,
  onLogAction,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredTickets = tickets.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus
  );

  // Send Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin' as const,
      senderName: 'Freshit Support Desk',
      text: replyText.trim(),
      timestamp: 'Just now',
    };

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'in_progress' as SupportTicket['status'],
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    onUpdateTickets(updated);
    setSelectedTicket({
      ...selectedTicket,
      status: 'in_progress',
      messages: [...selectedTicket.messages, newMsg],
    });
    setReplyText('');
    showToast('Reply dispatched to customer');
  };

  // Change Ticket Status
  const handleUpdateStatus = (ticketId: string, nextStatus: SupportTicket['status']) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t));
    onUpdateTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: nextStatus });
    }
    showToast(`Ticket status updated to ${nextStatus.toUpperCase()}`);
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

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Customer Support & Grievance Desk
          </h2>
          <p className="text-xs text-slate-500">
            Local customer inquiries, order delivery questions & resolutions
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'all', label: `All (${tickets.length})` },
            { id: 'open', label: 'Open' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTicket(t)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  {t.ticketNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    t.status === 'open'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : t.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-[#15803D] border-emerald-300'
                  }`}
                >
                  {t.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2 font-['Clash_Display',sans-serif]">
                {t.subject}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                From: <span className="font-semibold text-slate-700">{t.customerName}</span> ({t.customerPhone})
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mt-3 line-clamp-2">
                {t.messages[t.messages.length - 1]?.text}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{t.createdAt}</span>
              <button className="text-xs font-bold text-[#16A34A] hover:underline">
                Open Thread ({t.messages.length}) →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TICKET DETAIL & MESSAGING MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {selectedTicket.ticketNumber} · Category: {selectedTicket.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer: {selectedTicket.customerName} ({selectedTicket.customerPhone})
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'admin' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5">
                    {m.senderName} · {m.timestamp}
                  </span>
                  <div
                    className={`p-3 rounded-2xl max-w-sm ${
                      m.sender === 'admin'
                        ? 'bg-[#16A34A] text-white rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type support reply to customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#16A34A]"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {/* Status Change Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px]"
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[11px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
