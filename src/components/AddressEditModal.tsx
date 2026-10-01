import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Home, Briefcase, Plus, Check } from 'lucide-react';
import { UserAddress } from '../types';

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit: UserAddress | null;
  onSaveAddress: (address: UserAddress) => void;
}

export const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  addressToEdit,
  onSaveAddress,
}) => {
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>(addressToEdit?.label || 'Home');
  const [houseNo, setHouseNo] = useState(addressToEdit?.houseNo || 'Flat 402, Tower B');
  const [apartmentRoad, setApartmentRoad] = useState(addressToEdit?.apartmentRoad || 'Palm Grove Heights, Sector 29');
  const [area, setArea] = useState(addressToEdit?.area || 'Sector 29, Gurgaon');
  const [city, setCity] = useState(addressToEdit?.city || 'Gurugram');
  const [landmark, setLandmark] = useState(addressToEdit?.landmark || 'Opposite Leisure Valley Park');
  const [receiverName, setReceiverName] = useState(addressToEdit?.receiverName || 'Aarav Sharma');
  const [receiverPhone, setReceiverPhone] = useState(addressToEdit?.receiverPhone || '9876543210');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${houseNo.trim()}, ${apartmentRoad.trim()}, ${landmark ? landmark.trim() + ', ' : ''}${city.trim()}`;
    const newAddress: UserAddress = {
      id: addressToEdit?.id || `addr-${Date.now()}`,
      label,
      houseNo,
      apartmentRoad,
      area: area || 'Sector 29, Gurgaon',
      city: city || 'Gurugram',
      landmark,
      receiverName,
      receiverPhone,
      address: fullAddress,
      eta: '8 mins',
      isDefault: addressToEdit?.isDefault ?? true,
    };
    onSaveAddress(newAddress);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 font-['Satoshi',sans-serif]"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/40 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#085E2B] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                    {addressToEdit ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    8-minute fast grocery delivery coordinates
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Address Label Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-['Clash_Display',sans-serif]">
                  Save Address As
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'Home' as const, icon: Home },
                    { type: 'Work' as const, icon: Briefcase },
                    { type: 'Other' as const, icon: MapPin },
                  ].map(({ type, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLabel(type)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                        label === type
                          ? 'border-[#085E2B] bg-emerald-50 text-[#085E2B] shadow-2xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* House / Flat No */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                  Flat / House / Floor / Building <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 402, Tower B"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Apartment / Road */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                  Apartment / Society / Street <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={apartmentRoad}
                  onChange={(e) => setApartmentRoad(e.target.value)}
                  placeholder="e.g. Palm Grove Heights, Central Road"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Area & City (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                    Area / Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Sector 29, Gurgaon"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Gurugram"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-['Clash_Display',sans-serif]">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Leisure Valley Park, Near Gate 2"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Receiver Details */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-['Clash_Display',sans-serif]">
                  Receiver Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#085E2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      10-Digit Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#085E2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs shadow-sm transition-all cursor-pointer font-['Clash_Display',sans-serif]"
                >
                  Save &amp; Deliver Here
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
