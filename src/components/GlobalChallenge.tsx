import React from 'react';
import { motion } from 'motion/react';
import { Globe, Trophy, ChevronLeft, Timer, Play, Users, Coins } from 'lucide-react';

interface GlobalChallengeProps {
  onBack: () => void;
  onPlay: () => void;
  coins: number;
}

export const GlobalChallenge: React.FC<GlobalChallengeProps> = ({ onBack, onPlay, coins }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[160] bg-slate-900 text-white flex flex-col"
    >
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-black tracking-tighter uppercase">Global Event</h2>
        <div className="w-12" />
      </header>

      <div className="flex-1 p-8 flex flex-col items-center justify-center max-w-lg mx-auto text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative p-8 bg-indigo-600 rounded-[40px] shadow-2xl shadow-indigo-500/40">
            <Globe size={80} className="text-white animate-[spin_10s_linear_infinite]" />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">The Frozen Peak</h1>
        <p className="text-slate-400 font-medium mb-8">
          Explorers from around the world are tackling this treacherous board. Can you reach the top of the leaderboard?
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-10">
          <div className="bg-slate-800 p-6 rounded-[32px] border border-white/5">
            <Timer size={24} className="text-amber-500 mx-auto mb-2" />
            <span className="block text-2xl font-black uppercase">4D 12H</span>
            <span className="text-[10px] font-black text-white/30 uppercase">Time Left</span>
          </div>
          <div className="bg-slate-800 p-6 rounded-[32px] border border-white/5">
            <Users size={24} className="text-indigo-400 mx-auto mb-2" />
            <span className="block text-2xl font-black uppercase">1.2K</span>
            <span className="text-[10px] font-black text-white/30 uppercase">Players</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 border border-white/10 p-6 rounded-[32px] mb-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Event Rewards</h3>
          <div className="flex justify-center gap-8">
             <div className="flex flex-col items-center">
               <Trophy size={20} className="text-yellow-500 mb-1" />
               <span className="text-sm font-black">Top 1%</span>
               <span className="text-[10px] font-bold text-emerald-400">+5000 🪙</span>
             </div>
             <div className="flex flex-col items-center">
               <Trophy size={20} className="text-slate-300 mb-1" />
               <span className="text-sm font-black">Top 10%</span>
               <span className="text-[10px] font-bold text-emerald-400">+1000 🪙</span>
             </div>
          </div>
        </div>

        <button 
          onClick={onPlay}
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Play size={28} fill="currentColor" />
          ENTER CHALLENGE (50 🪙)
        </button>
      </div>
    </motion.div>
  );
};
