import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Store,
  Bike,
  ShieldCheck,
  HelpCircle,
  FileText,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Send,
  AlertCircle
} from 'lucide-react';
import { FreshitLogo } from './FreshitLogo';

export type StoreInfoTab =
  | 'about'
  | 'store'
  | 'careers'
  | 'faqs'
  | 'privacy'
  | 'terms'
  | 'security'
  | 'fssai'
  | 'grievance';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: StoreInfoTab;
  onApplyRider?: (applicant: { name: string; phone: string; vehicle: string; license: string; shift?: string }) => void;
}

export const StoreInfoModal: React.FC<StoreInfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
  onApplyRider,
}) => {
  const [activeTab, setActiveTab] = useState<StoreInfoTab>(initialTab);

  // Rider application form state
  const [riderForm, setRiderForm] = useState({
    name: '',
    phone: '',
    vehicle: 'Motorbike / Scooter',
    license: '',
    shift: 'Morning (6 AM - 2 PM)',
  });
  const [isRiderApplied, setIsRiderApplied] = useState(false);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIsRiderApplied(false);
    }
  }, [isOpen, initialTab]);

  const handleRiderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderForm.name || !riderForm.phone) return;
    if (onApplyRider) {
      onApplyRider(riderForm);
    }
    setIsRiderApplied(true);
  };

  const FAQS = [
    {
      q: 'How does Freshit deliver in just 8 minutes?',
      a: 'Freshit operates a dedicated single dark store hub located strategically on Kuntighat - Magra Rd in Chandrahati Bazar, Raghunathpur. All stock is pre-racked, picked by automated packers within 90 seconds, and dispatched via our dedicated local fleet within our strict 25 km geofence.',
    },
    {
      q: 'What is the 25 km delivery geofence?',
      a: 'To guarantee absolute peak freshness for fruits, vegetables, and chilled dairy without thawing or bruising, Freshit only accepts orders located within a verified 25 km radius of our store hub. Check your location using our interactive coverage map.',
    },
    {
      q: 'What is the minimum order value for Free Delivery?',
      a: 'Orders above ₹149 qualify for 100% Free Express Delivery! For orders below ₹149, a nominal delivery fee of ₹25 applies to support our local delivery riders.',
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit cards (Visa, MasterCard, RuPay), Net Banking, Freshit Money Wallet, and Cash on Delivery (COD). All transactions are encrypted with 256-bit bank-grade security.',
    },
    {
      q: 'What if an item is damaged or missing from my basket?',
      a: 'We offer an instant, no-questions-asked refund or replacement. Open the Help & Customer Support section from your Account Drawer or call our 24/7 toll-free helpline at 1800-FRESHIT to get an instant refund to your Freshit Money wallet or original payment source.',
    },
    {
      q: 'Are your fruits and vegetables fresh?',
      a: 'Yes! We source directly from vetted local farm cooperatives in Hooghly and Nadia districts every single morning at 4:30 AM. Produce is washed, ozone-sanitized, and quality-inspected before reaching our shelves.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] font-['Satoshi',sans-serif]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#121212] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <FreshitLogo size="sm" theme="dark" showBadge={false} />
                <span className="h-4 w-px bg-white/20" />
                <h3 className="font-bold text-sm sm:text-base font-['Clash_Display',sans-serif] text-[#F5ECD5]">
                  Store Information & Policies
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none text-xs font-bold font-['Clash_Display',sans-serif]">
              {[
                { id: 'about' as const, label: 'About Freshit', icon: Store },
                { id: 'store' as const, label: 'Flagship Hub', icon: MapPin },
                { id: 'careers' as const, label: 'Rider Careers', icon: Bike, badge: 'Hiring' },
                { id: 'faqs' as const, label: 'FAQs & Help', icon: HelpCircle },
                { id: 'fssai' as const, label: 'FSSAI Safety', icon: CheckCircle2 },
                { id: 'privacy' as const, label: 'Privacy Policy', icon: Lock },
                { id: 'terms' as const, label: 'Terms & Conditions', icon: FileText },
                { id: 'security' as const, label: 'Security', icon: ShieldCheck },
                { id: 'grievance' as const, label: 'Grievance Desk', icon: Mail },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {/* 1. ABOUT US */}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#085E2B] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 font-['Clash_Display',sans-serif]">
                        Freshit: Instant Neighborhood Kirana Commerce
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Born with a simple mission: bringing authentic local kirana warmth, farm-fresh local produce, and modern 8-minute delivery speed to the doorsteps of Chandrahati Bazar, Naya Sarai, and Raghunathpur.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                      <span className="text-lg font-extrabold text-[#085E2B] font-['Clash_Display',sans-serif] block">
                        8 Minutes
                      </span>
                      <span className="text-xs font-bold text-slate-800 block">Average Dispatch</span>
                      <p className="text-[11px] text-slate-500">Pick-and-pack fulfillment directly from our single local dark store hub.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                      <span className="text-lg font-extrabold text-blue-700 font-['Clash_Display',sans-serif] block">
                        25 km Radius
                      </span>
                      <span className="text-xs font-bold text-slate-800 block">Strict Service Geofence</span>
                      <p className="text-[11px] text-slate-500">We never compromise quality by delivering beyond our temperature-controlled radius.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                      <span className="text-lg font-extrabold text-amber-700 font-['Clash_Display',sans-serif] block">
                        1,000+ Items
                      </span>
                      <span className="text-xs font-bold text-slate-800 block">Everyday Essentials</span>
                      <p className="text-[11px] text-slate-500">From Amul taaza milk to farm tomatoes, Aashirvaad atta, and chilled cold drinks.</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <h5 className="font-bold text-slate-900 text-xs font-['Clash_Display',sans-serif] uppercase tracking-wider">
                      The Freshit Promise
                    </h5>
                    <p>
                      Freshit operates under a single store model developed by Convergix. Unlike multi-vendor marketplaces that route orders through third-party intermediaries with unpredictable delays, every item ordered on Freshit comes directly from our own organized inventory.
                    </p>
                    <p>
                      Our riders are local community members, our produce is sourced every morning from nearby Hooghly farms, and our customer support answers in seconds.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. FLAGSHIP STORE */}
              {activeTab === 'store' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#085E2B] uppercase tracking-wider font-['Clash_Display',sans-serif]">
                        Official Operational Facility
                      </span>
                      <h4 className="font-bold text-base text-slate-900 font-['Clash_Display',sans-serif]">
                        Freshit Dark Store &amp; Fulfillment Hub
                      </h4>
                      <p className="text-xs text-slate-600">
                        Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, West Bengal - 712513
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#085E2B] font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                        Live Hub Online
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-['Clash_Display',sans-serif]">
                        Store Operating Hours
                      </h5>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Monday – Sunday:</span>
                          <span className="font-bold text-slate-900">06:00 AM – 11:30 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Morning Farm Fresh Arrival:</span>
                          <span className="font-bold text-[#085E2B]">04:30 AM Daily</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customer Service Helpline:</span>
                          <span className="font-bold text-slate-900">24x7 Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-['Clash_Display',sans-serif]">
                        Direct Contact Lines
                      </h5>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#085E2B]" />
                          <span className="font-bold">1800-FRESHIT (Toll Free)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span>orders@freshit.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pincode Coverage: 712513 &amp; 25 km Geofence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RIDER CAREERS & APPLICATION FORM */}
              {activeTab === 'careers' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-amber-950 font-['Clash_Display',sans-serif]">
                        Earn up to ₹25,000/Month as a Freshit Delivery Hero
                      </h4>
                      <p className="text-xs text-amber-800 mt-1">
                        Deliver within a short 25 km local radius, get daily/weekly payouts, fuel subsidies, and full health insurance coverage.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-xs shrink-0 font-['Clash_Display',sans-serif]">
                      Immediate Joining
                    </span>
                  </div>

                  {isRiderApplied ? (
                    <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base text-slate-900 font-['Clash_Display',sans-serif]">
                        Application Submitted Successfully!
                      </h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Thank you, {riderForm.name}! Our fleet onboarding team will review your application and call you at {riderForm.phone} within 2 business hours for dark store briefing.
                      </p>
                      <button
                        onClick={() => setIsRiderApplied(false)}
                        className="mt-3 px-4 py-1.5 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#15803D]"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRiderSubmit} className="space-y-3.5 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200">
                      <h5 className="font-bold text-slate-900 text-xs font-['Clash_Display',sans-serif] uppercase tracking-wider">
                        Apply to Join the Freshit Rider Fleet
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Ghosh"
                            value={riderForm.name}
                            onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:outline-hidden focus:border-[#16A34A]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp / Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 98765 43210"
                            value={riderForm.phone}
                            onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:outline-hidden focus:border-[#16A34A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Vehicle *</label>
                          <select
                            value={riderForm.vehicle}
                            onChange={(e) => setRiderForm({ ...riderForm, vehicle: e.target.value })}
                            className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                          >
                            <option value="Motorbike / Scooter">Motorbike / Scooter</option>
                            <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                            <option value="Bicycle">Bicycle (Local &lt; 2km)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Driving License No.</label>
                          <input
                            type="text"
                            placeholder="e.g. WB15 20210001234"
                            value={riderForm.license}
                            onChange={(e) => setRiderForm({ ...riderForm, license: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Preferred Shift</label>
                          <select
                            value={riderForm.shift}
                            onChange={(e) => setRiderForm({ ...riderForm, shift: e.target.value })}
                            className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                          >
                            <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                            <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                            <option value="Night Peak (6 PM - 12 AM)">Night Peak (6 PM - 12 AM)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold font-['Clash_Display',sans-serif] shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Rider Application</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 4. FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 font-['Clash_Display',sans-serif]">
                    Frequently Asked Questions
                  </h4>

                  <div className="space-y-2">
                    {FAQS.map((faq, idx) => {
                      const isOpenFaq = expandedFaq === idx;
                      return (
                        <div
                          key={faq.q}
                          className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-colors"
                        >
                          <button
                            onClick={() => setExpandedFaq(isOpenFaq ? null : idx)}
                            className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer hover:bg-slate-50"
                          >
                            <span>{faq.q}</span>
                            {isOpenFaq ? (
                              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                          </button>
                          {isOpenFaq && (
                            <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 bg-slate-50/50">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. FSSAI FOOD SAFETY */}
              {activeTab === 'fssai' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold text-[#085E2B] uppercase tracking-wider font-['Clash_Display',sans-serif]">
                      Government Food Safety Compliance
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 font-['Clash_Display',sans-serif]">
                      FSSAI License No. 10020051003412
                    </h4>
                    <p className="text-xs text-slate-600">
                      Certified Category: Food Retailer, Storage &amp; Quick Commerce E-Commerce Distribution.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <h5 className="font-bold text-slate-900 text-xs font-['Clash_Display',sans-serif]">
                      Daily Quality &amp; Cold-Chain Standards
                    </h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Temperature Control:</strong> Milk, curd, paneer, and butter are stored constantly between 2°C and 4°C in monitored walk-in chillers.</li>
                      <li><strong>Ozone Vegetable Washing:</strong> All leafy greens and raw vegetables undergo ozone sanitization to remove surface microbes and pesticide residues.</li>
                      <li><strong>Batch Expiry Monitoring:</strong> Products expiring within 48 hours are automatically decommissioned and removed from order fulfillment.</li>
                      <li><strong>FSSAI Hygiene Rating:</strong> 5-Star Hygiene Audit verified under Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 6. PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-sm text-slate-900 font-['Clash_Display',sans-serif]">
                    Freshit Customer Privacy Policy
                  </h4>
                  <p>
                    Fresh Commerce Private Limited (&ldquo;Freshit&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your personal privacy. We only collect the minimal information required to fulfill your grocery delivery, including your name, contact phone number, and delivery street address.
                  </p>
                  <p>
                    <strong>Geolocation Data:</strong> Your precise GPS coordinates are collected solely to calculate distance to our dark store hub, check if your address is within our 25 km delivery geofence, and route our riders. We never sell or share location traces with ad networks.
                  </p>
                  <p>
                    <strong>Payment Data:</strong> All payments are processed through RBI-authorized payment aggregators. Freshit does not store credit card numbers, CVVs, or bank net-banking passwords on our servers.
                  </p>
                </div>
              )}

              {/* 7. TERMS & CONDITIONS */}
              {activeTab === 'terms' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-sm text-slate-900 font-['Clash_Display',sans-serif]">
                    Terms and Conditions of Service
                  </h4>
                  <p>
                    1. <strong>Single-Store Kirana Model:</strong> Freshit operates a single flagship dark store in Raghunathpur (PIN: 712513). Deliveries are strictly limited to verified addresses within our 25 km radius.
                  </p>
                  <p>
                    2. <strong>Delivery Estimates:</strong> Our 8-minute delivery commitment applies under standard operating conditions. Severe weather, flash floods, or railway crossing delays may cause minor variations; our app updates countdown timers live.
                  </p>
                  <p>
                    3. <strong>Returns &amp; Cancellations:</strong> Orders may be cancelled with full immediate refund at any point before the order status reaches &ldquo;Out for Delivery&rdquo;. Perishable grocery items with quality defects are refunded without return pickup.
                  </p>
                </div>
              )}

              {/* 8. SECURITY & COMPLIANCE */}
              {activeTab === 'security' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-sm text-slate-900 font-['Clash_Display',sans-serif]">
                    Security Architecture &amp; Data Protection
                  </h4>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                    <span className="font-bold text-xs uppercase tracking-wider font-['Clash_Display',sans-serif] block">
                      End-to-End Cryptographic Protection
                    </span>
                    <p className="text-xs">
                      All data in transit is encrypted using TLS 1.3 with 256-bit AES encryption. Our server infrastructure adheres to ISO/IEC 27001 security guidelines.
                    </p>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Strict CORS and Content Security Policy headers enforced.</li>
                    <li>Tokenized UPI &amp; card payment flows with 2-factor authentication.</li>
                    <li>Daily automated vulnerability scans and automated audit logging for admin actions.</li>
                  </ul>
                </div>
              )}

              {/* 9. GRIEVANCE OFFICER */}
              {activeTab === 'grievance' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-sm text-slate-900 font-['Clash_Display',sans-serif]">
                    Consumer Grievance Redressal Mechanism
                  </h4>
                  <p>
                    In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the details of the designated Grievance Officer are published below:
                  </p>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm font-['Clash_Display',sans-serif]">
                      Mr. Subhajit Sen
                    </div>
                    <p className="text-slate-600">Grievance &amp; Nodal Consumer Officer, Freshit Operations</p>
                    <p className="text-slate-600">
                      <strong>Office Address:</strong> Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, West Bengal - 712513
                    </p>
                    <p className="text-slate-600">
                      <strong>Email:</strong> <a href="mailto:grievance@freshit.com" className="text-[#085E2B] font-bold underline">grievance@freshit.com</a>
                    </p>
                    <p className="text-slate-600">
                      <strong>Resolution Timeframe:</strong> All consumer grievances are acknowledged within 48 hours and resolved within 30 days of receipt.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-medium text-[11px]">
                Freshit Quick Commerce · Single Dark Store Network
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs font-['Clash_Display',sans-serif] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
