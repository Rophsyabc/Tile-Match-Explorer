import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ComboIndicatorProps {
  multiplier: number;
}

export const ComboIndicator: React.FC<ComboIndicatorProps> = ({ multiplier }) => {
  if (multiplier <= 1) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={multiplier}
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.5, opacity: 0, y: -20 }}
        className="fixed top-1/4 right-8 z-50 pointer-events-none"
      >
        <div className="flex flex-col items-center">
          <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] italic tracking-tighter">
            COMBO!
          </div>
          <div className="text-4xl font-black text-white px-4 py-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl border-4 border-white">
            x{multiplier}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
