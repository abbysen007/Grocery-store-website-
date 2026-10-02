import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Package,
  X,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Category, Product } from '../../../types';

interface CategoriesPageProps {
  categories: (Category & { displayOrder: number; enabled: boolean })[];
  onUpdateCategories: (categories: (Category & { displayOrder: number; enabled: boolean })[]) => void;
  products: Product[];
  onLogAction?: (action: string, entityId: string, details: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onUpdateCategories,
  products,
  onLogAction,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<(Category & { displayOrder: number; enabled: boolean }) | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reorder Category (Up or Down)
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Re-index display orders
    const reordered = copy.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    onUpdateCategories(reordered);
    showToast(`Reordered "${temp.name}" for customer storefront`);
  };

  // Toggle Category Enabled
  const handleToggleEnable = (catId: string) => {
    const updated = categories.map((c) => (c.id === catId ? { ...c, enabled: !c.enabled } : c));
    onUpdateCategories(updated);
    const cat = categories.find((c) => c.id === catId);
    showToast(`Category "${cat?.name}" ${cat?.enabled ? 'disabled' : 'enabled'}`);
  };

  // Image file upload validation and DataURL conversion
  const handleCategoryFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP)');
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
        showToast('Category image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Edit Category
  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updated = categories.map((c) =>
      c.id === editingCategory.id ? editingCategory : c
    );
    onUpdateCategories(updated);
    if (onLogAction) {
      onLogAction('Category Updated', editingCategory.id, `Updated aisle "${editingCategory.name}"`);
    }
    showToast(`Updated category "${editingCategory.name}"`);
    setEditingCategory(null);
  };

  // Save New Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCat: Category & { displayOrder: number; enabled: boolean } = {
      id: `cat-${Date.now()}`,
      name: formName.trim(),
      icon: 'sparkles',
      imageUrl: formImage,
      displayOrder: categories.length + 1,
      enabled: true,
      itemCount: 0,
      subcategories: [],
    };

    onUpdateCategories([...categories, newCat]);
    setIsAddModalOpen(false);
    setFormName('');
    if (onLogAction) {
      onLogAction('Category Created', newCat.id, `Created category "${newCat.name}"`);
    }
    showToast(`Created new aisle: ${newCat.name}`);
  };

  // Delete Category with Product Association Check
  const handleDeleteCategory = (cat: Category & { displayOrder: number; enabled: boolean }) => {
    const associatedProducts = products.filter((p) => p.category === cat.name);
    if (associatedProducts.length > 0) {
      alert(
        `Cannot delete "${cat.name}": It contains ${associatedProducts.length} active grocery items! Please reassign these products to another aisle first.`
      );
      return;
    }

    if (!window.confirm(`Delete category "${cat.name}"?`)) return;

    const updated = categories.filter((c) => c.id !== cat.id);
    onUpdateCategories(updated);
    if (onLogAction) {
      onLogAction('Category Deleted', cat.id, `Deleted category ${cat.name}`);
    }
    showToast(`Deleted "${cat.name}"`);
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

      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
            Store Category Aisles ({categories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Aisles display in order on the customer app navigation and home rails
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => {
          const productCount = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                cat.enabled ? 'border-slate-200' : 'border-slate-200/50 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate font-['Clash_Display',sans-serif]">
                      {cat.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>{productCount} products in catalogue</span>
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                {/* Reorder Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === categories.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEnable(cat.id)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                      cat.enabled
                        ? 'bg-emerald-50 text-[#15803D] border-emerald-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {cat.enabled ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCategory}
            className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Create Category Aisle
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
                <label className="block text-slate-700 font-bold mb-1">Aisle Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Spices & Ghee"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#16A34A]"
                />
              </div>

              {/* Category Image */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <label className="block text-slate-700 font-bold mb-1 text-xs">Category Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {formImage ? (
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
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

                  <div className="flex-1 space-y-1">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleCategoryFileUpload(e, (url) => setFormImage(url))
                        }
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or enter image URL"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-800"
                    />
                  </div>
                </div>
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
                Save Aisle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditCategory}
            className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Clash_Display',sans-serif]">
                Edit Category Aisle
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Aisle Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#16A34A]"
                />
              </div>

              {/* Edit Image */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <label className="block text-slate-700 font-bold mb-1 text-xs">Category Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {editingCategory.imageUrl ? (
                      <img
                        src={editingCategory.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
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

                  <div className="flex-1 space-y-1">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Replace Image</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleCategoryFileUpload(e, (url) =>
                            setEditingCategory({ ...editingCategory, imageUrl: url })
                          )
                        }
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or enter image URL"
                      value={editingCategory.imageUrl || ''}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, imageUrl: e.target.value })
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catVisibleCheck"
                  checked={editingCategory.enabled}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, enabled: e.target.checked })
                  }
                  className="rounded text-[#16A34A] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="catVisibleCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Aisle is visible to customers on website
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
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
