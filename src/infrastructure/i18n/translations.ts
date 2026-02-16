/**
 * @unit translations.ts -> Type Definition
 * @purpose [AUTO] Type Definition logic for translations.ts.
 * @dependencies None
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
export type Locale = 'en' | 'tr';

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
};

export type TranslationKeys = {
  // Menu
  subtitle: string;
  playNow: string;
  levels: string;
  // Level select
  selectSector: string;
  back: string;
  // Game header
  score: string;
  goal: string;
  moves: string;
  levelShort: string;
  // Level intro overlay
  enteringSector: string;
  level: string;
  requirement: string;
  points: string;
  engage: string;
  // Game over overlay
  missionClear: string;
  systemFail: string;
  winMessage: string;
  loseMessage: string;
  nextSector: string;
  retry: string;
  backToStarMap: string;
  // Goals (level objectives)
  goalReachScore: string;
  goalCollect: string;
  goalWithinMoves: string;
  candyRed: string;
  candyBlue: string;
  candyGreen: string;
  candyYellow: string;
  candyPurple: string;
  candyOrange: string;
  movesBonus: string;
  backToMenu: string;
  noMovesLeftTitle: string;
  noMovesLeftMessage: string;
  shuffle: string;
  // Leaderboard
  leaderboard: string;
  bestScore: string;
  yourBest: string;
  // Daily rewards
  dailyReward: string;
  claimReward: string;
  loginBonus: string;
  streak: string;
  days: string;
  day: string;
  claimed: string;
  noScoresYet: string;
};

export const translations: Record<Locale, TranslationKeys> = {
  en: {
    subtitle: 'Star Journey Match-3',
    playNow: 'PLAY NOW',
    levels: 'LEVELS',
    selectSector: 'SELECT SECTOR',
    back: 'BACK',
    score: 'Score',
    goal: 'Goal',
    moves: 'Moves',
    levelShort: 'Lvl',
    enteringSector: 'Entering Sector',
    level: 'LEVEL',
    requirement: 'Requirement',
    points: 'Points',
    engage: 'ENGAGE',
    missionClear: 'MISSION CLEAR!',
    systemFail: 'SYSTEM FAIL',
    winMessage: 'Hyper-drive stabilized. Next sector ready.',
    loseMessage: 'Energy depleted. Re-routing required.',
    nextSector: 'NEXT SECTOR',
    retry: 'RETRY',
    backToStarMap: 'Back to Star Map',
    goalReachScore: 'Reach {score} points',
    goalCollect: 'Collect {count} {color}',
    goalWithinMoves: 'Within {moves} moves',
    candyRed: 'red',
    candyBlue: 'blue',
    candyGreen: 'green',
    candyYellow: 'yellow',
    candyPurple: 'purple',
    candyOrange: 'orange',
    movesBonus: 'Moves bonus',
    backToMenu: 'Main Menu',
    noMovesLeftTitle: 'No possible moves',
    noMovesLeftMessage: 'No valid swap left. Shuffle the board to continue.',
    shuffle: 'SHUFFLE',
    leaderboard: 'Leaderboard',
    bestScore: 'Best Score',
    yourBest: 'Your Best',
    dailyReward: 'Daily Reward',
    claimReward: 'CLAIM',
    loginBonus: 'Login Bonus',
    streak: 'Streak',
    days: 'days',
    day: 'Day',
    claimed: 'Claimed',
    noScoresYet: 'No scores recorded yet',
  },
  tr: {
    subtitle: 'Yıldız Yolculuğu Eşleştirme-3',
    playNow: 'HEMEN OYNA',
    levels: 'BÖLÜMLER',
    selectSector: 'SEKTÖR SEÇ',
    back: 'GERİ',
    score: 'Skor',
    goal: 'Hedef',
    moves: 'Hamle',
    levelShort: 'Böl',
    enteringSector: 'Sektöre Giriliyor',
    level: 'BÖLÜM',
    requirement: 'Gereksinim',
    points: 'Puan',
    engage: 'BAŞLA',
    missionClear: 'GÖREV TAMAMLANDI!',
    systemFail: 'SİSTEM ARIZASI',
    winMessage: 'Hiper sürücü stabilize. Sonraki sektör hazır.',
    loseMessage: 'Enerji tükendi. Yeniden yönlendirme gerekli.',
    nextSector: 'SONRAKİ SEKTÖR',
    retry: 'TEKRAR DENE',
    backToStarMap: 'Yıldız Haritasına Dön',
    goalReachScore: '{score} puan topla',
    goalCollect: '{count} adet {color} topla',
    goalWithinMoves: '{moves} hamlede bitir',
    candyRed: 'kırmızı',
    candyBlue: 'mavi',
    candyGreen: 'yeşil',
    candyYellow: 'sarı',
    candyPurple: 'mor',
    candyOrange: 'turuncu',
    movesBonus: 'Hamle bonusu',
    backToMenu: 'Ana Menü',
    noMovesLeftTitle: 'Olası hamle kalmadı',
    noMovesLeftMessage: 'Geçerli takas kalmadı. Devam etmek için tahtayı karıştır.',
    shuffle: 'KARIŞTIR',
    leaderboard: 'Skor Tablosu',
    bestScore: 'En Yüksek Skor',
    yourBest: 'En İyi Skorun',
    dailyReward: 'Günlük Ödül',
    claimReward: 'AL',
    loginBonus: 'Giriş Bonusu',
    streak: 'Seri',
    days: 'gün',
    day: 'Gün',
    claimed: 'Alındı',
    noScoresYet: 'Henüz skor kaydedilmedi',
  },
};
