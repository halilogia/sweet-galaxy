/**
 * @unit gameConstants.ts -> Module
 * @purpose [AUTO] Module logic for gameConstants.ts.
 * @dependencies None
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
import type { CandyColor } from './types';

export const GRID_SIZE = 8;
export const INITIAL_MOVES = 20;

/** Candy Crush tarzı toplam bölüm sayısı (level select ve zorluk formülleri buna göre). */
export const TOTAL_LEVELS = 500;

/** Level seçiminde sayfa başına gösterilen bölüm sayısı (sol/sağ ok ile sayfa değişir). */
export const LEVELS_PER_PAGE = 20;

export const CANDY_COLORS: CandyColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const COLOR_MAP: Record<CandyColor, string> = {
  red: 'bg-rose-500',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  purple: 'bg-violet-600',
  orange: 'bg-orange-500',
};
