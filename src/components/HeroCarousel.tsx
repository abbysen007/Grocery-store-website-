import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { HERO_BANNERS } from '../data/mockData';

interface HeroCarouselProps {
  onSelectCategory: (categoryName: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = HERO_BANNERS.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(nextSlide, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, currentIndex]);

  const currentBanner = HERO_BANNERS[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.categoryFilter) {
      onSelectCategory(currentBanner.categoryFilter);
    }
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleBannerClick}
        className="relative w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md group select-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background image */}
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
            />

            {/* Gradient Scrim for WCAG AA readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent sm:via-black/35" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5ECD5] text-[#121212] border border-[#E5D5AE] text-[11px] sm:text-xs font-['Clash_Display',sans-serif] font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#121212]" />
                  {currentBanner.badge}
                </span>
                <span className="text-emerald-300 text-xs font-bold font-['Clash_Display',sans-serif] hidden sm:inline-block">
                  ⚡ Guaranteed 8 Mins
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-['Clash_Display',sans-serif] font-bold tracking-tight leading-tight text-white drop-shadow-xs max-w-lg">
                {currentBanner.title}
              </h2>

              <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 max-w-md font-['Satoshi',sans-serif] font-medium">
                {currentBanner.subtitle}
              </p>

              <div className="mt-3 sm:mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-xs sm:text-sm shadow-md group-hover:gap-2.5 transition-all">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
          aria-label="Next banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {HERO_BANNERS.map((banner, idx) => (
            <button
              key={banner.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-[#F5ECD5]' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
