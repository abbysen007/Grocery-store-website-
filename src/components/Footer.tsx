import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Store, 
  Clock, 
  CheckCircle2, 
  Navigation,
  Compass,
  Building
} from 'lucide-react';
import { getStoredStoreLocation } from '../hooks/useGeolocation';
import { FreshitLogo } from './FreshitLogo';

interface FooterProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [storeConfig, setStoreConfig] = useState(() => getStoredStoreLocation());

  useEffect(() => {
    const handleUpdate = () => {
      setStoreConfig(getStoredStoreLocation());
    };
    window.addEventListener('freshit_store_updated', handleUpdate);
    return () => window.removeEventListener('freshit_store_updated', handleUpdate);
  }, []);

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#121212]/85 backdrop-blur-2xl text-slate-300 border-t border-white/10 mt-4 sm:mt-6 font-['Satoshi',sans-serif]">
      {/* 4 Value Pillars Banner (Glass styled with #F5ECD5 & #085E2B) */}
      <div className="border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5ECD5]/15 border border-[#F5ECD5]/30 text-[#F5ECD5] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-[#F5ECD5] text-[#F5ECD5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-['Clash_Display',sans-serif] text-white">Superfast 8-Min Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Dispatched from our Raghunathpur micro dark store.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#085E2B]/15 border border-[#085E2B]/30 text-[#085E2B] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#085E2B]" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-['Clash_Display',sans-serif] text-white">Best Wholesale Prices</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Direct mandi &amp; brand procurement passed directly to you.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-['Clash_Display',sans-serif] text-white">5,000+ Fresh Essentials</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Over 28 curated grocery &amp; daily household departments.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-['Clash_Display',sans-serif] text-white">Instant Doorstep Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Zero questions asked immediate replacement or refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand Info & About Us (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <FreshitLogo size="lg" theme="dark" showBadge={true} />

            <p className="text-xs sm:text-sm font-semibold text-[#F5ECD5]">
              India&apos;s last-minute grocery &amp; essentials app
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Freshit operates under a dedicated single-store quick-commerce model, serving the immediate neighborhoods around Chandrahati Bazar &amp; Naya Sarai, Raghunathpur with hyper-local 8-minute delivery.
            </p>
          </div>

          {/* Column 2: Categories Directory (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleMobileSection('categories')}
            >
              <h5 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-white">
                Categories Directory
              </h5>
              <div className="md:hidden text-slate-400">
                {mobileExpandedSection === 'categories' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            <ul className={`space-y-2 text-xs text-slate-400 ${mobileExpandedSection === 'categories' ? 'block' : 'hidden md:block'}`}>
              {[
                'Vegetables & Fruits',
                'Dairy, Bread & Eggs',
                'Atta, Rice & Dal',
                'Snacks & Drinks',
                'Bakery & Biscuits',
                'Chicken, Meat & Fish',
                'Instant Food',
                'Dry Fruits & Cereals',
                'Oil, Ghee & Masala',
                'Beauty & Personal Care',
                'Household Essentials',
              ].map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="hover:text-[#F5ECD5] text-left transition-colors cursor-pointer hover:translate-x-1 duration-150 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links & Company (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleMobileSection('links')}
            >
              <h5 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-white">
                Useful Links
              </h5>
              <div className="md:hidden text-slate-400">
                {mobileExpandedSection === 'links' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            <ul className={`space-y-2 text-xs text-slate-400 ${mobileExpandedSection === 'links' ? 'block' : 'hidden md:block'}`}>
              <li><a href="#about-us" className="hover:text-[#F5ECD5] transition-colors block">About Us</a></li>
              <li><a href="#single-store" className="hover:text-[#F5ECD5] transition-colors block">Our Flagship Store</a></li>
              <li><a href="#careers" className="hover:text-[#F5ECD5] transition-colors block">Rider Careers</a></li>
              <li><a href="#privacy" className="hover:text-[#F5ECD5] transition-colors block">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#F5ECD5] transition-colors block">Terms &amp; Conditions</a></li>
              <li><a href="#faqs" className="hover:text-[#F5ECD5] transition-colors block">FAQs &amp; Help Center</a></li>
              <li><a href="#security" className="hover:text-[#F5ECD5] transition-colors block">Security &amp; Compliance</a></li>
              <li><a href="#fssai" className="hover:text-[#F5ECD5] transition-colors block">FSSAI Food Safety</a></li>
            </ul>
          </div>

          {/* Column 4: Store Address & Location Details Card (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-white">
              Flagship Physical Store Location
            </h5>

            <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3 text-xs text-slate-300 shadow-sm">
              <div className="flex items-start gap-2.5">
                <Store className="w-5 h-5 text-[#F5ECD5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-['Clash_Display',sans-serif] text-white text-sm block">
                    Freshit Dark Store Hub
                  </span>
                  <span className="text-[10px] font-bold text-[#085E2B]">
                    Active 25m Hyper-Local Perimeter
                  </span>
                </div>
              </div>

              {/* Exact Physical Address as specified */}
              <div className="space-y-1 text-[11px] text-slate-400 leading-relaxed border-t border-white/10 pt-2.5">
                <p className="font-semibold text-slate-200">
                  Kuntighat - Magra Rd, Naya Sarai
                </p>
                <p>Chandrahati Bazar, Raghunathpur</p>
                <p>West Bengal - {storeConfig.pincode}</p>
                <div className="pt-1 flex items-center gap-1.5 font-bold text-[#F5ECD5]">
                  <span>Delivery PIN:</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-white text-[10px]">
                    {storeConfig.pincode}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#085E2B]" />
                  <a href="tel:1800-FRESHIT" className="hover:text-white font-bold text-slate-300">
                    1800-FRESHIT (24/7 Helpline)
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <a href="mailto:support@freshit.com" className="hover:text-white text-slate-400">
                    support@freshit.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Embedded Live Google Maps Widget Centered on Store Address */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-[#1A1A1A] rounded-3xl border border-white/10 p-5 sm:p-7 overflow-hidden shadow-xl space-y-4">
            {/* Store Locator Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#F5ECD5]" />
                  <h4 className="text-base font-bold font-['Clash_Display',sans-serif] text-white">
                    Live Google Map · Raghunathpur Store Location
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Store Address: <strong className="text-slate-200">Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar (PIN {storeConfig.pincode})</strong>. Orders are delivered under 25 meters of the store address.
                </p>
              </div>

              {/* Direct Open in Google Maps / Get Directions Button */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kuntighat+-+Magra+Rd,+Naya+Sarai,+Chandrahati+Bazar,+Raghunathpur,+West+Bengal+712513"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 font-['Clash_Display',sans-serif]"
              >
                <span>Open in Google Maps / Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Live Google Map iframe Widget */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-slate-950">
              <iframe
                title="Freshit Raghunathpur Flagship Store Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=22.993125,88.385500+(Freshit+Store+Hub)&t=&z=18&ie=UTF8&iwloc=&output=embed"
              />

              {/* Geofence Overlay Pill */}
              <div className="absolute top-3 left-3 bg-[#121212]/95 text-white backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 shadow-xl flex items-center gap-2 font-['Clash_Display',sans-serif]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#085E2B] animate-ping" />
                <span>Raghunathpur Dark Store Hub (PIN {storeConfig.pincode}) · Under 25m Perimeter</span>
              </div>
            </div>

            {/* Operating Perimeter Spec */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F5ECD5]" />
                <span className="font-semibold text-slate-300">
                  {storeConfig.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-[#085E2B]/30 text-emerald-300 font-bold text-[11px] font-['Clash_Display',sans-serif]">
                  ⚡ 8-Min Express Delivery
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/30 text-amber-300 font-bold text-[11px] font-['Clash_Display',sans-serif]">
                  🎯 Max Radius: Under 25m of Store Address
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Single Store Operating Disclaimer & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 space-y-6">
          {/* Single Store Operating Disclaimer Note */}
          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 text-[11px] text-slate-400 leading-relaxed font-medium">
            <span className="font-bold text-[#F5ECD5] block mb-1 font-['Clash_Display',sans-serif]">
              Single-Store Operating Notice &amp; Local Service Radius:
            </span>
            Freshit currently operates a single flagship dark store in Raghunathpur (PIN: {storeConfig.pincode}), serving immediate local neighborhoods with ultra-fast 8-minute delivery. Orders are delivered under 25 meters of the store address (Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar) to ensure absolute peak freshness and instant fulfillment.
          </div>

          {/* Social Icons & Bottom Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            {/* Copyright Statement */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <FreshitLogo size="sm" theme="dark" />
              <span>© Fresh Commerce Private Limited, 2016–2026. All rights reserved.</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Clash_Display',sans-serif]">
                Follow Freshit:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Twitter / X', url: 'https://twitter.com' },
                  { name: 'Instagram', url: 'https://instagram.com' },
                  { name: 'LinkedIn', url: 'https://linkedin.com' },
                  { name: 'Facebook', url: 'https://facebook.com' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] hover:bg-[#F5ECD5] hover:text-[#121212] text-slate-400 text-[11px] font-bold border border-white/10 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Trust and FSSAI License Footnote */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#085E2B]" /> FSSAI Central License No. 10020051003412
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> PCI-DSS 256-Bit Encrypted Payments
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
              <span>·</span>
              <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
              <span>·</span>
              <a href="#grievance" className="hover:text-slate-300">Grievance Officer</a>
              <span>·</span>
              <a href="#security" className="hover:text-slate-300">Security Architecture</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

