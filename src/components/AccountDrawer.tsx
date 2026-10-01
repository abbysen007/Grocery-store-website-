import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Package, 
  MapPin, 
  Wallet, 
  Ticket, 
  Settings, 
  Headphones, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  Check, 
  Bell, 
  Volume2, 
  Globe, 
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';
import { UserProfile, UserAddress, Order, UserWallet, Coupon } from '../types';
import { FreshitLogo } from './FreshitLogo';
import { OrderHistoryView } from './OrderHistoryView';
import { SavedAddressesView } from './SavedAddressesView';
import { WalletView } from './WalletView';
import { CouponsView } from './CouponsView';
import { CustomerSupportModal } from './CustomerSupportModal';

export type AccountSubView = 'menu' | 'orders' | 'addresses' | 'wallet' | 'coupons' | 'settings' | 'support';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  addresses: UserAddress[];
  currentAddress: UserAddress;
  onSelectCurrentAddress: (addr: UserAddress) => void;
  onAddAddress: (addr: UserAddress) => void;
  onUpdateAddress: (addr: UserAddress) => void;
  onDeleteAddress: (id: string) => void;
  wallet: UserWallet;
  onTopUpWallet: (amount: number) => void;
  onApplyCoupon?: (coupon: Coupon) => void;
  initialSubView?: AccountSubView;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onLogout,
  orders,
  onReorder,
  onTrackOrder,
  addresses,
  currentAddress,
  onSelectCurrentAddress,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  wallet,
  onTopUpWallet,
  onApplyCoupon,
  initialSubView = 'menu',
}) => {
  const [currentSubView, setCurrentSubView] = useState<AccountSubView>(initialSubView);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile edit form state
  const [editName, setEditName] = useState(userProfile.name);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editEmail, setEditEmail] = useState(userProfile.email);

  // Settings preferences state
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [deliverySound, setDeliverySound] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name: editName.trim() || userProfile.name,
      phone: editPhone.trim() || userProfile.phone,
      email: editEmail.trim() || userProfile.email,
    });
    setIsEditingProfile(false);
  };

  // Get user initials
  const initials = userProfile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Slide-in Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-lg bg-white/85 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden border-l border-white/60"
            >
              {/* Drawer Top Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2">
                  <FreshitLogo size="sm" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Clash_Display',sans-serif]">
                    · Account
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Main Body */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6">
                
                {/* 1. Sub-View: Orders */}
                {currentSubView === 'orders' && (
                  <OrderHistoryView
                    orders={orders}
                    onReorder={onReorder}
                    onTrackOrder={(ord) => {
                      onTrackOrder(ord);
                      onClose();
                    }}
                    onBack={() => setCurrentSubView('menu')}
                  />
                )}

                {/* 2. Sub-View: Addresses */}
                {currentSubView === 'addresses' && (
                  <SavedAddressesView
                    addresses={addresses}
                    currentAddress={currentAddress}
                    onSelectCurrentAddress={onSelectCurrentAddress}
                    onAddAddress={onAddAddress}
                    onUpdateAddress={onUpdateAddress}
                    onDeleteAddress={onDeleteAddress}
                    onBack={() => setCurrentSubView('menu')}
                  />
                )}

                {/* 3. Sub-View: Wallet */}
                {currentSubView === 'wallet' && (
                  <WalletView
                    wallet={wallet}
                    onTopUp={onTopUpWallet}
                    onBack={() => setCurrentSubView('menu')}
                  />
                )}

                {/* 4. Sub-View: Coupons */}
                {currentSubView === 'coupons' && (
                  <CouponsView
                    onApplyCoupon={(c) => {
                      if (onApplyCoupon) onApplyCoupon(c);
                    }}
                    onBack={() => setCurrentSubView('menu')}
                  />
                )}

                {/* 5. Sub-View: Support */}
                {currentSubView === 'support' && (
                  <CustomerSupportModal
                    onBack={() => setCurrentSubView('menu')}
                  />
                )}

                {/* 6. Sub-View: Settings */}
                {currentSubView === 'settings' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <button
                        onClick={() => setCurrentSubView('menu')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        ← Back to Menu
                      </button>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Settings & Preferences
                      </h3>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-[#085E2B]" />
                          <div>
                            <span className="font-bold text-[#121212] block text-xs">
                              8-Min Delivery SMS &amp; Notifications
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Real-time updates when rider is nearby
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={orderNotifications}
                          onChange={(e) => setOrderNotifications(e.target.checked)}
                          className="w-4 h-4 accent-[#085E2B] rounded"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-[#F5ECD5]" />
                          <div>
                            <span className="font-bold text-[#121212] block text-xs">
                              Promotional Cashback Alerts
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Weekly coupons and super discounts
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={promoAlerts}
                          onChange={(e) => setPromoAlerts(e.target.checked)}
                          className="w-4 h-4 accent-[#085E2B] rounded"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-bold text-[#121212] block text-xs">
                              In-App Sound Effects
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Cart add and delivery bell sounds
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={deliverySound}
                          onChange={(e) => setDeliverySound(e.target.checked)}
                          className="w-4 h-4 accent-[#085E2B] rounded"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-purple-600" />
                          <div>
                            <span className="font-bold text-[#121212] block text-xs">
                              App Language
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Choose preferred language
                            </span>
                          </div>
                        </div>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as any)}
                          className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">हिंदी (Hindi)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 0. Main Menu View */}
                {currentSubView === 'menu' && (
                  <div className="space-y-5">
                    
                    {/* User Header Profile Card */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 p-4">
                      {isEditingProfile ? (
                        /* Edit Profile Inline Form */
                        <form onSubmit={handleSaveProfile} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-slate-500 font-['Clash_Display',sans-serif]">
                              Edit Profile Information
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="text-xs font-bold text-slate-400 hover:text-slate-600"
                            >
                              Cancel
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:border-[#085E2B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:border-[#085E2B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:border-[#085E2B]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-[#085E2B] hover:bg-[#064821] text-white rounded-lg text-xs font-bold cursor-pointer font-['Clash_Display',sans-serif]"
                          >
                            Save Changes
                          </button>
                        </form>
                      ) : (
                        /* Default Profile Display */
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className="w-13 h-13 rounded-2xl bg-[#085E2B] text-white flex items-center justify-center font-bold text-base shadow-xs font-['Clash_Display',sans-serif]">
                              {initials}
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-[#121212] leading-tight font-['Clash_Display',sans-serif]">
                                {userProfile.name}
                              </h3>
                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                {userProfile.phone}
                              </p>
                              <span className="text-[11px] text-slate-400 block">
                                {userProfile.email}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setEditName(userProfile.name);
                              setEditPhone(userProfile.phone);
                              setEditEmail(userProfile.email);
                              setIsEditingProfile(true);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-[#085E2B] hover:underline cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Wallet & Coupon Ticker Cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setCurrentSubView('wallet')}
                        className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl cursor-pointer hover:bg-emerald-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#085E2B] mb-1 font-['Clash_Display',sans-serif]">
                          <Wallet className="w-4 h-4" />
                          <span>Freshit Money</span>
                        </div>
                        <span className="text-lg font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">
                          ₹{wallet.balance}
                        </span>
                        <span className="text-[10px] text-emerald-800 block font-medium">
                          1-tap checkout balance
                        </span>
                      </div>

                      <div
                        onClick={() => setCurrentSubView('coupons')}
                        className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl cursor-pointer hover:bg-amber-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1 font-['Clash_Display',sans-serif]">
                          <Ticket className="w-4 h-4" />
                          <span>Coupons</span>
                        </div>
                        <span className="text-lg font-bold text-[#121212] font-['Clash_Display',sans-serif]">
                          4 Active
                        </span>
                        <span className="text-[10px] text-amber-800 block font-medium">
                          Save up to ₹150 today
                        </span>
                      </div>
                    </div>

                    {/* Account Navigation Menu List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block mb-1 font-['Clash_Display',sans-serif]">
                        Activity & Settings
                      </span>

                      {[
                        {
                          id: 'orders' as const,
                          icon: Package,
                          label: 'Your Orders',
                          badge: `${orders.length} orders`,
                          color: 'text-emerald-700 bg-emerald-50',
                        },
                        {
                          id: 'addresses' as const,
                          icon: MapPin,
                          label: 'Saved Addresses',
                          badge: `${addresses.length} saved`,
                          color: 'text-blue-700 bg-blue-50',
                        },
                        {
                          id: 'wallet' as const,
                          icon: Wallet,
                          label: 'Freshit Money & Wallets',
                          badge: `₹${wallet.balance}`,
                          color: 'text-amber-700 bg-amber-50',
                        },
                        {
                          id: 'coupons' as const,
                          icon: Ticket,
                          label: 'Offers & Coupons',
                          badge: '4 Available',
                          color: 'text-purple-700 bg-purple-50',
                        },
                        {
                          id: 'settings' as const,
                          icon: Settings,
                          label: 'Settings & Preferences',
                          badge: 'Alerts & Sounds',
                          color: 'text-slate-700 bg-slate-100',
                        },
                        {
                          id: 'support' as const,
                          icon: Headphones,
                          label: 'Help & Customer Support',
                          badge: '24x7 Resolution',
                          color: 'text-teal-700 bg-teal-50',
                        },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setCurrentSubView(item.id)}
                            className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer shadow-2xs group"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-xs sm:text-sm text-[#121212] group-hover:text-[#085E2B] transition-colors font-['Clash_Display',sans-serif]">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-slate-400">
                                {item.badge}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to log out of Freshit?')) {
                            onLogout();
                            onClose();
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out of Freshit</span>
                      </button>
                    </div>

                    {/* Legal Notice */}
                    <div className="text-center text-[10px] text-slate-400 font-medium">
                      Freshit Instant Commerce v2.4.0 · 8-Minute Grocery Network
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
