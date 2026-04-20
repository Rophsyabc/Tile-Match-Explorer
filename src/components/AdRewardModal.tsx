import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Coins, Loader2, Sparkles } from 'lucide-react';

interface AdRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: () => void;
  rewardText: string;
  rewardAmount?: number;
}

export const AdRewardModal: React.FC<AdRewardModalProps> = ({ 
  isOpen, 
  onClose, 
  onReward, 
  rewardText,
  rewardAmount 
}) => {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsWatching(false);
            onReward();
            onClose();
            return 100;
          }
          return prev + 2; // ~5 seconds ad
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isWatching, onReward, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm bg-white rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden"
          >
            {!isWatching ? (
              <>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-6 inline-flex p-6 bg-amber-100 rounded-[32px] text-amber-600">
                  <Play size={48} fill="currentColor" />
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Watch to Earn</h3>
                <p className="text-slate-500 mb-8 font-medium">
                  Watch a short video to get <span className="text-indigo-600 font-bold">{rewardText}</span>
                </p>

                <button
                  onClick={() => setIsWatching(true)}
                  className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white text-xl font-black rounded-3xl shadow-xl shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <Play size={24} fill="currentColor" />
                  Watch Ad
                </button>
              </>
            ) : (
              <div className="py-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <Loader2 size={96} className="text-indigo-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-black text-xl">
                    {Math.floor(progress)}%
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-2">Watching Ad...</h3>
                <p className="text-slate-500 mb-8">Your reward is almost ready!</p>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Decorative Sparkles */}
            <div className="absolute -top-4 -left-4 text-amber-200 opacity-50"><Sparkles size={64} /></div>
            <div className="absolute -bottom-4 -right-4 text-indigo-200 opacity-50 rotate-12"><Sparkles size={48} /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
