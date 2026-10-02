import React, { useState } from 'react';
import {
  Bike,
  Search,
  Phone,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  Star,
  ExternalLink,
  X,
  FileCheck
} from 'lucide-react';
import { DeliveryPartner } from '../../../types/admin';

interface DeliveryPartnersPageProps {
  riders: DeliveryPartner[];
  onUpdateRiders: (riders: DeliveryPartner[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const DeliveryPartnersPage: React.FC<DeliveryPartnersPageProps> = ({
  riders,
  onUpdateRiders,
  onLogAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<DeliveryPartner | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New rider form
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderVehicle, setNewRiderVehicle] = useState<'E-Bike' | 'Motorcycle' | 'Bicycle' | 'Scooter'>('E-Bike');
  const [newRiderPlate, setNewRiderPlate] = useState('');
  const [newRiderDL, setNewRiderDL] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredRiders = riders.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle Verification (Approve / Reject)
  const handleToggleVerification = (riderId: string, nextStatus: 'verified' | 'rejected') => {
    const updated = riders.map((r) => (r.id === riderId ? { ...r, verificationStatus: nextStatus } : r));
    onUpdateRiders(updated);
    if (selectedRider && selectedRider.id === riderId) {
      setSelectedRider({ ...selectedRider, verificationStatus: nextStatus });
    }
    const r = riders.find((x) => x.id === riderId);
    if (onLogAction) {
      onLogAction('Rider Verification', riderId, `${r?.name} verification set to ${nextStatus}`);
    }
    showToast(`Rider ${r?.name} verification set to ${nextStatus.toUpperCase()}`);
  };

  // Toggle Availability (Online / Offline)
  const handleToggleAvailability = (riderId: string) => {
    const updated = riders.map((r) => {
      if (r.id === riderId) {
        const nextAvail = r.availability === 'online' ? 'offline' : 'online';
        return { ...r, availability: nextAvail as any };
      }
      return r;
    });
    onUpdateRiders(updated);
    showToast('Updated rider shift availability');
  };

  // Create Rider
  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName.trim() || !newRiderPhone.trim()) return;

    const newPartner: DeliveryPartner = {
      id: `rider-${Date.now()}`,
      name: newRiderName.trim(),
      phone: newRiderPhone.trim(),
      email: `${newRiderName.toLowerCase().replace(/\s+/g, '.')}@freshit.in`,
      vehicleType: newRiderVehicle,
      vehicleNumber: newRiderPlate.trim() || 'WB-16-PENDING',
      verificationStatus: 'verified',
      availability: 'online',
      currentDeliveryStatus: 'idle',
      completedDeliveries: 0,
      rating: 5.0,
      accountStatus: 'active',
      joinedDate: 'Today',
      drivingLicenseNumber: newRiderDL.trim() || 'VERIFIED-LOCAL-ID',
    };

    onUpdateRiders([newPartner, ...riders]);
    setIsAddModalOpen(false);
    setNewRiderName('');
    setNewRiderPhone('');
    setNewRiderPlate('');
    setNewRiderDL('');

    if (onLogAction) {
      onLogAction('New Rider Enrolled', newPartner.id, `Enrolled ${newPartner.name} (${newPartner.vehicleType})`);
    }
    showToast(`Rider ${newPartner.name} enrolled into delivery fleet`);
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

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search rider by name, phone or vehicle plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll Delivery Partner</span>
        </button>
      </div>

      {/* Riders Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRiders.map((rider) => (
          <div
            key={rider.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#15803D] flex items-center justify-center font-black text-base shadow-2xs">
                    {rider.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-['Clash_Display',sans-serif]">
                      {rider.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{rider.phone}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    rider.availability === 'online'
                      ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                      : rider.availability === 'busy'
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {rider.availability}
                </span>
              </div>

              {/* Specs & Performance */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle</span>
                  <span className="font-bold text-slate-800">{rider.vehicleType}</span>
                  <span className="text-[11px] text-slate-500 block font-mono">{rider.vehicleNumber}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating & Trips</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rider.rating} ★</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block">{rider.completedDeliveries} delivered</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleAvailability(rider.id)}
                className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Shift: {rider.availability === 'online' ? 'Go Offline' : 'Go Online'}
              </button>

              <button
                onClick={() => setSelectedRider(rider)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#15803D] hover:bg-emerald-100 font-bold transition-colors cursor-pointer"
              >
                View Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIDER DOSSIER MODAL */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black text-lg">
                  {selectedRider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                    {selectedRider.name}
                  </h3>
                  <p className="text-xs text-slate-500">Fleet Member since {selectedRider.joinedDate}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRider(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Driving Credentials:</span>
                <p className="text-slate-600">License: <span className="font-mono font-bold text-slate-900">{selectedRider.drivingLicenseNumber}</span></p>
                <p className="text-slate-600">Vehicle: <span className="font-semibold text-slate-800">{selectedRider.vehicleType} ({selectedRider.vehicleNumber})</span></p>
                <p className="text-slate-600">Verification:{' '}
                  <span className={`font-bold uppercase ${selectedRider.verificationStatus === 'verified' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {selectedRider.verificationStatus}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span>Direct Contact:</span>
                <a
                  href={`tel:${selectedRider.phone}`}
                  className="px-3 py-1 rounded-lg bg-[#16A34A] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call {selectedRider.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() =>
                  handleToggleVerification(
                    selectedRider.id,
                    selectedRider.verificationStatus === 'verified' ? 'rejected' : 'verified'
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedRider.verificationStatus === 'verified'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                }`}
              >
                {selectedRider.verificationStatus === 'verified' ? 'Revoke Verification' : 'Approve Verification'}
              </button>

              <button
                onClick={() => setSelectedRider(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL RIDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddRider}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Enroll Delivery Partner
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rider Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Ghosh"
                  value={newRiderName}
                  onChange={(e) => setNewRiderName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone (+91) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98321 00112"
                  value={newRiderPhone}
                  onChange={(e) => setNewRiderPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vehicle Type</label>
                  <select
                    value={newRiderVehicle}
                    onChange={(e) => setNewRiderVehicle(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="E-Bike">E-Bike</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Registration Plate</label>
                  <input
                    type="text"
                    placeholder="WB-16-EK-4021"
                    value={newRiderPlate}
                    onChange={(e) => setNewRiderPlate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Driving License / Aadhaar ID</label>
                <input
                  type="text"
                  placeholder="WB162024009112"
                  value={newRiderDL}
                  onChange={(e) => setNewRiderDL(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
              >
                Complete Enrollment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
