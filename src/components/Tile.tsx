import React from 'react';
import { motion } from 'motion/react';
import { GameTile } from '../types';
import { TILE_SIZE } from '../constants';
import { Lock, Key, Timer, Snowflake } from 'lucide-react';

interface TileProps {
  tile: GameTile;
  onClick: (tile: GameTile) => void;
  isTray?: boolean;
  index?: number;
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, isTray = false, index = 0 }) => {
  const style = isTray ? {} : {
    left: `${tile.x * TILE_SIZE}px`,
    top: `${tile.y * TILE_SIZE}px`,
    zIndex: tile.z * 10,
  };

  return (
    <motion.div
      layoutId={tile.instanceId}
      initial={isTray ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        filter: tile.isBlocked && !isTray ? 'brightness(0.7) grayscale(0.2)' : 'brightness(1) grayscale(0)',
        boxShadow: tile.isHinted ? '0 0 25px 8px rgba(255, 230, 0, 0.9)' : '0 12px 20px -5px rgba(0, 0, 0, 0.15)',
      }}
      whileHover={!tile.isBlocked && !isTray ? { scale: 1.05, y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' } : {}}
      whileTap={!tile.isBlocked && !isTray ? { scale: 0.95 } : {}}
      onClick={() => !tile.isBlocked && onClick(tile)}
      className={`
        flex items-center justify-center
        rounded-2xl shadow-xl border-b-[6px] border-r-[3px]
        cursor-pointer select-none transition-all duration-300
        ${tile.color} border-black/20
        ${isTray ? 'relative w-full h-full' : 'absolute w-16 h-16'}
        ${tile.isBlocked && !isTray ? 'cursor-not-allowed' : ''}
        ${tile.special === 'ice' && tile.health === 2 ? 'ring-4 ring-blue-300 ring-inset' : ''}
      `}
      style={style}
    >
      <span className={`${isTray ? 'text-2xl sm:text-3xl' : 'text-3xl'} drop-shadow-sm`}>{tile.symbol}</span>
      
      {/* Premium Glossy effect */}
      <div className="absolute top-1.5 left-1.5 w-[30%] h-[20%] bg-white/40 rounded-full blur-[2px]" />
      <div className="absolute top-0.5 right-0.5 w-[50%] h-[50%] bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl pointer-events-none" />
      
      {/* Special Tile Overlays */}
      {tile.special === 'ice' && (
        <div className={`absolute inset-0 bg-blue-400/30 rounded-xl flex items-center justify-center backdrop-blur-[1px] transition-opacity ${tile.health === 1 ? 'opacity-40' : 'opacity-100'}`}>
          <Snowflake size={24} className="text-white/80 animate-pulse" />
          {/* Crack lines for health 1 */}
          {tile.health === 1 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/50 rotate-45" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/50 -rotate-45" />
            </div>
          )}
        </div>
      )}

      {tile.special === 'lock' && (
        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
          <Lock size={24} className="text-white animate-bounce" />
        </div>
      )}

      {tile.special === 'key' && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full shadow-lg z-20">
          <Key size={12} className="text-white" />
        </div>
      )}

      {tile.special === 'timed' && (
        <div className="absolute bottom-1 left-1 right-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${(tile.timer || 10) * 10}%` }}
            className={`h-full ${ (tile.timer || 0) < 3 ? 'bg-red-500' : 'bg-green-400' }`}
          />
          <Timer size={10} className="absolute -top-3 right-0 text-white/80" />
        </div>
      )}

      {/* AI/Hint Shine Effect */}
      {tile.isHinted && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '200%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
        />
      )}
    </motion.div>
  );
};
