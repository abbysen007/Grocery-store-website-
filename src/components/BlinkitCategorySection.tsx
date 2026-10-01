import React from 'react';
import { motion } from 'motion/react';
import { BLINKIT_DEPARTMENTS, BlinkitCategory } from '../data/blinkitCategories';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BlinkitCategorySectionProps {
  onSelectCategory: (categoryName: string) => void;
}

export const BlinkitCategorySection: React.FC<BlinkitCategorySectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-10 space-y-8 sm:space-y-12">
      {BLINKIT_DEPARTMENTS.map((dept) => (
        <div key={dept.title} className="space-y-3.5">
          {/* Department Section Title */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold font-['Clash_Display',sans-serif] text-[#121212] tracking-tight">
                {dept.title}
              </h2>
              {dept.description && (
                <p className="text-xs sm:text-sm font-medium font-['Satoshi',sans-serif] text-slate-500 hidden sm:block">
                  {dept.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onSelectCategory(dept.categories[0].name)}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#085E2B] hover:text-[#064821] hover:underline cursor-pointer font-['Satoshi',sans-serif]"
            >
              <span>see all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Responsive Grid matching modern quick-commerce catalog */}
          <div
            className={`grid grid-cols-4 gap-2.5 sm:gap-4 ${
              dept.categories.length === 4 ? 'lg:grid-cols-4 max-w-4xl' : 'lg:grid-cols-8'
            }`}
          >
            {dept.categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center cursor-pointer select-none"
              >
                {/* Rounded Soft Translucent Glass Container */}
                <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl bg-white/45 backdrop-blur-md hover:bg-white/70 border border-white/60 p-2 sm:p-3 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)]">
                  
                  {/* Two overlapping authentic product packshots */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Left/Back Product packshot */}
                    {cat.images[0] && (
                      <img
                        src={cat.images[0]}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-[65%] h-[80%] object-contain -mr-4 z-10 filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    )}

                    {/* Right/Front Product packshot */}
                    {cat.images[1] && (
                      <img
                        src={cat.images[1]}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-[65%] h-[80%] object-contain -ml-2 z-20 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Bold Category Title underneath */}
                <span className="text-[11px] sm:text-xs md:text-[13px] font-bold font-['Clash_Display',sans-serif] text-[#121212] group-hover:text-[#085E2B] text-center mt-2 leading-tight tracking-tight line-clamp-2 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
