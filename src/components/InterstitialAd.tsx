import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ isOpen, onClose }) => {
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCanClose(false);
      setTimeLeft(5);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black flex items-center justify-center"
        >
          {/* Ad Content Placeholder */}
          <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
            <div className="w-full max-w-lg aspect-video bg-slate-900 rounded-3xl flex flex-col items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 left-6 text-white/20 text-xs font-black tracking-widest uppercase">Interstitial Ad</div>
              
              <div className="p-8 bg-indigo-500/20 rounded-full mb-6">
                <Loader2 size={64} className="text-indigo-400 animate-spin" />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-4">Discover New Worlds</h2>
              <p className="text-slate-400 max-w-xs">Experience the next generation of puzzle adventures. Download now!</p>
              
              <div className="mt-10 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm">
                Learn More
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={canClose ? onClose : undefined}
            className={`
              absolute top-10 right-10 p-4 rounded-full transition-all
              ${canClose 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white/5 text-white/40 cursor-not-allowed'}
            `}
          >
            {canClose ? <X size={32} /> : <span className="font-black text-xl">{timeLeft}</span>}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
