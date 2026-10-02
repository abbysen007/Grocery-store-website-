import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Save,
  AlertCircle
} from 'lucide-react';
import { StoreOperationalSettings } from '../../../types/admin';

interface StoreSettingsPageProps {
  settings: StoreOperationalSettings;
  onUpdateSettings: (settings: StoreOperationalSettings) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const StoreSettingsPage: React.FC<StoreSettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onLogAction,
}) => {
  const [formData, setFormData] = useState<StoreOperationalSettings>({ ...settings });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    if (onLogAction) {
      onLogAction('Store Settings Updated', 'store_settings', `Operational settings saved (Geofence: ${formData.geofenceRadiusKm}km)`);
    }
    showToast('Store settings updated & synchronized across platform!');
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
            Single Dark Store Hub Operations Settings
          </h2>
          <p className="text-xs text-slate-500">
            Chandrahati Bazar flagship fulfillment store configuration & 25 km boundary
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Section 1: Store Identity & Legal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#16A34A]" />
            <span>Store Hub Profile & Regulatory Compliance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Store Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Support Helpline Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={formData.fssaiLicense}
                onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Store Address (Dispatch Center)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Store PIN Code</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Geofence & Service Radius */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#16A34A]" />
            <span>Delivery Geofence (25 km Radius Engine)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Delivery Radius (km)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.geofenceRadiusKm}
                  onChange={(e) => setFormData({ ...formData, geofenceRadiusKm: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
                <span className="font-bold text-slate-500">km</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Haversine GPS boundary check</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hub Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hub Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Fulfillment & Pricing Structure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#16A34A]" />
            <span>Fulfillment SLA & Checkout Fees</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Min. Order Value (₹)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Free Delivery Above (₹)</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Platform Handling Fee (₹)</label>
              <input
                type="number"
                value={formData.platformHandlingFee}
                onChange={(e) => setFormData({ ...formData, platformHandlingFee: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operating Hours & Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#16A34A]" />
            <span>Store Operating Shift Hours</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Store Opening Time</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Store Closing Time</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Store Active Status</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isStoreOnline: !formData.isStoreOnline })}
                className={`w-full h-10 px-3 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  formData.isStoreOnline
                    ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.isStoreOnline ? 'bg-[#16A34A]' : 'bg-amber-500'}`} />
                <span>{formData.isStoreOnline ? 'Store Accepting Orders' : 'Store Paused (Offline)'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
