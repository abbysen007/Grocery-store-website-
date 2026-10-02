import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Percent,
  IndianRupee,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminOffer } from '../../../types/admin';

interface OffersPageProps {
  offers: AdminOffer[];
  onUpdateOffers: (offers: AdminOffer[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  offers,
  onUpdateOffers,
  onLogAction,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New offer form state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(50);
  const [minOrderValue, setMinOrderValue] = useState<number>(249);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle Offer Status
  const handleToggleOffer = (offerId: string) => {
    const updated = offers.map((o) => {
      if (o.id === offerId) {
        const nextStatus = o.status === 'active' ? 'disabled' : 'active';
        return { ...o, status: nextStatus as any };
      }
      return o;
    });

    onUpdateOffers(updated);
    showToast('Promo coupon status updated');
  };

  // Delete Offer
  const handleDeleteOffer = (offerId: string) => {
    if (!window.confirm('Delete this promotional coupon code?')) return;
    const updated = offers.filter((o) => o.id !== offerId);
    onUpdateOffers(updated);
    if (onLogAction) {
      onLogAction('Offer Deleted', offerId, 'Deleted promotional code');
    }
    showToast('Deleted promo coupon');
  };

  // Create Offer
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newOffer: AdminOffer = {
      id: `off-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || `Save on grocery orders above ₹${minOrderValue}`,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate,
      usageCount: 0,
      status: 'active',
    };

    onUpdateOffers([newOffer, ...offers]);
    setIsAddModalOpen(false);
    setCode('');
    setTitle('');
    setDescription('');

    if (onLogAction) {
      onLogAction('Promo Code Created', newOffer.code, `Created coupon ${newOffer.code} (₹${newOffer.discountValue})`);
    }
    showToast(`Created promo code ${newOffer.code} for customer checkout`);
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
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Store Promotional Coupons & Discounts ({offers.length})
          </h2>
          <p className="text-xs text-slate-500">
            One-time coupon codes applied by customers directly in the checkout cart
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all space-y-4 ${
              offer.status === 'active' ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200/60 bg-slate-50 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold text-sm">
                    {offer.discountType === 'percentage' ? <Percent className="w-5 h-5" /> : <IndianRupee className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-mono font-black text-slate-900 text-sm tracking-wider px-2 py-0.5 rounded-md bg-slate-100">
                      {offer.code}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {offer.usageCount} customer redemptions
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    offer.status === 'active'
                      ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {offer.status}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{offer.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{offer.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Min. Order:</span>
                  <span className="font-bold text-slate-800">₹{offer.minOrderValue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Expires On:</span>
                  <span className="font-bold text-slate-800">{offer.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleOffer(offer.id)}
                className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                {offer.status === 'active' ? 'Disable Code' : 'Activate Code'}
              </button>

              <button
                onClick={() => handleDeleteOffer(offer.id)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE OFFER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOffer}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Create Promotional Offer
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON40 / HOOGHLY50"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase tracking-wider focus:outline-hidden focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat ₹40 Off On Vegetables"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
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
                Publish Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
