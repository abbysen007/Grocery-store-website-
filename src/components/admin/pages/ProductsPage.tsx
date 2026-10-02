import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  Sparkles,
  Layers,
  IndianRupee,
  Package,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { Product } from '../../../types';
import { CATEGORIES } from '../../../data/mockData';

const CURATED_IMAGE_PRESETS: Record<string, { label: string; url: string }[]> = {
  'Vegetables & Fruits': [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
    { label: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80' },
    { label: 'Red Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
    { label: 'Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80' },
  ],
  'Dairy, Bread & Eggs': [
    { label: 'Milk Pouch', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
    { label: 'Farm Eggs', url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=80' },
    { label: 'Artisan Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },
  ],
  'Atta, Rice & Dal': [
    { label: 'Chakki Atta', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },
    { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80' },
  ],
  'Snacks & Drinks': [
    { label: 'Potato Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80' },
    { label: 'Chilled Cola', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80' },
  ],
  'Oil, Ghee & Masala': [
    { label: 'Cooking Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80' },
    { label: 'Spices Mix', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80' },
  ],
};

interface ProductsPageProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onUpdateProducts,
  onLogAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New product form state
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    category: CATEGORIES[0].name,
    weight: '500 g',
    price: 40,
    originalPrice: 50,
    discountPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    deliveryTimeMinutes: 8,
    inStock: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Image file upload validation and DataURL conversion
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSuccess(dataUrl);
        showToast('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pTitle = (p.title || p.name || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const matchesSearch =
        pTitle.includes(searchQuery.toLowerCase()) ||
        pCat.includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Toggle inStock
  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    onUpdateProducts(updated);
    const item = products.find((p) => p.id === productId);
    const itemTitle = item?.title || item?.name || 'Product';
    if (onLogAction) {
      onLogAction('Product Stock Toggled', productId, `${itemTitle} set to ${!item?.inStock ? 'In Stock' : 'Out of Stock'}`);
    }
    showToast(`Updated stock status for ${itemTitle}`);
  };

  // Save Add Product
  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill product name and selling price');
      return;
    }

    const img = formData.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: formData.title,
      title: formData.title,
      category: formData.category || CATEGORIES[0].name,
      weight: formData.weight || '1 unit',
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
      discountPercentage: formData.originalPrice
        ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
        : 0,
      image: img,
      imageUrl: img,
      deliveryTimeMinutes: 8,
      eta: '8 mins',
      description: `${formData.title} - Fresh local kirana produce and essentials from Freshit.`,
      unit: formData.weight || '1 unit',
      inStock: formData.inStock ?? true,
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: CATEGORIES[0].name,
      weight: '500 g',
      price: 40,
      originalPrice: 50,
      discountPercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      deliveryTimeMinutes: 8,
      inStock: true,
    });

    if (onLogAction) {
      onLogAction('New Product Created', newProd.id, `Created ${newProd.title} (₹${newProd.price})`);
    }
    showToast(`Added "${newProd.title}" to store catalogue`);
  };

  // Save Edit Product
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => {
      if (p.id === editingProduct.id) {
        return editingProduct;
      }
      return p;
    });

    onUpdateProducts(updated);
    if (onLogAction) {
      onLogAction('Product Edited', editingProduct.id, `Updated ${editingProduct.title}`);
    }
    showToast(`Updated "${editingProduct.title}"`);
    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const prodTitle = prod?.title || prod?.name || 'Product';
    if (!window.confirm(`Are you sure you want to remove "${prodTitle}" from the store catalogue?`)) {
      return;
    }

    const updated = products.filter((p) => p.id !== productId);
    onUpdateProducts(updated);
    if (onLogAction) {
      onLogAction('Product Deleted', productId, `Deleted ${prodTitle}`);
    }
    showToast(`Deleted "${prodTitle}" from store catalogue`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = 'ID,Title,Category,Weight,Price,OriginalPrice,DiscountPct,InStock\n';
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${(p.title || p.name || '').replace(/"/g, '""')}","${p.category}","${p.weight}",${p.price},${p.originalPrice},${p.discountPercentage},${p.inStock}`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshit-products-${Date.now()}.csv`;
    a.click();
    showToast('Exported product catalogue to CSV');
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-['Clash_Display',sans-serif] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search product title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#16A34A] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-medium"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#16A34A]"
          >
            <option value="all">All Aisles ({products.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            title="Download CSV Catalogue"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category Aisle</th>
                <th className="py-3 px-4">Unit Weight</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">MRP / Discount</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">{p.weight}</td>

                  <td className="py-3 px-4 font-bold text-slate-900">₹{p.price}</td>

                  <td className="py-3 px-4">
                    <span className="line-through text-slate-400 mr-1.5">₹{p.originalPrice}</span>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                      {p.discountPercentage}% OFF
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStock(p.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer border transition-colors ${
                        p.inStock
                          ? 'bg-emerald-50 text-[#15803D] border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-[#16A34A]' : 'bg-rose-500'}`} />
                      <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNewProduct}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Add New Kirana Grocery Item
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farm Fresh Palak / Aashirvaad Shudh Chakki Atta"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#16A34A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Aisle Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Weight / Vol *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 g, 1 kg, 1 Litre, 6 pcs"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Original Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Product Image Management */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Product Image &amp; Media</span>
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Preview and Upload Trigger */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload Image File (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => setFormData({ ...formData, imageUrl: url }))
                        }
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or enter image URL (https://...)"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-800"
                    />
                  </div>
                </div>

                {/* Quick 1-tap curated presets for selected category */}
                {formData.category && CURATED_IMAGE_PRESETS[formData.category] && (
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {CURATED_IMAGE_PRESETS[formData.category].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="rounded text-[#16A34A] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Available in stock for 8-minute delivery
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditProduct}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Edit Product Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight / Unit</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.weight}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      const orig = editingProduct.originalPrice || newPrice;
                      const disc = orig > newPrice ? Math.round(((orig - newPrice) / orig) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        price: newPrice,
                        discountPercentage: disc,
                      });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.originalPrice}
                    onChange={(e) => {
                      const newOrig = Number(e.target.value);
                      const disc = newOrig > editingProduct.price ? Math.round(((newOrig - editingProduct.price) / newOrig) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: newOrig,
                        discountPercentage: disc,
                      });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Edit Image Management */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Product Image &amp; Media</span>
                  </label>
                  {editingProduct.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, imageUrl: '' })}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {editingProduct.imageUrl ? (
                      <img
                        src={editingProduct.imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Replace Image (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => setEditingProduct({ ...editingProduct, imageUrl: url }))
                        }
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or enter image URL (https://...)"
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-800"
                    />
                  </div>
                </div>

                {/* Presets for category */}
                {editingProduct.category && CURATED_IMAGE_PRESETS[editingProduct.category] && (
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {CURATED_IMAGE_PRESETS[editingProduct.category].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, imageUrl: preset.url })}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editInStock"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="rounded text-[#16A34A] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="editInStock" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Available in Stock
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
