import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Users,
  Bike,
  Navigation,
  Tag,
  CreditCard,
  BarChart3,
  Bell,
  HeadphonesIcon,
  ShieldCheck,
  Store,
  Globe,
  FileText,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

export type AdminPageId =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'delivery_partners'
  | 'delivery_management'
  | 'offers'
  | 'payments'
  | 'reports'
  | 'notifications'
  | 'support'
  | 'staff'
  | 'store_settings'
  | 'website_settings'
  | 'activity_logs'
  | 'profile'
  | 'logout';

interface NavItem {
  id: AdminPageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Core Operations
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core Operations' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: 'Live', badgeColor: 'bg-emerald-500 text-white' },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'inventory', label: 'Inventory', icon: Boxes },

  // Logistics & Users
  { id: 'customers', label: 'Customers', icon: Users, section: 'Logistics & Users' },
  { id: 'delivery_partners', label: 'Delivery Partners', icon: Bike },
  { id: 'delivery_management', label: 'Delivery Dispatch', icon: Navigation, badge: '25km', badgeColor: 'bg-emerald-600/10 text-emerald-800' },

  // Growth & Finance
  { id: 'offers', label: 'Offers & Discounts', icon: Tag, section: 'Growth & Finance' },
  { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },

  // Communication & Support
  { id: 'notifications', label: 'Notifications', icon: Bell, section: 'Support & Security' },
  { id: 'support', label: 'Customer Support', icon: HeadphonesIcon, badge: 2, badgeColor: 'bg-amber-500 text-white' },
  { id: 'staff', label: 'Staff & Permissions', icon: ShieldCheck },

  // Store Configuration
  { id: 'store_settings', label: 'Store Settings', icon: Store, section: 'Settings' },
  { id: 'website_settings', label: 'Website Settings', icon: Globe },
  { id: 'activity_logs', label: 'Activity Logs', icon: FileText },
  { id: 'profile', label: 'Admin Profile', icon: UserCheck },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

interface AdminSidebarProps {
  currentPage: AdminPageId;
  onSelectPage: (page: AdminPageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: AdminUser;
  onViewStore: () => void;
  pendingOrdersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  currentUser,
  onViewStore,
  pendingOrdersCount = 2,
}) => {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#14532D] text-white transition-all duration-300 flex flex-col shadow-2xl border-r border-emerald-950/40 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-800/60 bg-[#0F3E22]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center font-black text-white text-xl shadow-lg shrink-0">
              F
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-['Clash_Display',sans-serif] font-bold text-lg text-white tracking-wide truncate flex items-center gap-1.5">
                  Freshit
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    ADMIN
                  </span>
                </span>
                <span className="text-[10px] text-emerald-300/80 truncate">
                  Kirana Store Control Center
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* View Storefront Quick Button */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={onViewStore}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isCollapsed
                ? 'justify-center bg-emerald-800/40 text-emerald-200 hover:bg-emerald-700/50 border-emerald-700/50'
                : 'bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 border-emerald-500/30'
            }`}
            title="View Live Customer Storefront"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && (
              <span className="truncate flex-1 text-left">View Customer Store</span>
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-emerald-800">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isLogout = item.id === 'logout';
            const showSection = !isCollapsed && item.section && (index === 0 || NAV_ITEMS[index - 1].section !== item.section);

            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 font-['Clash_Display',sans-serif]">
                    {item.section}
                  </div>
                )}

                <button
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-md font-bold'
                      : isLogout
                      ? 'text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 mt-2 border border-rose-800/30'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white scale-110' : isLogout ? 'text-rose-400' : 'text-emerald-300 group-hover:text-white'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.id === 'orders' && pendingOrdersCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-400 text-emerald-950 animate-pulse">
                      {pendingOrdersCount} new
                    </span>
                  )}

                  {!isCollapsed && item.badge && item.id !== 'orders' && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                        item.badgeColor || 'bg-emerald-800 text-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer Admin Info */}
        <div className="p-3 border-t border-emerald-800/60 bg-[#0F3E22]">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-emerald-300 truncate font-medium">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
