import React from 'react';
import { motion } from 'motion/react';
import { Star, Lock, ChevronLeft, Trophy, Calendar, CheckCircle2, Coins, ShoppingBag, Award } from 'lucide-react';
import { THEMES } from '../constants';

interface LevelMapProps {
  currentLevel: number;
  unlockedLevels: number;
  bestStars: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
  onDailyChallenge: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  isDailyDone: boolean;
  coins: number;
}

export const LevelMap: React.FC<LevelMapProps> = ({ 
  currentLevel, unlockedLevels, bestStars, onSelectLevel, onBack, onDailyChallenge, onOpenShop, onOpenAchievements, isDailyDone, coins
}) => {
  const levels = Array.from({ length: 500 }, (_, i) => i + 1);
  const biomes = [
    { title: 'Emerald Plains', range: [1, 100] },
    { title: 'Sunset Peaks', range: [101, 200] },
    { title: 'Deep Ocean', range: [201, 300] },
    { title: 'Mystic Forest', range: [301, 400] },
    { title: 'Sakura Kingdom', range: [401, 500] },
  ];

  const totalStars = Object.values(bestStars).reduce((a, b) => (a as number) + (b as number), 0);

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between bg-slate-800/50 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
           <Trophy size={20} className="text-yellow-500" />
           <h2 className="text-2xl font-black tracking-tighter uppercase">World Map</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onOpenShop} className="p-3 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-all active:scale-90">
            <ShoppingBag size={24} />
          </button>
          <button onClick={onOpenAchievements} className="p-3 bg-emerald-600 rounded-2xl hover:bg-emerald-500 transition-all active:scale-90 relative">
            <Award size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
          </button>
        </div>
      </header>

      {/* Map Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/10 scroll-smooth">
        <div className="relative max-w-md mx-auto py-10">
          
          {/* Stats Summary */}
          <div className="mb-12 flex justify-center gap-4">
            <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center">
               <div className="flex items-center gap-2 text-yellow-500 font-black text-xl">
                 <Star size={18} fill="currentColor" />
                 {totalStars}
               </div>
               <span className="text-[10px] font-black uppercase text-white/30">Total Stars</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center">
               <div className="flex items-center gap-2 text-amber-500 font-black text-xl">
                 <Coins size={18} fill="currentColor" />
                 {coins}
               </div>
               <span className="text-[10px] font-black uppercase text-white/30">Coins</span>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDailyChallenge}
            disabled={isDailyDone}
            className={`
              w-full mb-16 p-6 rounded-[32px] border-2 flex items-center justify-between transition-all
              ${isDailyDone 
                ? 'bg-slate-800/50 border-white/5 opacity-60' 
                : 'bg-gradient-to-r from-rose-500 to-pink-600 border-white/20 shadow-xl shadow-rose-500/20'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                {isDailyDone ? <CheckCircle2 size={32} /> : <Calendar size={32} />}
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest opacity-70">Daily Quest</p>
                <h3 className="text-xl font-black">{isDailyDone ? 'Complete' : 'Today\'s Puzzle'}</h3>
              </div>
            </div>
          </motion.button>

          {levels.map((lvl, index) => {
            const isUnlocked = lvl <= unlockedLevels;
            const isCurrent = lvl === currentLevel;
            const stars = bestStars[lvl] || 0;
            const theme = THEMES[Math.floor((lvl - 1) / 10) % THEMES.length];
            const biome = biomes.find(b => lvl >= b.range[0] && lvl <= b.range[1]);
            const isBiomeStart = lvl === biome?.range[0];
            
            // S-curve path logic
            const xOffset = Math.sin(index * 0.4) * 80;

            return (
              <React.Fragment key={lvl}>
                {isBiomeStart && (
                  <div className="w-full text-center my-12 relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <span className="relative bg-slate-900 px-6 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest text-white/40">
                      {biome?.title}
                    </span>
                  </div>
                )}
                
                <div className="relative mb-20 flex justify-center">
                  {/* Path Line */}
                  {index < levels.length - 1 && (
                    <div 
                      className={`absolute top-full left-1/2 w-1 -translate-x-1/2 ${isUnlocked ? 'bg-indigo-500/30' : 'bg-white/5'}`}
                      style={{ 
                        height: '80px',
                        transform: `translateX(${xOffset}px) rotate(${Math.cos(index * 0.4) * 20}deg)`,
                        transformOrigin: 'top center'
                      }}
                    />
                  )}

                  <motion.button
                    whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
                    whileTap={isUnlocked ? { scale: 0.9 } : {}}
                    onClick={() => isUnlocked && onSelectLevel(lvl)}
                    style={{ x: xOffset }}
                    className={`
                      relative w-20 h-20 rounded-[28px] flex flex-col items-center justify-center transition-all shadow-xl
                      ${isUnlocked 
                        ? `bg-gradient-to-br ${theme.gradient} border-2 border-white/40` 
                        : 'bg-slate-800 border-2 border-white/5 opacity-50'}
                      ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-slate-900' : ''}
                    `}
                  >
                    {!isUnlocked ? (
                      <Lock size={24} className="text-slate-500" />
                    ) : (
                      <>
                        <span className="text-xl font-black drop-shadow-md">{lvl}</span>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3].map(s => (
                            <Star key={s} size={10} className={s <= stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/20'} />
                          ))}
                        </div>
                      </>
                    )}

                    {isCurrent && (
                      <motion.div 
                        layoutId="current-indicator"
                        className="absolute -top-12 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap"
                      >
                        YOU ARE HERE
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
