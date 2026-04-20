import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Heart, Star, Sparkles, MessageCircle } from 'lucide-react';

interface PetCompanionProps {
  pet: {
    name: string;
    level: number;
    exp: number;
    mood: 'happy' | 'neutral' | 'sad' | 'excited';
  };
}

export const PetCompanion: React.FC<PetCompanionProps> = ({ pet }) => {
  const moodConfig = useMemo(() => {
    switch (pet.mood) {
      case 'happy':
        return { 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-400/20', 
          scale: 1.1,
          message: "You're a genius!",
          animation: { y: [0, -10, 0], rotate: [0, 5, -5, 0] }
        };
      case 'excited':
        return { 
          color: 'text-amber-400', 
          bg: 'bg-amber-400/20', 
          scale: 1.2,
          message: "COMBO POWER!",
          animation: { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
        };
      case 'sad':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-400/20', 
          scale: 0.9,
          message: "Aww, next time!",
          animation: { y: [0, 5, 0], opacity: [1, 0.7, 1] }
        };
      case 'neutral':
      default:
        return { 
          color: 'text-indigo-400', 
          bg: 'bg-indigo-400/20', 
          scale: 1,
          message: "Need a hint?",
          animation: { y: [0, -3, 0] }
        };
    }
  }, [pet.mood]);

  return (
    <div className="flex items-center gap-3 p-2 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/20">
      <div className="relative">
        <motion.div
          animate={moodConfig.animation}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-12 h-12 ${moodConfig.bg} rounded-full flex items-center justify-center border border-white/20`}
        >
          <Sparkles className={moodConfig.color} size={28} />
          
          {/* Exp ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="transparent"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * 22}
              animate={{ strokeDashoffset: (2 * Math.PI * 22) * (1 - (pet.exp % 100) / 100) }}
              className={moodConfig.color}
            />
          </svg>
        </motion.div>
        
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          <Heart size={8} className={pet.mood === 'sad' ? 'text-slate-300' : 'text-rose-500'} fill="currentColor" />
        </div>
      </div>

      <div className="hidden sm:flex flex-col pr-4">
        <div className="flex items-center gap-2">
          <span className="font-black text-white text-sm tracking-tight">{pet.name}</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white uppercase">Lv.{pet.level}</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={pet.mood}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5"
          >
            <MessageCircle size={10} className="text-white/40" />
            <span className="text-[10px] font-bold text-white/60 whitespace-nowrap">
              {moodConfig.message}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
