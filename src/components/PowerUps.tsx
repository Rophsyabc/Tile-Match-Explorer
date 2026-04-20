import React from 'react';
import { RotateCcw, Wand2, Shuffle, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface PowerUpsProps {
  onUndo: () => void;
  onHint: () => void;
  onAIHint: () => void;
  onShuffle: () => void;
  undoDisabled: boolean;
  coins: number;
}

export const PowerUps: React.FC<PowerUpsProps> = ({ onUndo, onHint, onAIHint, onShuffle, undoDisabled, coins }) => {
  return (
    <div className="flex gap-4 sm:gap-6 items-end justify-center">
      <PowerUpButton 
        icon={<RotateCcw size={18} />} 
        onClick={onUndo} 
        disabled={undoDisabled}
        label="Undo"
      />
      <PowerUpButton 
        icon={<Wand2 size={20} />} 
        onClick={onHint} 
        label="Hint"
      />
      <PowerUpButton 
        icon={<Brain size={28} />} 
        onClick={onAIHint} 
        label="AI Insight"
        primary
        cost={20}
        canAfford={coins >= 20}
      />
      <PowerUpButton 
        icon={<Shuffle size={18} />} 
        onClick={onShuffle} 
        label="Shuffle"
      />
    </div>
  );
};

interface PowerUpButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  primary?: boolean;
  cost?: number;
  canAfford?: boolean;
}

const PowerUpButton: React.FC<PowerUpButtonProps> = ({ icon, onClick, disabled, label, primary, cost, canAfford = true }) => {
  const isInactive = disabled || !canAfford;

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileHover={!isInactive ? { scale: 1.1, y: -5 } : {}}
        whileTap={!isInactive ? { scale: 0.9 } : {}}
        onClick={onClick}
        disabled={isInactive}
        className={`
          relative flex items-center justify-center rounded-full shadow-xl transition-all
          ${primary ? 'w-20 h-20 bg-indigo-600 text-white border-indigo-400' : 'w-14 h-14 bg-white/90 text-slate-700 border-white/50'}
          ${isInactive ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
          border-4 backdrop-blur-sm
        `}
      >
        {icon}
        {cost && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full border-2 border-white shadow-sm flex items-center gap-1">
            {cost}
          </div>
        )}
      </motion.button>
      <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md">
        {label}
      </span>
    </div>
  );
};
