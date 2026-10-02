import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  RotateCcw,
  Sliders,
  History,
  TrendingDown,
  X
} from 'lucide-react';
import { InventoryItem, StockAdjustment } from '../../../types/admin';

interface InventoryPageProps {
  inventory: InventoryItem[];
  onUpdateInventory: (items: InventoryItem[]) => void;
  adjustments: StockAdjustment[];
  onAddAdjustment: (adj: Omit<StockAdjustment, 'id' | 'timestamp'>) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  inventory,
  onUpdateInventory,
  adjustments,
  onAddAdjustment,
  onLogAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Farm collective morning delivery harvest');
  const [adjustType, setAdjustType] = useState<StockAdjustment['adjustmentType']>('add');
  const [thresholdItem, setThresholdItem] = useState<InventoryItem | null>(null);
  const [newThreshold, setNewThreshold] = useState<number>(10);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'low_stock' && item.status === 'low_stock') ||
        (filterStatus === 'out_of_stock' && (item.status === 'out_of_stock' || item.currentStock === 0));

      return matchesSearch && matchesStatus;
    });
  }, [inventory, searchQuery, filterStatus]);

  // Execute Stock Adjustment
  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    const diff = adjustType === 'add' || adjustType === 'return' ? Math.abs(adjustQty) : -Math.abs(adjustQty);
    const newStock = Math.max(0, adjustingItem.currentStock + diff);
    const newAvail = Math.max(0, newStock - adjustingItem.reservedStock);

    let nextStatus: InventoryItem['status'] = 'in_stock';
    if (newStock === 0) nextStatus = 'out_of_stock';
    else if (newStock <= adjustingItem.lowStockThreshold) nextStatus = 'low_stock';

    const updated = inventory.map((i) => {
      if (i.productId === adjustingItem.productId) {
        return {
          ...i,
          currentStock: newStock,
          availableStock: newAvail,
          status: nextStatus,
          lastUpdated: 'Just now',
        };
      }
      return i;
    });

    onUpdateInventory(updated);

    // Record adjustment audit
    onAddAdjustment({
      productId: adjustingItem.productId,
      productName: adjustingItem.productName,
      adjustmentType: adjustType,
      quantity: diff,
      previousStock: adjustingItem.currentStock,
      newStock,
      reason: adjustReason,
      adjustedBy: 'Store Inventory Staff',
    });

    if (onLogAction) {
      onLogAction('Stock Adjusted', adjustingItem.productId, `${adjustingItem.productName}: ${adjustingItem.currentStock} -> ${newStock} (${adjustReason})`);
    }

    showToast(`Stock updated for ${adjustingItem.productName}: ${newStock} units`);
    setAdjustingItem(null);
  };

  // Update Threshold
  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thresholdItem) return;

    const updated = inventory.map((i) => {
      if (i.productId === thresholdItem.productId) {
        let status = i.status;
        if (i.currentStock === 0) status = 'out_of_stock';
        else if (i.currentStock <= newThreshold) status = 'low_stock';
        else status = 'in_stock';

        return { ...i, lowStockThreshold: newThreshold, status };
      }
      return i;
    });

    onUpdateInventory(updated);
    showToast(`Low-stock threshold set to ${newThreshold} for ${thresholdItem.productName}`);
    setThresholdItem(null);
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

      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search SKU or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          {[
            { id: 'all', label: `All Items (${inventory.length})` },
            { id: 'low_stock', label: 'Low Stock Alerts' },
            { id: 'out_of_stock', label: 'Out of Stock' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">SKU & Item Name</th>
                <th className="py-3 px-4">Category Aisle</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Reserved</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Low-Stock Alert Level</th>
                <th className="py-3 px-4">Stock Health</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                      {item.productName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 text-sm">{item.currentStock}</td>

                  <td className="py-3 px-4 text-slate-500">{item.reservedStock}</td>

                  <td className="py-3 px-4 font-bold text-emerald-800">{item.availableStock}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setThresholdItem(item);
                        setNewThreshold(item.lowStockThreshold);
                      }}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-[#16A34A] font-semibold text-[11px] cursor-pointer"
                      title="Edit low stock threshold"
                    >
                      <span>≤ {item.lowStockThreshold} units</span>
                      <Sliders className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        item.status === 'out_of_stock' || item.currentStock === 0
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : item.status === 'low_stock'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-[#15803D] border-emerald-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setAdjustingItem(item);
                        setAdjustQty(10);
                        setAdjustType('add');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#15803D] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Movement History (Audit Trail) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
              Recent Stock Movements & Adjustment Audit Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Logged with reason & staff ID</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-2">Date/Time</th>
                <th className="pb-2">Item</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Qty Change</th>
                <th className="pb-2">Previous → New</th>
                <th className="pb-2">Reason / Remarks</th>
                <th className="pb-2">Adjusted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adjustments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 text-slate-400 font-mono">{a.timestamp}</td>
                  <td className="py-2.5 font-bold text-slate-900">{a.productName}</td>
                  <td className="py-2.5 capitalize font-medium text-slate-700">{a.adjustmentType}</td>
                  <td className="py-2.5 font-bold">
                    <span className={a.quantity > 0 ? 'text-[#16A34A]' : 'text-rose-600'}>
                      {a.quantity > 0 ? `+${a.quantity}` : a.quantity}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600">
                    {a.previousStock} → {a.newStock}
                  </td>
                  <td className="py-2.5 text-slate-600 leading-snug">{a.reason}</td>
                  <td className="py-2.5 text-slate-500">{a.adjustedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmAdjustment}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                  Adjust Stock Balance
                </h3>
                <p className="text-xs text-slate-500">{adjustingItem.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span>Current In-Store Stock:</span>
                <span className="font-bold text-slate-900">{adjustingItem.currentStock} units</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="add">Restock / Farm Arrival (+)</option>
                  <option value="remove">Write-Off / Correction (-)</option>
                  <option value="damaged">Transit Damaged / Expired (-)</option>
                  <option value="return">Customer Return (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Audit Reason (Required)</label>
                <textarea
                  rows={2}
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Fresh farm supply lot #HOO-991 received"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#16A34A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] cursor-pointer"
              >
                Confirm Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT THRESHOLD MODAL */}
      {thresholdItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveThreshold}
            className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Set Low-Stock Warning Threshold
              </h3>
              <button
                type="button"
                onClick={() => setThresholdItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When stock drops to or below this quantity, an alert is triggered in the executive dashboard.
            </p>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Threshold Quantity (units)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={newThreshold}
                onChange={(e) => setNewThreshold(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setThresholdItem(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#16A34A] text-white font-bold text-xs"
              >
                Save Threshold
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
