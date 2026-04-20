import React from 'react';
import { motion } from 'motion/react';

export const BannerAd: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] flex justify-center p-2 bg-black/5 backdrop-blur-sm border-t border-white/10">
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="w-full max-w-[320px] h-[50px] bg-slate-800 rounded-lg flex items-center justify-center text-white/40 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 shadow-lg"
      >
        <div className="absolute top-1 left-2 text-[8px] opacity-50">ADVERTISEMENT</div>
        Banner Ad Placeholder
      </motion.div>
    </div>
  );
};
