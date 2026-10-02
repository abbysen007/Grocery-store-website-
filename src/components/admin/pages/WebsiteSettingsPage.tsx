import React, { useState } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  Eye,
  MessageSquare
} from 'lucide-react';
import { WebsiteCustomizationSettings } from '../../../types/admin';

interface WebsiteSettingsPageProps {
  settings: WebsiteCustomizationSettings;
  onUpdateSettings: (settings: WebsiteCustomizationSettings) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const WebsiteSettingsPage: React.FC<WebsiteSettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onLogAction,
}) => {
  const [formData, setFormData] = useState<WebsiteCustomizationSettings>({ ...settings });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    if (onLogAction) {
      onLogAction('Website Content Updated', 'website_settings', 'Homepage text and banners saved');
    }
    showToast('Customer website text & settings published!');
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
            Customer Website Settings & Copywriting
          </h2>
          <p className="text-xs text-slate-500">
            Customize homepage hero text, top notices, footer contact details & metadata
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Publish to Website</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Banner Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            <span>Homepage Hero Banner & Notice Bar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Top Sticky Notice Pill</label>
              <input
                type="text"
                value={formData.heroNotice}
                onChange={(e) => setFormData({ ...formData, heroNotice: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hero Main Heading</label>
              <input
                type="text"
                value={formData.bannerTitle}
                onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hero Subheading</label>
              <input
                type="text"
                value={formData.bannerSubtitle}
                onChange={(e) => setFormData({ ...formData, bannerSubtitle: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Contact Info & Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#16A34A]" />
            <span>Customer Contact & SEO Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Customer Support Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Helpline Number</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp Live Order Chat</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-bold mb-1">Footer Copyright & Agency Attribution</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Convergix is credited as the development agency; Freshit remains the grocery store brand.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
