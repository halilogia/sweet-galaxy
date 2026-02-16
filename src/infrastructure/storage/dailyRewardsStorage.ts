/**
 * @unit dailyRewardsStorage.ts -> Module
 * @purpose Günlük ödül sistemi için localStorage yönetimi.
 * @dependencies None
 * @complexity 3 (Low)
 * @scope Module-Local
 */

const DAILY_REWARDS_KEY = 'sweet_galaxy_daily_rewards';
const LAST_LOGIN_KEY = 'sweet_galaxy_last_login';

export interface DailyReward {
  day: number;
  claimed: boolean;
  reward: number;
}

export function getLastLoginDate(): string | null {
  try {
    return localStorage.getItem(LAST_LOGIN_KEY);
  } catch {
    return null;
  }
}

export function setLastLoginDate(): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(LAST_LOGIN_KEY, today);
  } catch {
    // ignore
  }
}

export function isNewDay(): boolean {
  const lastLogin = getLastLoginDate();
  const today = new Date().toISOString().split('T')[0];
  return lastLogin !== today;
}

export function getDailyRewards(): DailyReward[] {
  try {
    const saved = localStorage.getItem(DAILY_REWARDS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      claimed: false,
      reward: (i + 1) * 100,
    }));
  } catch {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      claimed: false,
      reward: (i + 1) * 100,
    }));
  }
}

export function getCurrentStreak(): number {
  try {
    const saved = localStorage.getItem('sweet_galaxy_streak');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementStreak(): number {
  try {
    const streak = getCurrentStreak() + 1;
    localStorage.setItem('sweet_galaxy_streak', streak.toString());
    return streak;
  } catch {
    return 0;
  }
}

export function resetStreak(): void {
  try {
    localStorage.setItem('sweet_galaxy_streak', '0');
  } catch {
    // ignore
  }
}

export function claimDailyReward(day: number): number {
  try {
    const rewards = getDailyRewards();
    const reward = rewards[day - 1];
    if (reward && !reward.claimed) {
      reward.claimed = true;
      localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(rewards));
      return reward.reward;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function resetDailyRewards(): void {
  try {
    localStorage.removeItem(DAILY_REWARDS_KEY);
  } catch {
    // ignore
  }
}
