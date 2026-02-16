/**
 * @unit Tile.tsx -> Type Definition
 * @purpose [AUTO] Type Definition logic for Tile.tsx.
 * @dependencies [react, framer-motion, @]
 * @complexity 6 (Medium)
 * @scope [AUTO] Module-Local
 */
import React from 'react';
import { motion } from 'framer-motion';
import type { Candy } from '@/domain/types';
import { COLOR_MAP } from '@/domain/gameConstants';
import { CANDY_SVG, SPECIAL_CANDY_SVG } from '@/presentation/constants/candyIcons';

interface TileProps {
  candy: Candy;
  isSelected: boolean;
  isMatched: boolean;
  isHint?: boolean;
  isLocked?: boolean;
  onDragStart: (row: number, col: number) => void;
  onDrop: (row: number, col: number) => void;
  onTap?: (row: number, col: number) => void;
}

const Tile: React.FC<TileProps> = ({ candy, isSelected, isMatched, isHint, isLocked, onDragStart, onDrop, onTap }) => {
  const colorClass = COLOR_MAP[candy.color];

  const handleDragStart = (e: React.DragEvent) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    onDragStart(candy.row, candy.col);
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isMatched ? 0 : 1,
        scale: isMatched ? [1, 1.35, 0] : (isSelected ? 1.1 : 1),
        boxShadow: isHint ? ['0 0 0 0 rgba(255,255,255,0)', '0 0 0 4px rgba(255,255,255,0.9)', '0 0 20px 6px rgba(255,215,0,0.6)', '0 0 0 4px rgba(255,255,255,0.9)', '0 0 0 0 rgba(255,255,255,0)'] : undefined,
      }}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 180,
          damping: 24,
          mass: 1,
          delay: candy.row * 0.032,
        },
        opacity: { duration: isMatched ? 0.35 : 0.25 },
        scale: isMatched ? { duration: 0.35, times: [0, 0.4, 1] } : { duration: 0.25 },
        boxShadow: isHint ? { duration: 0.8, repeat: Infinity, repeatDelay: 0.2 } : undefined,
      }}
      draggable={!isMatched && !isLocked}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!isLocked) onDrop(candy.row, candy.col);
      }}
      onClick={() => onTap?.(candy.row, candy.col)}
      className={`relative w-full h-full min-w-0 min-h-0 p-0.5 sm:p-1 origin-center touch-manipulation select-none ${isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
      style={{ zIndex: isSelected ? 50 : 10, touchAction: 'none' }}
    >
      <div
        className={`
        w-full h-full rounded-xl flex items-center justify-center shadow-lg relative overflow-visible
        ${colorClass}
        ${isSelected ? 'ring-4 ring-white brightness-125' : 'shadow-md'}
        ${isHint ? 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-indigo-950/50' : ''}
        hover:brightness-110 transition-all border border-white/10
      `}
      >
        {isMatched && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0.9, scale: 0.8, boxShadow: '0 0 0 0 rgba(255,255,255,0.6)' }}
            animate={{
              opacity: 0,
              scale: 1.8,
              boxShadow: '0 0 30px 12px rgba(255,255,255,0.4), 0 0 60px 20px rgba(255,215,0,0.25)',
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}
        <div className="w-4/5 h-4/5 min-w-0 min-h-0 text-white/90 pointer-events-none drop-shadow-md flex items-center justify-center relative z-10">
          {candy.type === 'normal' ? CANDY_SVG[candy.color] : SPECIAL_CANDY_SVG[candy.type]}
        </div>
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-amber-600/80 rounded-lg p-1 sm:p-1.5 border-2 border-amber-400 shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Tile;
