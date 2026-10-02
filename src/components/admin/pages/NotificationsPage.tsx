import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  Users,
  Bike,
  ShieldAlert,
  Smartphone,
  MessageSquare,
  X
} from 'lucide-react';
import { AdminNotification } from '../../../types/admin';

interface NotificationsPageProps {
  notifications: AdminNotification[];
  onUpdateNotifications: (notifs: AdminNotification[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onUpdateNotifications,
  onLogAction,
}) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientGroup, setRecipientGroup] = useState<AdminNotification['recipientGroup']>('all_customers');
  const [channel, setChannel] = useState<AdminNotification['channel']>('in_app');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      recipientGroup,
      type: 'promotional',
      channel,
      sentAt: 'Just now',
      deliveryStatus: 'delivered',
    };

    onUpdateNotifications([newNotif, ...notifications]);
    setIsComposeOpen(false);
    setTitle('');
    setMessage('');

    if (onLogAction) {
      onLogAction('Broadcast Sent', newNotif.id, `Sent "${newNotif.title}" to ${newNotif.recipientGroup}`);
    }
    showToast(`Broadcast notification dispatched to ${recipientGroup.replace('_', ' ')}!`);
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
            Store Broadcast & Notification Hub
          </h2>
          <p className="text-xs text-slate-500">
            Dispatch announcements, harvest arrival alerts & emergency notices
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Compose Broadcast</span>
        </button>
      </div>

      {/* Notification Log List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold capitalize">
                    {n.recipientGroup.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold uppercase">
                    {n.channel}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed max-w-2xl">{n.message}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400 block">{n.sentAt}</span>
              <span className="text-[10px] font-bold text-emerald-700 mt-0.5 inline-block">
                ✓ {n.deliveryStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* COMPOSE MODAL */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSendNotification}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Dispatch Broadcast Message
              </h3>
              <button type="button" onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="all_customers">All Local Customers (Chandrahati Zone)</option>
                  <option value="active_riders">Active Delivery Partners (Fleet)</option>
                  <option value="admin_staff">Store Admin & Fulfillment Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Delivery Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="in_app">In-App Notification Bell & Banner</option>
                  <option value="sms">SMS Text Alert (+91 Gateway)</option>
                  <option value="push">Mobile Push Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Mangoes & Palak Restocked!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Body *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type alert message for customers or riders..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
              >
                Send Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
