/**
 * @unit leaderboardStorage.ts -> Module
 * @purpose Leaderboard skor kayıtları için localStorage yönetimi.
 * @dependencies None
 * @complexity 3 (Low)
 * @scope Module-Local
 */

const LEADERBOARD_KEY = 'sweet_galaxy_leaderboard';

export interface LeaderboardEntry {
  level: number;
  score: number;
  stars: number;
  date: string;
}

export interface LeaderboardData {
  [level: number]: LeaderboardEntry;
}

export function getLeaderboard(): LeaderboardData {
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveLeaderboardEntry(level: number, score: number, stars: number): void {
  try {
    const leaderboard = getLeaderboard();
    const existing = leaderboard[level];
    if (!existing || score > existing.score) {
      leaderboard[level] = {
        level,
        score,
        stars,
        date: new Date().toISOString(),
      };
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    }
  } catch {
    // ignore
  }
}

export function getLevelBestScore(level: number): number {
  const leaderboard = getLeaderboard();
  return leaderboard[level]?.score ?? 0;
}

export function getLevelStars(level: number): number {
  const leaderboard = getLeaderboard();
  return leaderboard[level]?.stars ?? 0;
}
