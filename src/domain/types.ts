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

/** Hücre türü: oynanabilir, boş (delik), taş, jelatin, kilit. */
export type CellKind = 'play' | 'empty' | 'stone' | 'jelly' | 'lock';

/** Seviye düzeni: her (row,col) için hücre türü. */
export type LevelLayout = CellKind[][];

/** Tek bir seviye hedefi (LEVEL_GOALS.md ile uyumlu). */
export type LevelGoal =
  | { type: 'score'; target: number }
  | { type: 'collect'; color: CandyColor; target: number }
  | { type: 'moves'; limit: number };

export interface GameState {
  /** Oynanabilir hücrelerde şeker; empty/stone/jelly hücrelerde null. */
  board: (Candy | null)[][];
  /** Seviyeye göre hücre düzeni (boş, taş, jelatin). */
  layout: LevelLayout;
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  /** Seviyedeki tüm hedefler (skor, topla, hamle vb.). */
  goals: LevelGoal[];
  /** Renk bazlı toplanan şeker sayısı (collect hedefleri için). */
  collected: Partial<Record<CandyColor, number>>;
  isProcessing: boolean;
  selectedCandy: { row: number; col: number } | null;
  /** Görev tamamlandığında true; kalan hamle bonusu eklenmiş olur. */
  levelCompleted?: boolean;
}

export interface LevelPromptResponse {
  levelName: string;
  description: string;
  targetScore: number;
  movesLimit: number;
}
