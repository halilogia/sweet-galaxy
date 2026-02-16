/**
 * @unit types.ts -> Type Definition
 * @purpose [AUTO] Type Definition logic for types.ts.
 * @dependencies None
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
export type CandyColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export type CandyType = 'normal' | 'striped-h' | 'striped-v' | 'wrapped' | 'color-bomb';

export interface Candy {
  id: string;
  color: CandyColor;
  type: CandyType;
  row: number;
  col: number;
  isMatched?: boolean;
}

export interface GameState {
  board: Candy[][];
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  isProcessing: boolean;
  selectedCandy: { row: number; col: number } | null;
}

export interface LevelPromptResponse {
  levelName: string;
  description: string;
  targetScore: number;
  movesLimit: number;
}
