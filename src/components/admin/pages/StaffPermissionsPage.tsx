import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  X,
  AlertCircle
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../../types/admin';

interface StaffPermissionsPageProps {
  staff: AdminUser[];
  onUpdateStaff: (staff: AdminUser[]) => void;
  currentUser: AdminUser;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const StaffPermissionsPage: React.FC<StaffPermissionsPageProps> = ({
  staff,
  onUpdateStaff,
  currentUser,
  onLogAction,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('Order Manager');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleStatus = (staffId: string) => {
    if (staffId === currentUser.id) {
      alert('You cannot deactivate your own current login account!');
      return;
    }

    const updated = staff.map((s) => {
      if (s.id === staffId) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        return { ...s, status: nextStatus as any };
      }
      return s;
    });

    onUpdateStaff(updated);
    const target = staff.find((s) => s.id === staffId);
    showToast(`Staff account for ${target?.name} updated`);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let perms = ['dashboard', 'orders'];
    if (role === 'Super Admin') perms = ['all'];
    else if (role === 'Inventory Manager') perms = ['dashboard', 'products', 'inventory', 'reports'];
    else if (role === 'Support Agent') perms = ['dashboard', 'customers', 'support'];

    const newStaff: AdminUser = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98000 00000',
      role,
      status: 'active',
      lastLogin: 'Never',
      permissions: perms,
    };

    onUpdateStaff([...staff, newStaff]);
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');

    if (onLogAction) {
      onLogAction('Staff Account Created', newStaff.id, `Created ${newStaff.name} as ${newStaff.role}`);
    }
    showToast(`Enrolled ${newStaff.name} as ${newStaff.role}`);
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
            Store Staff & Access Governance ({staff.length})
          </h2>
          <p className="text-xs text-slate-500">
            Role-Based Access Control (RBAC) enforced across all 19 admin modules
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Module Permissions</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803D] font-bold text-xs flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 border border-slate-200">
                      {s.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono">{s.phone}</td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {s.permissions.includes('all') ? 'Full System Root Access' : s.permissions.join(', ')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        s.status === 'active'
                          ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(s.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                        s.status === 'active'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddStaff}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Add Authorized Staff Member
              </h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="suman.roy@freshit.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone (+91)</label>
                <input
                  type="tel"
                  placeholder="+91 98000 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="Order Manager">Order Manager (Live Dispatch, Orders, Support)</option>
                  <option value="Inventory Manager">Inventory Manager (Catalogue, Stock, Adjustments)</option>
                  <option value="Support Agent">Support Agent (Customer Tickets & Enquiries)</option>
                  <option value="Super Admin">Super Admin (Unrestricted Root Access)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
              >
                Authorize Staff
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
