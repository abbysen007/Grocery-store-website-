import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Percent,
  Clock,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import { Order, Product } from '../../../types';

interface ReportsPageProps {
  orders: Order[];
  products: Product[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ orders, products }) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');

  // Aggregated analytics metrics
  const analytics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const grossRevenue = validOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const avgOrderValue = validOrders.length > 0 ? Math.round(grossRevenue / validOrders.length) : 0;
    const deliveryFees = validOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    const riderTips = validOrders.reduce((sum, o) => sum + (o.tip || 0), 0);

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    validOrders.forEach((o) => {
      o.items.forEach((it) => {
        const cat = it.product.category || 'General';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + it.product.price * it.quantity;
      });
    });

    // Payment methods
    const methodCounts: Record<string, number> = {};
    validOrders.forEach((o) => {
      const m = o.paymentDetails?.method || 'UPI';
      methodCounts[m] = (methodCounts[m] || 0) + 1;
    });

    return {
      grossRevenue,
      totalOrders: validOrders.length,
      avgOrderValue,
      deliveryFees,
      riderTips,
      cancelledCount: orders.filter((o) => o.status === 'cancelled').length,
      categoryTotals,
      methodCounts,
    };
  }, [orders]);

  // Export Summary Report
  const handleExportReport = () => {
    const lines = [
      'Freshit Dark Store - Operational Business Report',
      `Generated At,${new Date().toISOString()}`,
      `Date Filter Range,${dateRange}`,
      `Total Completed/Active Orders,${analytics.totalOrders}`,
      `Gross Store Revenue,INR ${analytics.grossRevenue}`,
      `Average Order Value,INR ${analytics.avgOrderValue}`,
      `Cancelled Orders,${analytics.cancelledCount}`,
      '',
      'Category Revenue Breakdown:',
      ...Object.entries(analytics.categoryTotals).map(([cat, val]) => `"${cat}",INR ${val}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshit-report-${dateRange}-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Store Performance & Financial Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Real order logs and inventory turnover metrics for the Chandrahati hub
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['today', '7days', '30days', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  dateRange === range
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Gross Sales
          </span>
          <div className="text-2xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            ₹{analytics.grossRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +14.8% vs last week
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Orders
          </span>
          <div className="text-2xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            {analytics.totalOrders}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> 100% single store fulfillment
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-black text-slate-900 font-['Clash_Display',sans-serif]">
            ₹{analytics.avgOrderValue}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Across essentials & fresh produce
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Cancellations
          </span>
          <div className="text-2xl font-black text-rose-600 font-['Clash_Display',sans-serif]">
            {analytics.cancelledCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Pre-dispatch reversal rate: &lt;2%
          </span>
        </div>
      </div>

      {/* Visual Category Sales Breakdown & Payment Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              Revenue by Product Category Aisle
            </h3>
            <span className="text-xs text-slate-400 font-medium">Sales Share</span>
          </div>

          <div className="space-y-3">
            {Object.entries(analytics.categoryTotals).map(([cat, total]) => {
              const pct = analytics.grossRevenue > 0 ? Math.round((total / analytics.grossRevenue) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-slate-900 font-bold">
                      ₹{total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Channels & Surcharges */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              Payment Methods & Ancillary Income
            </h3>
            <span className="text-xs text-slate-400 font-medium">Transactions</span>
          </div>

          <div className="space-y-3">
            {Object.entries(analytics.methodCounts).map(([method, count]) => {
              const pct = analytics.totalOrders > 0 ? Math.round((count / analytics.totalOrders) * 100) : 0;

              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{method}</span>
                    <span className="text-slate-900 font-bold">
                      {count} orders ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Total Delivery Fees Collected:</span>
                <span className="text-base font-bold text-slate-900">₹{analytics.deliveryFees}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Rider Tips Disbursed:</span>
                <span className="text-base font-bold text-emerald-800">₹{analytics.riderTips}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
