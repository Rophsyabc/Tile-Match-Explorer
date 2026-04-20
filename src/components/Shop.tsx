import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, Coins, Check, Lock, Zap, Shield, PlusCircle } from 'lucide-react';
import { THEMES, BOOSTERS } from '../constants';

interface ShopProps {
  coins: number;
  ownedThemes: string[];
  activeThemeId: string;
  boosters: Record<string, number>;
  onBack: () => void;
  onPurchaseTheme: (themeId: string, price: number) => void;
  onActivateTheme: (themeId: string) => void;
  onPurchaseBooster: (boosterId: string, price: number) => void;
}

export const Shop: React.FC<ShopProps> = ({ 
  coins, ownedThemes, activeThemeId, boosters, onBack, onPurchaseTheme, onActivateTheme, onPurchaseBooster 
}) => {
  const [tab, setTab] = React.useState<'themes' | 'boosters'>('themes');

  const boosterIcons: Record<string, any> = {
    extra_slot: PlusCircle,
    star_shield: Shield,
    combo_boost: Zap,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-slate-900 text-white flex flex-col"
    >
      <header className="p-6 flex items-center justify-between bg-slate-800/50 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Explorer's Shop</h2>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Coins size={16} />
            <span>{coins}</span>
          </div>
        </div>
        <div className="w-12" />
      </header>

      <div className="flex p-4 gap-2 bg-slate-800/30">
        <button 
          onClick={() => setTab('themes')}
          className={`flex-1 py-3 rounded-2xl font-black transition-all ${tab === 'themes' ? 'bg-indigo-600 shadow-lg' : 'bg-white/5 text-white/40'}`}
        >
          THEMES
        </button>
        <button 
          onClick={() => setTab('boosters')}
          className={`flex-1 py-3 rounded-2xl font-black transition-all ${tab === 'boosters' ? 'bg-indigo-600 shadow-lg' : 'bg-white/5 text-white/40'}`}
        >
          BOOSTERS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {tab === 'themes' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEMES.map((theme) => {
                const isOwned = ownedThemes.includes(theme.id);
                const isActive = activeThemeId === theme.id;
                
                return (
                  <div key={theme.id} className="bg-slate-800 rounded-[32px] p-2 border border-white/5 overflow-hidden">
                    <div className={`h-24 rounded-[24px] bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4 relative`}>
                      <span className="text-white font-black text-xl drop-shadow-md">{theme.name}</span>
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/30 text-white">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Price</span>
                        <div className="flex items-center gap-1 text-amber-400 font-black">
                          {theme.price === 0 ? 'FREE' : <><Coins size={14} />{theme.price}</>}
                        </div>
                      </div>
                      
                      {isOwned ? (
                        <button 
                          onClick={() => onActivateTheme(theme.id)}
                          disabled={isActive}
                          className={`px-6 py-2 rounded-full font-black text-xs transition-all ${isActive ? 'bg-white/10 text-white/30 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}`}
                        >
                          {isActive ? 'ACTIVE' : 'ACTIVATE'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => onPurchaseTheme(theme.id, theme.price)}
                          disabled={coins < theme.price}
                          className={`px-6 py-2 rounded-full font-black text-xs flex items-center gap-2 transition-all ${coins >= theme.price ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                          <ShoppingBag size={14} />
                          BUY
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {BOOSTERS.map((booster) => {
                const Icon = boosterIcons[booster.id];
                const count = boosters[booster.id] || 0;

                return (
                  <div key={booster.id} className="bg-slate-800 rounded-[32px] p-6 border border-white/5 flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-600/20 rounded-[20px] flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg leading-tight">{booster.name}</h3>
                      <p className="text-xs text-white/40 font-medium">{booster.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-black text-indigo-300 border border-indigo-500/20 uppercase">
                          Owned: {count}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onPurchaseBooster(booster.id, booster.price)}
                      disabled={coins < booster.price}
                      className={`h-12 px-6 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${coins >= booster.price ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                    >
                      <Coins size={16} />
                      {booster.price}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
