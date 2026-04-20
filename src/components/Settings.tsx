import React from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetProgress: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, isMuted, onToggleMute, onResetProgress }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-slate-100 rounded-2xl text-slate-600 mb-4">
                <SettingsIcon size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Settings</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={onToggleMute}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    {isMuted ? <VolumeX size={20} className="text-red-500" /> : <Volume2 size={20} className="text-indigo-500" />}
                  </div>
                  <span className="font-bold text-slate-700">Sound Effects</span>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isMuted ? 'bg-slate-300' : 'bg-indigo-500'}`}>
                  <motion.div 
                    animate={{ x: isMuted ? 4 : 28 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </div>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                    onResetProgress();
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all group"
              >
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:rotate-180 transition-transform duration-500">
                  <RotateCcw size={20} />
                </div>
                <span className="font-bold">Reset Progress</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                Tile Explorer v2.0
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
