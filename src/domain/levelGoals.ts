/**
 * Seviyeye göre hedef listesi (LEVEL_GOALS.md ile uyumlu).
 */
import type { CandyColor, CellKind, GameState, LevelGoal, LevelLayout } from './types';
import { CANDY_COLORS, GRID_SIZE } from './gameConstants';

function scoreTarget(level: number): number {
  return 1000 + (level - 1) * 750;
}

function movesLimit(level: number): number {
  return Math.max(15, 30 - Math.floor(level / 2));
}

/**
 * Seviye numarasına göre hedefleri döndürür. Her seviyede en az skor + hamle; belirli seviyelerde collect eklenir.
 */
export function getLevelGoals(level: number): LevelGoal[] {
  const goals: LevelGoal[] = [
    { type: 'score', target: scoreTarget(level) },
    { type: 'moves', limit: movesLimit(level) },
  ];

  if (level >= 2) {
    const color = CANDY_COLORS[(level - 2) % CANDY_COLORS.length];
    const collectTarget = Math.min(8 + level * 2, 35);
    goals.push({ type: 'collect', color, target: collectTarget });
  }

  return goals;
}

export function getScoreTarget(level: number): number {
  return scoreTarget(level);
}

export function getMovesLimit(level: number): number {
  return movesLimit(level);
}

/** Tüm hedefler sağlanmış mı (skor, topla, hamle bitmeden). */
export function allGoalsMet(state: GameState): boolean {
  for (const g of state.goals) {
    if (g.type === 'score' && state.score < g.target) return false;
    if (g.type === 'collect') {
      const n = state.collected[g.color] ?? 0;
      if (n < g.target) return false;
    }
    if (g.type === 'moves') {
      if (state.moves < 0) return false;
    }
  }
  return true;
}

/**
 * Seviyeye göre hücre düzeni: play (oynanabilir), empty (delik), stone (taş), jelly (jelatin), lock (kilit).
 * Bazı seviyelerde köşelerde delikler, ortada taş/jelatin/kilit eklenir.
 */
export function getLevelLayout(level: number): LevelLayout {
  const layout: LevelLayout = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, (): CellKind => 'play')
  );

  if (level >= 4) {
    const emptyCount = Math.min(2 + Math.floor(level / 3), 6);
    for (let i = 0; i < emptyCount; i++) {
      const r = (level + i * 3) % GRID_SIZE;
      const c = (level * 2 + i * 5) % GRID_SIZE;
      layout[r][c] = 'empty';
    }
  }

  if (level >= 6) {
    const stoneCount = Math.min(1 + Math.floor((level - 6) / 2), 5);
    for (let i = 0; i < stoneCount; i++) {
      const r = Math.floor(GRID_SIZE / 2) + (i % 2) - 1;
      const c = Math.floor(GRID_SIZE / 2) + Math.floor(i / 2) - 1;
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && layout[r][c] === 'play')
        layout[r][c] = 'stone';
    }
  }

  if (level >= 9) {
    const jellyCount = Math.min(2 + (level - 9), 8);
    for (let i = 0; i < jellyCount; i++) {
      const r = (level * 7 + i * 11) % GRID_SIZE;
      const c = (level * 3 + i * 7) % GRID_SIZE;
      if (layout[r][c] === 'play') layout[r][c] = 'jelly';
    }
  }

  if (level >= 12) {
    const lockCount = Math.min(2 + Math.floor((level - 12) / 3), 6);
    for (let i = 0; i < lockCount; i++) {
      const r = (level * 5 + i * 13) % GRID_SIZE;
      const c = (level * 4 + i * 9) % GRID_SIZE;
      if (layout[r][c] === 'play') layout[r][c] = 'lock';
    }
  }

  return layout;
}
