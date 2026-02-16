/**
 * @unit App.tsx -> Type Definition
 * @purpose [AUTO] Type Definition logic for App.tsx.
 * @dependencies [react, framer-motion, @]
 * @complexity 7 (Medium)
 * @scope [AUTO] Module-Local
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatch3 } from '@/presentation/hooks/useMatch3';
import Tile from '@/presentation/components/Tile';
import LanguageSelector from '@/presentation/components/LanguageSelector';
import { useI18n } from '@/infrastructure/i18n';
import { getStoredProgress, setStoredProgress } from '@/infrastructure/storage/progressStorage';
import { saveLeaderboardEntry, getLevelBestScore, getLevelStars, getLeaderboard, type LeaderboardData } from '@/infrastructure/storage/leaderboardStorage';
import { isNewDay, setLastLoginDate, getCurrentStreak, incrementStreak, resetStreak, claimDailyReward, getDailyRewards, type DailyReward } from '@/infrastructure/storage/dailyRewardsStorage';
import { TOTAL_LEVELS, LEVELS_PER_PAGE, COLOR_MAP } from '@/domain/gameConstants';
import { CANDY_SVG } from '@/presentation/constants/candyIcons';
import { allGoalsMet } from '@/domain/levelGoals';
import type { CandyColor, LevelGoal } from '@/domain/types';

type View = 'MENU' | 'LEVEL_SELECT' | 'GAME' | 'LEADERBOARD' | 'DAILY_REWARDS';

const App: React.FC = () => {
  const { t } = useI18n();
  const [view, setView] = useState<View>('MENU');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(getStoredProgress);
  const [levelSelectPage, setLevelSelectPage] = useState(0);
  const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);
  const [showLevelIntro, setShowLevelIntro] = useState(true);
  const [dragSource, setDragSource] = useState<{ row: number; col: number } | null>(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);

  const { gameState, performSwap, resetGame, hint, noValidMovesLeft, shuffleBoard } = useMatch3(1, { hintEnabled: !showLevelIntro && !isGameEnded });

  useEffect(() => {
    setStoredProgress(unlockedLevel);
  }, [unlockedLevel]);

  useEffect(() => {
    if (view === 'MENU' && isNewDay()) {
      const streak = getCurrentStreak();
      const newStreak = streak > 0 ? incrementStreak() : (resetStreak(), incrementStreak());
      setLastLoginDate();
      const rewards = getDailyRewards();
      const currentDay = (newStreak - 1) % 7 + 1;
      const reward = rewards[currentDay - 1];
      if (reward && !reward.claimed) {
        setShowDailyReward(true);
        setDailyRewardAmount(reward.reward);
      }
    }
  }, [view]);

  useEffect(() => {
    if (gameState.levelCompleted && isGameEnded) {
      const stars = gameState.score >= gameState.targetScore * 1.5 ? 3 : gameState.score >= gameState.targetScore * 1.2 ? 2 : 1;
      saveLeaderboardEntry(gameState.level, gameState.score, stars);
    }
  }, [gameState.levelCompleted, gameState.score, gameState.level, gameState.targetScore, isGameEnded]);

  useEffect(() => {
    if (gameState.levelCompleted) {
      setIsGameEnded(true);
      if (gameState.level === unlockedLevel) setUnlockedLevel((prev) => prev + 1);
      return;
    }
    if (gameState.moves === 0 && !gameState.isProcessing) {
      setIsGameEnded(true);
      if (allGoalsMet(gameState) && gameState.level === unlockedLevel) {
        setUnlockedLevel((prev) => prev + 1);
      }
    }
  }, [gameState.levelCompleted, gameState.moves, gameState.isProcessing, gameState.level, gameState, unlockedLevel]);

  const handleStartGame = (level: number) => {
    resetGame(level);
    setView('GAME');
    setShowLevelIntro(true);
    setIsGameEnded(false);
  };

  const openLevelSelect = () => {
    setLevelSelectPage(Math.min(totalPages - 1, Math.floor((unlockedLevel - 1) / LEVELS_PER_PAGE)));
    setView('LEVEL_SELECT');
  };

  const handleNextLevel = () => {
    resetGame(gameState.level + 1);
    setShowLevelIntro(true);
    setIsGameEnded(false);
  };

  const isWin = gameState.levelCompleted === true;
  const stars = isWin
    ? (gameState.score >= gameState.targetScore * 1.5 ? 3 : gameState.score >= gameState.targetScore * 1.2 ? 2 : 1)
    : 0;
  const movesBonus = isWin && gameState.moves > 0 ? gameState.moves * 50 : 0;

  const candyColorLabel = (color: CandyColor): string => {
    const key = `candy${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof typeof t;
    return (t as Record<string, string>)[key] ?? color;
  };

  const renderGoalLine = (g: LevelGoal) => {
    if (g.type === 'score') return t.goalReachScore.replace('{score}', String(g.target));
    if (g.type === 'collect') return t.goalCollect.replace('{count}', String(g.target)).replace('{color}', candyColorLabel(g.color));
    if (g.type === 'moves') return t.goalWithinMoves.replace('{moves}', String(g.limit));
    return '';
  };

  const handleTileTap = (row: number, col: number) => {
    if (!dragSource) {
      setDragSource({ row, col });
      return;
    }
    if (dragSource.row === row && dragSource.col === col) {
      setDragSource(null);
      return;
    }
    const isAdjacent = Math.abs(dragSource.row - row) + Math.abs(dragSource.col - col) === 1;
    if (isAdjacent) {
      performSwap(dragSource, { row, col });
      setDragSource(null);
    } else {
      setDragSource({ row, col });
    }
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-3 py-2 sm:py-4">
      {/* Yıldız deseni yavaşça kayar; sabit iki nokta hissini azaltır */}
      <motion.div
        className="absolute inset-0 bg-stars pointer-events-none z-0"
        animate={{
          backgroundPosition: ['0px 0px', '80px 40px', '40px 80px', '0px 0px'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'MENU' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-4 sm:gap-8 z-10 w-full max-w-md relative"
          >
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-[clamp(2.5rem,12vw,5rem)] sm:text-7xl md:text-8xl font-candy text-white mb-1 sm:mb-2 leading-tight relative"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(255,255,255,0.4)) drop-shadow(0 0 40px rgba(129,140,248,0.3))',
                    'drop-shadow(0 0 28px rgba(255,255,255,0.5)) drop-shadow(0 0 50px rgba(129,140,248,0.5))',
                    'drop-shadow(0 0 20px rgba(255,255,255,0.4)) drop-shadow(0 0 40px rgba(129,140,248,0.3))',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  SWEET
                </motion.span>
                <br />
                <motion.span
                  className="inline-block bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300 bg-clip-text text-transparent"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  GALAXY
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-indigo-300 tracking-[0.2em] sm:tracking-[0.3em] font-bold uppercase text-xs sm:text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t.subtitle}
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 sm:gap-4 w-full max-w-[16rem] sm:w-64"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                onClick={() => handleStartGame(unlockedLevel)}
                className="relative py-3 sm:py-4 rounded-2xl font-candy text-lg sm:text-xl text-white border-b-4 border-indigo-800 touch-manipulation min-h-[48px] overflow-hidden shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <span className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
                <span className="relative z-10">{t.playNow}</span>
              </motion.button>
              <motion.button
                onClick={openLevelSelect}
                className="py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl font-candy text-lg sm:text-xl text-indigo-200 border border-white/20 touch-manipulation min-h-[48px] relative overflow-hidden"
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">{t.levels}</span>
              </motion.button>
              <motion.button
                onClick={() => setView('LEADERBOARD')}
                className="py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl font-candy text-lg sm:text-xl text-indigo-200 border border-white/20 touch-manipulation min-h-[48px] relative overflow-hidden"
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">{t.leaderboard}</span>
              </motion.button>
              <motion.button
                onClick={() => setView('DAILY_REWARDS')}
                className="py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl font-candy text-lg sm:text-xl text-indigo-200 border border-white/20 touch-manipulation min-h-[48px] relative overflow-hidden"
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">{t.dailyReward}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showDailyReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDailyReward(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-4 border border-white/20 shadow-2xl"
              >
                <h3 className="text-2xl sm:text-3xl font-candy text-white text-center mb-2">{t.dailyReward}</h3>
                <p className="text-indigo-200 text-center mb-4">{t.loginBonus}</p>
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl font-candy text-yellow-300 mb-2">
                    +{dailyRewardAmount}
                  </div>
                  <div className="text-white/80 text-sm">{t.points}</div>
                </div>
                <motion.button
                  onClick={() => {
                    const streak = getCurrentStreak();
                    const currentDay = (streak - 1) % 7 + 1;
                    const reward = claimDailyReward(currentDay);
                    if (reward > 0) {
                      setShowDailyReward(false);
                    }
                  }}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-candy text-lg text-white border border-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.claimReward}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'LEVEL_SELECT' && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl h-full flex flex-col min-h-0 px-4 sm:px-8 z-10"
          >
            <div className="flex justify-between items-center mb-2 sm:mb-4 flex-shrink-0">
              <h2 className="text-xl sm:text-3xl font-candy text-white">{t.selectSector}</h2>
              <button onClick={() => setView('MENU')} className="text-indigo-400 font-bold hover:text-white transition-colors touch-manipulation min-h-[44px] px-2">{t.back}</button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-h-0 w-full">
              <button
                type="button"
                onClick={() => setLevelSelectPage((p) => Math.max(0, p - 1))}
                disabled={levelSelectPage === 0}
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white touch-manipulation transition-all"
                aria-label="Önceki sayfa"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>

              <div className="grid grid-cols-5 grid-rows-4 gap-1.5 sm:gap-3 flex-1 min-h-0 w-full overflow-hidden">
                {Array.from({ length: LEVELS_PER_PAGE }).map((_, i) => {
                  const lvl = levelSelectPage * LEVELS_PER_PAGE + i + 1;
                  if (lvl > TOTAL_LEVELS) return <div key={`empty-${i}`} />;
                  const isLocked = lvl > unlockedLevel;
                  const bestScore = getLevelBestScore(lvl);
                  const stars = getLevelStars(lvl);
                  return (
                    <button
                      key={lvl}
                      disabled={isLocked}
                      onClick={() => handleStartGame(lvl)}
                      className={`
                        aspect-square min-h-0 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-candy text-sm sm:text-base relative
                        ${isLocked
                          ? 'bg-black/40 text-white/20 border border-white/5 cursor-not-allowed'
                          : 'bg-gradient-to-br from-indigo-400 to-purple-600 text-white border-b-4 border-indigo-900 shadow-lg hover:scale-110 active:scale-95'
                        }
                        transition-all touch-manipulation
                      `}
                    >
                      {isLocked ? (
                        '🔒'
                      ) : (
                        <>
                          <span>{lvl}</span>
                          {bestScore > 0 && (
                            <span className="text-[0.6rem] sm:text-xs opacity-80 mt-0.5">
                              {bestScore.toLocaleString()}
                            </span>
                          )}
                          {stars > 0 && (
                            <span className="absolute top-1 right-1 text-yellow-300 text-xs">
                              {'⭐'.repeat(stars)}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setLevelSelectPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={levelSelectPage >= totalPages - 1}
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white touch-manipulation transition-all"
                aria-label="Sonraki sayfa"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <p className="text-indigo-400/80 text-xs sm:text-sm mt-2 flex-shrink-0">
              {levelSelectPage * LEVELS_PER_PAGE + 1} – {Math.min((levelSelectPage + 1) * LEVELS_PER_PAGE, TOTAL_LEVELS)} / {TOTAL_LEVELS}
            </p>
          </motion.div>
        )}

        {view === 'LEADERBOARD' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl h-full flex flex-col min-h-0 px-4 sm:px-8 z-10"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
              <h2 className="text-xl sm:text-3xl font-candy text-white">{t.leaderboard}</h2>
              <button onClick={() => setView('MENU')} className="text-indigo-400 font-bold hover:text-white transition-colors touch-manipulation min-h-[44px] px-2">{t.back}</button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-2 sm:space-y-3 pb-4">
                {(() => {
                  const leaderboard: LeaderboardData = getLeaderboard();
                  const entries = Object.values(leaderboard).sort((a, b) => b.level - a.level);
                  
                  if (entries.length === 0) {
                    return (
                      <div className="text-center text-indigo-300 py-8">
                        <p className="text-sm sm:text-base">{t.yourBest}</p>
                        <p className="text-xs sm:text-sm opacity-70 mt-2">{t.noScoresYet}</p>
                      </div>
                    );
                  }

                  return entries.map((entry) => (
                    <motion.div
                      key={entry.level}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-2xl sm:text-3xl font-candy text-indigo-300">
                          {entry.level}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm sm:text-base">
                            {t.level} {entry.level}
                          </div>
                          <div className="text-indigo-300 text-xs sm:text-sm">
                            {t.bestScore}: {entry.score.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-yellow-300 text-lg sm:text-xl">
                        {'⭐'.repeat(entry.stars)}
                      </div>
                    </motion.div>
                  ));
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'DAILY_REWARDS' && (
          <motion.div
            key="daily-rewards"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl h-full flex flex-col min-h-0 px-4 sm:px-8 z-10"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
              <h2 className="text-xl sm:text-3xl font-candy text-white">{t.dailyReward}</h2>
              <button onClick={() => setView('MENU')} className="text-indigo-400 font-bold hover:text-white transition-colors touch-manipulation min-h-[44px] px-2">{t.back}</button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-4 pb-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                  <div className="text-indigo-300 text-sm sm:text-base mb-2">{t.streak}</div>
                  <div className="text-3xl sm:text-4xl font-candy text-yellow-300">
                    {getCurrentStreak()} {t.days}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {getDailyRewards().map((reward: DailyReward, index: number) => {
                    const streak = getCurrentStreak();
                    const currentDay = (streak - 1) % 7 + 1;
                    const isToday = index + 1 === currentDay && streak > 0;
                    const isClaimed = reward.claimed;
                    const canClaim = isToday && !isClaimed;

                    return (
                      <motion.div
                        key={reward.day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 border-2 flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px]
                          ${isToday ? 'border-yellow-400 bg-yellow-500/20' : 'border-white/20'}
                          ${isClaimed ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="text-xs sm:text-sm font-semibold text-white mb-1">
                          {t.day} {reward.day}
                        </div>
                        <div className="text-lg sm:text-xl font-candy text-yellow-300 mb-1">
                          +{reward.reward}
                        </div>
                        {isClaimed && (
                          <div className="text-[0.6rem] sm:text-xs text-green-300 mt-1">
                            ✓ {t.claimed}
                          </div>
                        )}
                        {canClaim && (
                          <motion.button
                            onClick={() => {
                              const claimed = claimDailyReward(reward.day);
                              if (claimed > 0) {
                                // Reward claimed, refresh view
                                setView('DAILY_REWARDS');
                              }
                            }}
                            className="mt-1 px-2 py-1 text-[0.6rem] sm:text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors touch-manipulation"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t.claimReward}
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'GAME' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl flex-1 min-h-0 min-w-0 px-2 sm:px-4 overflow-hidden"
          >
            <div className="w-full flex justify-between items-center gap-2 sm:gap-4 px-2 sm:px-6 mb-2 sm:mb-4 flex-shrink-0">
              <button onClick={() => setView('MENU')} className="p-2 sm:p-3 bg-white/5 rounded-xl text-indigo-300 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>

              <div className="flex gap-2 sm:gap-4 items-center bg-indigo-950/40 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl min-w-0 flex-wrap justify-center">
                <div className="text-center min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-400 tracking-widest">{t.score}</p>
                  <p className="text-xl sm:text-3xl font-candy text-yellow-400 leading-none truncate">{gameState.score}</p>
                </div>
                <div className="h-8 sm:h-10 w-px bg-white/10 flex-shrink-0" />
                <div className="text-center min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-400 tracking-widest">{t.moves}</p>
                  <p className={`text-xl sm:text-3xl font-candy leading-none ${gameState.moves < 5 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
                    {gameState.moves}
                  </p>
                </div>
                {gameState.goals.some(g => g.type === 'collect') && (
                  <>
                    <div className="h-8 sm:h-10 w-px bg-white/10 flex-shrink-0" />
                    {gameState.goals.filter((g): g is import('@/domain/types').LevelGoal & { type: 'collect' } => g.type === 'collect').map((g) => {
                      const cur = gameState.collected[g.color] ?? 0;
                      const done = cur >= g.target;
                      return (
                        <div key={`${g.color}-${g.target}`} className="flex items-center gap-1.5 sm:gap-2 min-w-0" title={candyColorLabel(g.color)}>
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shadow-md border border-white/10 flex-shrink-0 ${COLOR_MAP[g.color]} ${done ? 'ring-2 ring-emerald-400' : ''}`}>
                            <div className="w-4/5 h-4/5 text-white/90 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                              {CANDY_SVG[g.color]}
                            </div>
                          </div>
                          <span className={`text-[10px] sm:text-xs font-candy tabular-nums ${done ? 'text-emerald-400' : 'text-white/90'}`}>
                            {cur}/{g.target}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="p-2 sm:p-3 bg-white/5 rounded-xl text-indigo-300 font-bold uppercase text-[10px] sm:text-xs flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                {t.levelShort} {gameState.level}
              </div>
            </div>

            <div className="w-full max-w-xl h-1.5 sm:h-2.5 bg-indigo-950/60 rounded-full mb-2 sm:mb-4 overflow-hidden border border-white/5 mx-auto flex-shrink-0">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (gameState.score / gameState.targetScore) * 100)}%` }}
              />
            </div>

            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 min-w-0">
              <div
                className="relative bg-white/5 rounded-2xl sm:rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex-shrink-0"
                style={{ width: 'min(82vmin, 560px)', height: 'min(82vmin, 560px)' }}
              >
              <div
                className="grid gap-0.5 sm:gap-1.5 bg-black/40 p-1.5 sm:p-2 rounded-xl sm:rounded-[32px] overflow-visible relative w-full h-full absolute inset-0"
                style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)' }}
              >
                {gameState.board.map((row, r) =>
                  row.map((candy, c) => {
                    const kind = gameState.layout[r]?.[c] ?? 'play';
                    if (!candy) {
                      return (
                        <div
                          key={`cell-${r}-${c}`}
                          className="w-full h-full min-w-0 min-h-0 p-0.5 sm:p-1 flex items-center justify-center rounded-xl"
                        >
                          {kind === 'empty' && (
                            <div className="w-full h-full rounded-xl bg-indigo-950/80 border border-indigo-800/50" />
                          )}
                          {kind === 'stone' && (
                            <div className="w-full h-full rounded-xl bg-stone-600/90 border border-stone-500 flex items-center justify-center">
                              <span className="text-stone-300 text-xs">◆</span>
                            </div>
                          )}
                          {kind === 'jelly' && (
                            <div className="w-full h-full rounded-xl bg-violet-500/40 border border-violet-400/50 backdrop-blur-sm" />
                          )}
                        </div>
                      );
                    }
                    const isHintCell = hint != null && (
                      (r === hint.from.row && c === hint.from.col) || (r === hint.to.row && c === hint.to.col)
                    );
                    return (
                      <Tile
                        key={candy.id}
                        candy={candy}
                        isSelected={dragSource?.row === r && dragSource?.col === c}
                        isMatched={candy.isMatched ?? false}
                        isHint={isHintCell}
                        isLocked={kind === 'lock'}
                        onDragStart={(row, col) => setDragSource({ row, col })}
                        onDrop={(row, col) => {
                          if (dragSource) {
                            performSwap(dragSource, { row, col });
                            setDragSource(null);
                          }
                        }}
                        onTap={handleTileTap}
                      />
                    );
                  })
                )}
              </div>

              <AnimatePresence>
                {showLevelIntro && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 flex items-center justify-center bg-indigo-950/90 rounded-[32px] backdrop-blur-md"
                  >
                    <div className="text-center p-4 sm:p-8">
                      <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} className="text-indigo-400 font-bold tracking-widest uppercase mb-1 sm:mb-2 text-sm sm:text-base">{t.enteringSector}</motion.h2>
                      <motion.h1 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-4xl sm:text-6xl font-candy text-white mb-4 sm:mb-8">{t.level} {gameState.level}</motion.h1>
                      <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 mb-4 sm:mb-8 space-y-2">
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">{t.requirement}</p>
                        {gameState.goals.map((g, i) => (
                          <p key={i} className="text-indigo-200 text-sm sm:text-base flex items-center gap-2">
                            <span className="text-white/70">•</span>
                            <span>{renderGoalLine(g)}</span>
                          </p>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLevelIntro(false)}
                        className="px-10 sm:px-16 py-4 sm:py-5 bg-white text-indigo-950 rounded-full font-candy text-xl sm:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform touch-manipulation min-h-[44px]"
                      >
                        {t.engage}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {noValidMovesLeft && !isGameEnded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 flex items-center justify-center rounded-[32px] bg-indigo-950/40 backdrop-blur-xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="relative w-full max-w-sm sm:max-w-md mx-4 rounded-3xl border border-white/20 bg-gradient-to-b from-indigo-900/95 to-indigo-950/95 shadow-2xl shadow-indigo-950/50 ring-2 ring-white/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                      <div className="relative text-center px-6 sm:px-10 py-6 sm:py-8">
                        <h2 className="text-xl sm:text-3xl font-candy text-amber-300 mb-2 sm:mb-3 drop-shadow-sm">
                          {t.noMovesLeftTitle}
                        </h2>
                        <p className="text-indigo-200 text-sm sm:text-base mb-5 sm:mb-6">
                          {t.noMovesLeftMessage}
                        </p>
                        <button
                          type="button"
                          onClick={shuffleBoard}
                          className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-candy text-lg sm:text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform touch-manipulation min-h-[44px]"
                        >
                          {t.shuffle}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isGameEnded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center rounded-[32px] bg-indigo-950/40 backdrop-blur-xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="relative w-full max-w-sm sm:max-w-md mx-4 rounded-3xl border border-white/20 bg-gradient-to-b from-indigo-900/95 to-indigo-950/95 shadow-2xl shadow-indigo-950/50 ring-2 ring-white/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                      <div className="relative text-center px-6 sm:px-10 py-6 sm:py-8">
                        <h1 className="text-2xl sm:text-5xl md:text-6xl font-candy text-white mb-1 sm:mb-2 italic leading-tight drop-shadow-sm">
                          {isWin ? t.missionClear : t.systemFail}
                        </h1>
                        <p className="text-indigo-200 text-sm sm:text-lg mb-3 sm:mb-4">
                          {isWin ? t.winMessage : t.loseMessage}
                        </p>

                        {isWin && (
                          <>
                            <div className="flex justify-center gap-1 sm:gap-2 mb-3 sm:mb-4" aria-label={`${stars} stars`}>
                              {[1, 2, 3].map((i) => (
                                <span key={i} className={`text-2xl sm:text-4xl drop-shadow-md ${i <= stars ? 'text-amber-400' : 'text-white/15'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-amber-300/95 font-candy text-base sm:text-xl mb-0.5">
                              {gameState.score} {t.points}
                            </p>
                            {movesBonus > 0 && (
                              <p className="text-emerald-400/90 text-xs sm:text-sm mb-4">
                                {t.movesBonus}: +{movesBonus}
                              </p>
                            )}
                          </>
                        )}

                        <div className="flex flex-col gap-2 sm:gap-3 mt-5 sm:mt-6">
                          <button
                            onClick={isWin ? handleNextLevel : () => handleStartGame(gameState.level)}
                            className="py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl font-candy text-lg sm:text-xl text-white shadow-lg shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98] transition-transform touch-manipulation min-h-[44px]"
                          >
                            {isWin ? t.nextSector : t.retry}
                          </button>
                          <button
                            onClick={() => setView(isWin ? 'MENU' : 'LEVEL_SELECT')}
                            className="text-indigo-300 font-bold tracking-widest uppercase text-xs sm:text-sm hover:text-white touch-manipulation py-2"
                          >
                            {isWin ? t.backToMenu : t.backToStarMap}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Tüm harita: uğurböceği gibi yavaş ve rastgele dolaşan ışıklar (tam ekran) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {/* İki büyük nokta – tüm ekranı dolaşan, birbirinden tamamen bağımsız rotalar */}
        <motion.div
          className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90 shadow-[0_0_14px_rgba(255,255,255,0.8)]"
          style={{ left: '12%', top: '22%' }}
          animate={{
            x: [0, 90, 160, 80, -60, -140, -80, 40, 120, 20, -100, -40, 70, 140, 50, 0],
            y: [0, 50, -30, 80, 120, 60, -40, -90, -20, 70, 100, 40, -60, 20, 80, 0],
            opacity: [0.7, 0.9, 0.8, 0.95, 0.85, 0.7, 0.9, 0.75, 0.9, 0.8, 0.95, 0.7, 0.85, 0.9, 0.8, 0.7],
            scale: [1, 1.06, 0.96, 1.08, 1.02, 0.98, 1.05, 1, 1.04, 0.97, 1.06, 1, 1.03, 1.07, 0.98, 1],
          }}
          transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90 shadow-[0_0_14px_rgba(255,255,255,0.8)]"
          style={{ left: '78%', top: '58%' }}
          animate={{
            x: [0, -110, -50, 70, 130, 40, -90, -150, -70, 50, 100, 20, -80, -30, 60, 90, 0],
            y: [0, -70, 40, 90, 20, -50, -100, -30, 60, 110, 50, -40, 30, 80, -20, -50, 0],
            opacity: [0.75, 0.85, 0.9, 0.7, 0.95, 0.8, 0.88, 0.92, 0.78, 0.9, 0.82, 0.95, 0.72, 0.88, 0.9, 0.8, 0.75],
            scale: [1, 1.04, 0.98, 1.07, 1, 1.05, 0.96, 1.08, 1.02, 0.97, 1.06, 1, 1.03, 0.99, 1.05, 1.02, 1],
          }}
          transition={{ duration: 58, repeat: Infinity, ease: 'linear', delay: 9 }}
        />
        {/* Küçük yıldızlar – her biri tüm haritada farklı rota, büyük mesafe */}
        {[
          { left: '10%', top: '15%', size: '8px', x: [0, 80, 140, 60, -70, -130, -50, 90, 120, 30, -80, 0], y: [0, 60, -40, 100, 80, 20, -70, -30, 50, 90, 40, 0], d: 45 },
          { left: '88%', top: '28%', size: '6px', x: [0, -100, -160, -80, 50, 110, 40, -90, -50, 70, 100, 0], y: [0, -50, 30, 80, 100, 50, -30, -80, 20, 60, -20, 0], d: 48 },
          { left: '72%', top: '72%', size: '10px', x: [0, 70, 120, 40, -90, -140, -60, 80, 50, -70, 20, 0], y: [0, -60, 40, 90, 50, -20, -80, -40, 70, 30, 60, 0], d: 50 },
          { left: '22%', top: '82%', size: '6px', x: [0, -60, 90, 130, 50, -80, -120, -40, 70, 100, 20, 0], y: [0, 70, 40, -50, -90, -30, 60, 100, 30, -60, 40, 0], d: 46 },
          { left: '48%', top: '38%', size: '4px', x: [0, 100, 50, -80, -130, -60, 70, 120, 30, -90, 40, 0], y: [0, 40, 90, 60, -30, -80, 20, 70, -50, 30, 80, 0], d: 54 },
          { left: '92%', top: '48%', size: '8px', x: [0, -90, -40, 80, 130, 60, -70, -110, -30, 90, 50, 0], y: [0, 50, 90, 30, -60, -100, -20, 70, 100, 40, -30, 0], d: 47 },
          { left: '6%', top: '62%', size: '6px', x: [0, 120, 70, -50, -100, 30, 90, 40, -80, -40, 60, 0], y: [0, -40, 80, 100, 50, -60, 20, 70, 30, -80, -20, 0], d: 51 },
          { left: '58%', top: '12%', size: '5px', x: [0, -70, 90, 140, 60, -80, -130, -50, 70, 110, 20, 0], y: [0, 80, 50, -40, -80, 30, 70, -20, -60, 40, 90, 0], d: 49 },
          { left: '38%', top: '56%', size: '7px', x: [0, 90, 30, -100, -60, 80, 130, 40, -70, -110, 50, 0], y: [0, 60, -70, -30, 90, 50, -40, 80, 20, -50, 70, 0], d: 52 },
          { left: '76%', top: '86%', size: '5px', x: [0, -80, -130, -50, 70, 120, 50, -90, -40, 80, 30, 0], y: [0, 60, 20, -70, -100, -40, 60, 90, 30, -50, 70, 0], d: 44 },
        ].map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: '0 0 10px 2px rgba(255,255,255,0.6)',
            }}
            animate={{
              x: star.x,
              y: star.y,
              opacity: [0.5, 0.8, 0.6, 0.9, 0.55, 0.75, 0.65, 0.85, 0.5, 0.8, 0.6, 0.5],
              scale: [1, 1.1, 0.95, 1.05, 1, 1.08, 0.92, 1.04, 0.98, 1.06, 1, 1],
            }}
            transition={{
              duration: star.d,
              repeat: Infinity,
              delay: i * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
