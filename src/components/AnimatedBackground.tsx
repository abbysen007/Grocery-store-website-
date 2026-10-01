import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const AnimatedBackground: React.FC = () => {
  // Listen to window scroll progress (0 to 1) and raw scrollY
  const { scrollY, scrollYProgress } = useScroll();

  // Smooth springs for buttery 60fps parallax motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // Layer 1: Parallax deep green ambient orb (moves down & slightly right)
  const orb1Y = useTransform(smoothProgress, [0, 1], [0, 450]);
  const orb1X = useTransform(smoothProgress, [0, 0.5, 1], [0, 60, -40]);
  const orb1Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.25, 0.9]);
  const orb1Rotate = useTransform(smoothProgress, [0, 1], [0, 90]);

  // Layer 2: Parallax bright beige & warm gold aura orb (drifts across center)
  const orb2Y = useTransform(smoothProgress, [0, 1], [100, 750]);
  const orb2X = useTransform(smoothProgress, [0, 0.5, 1], [0, -100, 30]);
  const orb2Scale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 0.85, 1.2]);

  // Layer 3: Secondary botanical emerald accent (bottom left moving upward)
  const orb3Y = useTransform(smoothProgress, [0, 1], [600, 150]);
  const orb3X = useTransform(smoothProgress, [0, 1], [-50, 80]);
  const orb3Scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.15, 1]);

  // Layer 4: Floating geometric grid scroll displacement
  const gridY = useTransform(scrollY, (y) => -(y * 0.15) % 40);

  // Layer 5: Subtle floating brand accent shapes (leaf & lightning silhouettes)
  const leaf1Y = useTransform(smoothProgress, [0, 1], [120, -180]);
  const leaf1Rotate = useTransform(smoothProgress, [0, 1], [15, 160]);

  const leaf2Y = useTransform(smoothProgress, [0, 1], [700, 200]);
  const leaf2Rotate = useTransform(smoothProgress, [0, 1], [-25, 85]);

  const bolt1Y = useTransform(smoothProgress, [0, 1], [400, 50]);
  const bolt1Rotate = useTransform(smoothProgress, [0, 1], [-10, 45]);

  // Top scroll progress indicator bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Ambient Canvas: Highly transparent airy wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/25 via-transparent to-[#F1EDE2]/20 pointer-events-none" />

      {/* 2. Micro Dot Pattern Overlay that shifts gently on scroll */}
      <motion.div
        style={{ y: gridY }}
        className="absolute -inset-y-20 inset-x-0 opacity-[0.06] pointer-events-none"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="freshit-dot-pattern"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#085E2B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#freshit-dot-pattern)" />
        </svg>
      </motion.div>

      {/* 3. Primary Deep Forest Green Ambient Orb (#085E2B) */}
      <motion.div
        style={{
          y: orb1Y,
          x: orb1X,
          scale: orb1Scale,
          rotate: orb1Rotate,
        }}
        className="absolute top-10 -left-20 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-gradient-to-br from-[#085E2B]/22 via-[#0E783A]/16 to-transparent blur-[80px] sm:blur-[120px] transform-gpu will-change-transform"
      />

      {/* 4. Bright Luminous Beige / Warm Golden Amber Orb (#F5ECD5 & #E6CE96) */}
      <motion.div
        style={{
          y: orb2Y,
          x: orb2X,
          scale: orb2Scale,
        }}
        className="absolute top-48 -right-28 w-[400px] sm:w-[640px] h-[400px] sm:h-[640px] rounded-full bg-gradient-to-bl from-[#F5ECD5]/80 via-[#EBD9AB]/55 to-transparent blur-[70px] sm:blur-[110px] transform-gpu will-change-transform"
      />

      {/* 5. Central Soft Sage Mint Reflection */}
      <motion.div
        style={{
          y: orb3Y,
          x: orb3X,
          scale: orb3Scale,
        }}
        className="absolute top-[45vh] left-[25vw] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#085E2B]/15 via-[#8FD4A7]/22 to-transparent blur-[90px] sm:blur-[130px] transform-gpu will-change-transform"
      />

      {/* 6. Floating Stylized Brand Glyphs that react with parallax rotation to scroll */}
      {/* Floating Botanical Leaf 1 (Top Right) */}
      <motion.div
        style={{
          y: leaf1Y,
          rotate: leaf1Rotate,
        }}
        className="absolute top-36 right-[12%] opacity-15 hidden md:block transform-gpu will-change-transform"
      >
        <svg width="84" height="84" viewBox="0 0 36 36" fill="none">
          <path
            d="M6 30C6 30 5 18 16 7C27 -4 34 2 34 2C34 2 36 17 25 27C16 35 6 30 6 30Z"
            fill="#085E2B"
          />
        </svg>
      </motion.div>

      {/* Floating Lightning Bolt 1 (Mid Left) */}
      <motion.div
        style={{
          y: bolt1Y,
          rotate: bolt1Rotate,
        }}
        className="absolute top-[55vh] left-[8%] opacity-20 hidden md:block transform-gpu will-change-transform"
      >
        <svg width="64" height="64" viewBox="0 0 36 36" fill="none">
          <path
            d="M20 2L10 16H18L13 32L28 15H19L24 2H20Z"
            fill="#E0CD9E"
            stroke="#121212"
            strokeWidth="0.8"
          />
        </svg>
      </motion.div>

      {/* Floating Botanical Leaf 2 (Lower Right) */}
      <motion.div
        style={{
          y: leaf2Y,
          rotate: leaf2Rotate,
        }}
        className="absolute top-[75vh] right-[6%] opacity-15 hidden md:block transform-gpu will-change-transform"
      >
        <svg width="96" height="96" viewBox="0 0 36 36" fill="none">
          <path
            d="M6 30C6 30 5 18 16 7C27 -4 34 2 34 2C34 2 36 17 25 27C16 35 6 30 6 30Z"
            fill="#085E2B"
          />
        </svg>
      </motion.div>

      {/* 7. Subtle Edge Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/[0.02]" />

      {/* 8. Ultra-thin Top Scroll Progress Line (Deep Green to Bright Beige) */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#085E2B] via-[#0E783A] to-[#F5ECD5] origin-left z-50 pointer-events-none"
      />
    </div>
  );
};
