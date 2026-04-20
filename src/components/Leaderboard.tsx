import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronLeft, User, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface LeaderboardProps {
  playerScore: number;
  playerLevel: number;
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ playerScore, playerLevel, onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'leaderboard';
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900 text-white flex flex-col">
      <header className="p-6 flex items-center justify-between bg-slate-800/50 backdrop-blur-md border-b border-white/10">
        <button 
          onClick={onBack}
          className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-black tracking-tighter uppercase">Hall of Fame</h2>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Legends...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <Trophy size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold">No legends yet. Be the first!</p>
            </div>
          ) : (
            entries.map((entry, index) => {
              const isTop3 = index < 3;
              const medalColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];

              return (
                <motion.div
                  key={entry.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center gap-4 p-4 rounded-3xl border transition-all
                    ${entry.isPlayer 
                      ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105' 
                      : 'bg-slate-800 border-white/5'}
                  `}
                >
                  <div className="w-10 h-10 flex items-center justify-center font-black text-xl">
                    {isTop3 ? (
                      <Medal className={medalColors[index]} size={28} />
                    ) : (
                      <span className="text-slate-500">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${entry.isPlayer ? 'bg-white/20' : 'bg-slate-700'}`}>
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-black tracking-tight">{entry.displayName || 'Explorer'}</p>
                      <p className="text-[10px] uppercase font-bold text-white/50">Level {entry.level}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-indigo-300">{entry.score}</p>
                    <p className="text-[10px] uppercase font-bold text-white/30">Points</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div className="p-8 bg-slate-800/50 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 font-medium italic">
          "The journey is the reward, but a little glory never hurts."
        </p>
      </div>
    </div>
  );
};
