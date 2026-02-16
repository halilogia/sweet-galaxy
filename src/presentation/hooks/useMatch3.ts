/**
 * @unit useMatch3.ts -> Hook
 * @purpose [AUTO] Hook logic for useMatch3.ts.
 * @dependencies [react, @]
 * @complexity 20 (High)
 * @scope [AUTO] Module-Local
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Candy, CandyColor, GameState } from '@/domain/types';
import { GRID_SIZE, CANDY_COLORS } from '@/domain/gameConstants';

const generateCandy = (row: number, col: number): Candy => ({
  id: `candy-${Math.random().toString(36).substr(2, 9)}-${Date.now()}-${row}-${col}`,
  color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)],
  type: 'normal',
  row,
  col,
});

export const useMatch3 = (initialLevel: number = 1) => {
  const calculateTarget = (lvl: number) => 1000 + (lvl - 1) * 750;
  const calculateMoves = (lvl: number) => Math.max(15, 30 - Math.floor(lvl / 2));

  const createInitialBoard = (): Candy[][] => {
    const board: Candy[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      board[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let candy = generateCandy(r, c);
        while (
          (r > 1 && board[r-1][c].color === candy.color && board[r-2][c].color === candy.color) ||
          (c > 1 && board[r][c-1].color === candy.color && board[r][c-2].color === candy.color)
        ) {
          candy = generateCandy(r, c);
        }
        board[r][c] = candy;
      }
    }
    return board;
  };

  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    score: 0,
    moves: calculateMoves(initialLevel),
    level: initialLevel,
    targetScore: calculateTarget(initialLevel),
    isProcessing: false,
    selectedCandy: null,
  });

  /** Her render'da güncel tahta; processBoard async döngüsü closure yerine bunu okur. */
  const boardRef = useRef<Candy[][]>(gameState.board);
  boardRef.current = gameState.board;

  const checkMatches = useCallback((board: Candy[][]): { hasMatches: boolean; matchedBoard: Candy[][] } => {
    let hasMatches = false;
    const newBoard = board.map(row => row.map(candy => ({ ...candy, isMatched: false })));

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const color = newBoard[r][c].color;
        if (color === newBoard[r][c + 1].color && color === newBoard[r][c + 2].color) {
          newBoard[r][c].isMatched = true;
          newBoard[r][c + 1].isMatched = true;
          newBoard[r][c + 2].isMatched = true;
          hasMatches = true;
        }
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const color = newBoard[r][c].color;
        if (color === newBoard[r + 1][c].color && color === newBoard[r + 2][c].color) {
          newBoard[r][c].isMatched = true;
          newBoard[r + 1][c].isMatched = true;
          newBoard[r + 2][c].isMatched = true;
          hasMatches = true;
        }
      }
    }

    return { hasMatches, matchedBoard: newBoard };
  }, []);

  const handleGravity = useCallback((board: Candy[][]): Candy[][] => {
    const newBoard: Candy[][] = Array.from({ length: GRID_SIZE }, (_, r) =>
      Array.from({ length: GRID_SIZE }, (_, c) => board[r][c])
    );

    for (let c = 0; c < GRID_SIZE; c++) {
      let writeIdx = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (!board[r][c].isMatched) {
          newBoard[writeIdx][c] = { ...board[r][c], row: writeIdx, col: c };
          writeIdx--;
        }
      }
      while (writeIdx >= 0) {
        newBoard[writeIdx][c] = generateCandy(writeIdx, c);
        writeIdx--;
      }
    }
    return newBoard;
  }, []);

  const processBoard = useCallback(async () => {
    setGameState(prev => ({ ...prev, isProcessing: true }));

    const runCycle = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));

      const currentBoard = boardRef.current;
      const { hasMatches, matchedBoard } = checkMatches(currentBoard);

      if (hasMatches) {
        let matchesInThisTurn = 0;
        matchedBoard.forEach(row => row.forEach(c => { if (c.isMatched) matchesInThisTurn++; }));

        setGameState(prev => ({
          ...prev,
          board: matchedBoard,
          score: prev.score + (matchesInThisTurn * 15),
        }));

        await new Promise(resolve => setTimeout(resolve, 400));

        setGameState(prev => {
          const nextBoard = handleGravity(prev.board);
          return { ...prev, board: nextBoard };
        });

        await new Promise(resolve => setTimeout(resolve, 500));
        await runCycle();
      } else {
        setGameState(prev => ({ ...prev, isProcessing: false }));
      }
    };

    await runCycle();
  }, [checkMatches, handleGravity]);

  /** Geçerli bir hamle bulur (takas edilince eşleşme oluşan iki komşu hücre). */
  const getHintMove = useCallback((): { from: { row: number; col: number }; to: { row: number; col: number } } | null => {
    const board = boardRef.current;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (c < GRID_SIZE - 1) {
          const swapped = board.map((row, ri) => row.map((cell, ci) => {
            if (ri === r && ci === c) return { ...board[r][c + 1], row: r, col: c };
            if (ri === r && ci === c + 1) return { ...board[r][c], row: r, col: c + 1 };
            return { ...cell };
          }));
          if (checkMatches(swapped).hasMatches) return { from: { row: r, col: c }, to: { row: r, col: c + 1 } };
        }
        if (r < GRID_SIZE - 1) {
          const swapped = board.map((row, ri) => row.map((cell, ci) => {
            if (ri === r && ci === c) return { ...board[r + 1][c], row: r, col: c };
            if (ri === r + 1 && ci === c) return { ...board[r][c], row: r + 1, col: c };
            return { ...cell };
          }));
          if (checkMatches(swapped).hasMatches) return { from: { row: r, col: c }, to: { row: r + 1, col: c } };
        }
      }
    }
    return null;
  }, [checkMatches]);

  const [hint, setHint] = useState<{ from: { row: number; col: number }; to: { row: number; col: number } } | null>(null);

  const performSwap = (from: { row: number; col: number }, to: { row: number; col: number }) => {
    if (gameState.isProcessing || gameState.moves <= 0) return;

    setHint(null);

    const isAdjacent = Math.abs(from.row - to.row) + Math.abs(from.col - to.col) === 1;
    if (!isAdjacent) return;

    const newBoard = gameState.board.map(r => [...r]);
    const candyA = { ...newBoard[from.row][from.col], row: to.row, col: to.col };
    const candyB = { ...newBoard[to.row][to.col], row: from.row, col: from.col };

    newBoard[from.row][from.col] = candyB;
    newBoard[to.row][to.col] = candyA;

    const { hasMatches } = checkMatches(newBoard);

    if (hasMatches) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moves: prev.moves - 1,
        selectedCandy: null,
      }));
    }
  };

  useEffect(() => {
    if (!gameState.isProcessing && checkMatches(gameState.board).hasMatches) {
      processBoard();
    }
  }, [gameState.isProcessing, gameState.board, checkMatches, processBoard]);

  const HINT_DELAY_MS = 6000;

  useEffect(() => {
    if (gameState.isProcessing || gameState.moves <= 0) {
      setHint(null);
      return;
    }
    setHint(null);
    const t = setTimeout(() => {
      const move = getHintMove();
      if (move) setHint(move);
    }, HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [gameState.isProcessing, gameState.moves, gameState.board, getHintMove]);

  const resetGame = (newLevel: number) => {
    setHint(null);
    setGameState({
      board: createInitialBoard(),
      score: 0,
      moves: calculateMoves(newLevel),
      level: newLevel,
      targetScore: calculateTarget(newLevel),
      isProcessing: false,
      selectedCandy: null,
    });
  };

  return { gameState, performSwap, resetGame, hint };
};
