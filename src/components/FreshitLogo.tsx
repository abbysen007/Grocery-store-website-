import React from 'react';

interface FreshitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  showBadge?: boolean;
  className?: string;
}

export const FreshitLogo: React.FC<FreshitLogoProps> = ({
  size = 'md',
  theme = 'light',
  showBadge = false,
  className = '',
}) => {
  // Size mapping
  const sizeConfig = {
    sm: {
      iconSize: 22,
      textSize: 'text-xl',
      badgeSize: 'text-[9px] px-1.5 py-0.5',
      gap: 'gap-2',
    },
    md: {
      iconSize: 28,
      textSize: 'text-2xl sm:text-[26px]',
      badgeSize: 'text-[10px] px-2 py-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      iconSize: 34,
      textSize: 'text-3xl sm:text-4xl',
      badgeSize: 'text-xs px-2.5 py-0.5',
      gap: 'gap-3',
    },
    xl: {
      iconSize: 42,
      textSize: 'text-4xl sm:text-5xl',
      badgeSize: 'text-xs px-3 py-1',
      gap: 'gap-3.5',
    },
  }[size];

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} select-none group ${className}`}>
      {/* Signature Vector Icon: Stylized Lightning Bolt merged with a Fresh Green Leaf */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          width={sizeConfig.iconSize}
          height={sizeConfig.iconSize}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-xs"
        >
          <defs>
            {/* Deep Emerald Leaf Gradient */}
            <linearGradient id="freshitLeafGrad" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#04401C" />
              <stop offset="50%" stopColor="#085E2B" />
              <stop offset="100%" stopColor="#0E783A" />
            </linearGradient>

            {/* Bright Luminous Beige-Gold Bolt Gradient */}
            <linearGradient id="freshitBoltGrad" x1="10" y1="2" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="45%" stopColor="#F5ECD5" />
              <stop offset="100%" stopColor="#D9BF86" />
            </linearGradient>

            {/* Subtle glow / inner shadow */}
            <filter id="freshitGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Leaf Form with curved spine */}
          <path
            d="M6 30C6 30 5 18 16 7C27 -4 34 2 34 2C34 2 36 17 25 27C16 35 6 30 6 30Z"
            fill="url(#freshitLeafGrad)"
          />

          {/* Leaf Central Rib Line */}
          <path
            d="M7 29C13 25 21 17 33 3"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />

          {/* Stylized Lightning Bolt Intersecting & Powering the Leaf */}
          <path
            d="M20 2L10 16H18L13 32L28 15H19L24 2H20Z"
            fill="url(#freshitBoltGrad)"
            stroke="#121212"
            strokeWidth="1.2"
            strokeLinejoin="round"
            filter="url(#freshitGlow)"
          />

          {/* Speed / Spark highlight dot */}
          <circle cx="28" cy="6" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Typography: "fresh" + "it" in bold geometric Clash Display / Cabinet Grotesk */}
      <div className="flex items-baseline">
        <span
          className={`font-['Clash_Display',sans-serif] ${sizeConfig.textSize} font-bold tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-[#121212]'
          }`}
        >
          fresh
          <span className="text-[#085E2B] inline-block transition-transform group-hover:translate-x-0.5">
            it
          </span>
        </span>

        {showBadge && (
          <span
            className={`ml-2 font-['Clash_Display',sans-serif] font-bold uppercase tracking-wider rounded-md ${sizeConfig.badgeSize} ${
              isDark
                ? 'bg-[#F5ECD5] text-[#121212]'
                : 'bg-[#121212] text-[#F5ECD5]'
            } shadow-xs`}
          >
            8 MINS
          </span>
        )}
      </div>
    </div>
  );
};
