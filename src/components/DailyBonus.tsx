import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Check, Coins, Calendar, X } from 'lucide-react';

interface DailyBonusProps {
  isOpen: boolean;
  onClose: () => void;
  lastClaimDate: string | null;
  onClaim: (reward: number) => void;
}

export const DailyBonus: React.FC<DailyBonusProps> = ({ 
  isOpen, onClose, lastClaimDate, onClaim 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const hasClaimedToday = lastClaimDate === today;

  const rewards = [
    { day: 1, amount: 50 },
    { day: 2, amount: 100 },
    { day: 3, amount: 150 },
    { day: 4, amount: 200 },
    { day: 5, amount: 300 },
    { day: 6, amount: 500 },
    { day: 7, amount: 1000 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 rounded-full" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 bg-emerald-50 rounded-full" />

            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
              <X size={24} className="text-slate-400" />
            </button>

            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex p-6 bg-indigo-600 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-200">
                <Gift size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Daily Bounty</h2>
              <p className="text-slate-500 font-bold">Claim your rewards every 24h!</p>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-8 relative z-10">
              {rewards.map((reward, i) => (
                <div 
                  key={reward.day}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                    i === 0 && !hasClaimedToday 
                    ? 'border-indigo-500 bg-indigo-50 scale-105' 
                    : 'border-slate-100 bg-white opacity-50'
                  }`}
                >
                  <span className="text-[10px] font-black text-slate-400 mb-1">D{reward.day}</span>
                  <div className="mb-1 text-amber-500">
                    <Coins size={16} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700">{reward.amount}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onClaim(rewards[0].amount)}
              disabled={hasClaimedToday}
              className={`w-full py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest relative z-10 ${
                hasClaimedToday
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 active:scale-95'
              }`}
            >
              {hasClaimedToday ? <Check size={28} /> : <Calendar size={28} />}
              {hasClaimedToday ? 'CLAIMED' : 'CLAIM NOW'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
