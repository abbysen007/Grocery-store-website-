import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockData';
import { BLINKIT_DEPARTMENTS } from '../data/blinkitCategories';

interface CategoryViewProps {
  categoryName: string;
  products: Product[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  onSelectCategory: (name: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryName,
  products,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onProductClick,
  onBack,
  onSelectCategory,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'discount'>('relevance');

  // Category synonyms and department groupings
  const matchingCategoryNames = useMemo(() => {
    const target = categoryName.toLowerCase().trim();
    const set = new Set<string>([target]);

    const dept = BLINKIT_DEPARTMENTS.find(
      (d) => d.title.toLowerCase() === target || (d.title === 'Snacks & Drinks' && target === 'snacks & drinks')
    );
    if (dept) {
      dept.categories.forEach((c) => set.add(c.name.toLowerCase()));
    }

    if (target.includes('snack') || target.includes('drink')) {
      ['chips & namkeen', 'sweets & chocolates', 'drinks & juices', 'tea, coffee & milk drinks', 'instant food', 'sauces & spreads', 'paan corner', 'ice creams & more', 'snacks & drinks', 'chips & crisps', 'cold drinks & juices', 'chocolates & candies', 'namkeen & bhujia', 'cookies & biscuits'].forEach((n) => set.add(n));
    } else if (target.includes('veg') || target.includes('fruit')) {
      ['vegetables & fruits', 'fresh vegetables', 'fresh fruits', 'leafy greens', 'hydroponics & salads', 'seasonal exotics'].forEach((n) => set.add(n));
    } else if (target.includes('dairy') || target.includes('bread') || target.includes('egg')) {
      ['dairy, bread & eggs', 'milk', 'bread & pav', 'eggs', 'butter & cheese', 'paneer & curd', 'paneer & tofu', 'curd & yogurt'].forEach((n) => set.add(n));
    } else if (target.includes('atta') || target.includes('rice') || target.includes('dal')) {
      ['atta, rice & dal', 'atta & flour', 'basmati rice', 'pulses & lentils', 'poha & grains', 'organic grains'].forEach((n) => set.add(n));
    } else if (target.includes('oil') || target.includes('ghee') || target.includes('masala')) {
      ['oil, ghee & masala', 'cooking oils', 'desi ghee', 'powdered spices', 'whole spices & seeds', 'whole spices'].forEach((n) => set.add(n));
    } else if (target.includes('bakery') || target.includes('biscuit')) {
      ['bakery & biscuits', 'digestive biscuits', 'cookies & rusk', 'choco fills', 'whole wheat bread', 'cakes & muffins', 'cream biscuits'].forEach((n) => set.add(n));
    } else if (target.includes('beauty') || target.includes('personal') || target.includes('bath') || target.includes('skin')) {
      ['beauty & personal care', 'bath & body', 'hair', 'skin & face', 'beauty & cosmetics', 'soaps & body wash', 'hair care', 'skin care', 'oral hygiene'].forEach((n) => set.add(n));
    } else if (target.includes('house') || target.includes('clean') || target.includes('home')) {
      ['household essentials', 'cleaners & repellents', 'kitchenware & appliances', 'home & lifestyle', 'detergent & fabric care', 'dishwashers'].forEach((n) => set.add(n));
    } else if (target.includes('electr')) {
      ['electronics & gadgets', 'electronics', 'batteries & bulbs', 'charging cables & adapters'].forEach((n) => set.add(n));
    } else if (target.includes('station') || target.includes('craft') || target.includes('game')) {
      ['stationery & crafts', 'stationery & games', 'notebooks & registers', 'art supplies'].forEach((n) => set.add(n));
    } else if (target.includes('meat') || target.includes('chicken') || target.includes('fish')) {
      ['chicken, meat & fish', 'fresh chicken', 'tender mutton', 'fish & seafood'].forEach((n) => set.add(n));
    } else if (target.includes('dry fruit') || target.includes('cereal')) {
      ['dry fruits & cereals', 'almonds & cashews', 'makhana & fox nuts', 'breakfast cereals'].forEach((n) => set.add(n));
    }

    return set;
  }, [categoryName]);

  const subcategoriesList = useMemo(() => {
    const listSet = new Set<string>();

    for (const dept of BLINKIT_DEPARTMENTS) {
      const found = dept.categories.find(
        (c) => matchingCategoryNames.has(c.name.toLowerCase()) || c.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (found) {
        found.subcategories.forEach((s) => listSet.add(s));
      }
    }

    const cat = CATEGORIES.find(
      (c) => matchingCategoryNames.has(c.name.toLowerCase()) || c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (cat) {
      cat.subcategories.forEach((s) => listSet.add(s));
    }

    products.forEach((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subcategory || '').toLowerCase();
      if (matchingCategoryNames.has(pCat) || matchingCategoryNames.has(pSub)) {
        if (p.subcategory) listSet.add(p.subcategory);
      }
    });

    return Array.from(listSet);
  }, [categoryName, products, matchingCategoryNames]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subcategory || '').toLowerCase();
      return (
        matchingCategoryNames.has(pCat) ||
        matchingCategoryNames.has(pSub) ||
        pCat === categoryName.toLowerCase() ||
        pSub === categoryName.toLowerCase()
      );
    });

    if (selectedSubcategory !== 'All') {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return list;
  }, [products, categoryName, selectedSubcategory, sortBy, matchingCategoryNames]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-3xl font-bold font-['Clash_Display',sans-serif] text-[#121212] tracking-tight">
              {categoryName}
            </h1>
            <span className="text-xs font-medium font-['Satoshi',sans-serif] text-slate-500">
              {filteredProducts.length} items available in 8 mins
            </span>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 font-['Satoshi',sans-serif]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs font-semibold text-[#121212] rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#085E2B] cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Left Subcategories / Category Switcher Sidebar */}
        <div className="w-full md:w-56 shrink-0">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-3 sm:p-4 sticky top-24">
            <h3 className="text-xs font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400 mb-3">
              Subcategories
            </h3>

            <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              <button
                onClick={() => setSelectedSubcategory('All')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubcategory === 'All'
                    ? 'bg-emerald-50 text-[#085E2B] border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <span>All {categoryName}</span>
                {selectedSubcategory === 'All' && <Check className="w-3.5 h-3.5 shrink-0 hidden md:block" />}
              </button>

              {subcategoriesList.map((sub) => {
                const isActive = selectedSubcategory === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-50 text-[#085E2B] border border-emerald-200/80 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <span>{sub}</span>
                    {isActive && <Check className="w-3.5 h-3.5 shrink-0 hidden md:block" />}
                  </button>
                );
              })}
            </div>

            {/* Other Departments Quick Links */}
            <div className="mt-6 pt-4 border-t border-slate-100 hidden md:block">
              <h3 className="text-[11px] font-bold font-['Clash_Display',sans-serif] uppercase tracking-wider text-slate-400 mb-2">
                Other Departments
              </h3>
              <div className="space-y-1">
                {CATEGORIES.filter((c) => c.name !== categoryName)
                  .slice(0, 5)
                  .map((other) => (
                    <button
                      key={other.id}
                      onClick={() => {
                        onSelectCategory(other.name);
                        setSelectedSubcategory('All');
                      }}
                      className="block w-full text-left px-2 py-1.5 text-xs text-slate-600 hover:text-[#085E2B] hover:bg-emerald-50/50 rounded-lg font-medium transition-colors"
                    >
                      {other.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-12 text-center">
              <p className="text-base font-bold text-slate-700 mb-1">
                No products found in this subcategory
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Try selecting "All" or browse other departments.
              </p>
              <button
                onClick={() => setSelectedSubcategory('All')}
                className="px-5 py-2.5 rounded-xl bg-[#085E2B] text-white text-xs font-bold hover:bg-[#064821] transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cartQuantities[product.id] || 0}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
