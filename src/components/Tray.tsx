import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTile } from '../types';
import { Tile } from './Tile';
import { TRAY_SIZE } from '../constants';

interface TrayProps {
  tiles: GameTile[];
  size?: number;
}

export const Tray: React.FC<TrayProps> = ({ tiles, size = TRAY_SIZE }) => {
  return (
    <motion.div 
      layout
      className="relative p-2 pb-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-[95vw] max-w-xl mx-auto"
    >
      <div className="flex gap-1.5 min-h-[56px] sm:min-h-[72px] items-center justify-center relative">
        {/* Empty slots background */}
        <div className="flex gap-1.5 p-2 justify-center pointer-events-none w-full">
          {Array.from({ length: size }).map((_, i) => (
            <div 
              key={i} 
              className="w-[10vw] max-w-[64px] aspect-square rounded-xl bg-black/10 border border-white/10 shadow-inner" 
            />
          ))}
        </div>

        {/* Tiles in tray */}
        <div className="absolute inset-0 flex gap-1.5 p-2 justify-center items-center">
          <AnimatePresence mode="popLayout">
            {tiles.map((tile, index) => (
              <div key={tile.instanceId} className="w-[10vw] max-w-[64px] aspect-square relative flex items-center justify-center">
                <Tile 
                  tile={tile} 
                  onClick={() => {}} 
                  isTray={true} 
                  index={index}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Tray label */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
        Matching Tray
      </div>
    </motion.div>
  );
};
