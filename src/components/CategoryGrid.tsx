import React from 'react';
import { 
  Apple, 
  Milk, 
  Coffee, 
  Wheat, 
  Flame, 
  Cookie, 
  Zap, 
  Sparkles, 
  Home, 
  BatteryCharging, 
  PenTool, 
  ChevronRight 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Apple,
  Milk,
  Coffee,
  Wheat,
  Flame,
  Cookie,
  Zap,
  Sparkles,
  Home,
  BatteryCharging,
  PenTool,
};

// Distinct soft pastel palettes matching Blinkit's modern category badges
const CATEGORY_COLORS: Record<string, { bg: string; text: string; iconBg: string }> = {
  'Vegetables & Fruits': { bg: 'bg-emerald-50 hover:bg-emerald-100/80', text: 'text-emerald-950', iconBg: 'bg-emerald-500 text-white' },
  'Dairy, Bread & Eggs': { bg: 'bg-sky-50 hover:bg-sky-100/80', text: 'text-sky-950', iconBg: 'bg-sky-500 text-white' },
  'Snacks & Drinks': { bg: 'bg-amber-50 hover:bg-amber-100/80', text: 'text-amber-950', iconBg: 'bg-amber-500 text-white' },
  'Atta, Rice & Dal': { bg: 'bg-orange-50 hover:bg-orange-100/80', text: 'text-orange-950', iconBg: 'bg-orange-500 text-white' },
  'Oil, Ghee & Masala': { bg: 'bg-yellow-50 hover:bg-yellow-100/80', text: 'text-yellow-950', iconBg: 'bg-yellow-600 text-white' },
  'Bakery & Biscuits': { bg: 'bg-rose-50 hover:bg-rose-100/80', text: 'text-rose-950', iconBg: 'bg-rose-500 text-white' },
  'Instant Food': { bg: 'bg-red-50 hover:bg-red-100/80', text: 'text-red-950', iconBg: 'bg-red-500 text-white' },
  'Beauty & Personal Care': { bg: 'bg-purple-50 hover:bg-purple-100/80', text: 'text-purple-950', iconBg: 'bg-purple-500 text-white' },
  'Household Essentials': { bg: 'bg-teal-50 hover:bg-teal-100/80', text: 'text-teal-950', iconBg: 'bg-teal-600 text-white' },
  'Electronics & Gadgets': { bg: 'bg-blue-50 hover:bg-blue-100/80', text: 'text-blue-950', iconBg: 'bg-blue-600 text-white' },
  'Stationery & Crafts': { bg: 'bg-indigo-50 hover:bg-indigo-100/80', text: 'text-indigo-950', iconBg: 'bg-indigo-600 text-white' },
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold font-['Clash_Display',sans-serif] text-[#121212] tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium font-['Satoshi',sans-serif]">
            Explore 1,000+ daily grocery and household staples delivered in 8 mins
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            className="text-xs sm:text-sm font-bold text-[#085E2B] hover:text-[#064821] hover:underline cursor-pointer"
          >
            Show All Departments
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || Apple;
          const colors = CATEGORY_COLORS[cat.name] || {
            bg: 'bg-gradient-to-b from-[#F8F9FA] to-[#EDF2F7]',
            text: 'text-slate-800',
            iconBg: 'bg-[#085E2B] text-white',
          };
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                isSelected
                  ? 'border-[#085E2B] bg-emerald-50/75 backdrop-blur-md ring-2 ring-[#085E2B]/20'
                  : 'border-white/60 bg-white/45 backdrop-blur-md hover:bg-white/70'
              }`}
            >
              {/* Centered isometric / clean icon badge representation */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-108 transition-transform duration-200 ${colors.iconBg}`}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              <span
                className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 font-['Clash_Display',sans-serif] ${
                  isSelected ? 'text-[#085E2B]' : 'text-[#121212]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
