import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus } from '../types';
import { Play, RotateCcw, Trophy, AlertTriangle, Star } from 'lucide-react';

interface GameOverlayProps {
  status: GameStatus;
  level: number;
  onStart: () => void;
  onRestart: () => void;
  onRevive: () => void;
  stars?: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ status, level, onStart, onRestart, onRevive, stars = 0 }) => {
  return (
    <AnimatePresence>
      {status !== 'playing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl text-center border-b-8 border-black/5"
          >
            {status === 'idle' && (
              <>
                <div className="mb-6 inline-flex p-6 bg-indigo-100 rounded-[32px] text-indigo-600 shadow-inner">
                  <Play size={64} fill="currentColor" />
                </div>
                <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">Tile Explorer</h1>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">Embark on a serene journey of triple-tile matching across 500 levels.</p>
                <button
                  onClick={onStart}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-3xl shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Start Adventure
                </button>
              </>
            )}

            {status === 'won' && (
              <>
                <div className="mb-6 inline-flex p-6 bg-yellow-100 rounded-[32px] text-yellow-600 shadow-inner">
                  <Trophy size={64} />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-2">Victory!</h2>
                <p className="text-slate-500 mb-6 font-bold">Level {level} Complete</p>
                
                <div className="flex justify-center gap-2 mb-10">
                  {[1, 2, 3].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + s * 0.1, type: 'spring' }}
                    >
                      <Star 
                        size={48} 
                        className={s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} 
                      />
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={onStart}
                  className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-black rounded-3xl shadow-xl shadow-green-200 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Next Level
                </button>
              </>
            )}

            {status === 'lost' && (
              <>
                <div className="mb-6 inline-flex p-6 bg-red-100 rounded-[32px] text-red-600 shadow-inner">
                  <AlertTriangle size={64} />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-2">Tray Full!</h2>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">Your tray is full. Take a deep breath and try again or revive to continue.</p>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={onRevive}
                    className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white text-xl font-black rounded-3xl shadow-xl shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                  >
                    <Play size={24} fill="currentColor" />
                    Revive with Ad
                  </button>

                  <button
                    onClick={onRestart}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-lg font-black rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                  >
                    <RotateCcw size={20} />
                    Try Again
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
