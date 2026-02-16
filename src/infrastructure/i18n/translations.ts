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
  },
};
