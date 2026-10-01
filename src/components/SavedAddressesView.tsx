import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Home, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  ArrowLeft,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { UserAddress } from '../types';
import { AddressEditModal } from './AddressEditModal';

interface SavedAddressesViewProps {
  addresses: UserAddress[];
  currentAddress: UserAddress;
  onSelectCurrentAddress: (addr: UserAddress) => void;
  onAddAddress: (addr: UserAddress) => void;
  onUpdateAddress: (addr: UserAddress) => void;
  onDeleteAddress: (id: string) => void;
  onBack: () => void;
}

export const SavedAddressesView: React.FC<SavedAddressesViewProps> = ({
  addresses,
  currentAddress,
  onSelectCurrentAddress,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onBack,
}) => {
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (addr: UserAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleSave = (addr: UserAddress) => {
    if (editingAddress) {
      onUpdateAddress(addr);
    } else {
      onAddAddress(addr);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Saved Addresses</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Manage your delivery locations &amp; fast drop coordinates
            </span>
          </div>
        </div>

        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add New</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {addresses.map((addr) => {
          const isSelected = currentAddress.id === addr.id;
          const IconComp = addr.label === 'Home' ? Home : addr.label === 'Work' ? Briefcase : MapPin;

          return (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#085E2B] bg-emerald-50/60 backdrop-blur-md shadow-xs ring-1 ring-emerald-500/20'
                  : 'border-white/60 bg-white/60 backdrop-blur-md hover:bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#085E2B] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-[#121212] font-['Clash_Display',sans-serif]">
                      {addr.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    ⚡ {addr.eta}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#121212] line-clamp-1 font-['Clash_Display',sans-serif]">
                  {addr.area}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {addr.address}
                </p>

                {addr.receiverPhone && (
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    Contact: +91 {addr.receiverPhone}
                  </p>
                )}
              </div>

              {/* Actions row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {!isSelected ? (
                  <button
                    onClick={() => onSelectCurrentAddress(addr)}
                    className="text-xs font-bold text-[#085E2B] hover:underline cursor-pointer font-['Clash_Display',sans-serif]"
                  >
                    Set as Active
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-[#085E2B] flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Default
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="text-slate-500 hover:text-slate-900 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {addresses.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete address "${addr.label} - ${addr.area}"?`)) {
                          onDeleteAddress(addr.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      <AddressEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={editingAddress}
        onSaveAddress={handleSave}
      />
    </div>
  );
};
