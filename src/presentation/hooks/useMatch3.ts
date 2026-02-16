/**
 * @unit useMatch3.ts -> Hook
 * @purpose [AUTO] Hook logic for useMatch3.ts.
 * @dependencies [react, @]
 * @complexity 20 (High)
 * @scope [AUTO] Module-Local
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Candy, CandyColor, CandyType, GameState, LevelGoal, LevelLayout } from '@/domain/types';
import { GRID_SIZE, CANDY_COLORS } from '@/domain/gameConstants';
import { getLevelGoals, getLevelLayout, allGoalsMet } from '@/domain/levelGoals';

const generateCandy = (row: number, col: number): Candy => ({
  id: `candy-${Math.random().toString(36).substr(2, 9)}-${Date.now()}-${row}-${col}`,
  color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)],
  type: 'normal',
  row,
  col,
});

function initialCollected(goals: LevelGoal[]): Partial<Record<CandyColor, number>> {
  const c: Partial<Record<CandyColor, number>> = {};
  goals.forEach(g => {
    if (g.type === 'collect') c[g.color] = 0;
  });
  return c;
}

export type UseMatch3Options = { hintEnabled?: boolean };

export const useMatch3 = (initialLevel: number = 1, options: UseMatch3Options = {}) => {
  const { hintEnabled = true } = options;
  const goalsForLevel = (lvl: number) => getLevelGoals(lvl);
  const scoreTargetFromGoals = (goals: LevelGoal[]) => goals.find(g => g.type === 'score')?.target ?? 1000;
  const movesLimitFromGoals = (goals: LevelGoal[]) => goals.find(g => g.type === 'moves')?.limit ?? 20;

  const createInitialBoard = (layout: LevelLayout): (Candy | null)[][] => {
    const board: (Candy | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (layout[r][c] !== 'play' && layout[r][c] !== 'lock') continue;
        let candy = generateCandy(r, c);
        while (
          (r > 1 && (board[r-1][c]?.color === candy.color && board[r-2][c]?.color === candy.color)) ||
          (c > 1 && (board[r][c-1]?.color === candy.color && board[r][c-2]?.color === candy.color))
        ) {
          candy = generateCandy(r, c);
        }
        board[r][c] = candy;
      }
    }
    return board;
  };

  const initialLayout = getLevelLayout(initialLevel);
  const initialGoals = goalsForLevel(initialLevel);
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(initialLayout),
    layout: initialLayout,
    score: 0,
    moves: movesLimitFromGoals(initialGoals),
    level: initialLevel,
    targetScore: scoreTargetFromGoals(initialGoals),
    goals: initialGoals,
    collected: initialCollected(initialGoals),
    isProcessing: false,
    selectedCandy: null,
    levelCompleted: false,
  });

  /** Her render'da güncel tahta; processBoard async döngüsü closure yerine bunu okur. */
  const boardRef = useRef<(Candy | null)[][]>(gameState.board);
  boardRef.current = gameState.board;

  /** Combo: ardışık eşleşme sayacı (her cascade'de artar, tahta sakinleşince sıfırlanır). */
  const comboRef = useRef(0);

  /** Hatalı hamlede geri alma zamanlayıcısı; yeni swap yapılınca iptal edilir. */
  const revertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INVALID_SWAP_REVERT_MS = 420;
  const BONUS_PER_REMAINING_MOVE = 50;

  const checkMatches = useCallback((board: (Candy | null)[][]): { hasMatches: boolean; matchedBoard: (Candy | null)[][] } => {
    let hasMatches = false;
    const newBoard = board.map(row => row.map(c => c ? { ...c, isMatched: false } : null));

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const a = newBoard[r][c], b = newBoard[r][c + 1], c2 = newBoard[r][c + 2];
        if (!a || !b || !c2) continue;
        if (a.color === b.color && a.color === c2.color) {
          a.isMatched = true; b.isMatched = true; c2.isMatched = true;
          hasMatches = true;
        }
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const a = newBoard[r][c], b = newBoard[r + 1][c], c2 = newBoard[r + 2][c];
        if (!a || !b || !c2) continue;
        if (a.color === b.color && a.color === c2.color) {
          a.isMatched = true; b.isMatched = true; c2.isMatched = true;
          hasMatches = true;
        }
      }
    }
    return { hasMatches, matchedBoard: newBoard };
  }, []);

  /** 4/5+ eşleşmelerden striped ve wrapped üretir; atanan hücrelerin isMatched'ını kaldırır. */
  const applySpecials = useCallback((matchedBoard: (Candy | null)[][]): (Candy | null)[][] => {
    const board = matchedBoard.map(row => row.map(c => c ? { ...c } : null));
    type Run = { r: number; c: number; length: number; horizontal: boolean };
    const runs: Run[] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      let c = 0;
      while (c <= GRID_SIZE - 3) {
        const cell = board[r][c];
        if (!cell || !cell.isMatched) { c++; continue; }
        const color = cell.color;
        let len = 0;
        while (c + len < GRID_SIZE && board[r][c + len]?.isMatched && board[r][c + len]?.color === color) len++;
        if (len >= 3) runs.push({ r, c, length: len, horizontal: true });
        c += len;
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      let r = 0;
      while (r <= GRID_SIZE - 3) {
        const cell = board[r][c];
        if (!cell || !cell.isMatched) { r++; continue; }
        const color = cell.color;
        let len = 0;
        while (r + len < GRID_SIZE && board[r + len][c]?.isMatched && board[r + len][c]?.color === color) len++;
        if (len >= 3) runs.push({ r, c, length: len, horizontal: false });
        r += len;
      }
    }

    const wrappedCells = new Set<string>();
    const stripedCells = new Map<string, CandyType>();

    const key = (r: number, c: number) => `${r},${c}`;
    const inRun = (r: number, c: number, run: Run) => {
      if (run.horizontal) return r === run.r && c >= run.c && c < run.c + run.length;
      return c === run.c && r >= run.r && r < run.r + run.length;
    };

    for (const run of runs) {
      if (run.length >= 5) {
        const mid = run.length >> 1;
        const r0 = run.horizontal ? run.r : run.r + mid;
        const c0 = run.horizontal ? run.c + mid : run.c;
        wrappedCells.add(key(r0, c0));
      }
    }
    const inRun4H = (r: number, c: number) => runs.some(run => run.horizontal && run.length === 4 && inRun(r, c, run));
    const inRun4V = (r: number, c: number) => runs.some(run => !run.horizontal && run.length === 4 && inRun(r, c, run));
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE; c++)
        if (inRun4H(r, c) && inRun4V(r, c)) wrappedCells.add(key(r, c));
    for (const run of runs) {
      if (run.length !== 4) continue;
      for (let i = 0; i < 4; i++) {
        const rr = run.horizontal ? run.r : run.r + i;
        const cc = run.horizontal ? run.c + i : run.c;
        const k = key(rr, cc);
        if (wrappedCells.has(k)) continue;
        stripedCells.set(k, run.horizontal ? 'striped-h' : 'striped-v');
        break;
      }
    }

    for (const k of wrappedCells) {
      const [r, c] = k.split(',').map(Number);
      const cell = board[r][c];
      if (cell) { cell.type = 'wrapped'; cell.isMatched = false; }
    }
    stripedCells.forEach((t, k) => {
      const [r, c] = k.split(',').map(Number);
      if (wrappedCells.has(k)) return;
      const cell = board[r][c];
      if (cell) { cell.type = t; cell.isMatched = false; }
    });

    return board;
  }, []);

  /** isMatched olan özel şekerlerin satır/sütun/3x3 etkisini uygular. */
  const resolveSpecialExplosions = useCallback((board: (Candy | null)[][]): (Candy | null)[][] => {
    const next = board.map(row => row.map(c => c ? { ...c } : null));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = next[r][c];
        if (!cell || !cell.isMatched || cell.type === 'normal') continue;
        if (cell.type === 'striped-h') {
          for (let cc = 0; cc < GRID_SIZE; cc++) { const x = next[r][cc]; if (x) x.isMatched = true; }
        }
        if (cell.type === 'striped-v') {
          for (let rr = 0; rr < GRID_SIZE; rr++) { const x = next[rr][c]; if (x) x.isMatched = true; }
        }
        if (cell.type === 'wrapped') {
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr, cc = c + dc;
              if (rr >= 0 && rr < GRID_SIZE && cc >= 0 && cc < GRID_SIZE) {
                const x = next[rr][cc];
                if (x) x.isMatched = true;
              }
            }
        }
        if (cell.type === 'color-bomb') {
          const colorToClear = cell.color;
          const colorCounts: Partial<Record<CandyColor, number>> = {};
          for (let rr = 0; rr < GRID_SIZE; rr++) {
            for (let cc = 0; cc < GRID_SIZE; cc++) {
              const x = next[rr][cc];
              if (x && x.type !== 'color-bomb') {
                colorCounts[x.color] = (colorCounts[x.color] ?? 0) + 1;
              }
            }
          }
          const targetColor = colorToClear || (Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as CandyColor) || CANDY_COLORS[0];
          for (let rr = 0; rr < GRID_SIZE; rr++) {
            for (let cc = 0; cc < GRID_SIZE; cc++) {
              const x = next[rr][cc];
              if (x && x.color === targetColor) {
                x.isMatched = true;
              }
            }
          }
        }
      }
    }
    return next;
  }, []);

  const handleGravity = useCallback((board: (Candy | null)[][], layout: LevelLayout): (Candy | null)[][] => {
    const newBoard: (Candy | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    for (let c = 0; c < GRID_SIZE; c++) {
      const playRows = Array.from({ length: GRID_SIZE }, (_, r) => r).filter(r => layout[r][c] === 'play' || layout[r][c] === 'lock').sort((a, b) => b - a);
      const surviving: Candy[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        if (layout[r][c] !== 'play' && layout[r][c] !== 'lock') continue;
        const cell = board[r][c];
        if (cell && !cell.isMatched) surviving.push(cell);
      }
      surviving.sort((a, b) => b.row - a.row);
      playRows.forEach((row, i) => {
        if (layout[row][c] === 'lock') {
          if (i < surviving.length)
            newBoard[row][c] = { ...surviving[i], row, col: c };
          else
            newBoard[row][c] = generateCandy(row, c);
        } else if (layout[row][c] === 'play') {
          if (i < surviving.length)
            newBoard[row][c] = { ...surviving[i], row, col: c };
          else
            newBoard[row][c] = generateCandy(row, c);
        }
      });
    }
    return newBoard;
  }, []);

  const processBoard = useCallback(async () => {
    comboRef.current = 0;
    setGameState(prev => ({ ...prev, isProcessing: true }));

    const runCycle = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));

      const currentBoard = boardRef.current;
      const { hasMatches, matchedBoard } = checkMatches(currentBoard);

      if (hasMatches) {
        const boardWithSpecials = applySpecials(matchedBoard);
        const boardAfterExplosions = resolveSpecialExplosions(boardWithSpecials);

        let matchesInThisTurn = 0;
        const byColor: Partial<Record<CandyColor, number>> = {};
        boardAfterExplosions.forEach(row => row.forEach(c => {
          if (c?.isMatched) {
            matchesInThisTurn++;
            byColor[c.color] = (byColor[c.color] ?? 0) + 1;
          }
        }));

        const comboMultiplier = 1 + comboRef.current * 0.5;
        const baseScore = matchesInThisTurn * 15;
        const scoreToAdd = Math.floor(baseScore * comboMultiplier);
        comboRef.current++;

        setGameState(prev => {
          const nextCollected = { ...prev.collected };
          Object.entries(byColor).forEach(([color, n]) => {
            nextCollected[color as CandyColor] = (prev.collected[color as CandyColor] ?? 0) + n;
          });
          const nextLayout = prev.layout.map(row => [...row]);
          const affectedCells = new Set<string>();
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              const cell = boardAfterExplosions[r][c];
              if (cell?.isMatched) {
                affectedCells.add(`${r},${c}`);
                for (let dr = -1; dr <= 1; dr++) {
                  for (let dc = -1; dc <= 1; dc++) {
                    const rr = r + dr, cc = c + dc;
                    if (rr >= 0 && rr < GRID_SIZE && cc >= 0 && cc < GRID_SIZE) {
                      affectedCells.add(`${rr},${cc}`);
                    }
                  }
                }
              }
            }
          }
          affectedCells.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            if (nextLayout[r][c] === 'jelly' || nextLayout[r][c] === 'stone' || nextLayout[r][c] === 'lock') {
              nextLayout[r][c] = 'play';
            }
          });
          return {
            ...prev,
            board: boardAfterExplosions,
            layout: nextLayout,
            score: prev.score + scoreToAdd,
            collected: nextCollected,
          };
        });

        await new Promise(resolve => setTimeout(resolve, 400));

        setGameState(prev => {
          const nextBoard = handleGravity(prev.board, prev.layout);
          return { ...prev, board: nextBoard };
        });
        setHint(null);

        await new Promise(resolve => setTimeout(resolve, 500));
        await runCycle();
      } else {
        comboRef.current = 0;
        setGameState(prev => ({ ...prev, isProcessing: false }));
      }
    };

    await runCycle();
  }, [checkMatches, handleGravity, applySpecials, resolveSpecialExplosions]);

  /** Geçerli bir hamle bulur (takas edilince eşleşme oluşan iki komşu hücre). */
  const getHintMove = useCallback((): { from: { row: number; col: number }; to: { row: number; col: number } } | null => {
    const board = boardRef.current;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (c < GRID_SIZE - 1) {
          const a = board[r][c], b = board[r][c + 1];
          const layout = gameState.layout;
          if (a && b && layout[r][c] !== 'lock' && layout[r][c + 1] !== 'lock') {
            const swapped = board.map((row, ri) => row.map((cell, ci) => {
              if (ri === r && ci === c) return { ...b, row: r, col: c };
              if (ri === r && ci === c + 1) return { ...a, row: r, col: c + 1 };
              return cell;
            }));
            if (checkMatches(swapped).hasMatches) return { from: { row: r, col: c }, to: { row: r, col: c + 1 } };
          }
        }
        if (r < GRID_SIZE - 1) {
          const a = board[r][c], b = board[r + 1][c];
          const layout = gameState.layout;
          if (a && b && layout[r][c] !== 'lock' && layout[r + 1][c] !== 'lock') {
            const swapped = board.map((row, ri) => row.map((cell, ci) => {
              if (ri === r && ci === c) return { ...b, row: r, col: c };
              if (ri === r + 1 && ci === c) return { ...a, row: r + 1, col: c };
              return cell;
            }));
            if (checkMatches(swapped).hasMatches) return { from: { row: r, col: c }, to: { row: r + 1, col: c } };
          }
        }
      }
    }
    return null;
  }, [checkMatches]);

  const [hint, setHint] = useState<{ from: { row: number; col: number }; to: { row: number; col: number } } | null>(null);
  const [noValidMovesLeft, setNoValidMovesLeft] = useState(false);

  const performSwap = (from: { row: number; col: number }, to: { row: number; col: number }) => {
    if (gameState.isProcessing || gameState.moves <= 0 || gameState.levelCompleted) return;

    setHint(null);

    if (revertTimeoutRef.current != null) {
      clearTimeout(revertTimeoutRef.current);
      revertTimeoutRef.current = null;
    }

    const isAdjacent = Math.abs(from.row - to.row) + Math.abs(from.col - to.col) === 1;
    if (!isAdjacent) return;

    const newBoard = gameState.board.map(r => [...r]);
    const candyA = newBoard[from.row][from.col];
    const candyB = newBoard[to.row][to.col];
    if (!candyA || !candyB) return;
    if (gameState.layout[from.row][from.col] === 'lock' || gameState.layout[to.row][to.col] === 'lock') return;

    const isSpecialA = candyA.type !== 'normal';
    const isSpecialB = candyB.type !== 'normal';
    const isColorBombA = candyA.type === 'color-bomb';
    const isColorBombB = candyB.type === 'color-bomb';

    let swappedA = { ...candyB, row: from.row, col: from.col };
    let swappedB = { ...candyA, row: to.row, col: to.col };

    if (isColorBombA && !isColorBombB && candyB.type === 'normal') {
      swappedA = { ...candyA, color: candyB.color, row: from.row, col: from.col };
      swappedB = { ...candyB, type: 'color-bomb', color: candyB.color, row: to.row, col: to.col };
    } else if (isColorBombB && !isColorBombA && candyA.type === 'normal') {
      swappedA = { ...candyA, type: 'color-bomb', color: candyA.color, row: from.row, col: from.col };
      swappedB = { ...candyB, color: candyA.color, row: to.row, col: to.col };
    } else if (isSpecialA && isSpecialB && !isColorBombA && !isColorBombB) {
      const colorBombColor = candyA.color;
      swappedA = { ...candyA, type: 'color-bomb', color: colorBombColor, row: from.row, col: from.col };
      swappedB = { ...candyB, type: 'color-bomb', color: colorBombColor, row: to.row, col: to.col };
    }

    newBoard[from.row][from.col] = swappedA;
    newBoard[to.row][to.col] = swappedB;

    const { hasMatches } = checkMatches(newBoard);

    if (hasMatches) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moves: prev.moves - 1,
        selectedCandy: null,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        selectedCandy: null,
      }));
      revertTimeoutRef.current = setTimeout(() => {
        revertTimeoutRef.current = null;
        setGameState(prev => {
          const board = prev.board.map(r => [...r]);
          const a = board[from.row][from.col];
          const b = board[to.row][to.col];
          if (a && b) {
            board[from.row][from.col] = { ...b, row: from.row, col: from.col };
            board[to.row][to.col] = { ...a, row: to.row, col: to.col };
          }
          return { ...prev, board };
        });
      }, INVALID_SWAP_REVERT_MS);
    }
  };

  useEffect(() => {
    if (!gameState.isProcessing && checkMatches(gameState.board).hasMatches) {
      processBoard();
    }
  }, [gameState.isProcessing, gameState.board, checkMatches, processBoard]);

  useEffect(() => {
    if (gameState.levelCompleted) return;
    if (!gameState.isProcessing && allGoalsMet(gameState)) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + prev.moves * BONUS_PER_REMAINING_MOVE,
        levelCompleted: true,
      }));
    }
  }, [gameState.isProcessing, gameState.score, gameState.moves, gameState.collected, gameState.goals, gameState.targetScore, gameState.levelCompleted]);

  const HINT_DELAY_MS = 15000;

  /** Tahta her değiştiğinde ipucunun geçerliliğini kontrol et ve gerekiyorsa temizle. */
  useEffect(() => {
    if (!hint) return;
    const board = gameState.board;
    const fromCell = board[hint.from.row]?.[hint.from.col];
    const toCell = board[hint.to.row]?.[hint.to.col];
    if (!fromCell || !toCell) {
      setHint(null);
      return;
    }
    const swapped = board.map((row, ri) => row.map((cell, ci) => {
      if (ri === hint.from.row && ci === hint.from.col) return toCell ? { ...toCell, row: hint.from.row, col: hint.from.col } : cell;
      if (ri === hint.to.row && ci === hint.to.col) return fromCell ? { ...fromCell, row: hint.to.row, col: hint.to.col } : cell;
      return cell;
    }));
    const { hasMatches } = checkMatches(swapped);
    if (!hasMatches) {
      setHint(null);
    }
  }, [gameState.board, hint, checkMatches]);

  /** Olası hamle kalmadığında (tahta sakin, hiç geçerli takas yok) işaretle. */
  useEffect(() => {
    if (gameState.isProcessing || gameState.moves <= 0 || gameState.levelCompleted) {
      setNoValidMovesLeft(false);
      return;
    }
    const { hasMatches } = checkMatches(gameState.board);
    if (hasMatches) {
      setNoValidMovesLeft(false);
      return;
    }
    const move = getHintMove();
    setNoValidMovesLeft(move === null);
  }, [gameState.board, gameState.isProcessing, gameState.moves, gameState.levelCompleted, checkMatches, getHintMove]);

  useEffect(() => {
    if (!hintEnabled) {
      setHint(null);
      return;
    }
    if (gameState.isProcessing || gameState.moves <= 0 || gameState.levelCompleted) {
      setHint(null);
      return;
    }
    const t = setTimeout(() => {
      const move = getHintMove();
      if (move) setHint(move);
    }, HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [hintEnabled, gameState.isProcessing, gameState.moves, gameState.levelCompleted, gameState.board, getHintMove]);

  const resetGame = (newLevel: number) => {
    setHint(null);
    setNoValidMovesLeft(false);
    const goals = goalsForLevel(newLevel);
    const layout = getLevelLayout(newLevel);
    setGameState({
      board: createInitialBoard(layout),
      layout,
      score: 0,
      moves: movesLimitFromGoals(goals),
      level: newLevel,
      targetScore: scoreTargetFromGoals(goals),
      goals,
      collected: initialCollected(goals),
      isProcessing: false,
      selectedCandy: null,
      levelCompleted: false,
    });
  };

  const shuffleBoard = () => {
    setHint(null);
    setNoValidMovesLeft(false);
    setGameState(prev => ({ ...prev, board: createInitialBoard(prev.layout), selectedCandy: null }));
  };

  return { gameState, performSwap, resetGame, hint, noValidMovesLeft, shuffleBoard };
};
