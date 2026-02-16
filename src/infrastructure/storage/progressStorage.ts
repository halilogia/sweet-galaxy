/**
 * @unit progressStorage.ts -> Module
 * @purpose [AUTO] Module logic for progressStorage.ts.
 * @dependencies None
 * @complexity 4 (Low)
 * @scope [AUTO] Module-Local
 */
const PROGRESS_KEY = 'sweet_galaxy_progress';

export function getStoredProgress(): number {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? parseInt(saved, 10) : 1;
  } catch {
    return 1;
  }
}

export function setStoredProgress(unlockedLevel: number): void {
  try {
    localStorage.setItem(PROGRESS_KEY, unlockedLevel.toString());
  } catch {
    // ignore
  }
}
