import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
  Package,
  AlertTriangle,
  Clock,
  Bike,
  CheckCircle2,
  XCircle,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Sparkles,
  Boxes
} from 'lucide-react';
import { Order, Product } from '../../../types';
import { InventoryItem, AdminCustomer } from '../../../types/admin';
import { AdminPageId } from '../AdminSidebar';

interface DashboardPageProps {
  orders: Order[];
  products: Product[];
  inventory: InventoryItem[];
  customers: AdminCustomer[];
  onSelectPage: (page: AdminPageId, filter?: string) => void;
  onSelectOrder?: (order: Order) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  orders,
  products,
  inventory,
  customers,
  onSelectPage,
  onSelectOrder,
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Computed metrics from real store records
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'delivered');
    const pendingOrders = orders.filter((o) => o.status === 'placed');
    const preparingOrders = orders.filter((o) => o.status === 'packing');
    const activeDeliveries = orders.filter((o) => o.status === 'on_the_way');
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

    const totalSales = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    const pendingPayments = orders.filter(
      (o) => (o.paymentDetails?.method === 'cod' || (o.paymentDetails?.method as string) === 'Cash on Delivery') && o.status !== 'delivered' && o.status !== 'cancelled'
    ).length;

    const lowStock = inventory.filter((i) => i.status === 'low_stock').length;
    const outOfStock = inventory.filter((i) => i.status === 'out_of_stock' || i.currentStock === 0).length;

    return {
      totalOrders,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      preparingOrders: preparingOrders.length,
      activeDeliveries: activeDeliveries.length,
      cancelledOrders: cancelledOrders.length,
      totalSales,
      pendingPayments,
      lowStock,
      outOfStock,
      totalCustomers: customers.length,
      totalProducts: products.length,
    };
  }, [orders, products, inventory, customers]);

  // Top-selling products calculation
  const topProducts = useMemo(() => {
    const counts: Record<string, { product: Product; count: number; revenue: number }> = {};
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((it) => {
        if (!counts[it.product.id]) {
          counts[it.product.id] = { product: it.product, count: 0, revenue: 0 };
        }
        counts[it.product.id].count += it.quantity;
        counts[it.product.id].revenue += it.quantity * it.product.price;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Low-stock alert items
  const lowStockItems = useMemo(() => {
    return inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').slice(0, 4);
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
            <h2 className="text-lg font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              Freshit Dark Store Live Operational Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Serving Chandrahati Bazar, Naya Sarai & Raghunathpur within 25 km radius
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          {(['today', 'week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                timeFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'all' ? 'All Time' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid (12 Cards with direct clickable drill-down) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        {/* Total Orders */}
        <div
          onClick={() => onSelectPage('orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            {stats.totalOrders}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            View orders <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => onSelectPage('payments')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            ₹{stats.totalSales.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            Settlements <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Active Deliveries */}
        <div
          onClick={() => onSelectPage('delivery_management')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">On The Way</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            {stats.activeDeliveries}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5">
            Track dispatch <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Preparing */}
        <div
          onClick={() => onSelectPage('orders', 'packing')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Packing</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            {stats.preparingOrders}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-0.5">
            Store packing <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onSelectPage('inventory')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            {stats.lowStock}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-0.5">
            Audit inventory <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onSelectPage('inventory')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-rose-600 font-['Clash_Display',sans-serif]">
            {stats.outOfStock}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-0.5">
            Replenish <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Middle Row: Visual SVG Analytics Trend & Low Stock Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales & Order Trend (Interactive SVG Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Sales & Order Volume Trajectory
              </h3>
              <p className="text-xs text-slate-500">Hourly throughput from Chandrahati single store</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-1 bg-[#16A34A] rounded-full" /> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-1 bg-blue-500 rounded-full" /> Orders
              </span>
            </div>
          </div>

          {/* SVG Line / Bar Graphic */}
          <div className="h-48 w-full relative flex items-end justify-between gap-2 pt-6 pb-2">
            {[
              { time: '06 AM', rev: 450, orders: 3 },
              { time: '08 AM', rev: 1420, orders: 8 },
              { time: '10 AM', rev: 2100, orders: 12 },
              { time: '12 PM', rev: 1890, orders: 10 },
              { time: '02 PM', rev: 890, orders: 5 },
              { time: '04 PM', rev: 1650, orders: 9 },
              { time: '06 PM', rev: 2850, orders: 15 },
              { time: '08 PM', rev: 3400, orders: 18 },
            ].map((pt, i) => {
              const maxRev = 3500;
              const heightPct = Math.round((pt.rev / maxRev) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{pt.rev}
                  </span>
                  <div className="w-full max-w-[28px] bg-slate-100 rounded-lg flex flex-col justify-end p-0.5 h-full overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#16A34A] rounded-md transition-all group-hover:bg-[#15803D]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate">{pt.time}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak hour: 08:00 PM (Dinner & Night grocery rush)</span>
            <button
              onClick={() => onSelectPage('reports')}
              className="text-[#16A34A] font-bold hover:underline flex items-center gap-1"
            >
              Full Reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Low Stock Priority Replenishment Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Critical Alerts</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {lowStockItems.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All grocery items safely above threshold.
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.category} · Threshold: {item.lowStockThreshold}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          item.currentStock === 0
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.currentStock} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectPage('inventory')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Manage Stock & Adjustments
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table & Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-slate-500">Live order stream for single dark store hub</p>
            </div>
            <button
              onClick={() => onSelectPage('orders')}
              className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
            >
              All Orders ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer & Area</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => {
                  const statusColors: Record<string, string> = {
                    placed: 'bg-blue-50 text-blue-700 border-blue-200',
                    packing: 'bg-amber-50 text-amber-700 border-amber-200',
                    on_the_way: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                    delivered: 'bg-slate-100 text-slate-700 border-slate-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800 block">
                          {order.address?.label || 'Customer'}
                        </span>
                        <span className="text-[11px] text-slate-500">{order.address?.area}</span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} items
                      </td>
                      <td className="py-3 font-bold text-slate-900">₹{order.grandTotal}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            statusColors[order.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            if (onSelectOrder) onSelectOrder(order);
                            onSelectPage('orders');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#15803D] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Top Selling Essentials
              </h3>
              <p className="text-xs text-slate-500">Fastest movers today</p>
            </div>
            <button
              onClick={() => onSelectPage('products')}
              className="text-xs font-bold text-[#16A34A] hover:underline"
            >
              Catalogue
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map(({ product, count, revenue }) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name || product.title}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {product.name || product.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {product.weight} · ₹{product.price}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 block">{count} sold</span>
                  <span className="text-[10px] font-bold text-[#16A34A]">₹{revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
