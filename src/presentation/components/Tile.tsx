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
import { CANDY_SVG } from '@/presentation/constants/candyIcons';

interface TileProps {
  candy: Candy;
  isSelected: boolean;
  isMatched: boolean;
  isHint?: boolean;
  onDragStart: (row: number, col: number) => void;
  onDrop: (row: number, col: number) => void;
}

const Tile: React.FC<TileProps> = ({ candy, isSelected, isMatched, isHint, onDragStart, onDrop }) => {
  const colorClass = COLOR_MAP[candy.color];

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(candy.row, candy.col);
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  return (
    <motion.div
      layout="position"
      initial={{ y: -400, opacity: 0 }}
      animate={{
        y: 0,
        opacity: isMatched ? 0 : 1,
        scale: isMatched ? 0 : (isSelected ? 1.1 : 1),
        boxShadow: isHint ? ['0 0 0 0 rgba(255,255,255,0)', '0 0 0 4px rgba(255,255,255,0.9)', '0 0 20px 6px rgba(255,215,0,0.6)', '0 0 0 4px rgba(255,255,255,0.9)', '0 0 0 0 rgba(255,255,255,0)'] : undefined,
      }}
      transition={{
        layout: { type: 'spring', stiffness: 400, damping: 30, mass: 1 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        boxShadow: isHint ? { duration: 0.8, repeat: Infinity, repeatDelay: 0.2 } : undefined,
      }}
      draggable={!isMatched}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(candy.row, candy.col);
      }}
      className="relative w-full h-full min-w-0 min-h-0 p-0.5 sm:p-1 cursor-grab active:cursor-grabbing origin-center touch-manipulation select-none"
      style={{ zIndex: isSelected ? 50 : 10, touchAction: 'none' }}
    >
      <div
        className={`
        w-full h-full rounded-xl flex items-center justify-center shadow-lg
        ${colorClass}
        ${isSelected ? 'ring-4 ring-white brightness-125' : 'shadow-md'}
        ${isHint ? 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-indigo-950/50' : ''}
        hover:brightness-110 transition-all border border-white/10
      `}
      >
        <div className="w-4/5 h-4/5 min-w-0 min-h-0 text-white/90 pointer-events-none drop-shadow-md flex items-center justify-center">
          {CANDY_SVG[candy.color]}
        </div>
      </div>
    </motion.div>
  );
};

export default Tile;
