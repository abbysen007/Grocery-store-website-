import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  User,
  Power,
  ShieldAlert,
  X,
  Bike
} from 'lucide-react';
import { AdminUser, AdminNotification, StoreOperationalSettings } from '../../types/admin';
import { AdminPageId } from './AdminSidebar';

interface AdminTopNavProps {
  currentPage: AdminPageId;
  onOpenMobileSidebar: () => void;
  currentUser: AdminUser;
  storeSettings: StoreOperationalSettings;
  onToggleStoreStatus: (online: boolean) => void;
  onViewStore: () => void;
  onOpenRiderPortal?: () => void;
  onSelectPage: (page: AdminPageId) => void;
  notifications: AdminNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const PAGE_TITLES: Record<AdminPageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Dashboard', subtitle: 'Real-time overview of orders, inventory & store metrics' },
  orders: { title: 'Orders Management', subtitle: 'Live order tracking, status lifecycles & dispatch' },
  products: { title: 'Products Catalogue', subtitle: 'Manage grocery items, prices, weights & visibility' },
  categories: { title: 'Categories Directory', subtitle: 'Organize store aisles, display order & homepage layout' },
  inventory: { title: 'Inventory Control', subtitle: 'Stock balance, low-stock thresholds & audit movements' },
  customers: { title: 'Customer Directory', subtitle: 'Registered customer profiles, addresses & orders' },
  delivery_partners: { title: 'Delivery Partners (Riders)', subtitle: 'Verified delivery agents, vehicles & active status' },
  delivery_management: { title: 'Live Delivery Dispatch', subtitle: '25 km geofence coverage & active rider tracking' },
  offers: { title: 'Offers & Discounts', subtitle: 'Promo coupons, minimum order conditions & validity' },
  payments: { title: 'Payments & Refunds', subtitle: 'Gateway transactions, UPI, COD settlements & refunds' },
  reports: { title: 'Reports & Analytics', subtitle: 'Daily revenue, sales trends & category performances' },
  notifications: { title: 'Notification Centre', subtitle: 'Broadcast updates, order SMS & store announcements' },
  support: { title: 'Customer Support Desk', subtitle: 'Customer help tickets, delivery delays & inquiries' },
  staff: { title: 'Staff & Permissions', subtitle: 'Admin user roles, access control & system authorizations' },
  store_settings: { title: 'Store Settings', subtitle: 'Chandrahati dark store hub, timings & delivery fees' },
  website_settings: { title: 'Website Settings', subtitle: 'Banner messages, customer notices & homepage settings' },
  activity_logs: { title: 'Audit Activity Logs', subtitle: 'Immutable administrative trail of all store modifications' },
  profile: { title: 'Admin Profile & Security', subtitle: 'Account settings, session details & password update' },
  logout: { title: 'Sign Out', subtitle: 'Securely terminate admin control session' },
};

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  currentPage,
  onOpenMobileSidebar,
  currentUser,
  storeSettings,
  onToggleStoreStatus,
  onViewStore,
  onOpenRiderPortal,
  onSelectPage,
  notifications,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pageInfo = PAGE_TITLES[currentPage] || { title: 'Admin Center', subtitle: 'Freshit Store Management' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 font-['Clash_Display',sans-serif] tracking-tight truncate">
              {pageInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200">
              25 km Hub
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 truncate -mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Quick Search (Desktop) */}
        <div className="hidden lg:flex items-center relative w-56 xl:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders, products, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Store Online / Paused Switch */}
        <button
          onClick={() => onToggleStoreStatus(!storeSettings.isStoreOnline)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
            storeSettings.isStoreOnline
              ? 'bg-emerald-50 text-[#15803D] border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
          }`}
          title={storeSettings.isStoreOnline ? 'Store is accepting online orders' : 'Store is paused'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              storeSettings.isStoreOnline ? 'bg-[#16A34A] animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="hidden sm:inline">
            {storeSettings.isStoreOnline ? 'Store Online' : 'Store Paused'}
          </span>
        </button>

        {/* View Customer Website Link */}
        <button
          onClick={onViewStore}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
          title="Open Customer Storefront"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          <span>Customer View</span>
        </button>

        {/* View Rider Portal Link */}
        {onOpenRiderPortal && (
          <button
            onClick={onOpenRiderPortal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
            title="Open Rider Fleet Portal"
          >
            <Bike className="w-3.5 h-3.5 text-emerald-700" />
            <span>Rider Portal</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[9px] font-black flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900 font-['Clash_Display',sans-serif] uppercase tracking-wider">
                  Store Notifications ({notifications.length})
                </span>
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    onSelectPage('notifications');
                  }}
                  className="text-[11px] font-bold text-[#16A34A] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.sentAt}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#14532D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-sm bg-emerald-50 text-[#15803D] text-[9px] font-bold uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onSelectPage('profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Admin Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onSelectPage('store_settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <Power className="w-4 h-4 text-slate-500" />
                <span>Store Hub Settings</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
