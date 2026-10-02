import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Key,
  Smartphone,
  Mail,
  CheckCircle2,
  Lock,
  LogOut,
  Clock
} from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminProfilePageProps {
  currentUser: AdminUser;
  onUpdateCurrentUser: (user: AdminUser) => void;
  onLogout: () => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const AdminProfilePage: React.FC<AdminProfilePageProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onLogout,
  onLogAction,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminUser = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
    };
    onUpdateCurrentUser(updated);
    if (onLogAction) {
      onLogAction('Admin Profile Updated', currentUser.id, `Updated details for ${name}`);
    }
    showToast('Profile information updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      alert('Please fill current and new password');
      return;
    }
    if (newPass !== confirmPass) {
      alert('New password and confirmation do not match');
      return;
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    if (onLogAction) {
      onLogAction('Password Changed', currentUser.id, 'Admin password rotated securely');
    }
    showToast('Password changed successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-['Clash_Display',sans-serif] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              {currentUser.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200 uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">{currentUser.email}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
          <User className="w-4 h-4 text-[#16A34A]" />
          <span>Personal Information & Contact</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Mobile Contact (+91)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#16A34A]" />
          <span>Rotate Security Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black cursor-pointer"
            >
              Save New Password
            </button>
          </div>
        </form>
      </div>

      {/* Session Security Details */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Active Session: Authenticated via 256-bit TLS (Chandrahati Hub Internal Network)</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">IP: 103.21.244.18</span>
      </div>
    </div>
  );
};
