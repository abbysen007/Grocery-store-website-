import React, { useState, useEffect } from 'react';
import { AdminDataService } from '../../services/adminState';
import {
  AdminPageId,
  AdminSidebar
} from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminLogin } from './AdminLogin';

// Subpages
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { DeliveryPartnersPage } from './pages/DeliveryPartnersPage';
import { DeliveryManagementPage } from './pages/DeliveryManagementPage';
import { OffersPage } from './pages/OffersPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CustomerSupportPage } from './pages/CustomerSupportPage';
import { StaffPermissionsPage } from './pages/StaffPermissionsPage';
import { StoreSettingsPage } from './pages/StoreSettingsPage';
import { WebsiteSettingsPage } from './pages/WebsiteSettingsPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';

// Types
import { Product, Order, Category } from '../../types';
import {
  AdminUser,
  InventoryItem,
  StockAdjustment,
  AdminCustomer,
  DeliveryPartner,
  AdminOffer,
  PaymentTransaction,
  SupportTicket,
  AdminNotification,
  ActivityLog,
  StoreOperationalSettings,
  WebsiteCustomizationSettings
} from '../../types/admin';

interface AdminPanelProps {
  onBackToStore: () => void;
  onOpenRiderPortal?: () => void;
  // External sync callbacks
  onStoreProductsUpdated?: (products: Product[]) => void;
  onStoreSettingsUpdated?: (settings: StoreOperationalSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStore,
  onOpenRiderPortal,
  onStoreProductsUpdated,
  onStoreSettingsUpdated,
}) => {
  // Navigation & UI States
  const [currentPage, setCurrentPage] = useState<AdminPageId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [subFilter, setSubFilter] = useState<string | undefined>(undefined);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('freshit_admin_auth') === 'true';
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState<AdminUser>(() => AdminDataService.getCurrentUser());

  // Entity States
  const [staff, setStaff] = useState<AdminUser[]>(() => AdminDataService.getStaff());
  const [products, setProducts] = useState<Product[]>(() => AdminDataService.getProducts());
  const [categories, setCategories] = useState(() => AdminDataService.getCategories());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => AdminDataService.getInventory());
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(() => AdminDataService.getStockAdjustments());
  const [orders, setOrders] = useState<Order[]>(() => AdminDataService.getOrders());
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => AdminDataService.getCustomers());
  const [riders, setRiders] = useState<DeliveryPartner[]>(() => AdminDataService.getRiders());
  const [offers, setOffers] = useState<AdminOffer[]>(() => AdminDataService.getOffers());
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => AdminDataService.getPayments());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => AdminDataService.getTickets());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => AdminDataService.getNotifications());
  const [logs, setLogs] = useState<ActivityLog[]>(() => AdminDataService.getLogs());
  const [storeSettings, setStoreSettings] = useState<StoreOperationalSettings>(() => AdminDataService.getStoreSettings());
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteCustomizationSettings>(() => AdminDataService.getWebsiteSettings());

  // Audit Logger
  const handleLogAction = (action: string, entityId: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      staffName: currentUser.name,
      staffEmail: currentUser.email,
      action,
      entityType: 'order',
      entityId,
      timestamp: 'Just now',
      details,
      result: 'success',
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    AdminDataService.logAction({
      staffName: currentUser.name,
      staffEmail: currentUser.email,
      action,
      entityType: 'order',
      entityId,
      details,
      result: 'success',
    });
  };

  // State Mutators with Persistence & External Propagation
  const handleUpdateProducts = (updated: Product[]) => {
    setProducts(updated);
    AdminDataService.saveProducts(updated);
    if (onStoreProductsUpdated) onStoreProductsUpdated(updated);
  };

  const handleUpdateCategories = (updated: (Category & { displayOrder: number; enabled: boolean })[]) => {
    setCategories(updated);
    AdminDataService.saveCategories(updated);
  };

  const handleUpdateInventory = (updated: InventoryItem[]) => {
    setInventory(updated);
    AdminDataService.saveInventory(updated);
  };

  const handleAddAdjustment = (adj: Omit<StockAdjustment, 'id' | 'timestamp'>) => {
    AdminDataService.addStockAdjustment(adj);
    setAdjustments(AdminDataService.getStockAdjustments());
  };

  const handleUpdateOrders = (updated: Order[]) => {
    setOrders(updated);
    AdminDataService.saveOrders(updated);
  };

  const handleUpdateCustomers = (updated: AdminCustomer[]) => {
    setCustomers(updated);
    AdminDataService.saveCustomers(updated);
  };

  const handleUpdateRiders = (updated: DeliveryPartner[]) => {
    setRiders(updated);
    AdminDataService.saveRiders(updated);
  };

  const handleUpdateOffers = (updated: AdminOffer[]) => {
    setOffers(updated);
    AdminDataService.saveOffers(updated);
  };

  const handleUpdatePayments = (updated: PaymentTransaction[]) => {
    setPayments(updated);
    AdminDataService.savePayments(updated);
  };

  const handleUpdateTickets = (updated: SupportTicket[]) => {
    setTickets(updated);
    AdminDataService.saveTickets(updated);
  };

  const handleUpdateNotifications = (updated: AdminNotification[]) => {
    setNotifications(updated);
    AdminDataService.saveNotifications(updated);
  };

  const handleUpdateStaff = (updated: AdminUser[]) => {
    setStaff(updated);
    AdminDataService.saveStaff(updated);
  };

  const handleUpdateStoreSettings = (updated: StoreOperationalSettings) => {
    setStoreSettings(updated);
    AdminDataService.saveStoreSettings(updated);
    if (onStoreSettingsUpdated) onStoreSettingsUpdated(updated);
  };

  const handleUpdateWebsiteSettings = (updated: WebsiteCustomizationSettings) => {
    setWebsiteSettings(updated);
    AdminDataService.saveWebsiteSettings(updated);
  };

  const handleUpdateCurrentUser = (user: AdminUser) => {
    setCurrentUser(user);
    AdminDataService.setCurrentUser(user);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('freshit_admin_auth', 'true');
    } catch {}
    handleLogAction('Staff Login', user.id, `Signed in as ${user.role}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('freshit_admin_auth');
    } catch {}
    handleLogAction('Staff Logout', currentUser.id, 'Session terminated securely');
  };

  // If unauthenticated, show Login screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToStore={onBackToStore}
      />
    );
  }

  // Handle Logout Tab Click
  if (currentPage === 'logout') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <span className="text-xl font-bold">!</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Sign out of Admin Center?
          </h3>
          <p className="text-xs text-slate-500">
            You will need to sign in again to manage store operations and orders.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Satoshi',sans-serif] text-slate-900">
      {/* 1. Left Persistent Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          setSubFilter(undefined);
          setCurrentPage(page);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onViewStore={onBackToStore}
        pendingOrdersCount={orders.filter((o) => o.status === 'placed').length}
      />

      {/* 2. Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Navbar */}
        <AdminTopNav
          currentPage={currentPage}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          currentUser={currentUser}
          storeSettings={storeSettings}
          onToggleStoreStatus={(online) =>
            handleUpdateStoreSettings({ ...storeSettings, isStoreOnline: online })
          }
          onViewStore={onBackToStore}
          onOpenRiderPortal={onOpenRiderPortal}
          onSelectPage={(page) => {
            setSubFilter(undefined);
            setCurrentPage(page);
          }}
          notifications={notifications}
          onLogout={handleLogout}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Dynamic Route Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <DashboardPage
              orders={orders}
              products={products}
              inventory={inventory}
              customers={customers}
              onSelectPage={(page, filter) => {
                if (filter) setSubFilter(filter);
                setCurrentPage(page);
              }}
            />
          )}

          {currentPage === 'orders' && (
            <OrdersPage
              orders={orders}
              onUpdateOrders={handleUpdateOrders}
              riders={riders}
              onLogAction={handleLogAction}
              initialFilter={subFilter}
            />
          )}

          {currentPage === 'products' && (
            <ProductsPage
              products={products}
              onUpdateProducts={handleUpdateProducts}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'categories' && (
            <CategoriesPage
              categories={categories}
              onUpdateCategories={handleUpdateCategories}
              products={products}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'inventory' && (
            <InventoryPage
              inventory={inventory}
              onUpdateInventory={handleUpdateInventory}
              adjustments={adjustments}
              onAddAdjustment={handleAddAdjustment}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'customers' && (
            <CustomersPage
              customers={customers}
              onUpdateCustomers={handleUpdateCustomers}
              orders={orders}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'delivery_partners' && (
            <DeliveryPartnersPage
              riders={riders}
              onUpdateRiders={handleUpdateRiders}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'delivery_management' && (
            <DeliveryManagementPage
              orders={orders}
              onUpdateOrders={handleUpdateOrders}
              riders={riders}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'offers' && (
            <OffersPage
              offers={offers}
              onUpdateOffers={handleUpdateOffers}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'payments' && (
            <PaymentsPage
              payments={payments}
              onUpdatePayments={handleUpdatePayments}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              orders={orders}
              products={products}
            />
          )}

          {currentPage === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onUpdateNotifications={handleUpdateNotifications}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'support' && (
            <CustomerSupportPage
              tickets={tickets}
              onUpdateTickets={handleUpdateTickets}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'staff' && (
            <StaffPermissionsPage
              staff={staff}
              onUpdateStaff={handleUpdateStaff}
              currentUser={currentUser}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'store_settings' && (
            <StoreSettingsPage
              settings={storeSettings}
              onUpdateSettings={handleUpdateStoreSettings}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'website_settings' && (
            <WebsiteSettingsPage
              settings={websiteSettings}
              onUpdateSettings={handleUpdateWebsiteSettings}
              onLogAction={handleLogAction}
            />
          )}

          {currentPage === 'activity_logs' && (
            <ActivityLogsPage logs={logs} />
          )}

          {currentPage === 'profile' && (
            <AdminProfilePage
              currentUser={currentUser}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onLogout={handleLogout}
              onLogAction={handleLogAction}
            />
          )}
        </main>
      </div>
    </div>
  );
};
