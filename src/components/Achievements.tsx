import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronLeft, CheckCircle2, Circle, Coins, Star, Award } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Record<string, Achievement>;
  onBack: () => void;
  onClaim: (id: string) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ 
  achievements, onBack, onClaim 
}) => {
  const achievementList = Object.values(achievements);
  const completedCount = achievementList.filter(a => a.current >= a.target).length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-[150] bg-slate-900 text-white flex flex-col"
    >
      <header className="p-6 flex items-center justify-between bg-slate-800/50 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Trophy Room</h2>
          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
            {completedCount} / {achievementList.length} ACHIEVED
          </p>
        </div>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {achievementList.map((achievement) => {
            const isCompleted = achievement.current >= achievement.target;
            const progress = Math.min(100, (achievement.current / achievement.target) * 100);

            return (
              <div 
                key={achievement.id} 
                className={`p-6 rounded-[32px] border transition-all ${isCompleted ? 'bg-indigo-600/20 border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'bg-slate-800 border-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-[20px] ${isCompleted ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                    {isCompleted ? <Trophy size={32} /> : <Award size={32} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-lg leading-tight">{achievement.title}</h3>
                      {isCompleted && achievement.isClaimed && <CheckCircle2 size={24} className="text-emerald-400" />}
                    </div>
                    <p className="text-xs text-white/50 font-medium mb-3">{achievement.description}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full ${isCompleted ? 'bg-indigo-400' : 'bg-slate-600'}`}
                        />
                      </div>
                      <span className="text-[10px] font-black text-white/40">{achievement.current}/{achievement.target}</span>
                    </div>
                  </div>
                </div>

                {isCompleted && !achievement.isClaimed && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onClaim(achievement.id)}
                    className="mt-4 w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black flex items-center justify-center gap-2 text-white shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
                  >
                    <Coins size={20} />
                    Claim {achievement.reward} Coins
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
