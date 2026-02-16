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
import { TOTAL_LEVELS, LEVELS_PER_PAGE } from '@/domain/gameConstants';

type View = 'MENU' | 'LEVEL_SELECT' | 'GAME';

const App: React.FC = () => {
  const { t } = useI18n();
  const [view, setView] = useState<View>('MENU');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(getStoredProgress);
  const [levelSelectPage, setLevelSelectPage] = useState(0);
  const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

  const { gameState, performSwap, resetGame, hint } = useMatch3(1);
  const [dragSource, setDragSource] = useState<{ row: number; col: number } | null>(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showLevelIntro, setShowLevelIntro] = useState(true);

  useEffect(() => {
    setStoredProgress(unlockedLevel);
  }, [unlockedLevel]);

  useEffect(() => {
    if (gameState.moves === 0 && !gameState.isProcessing) {
      setIsGameEnded(true);
      if (gameState.score >= gameState.targetScore && gameState.level === unlockedLevel) {
        setUnlockedLevel((prev) => prev + 1);
      }
    }
  }, [gameState.moves, gameState.isProcessing, gameState.score, gameState.targetScore, gameState.level, unlockedLevel]);

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

  const isWin = gameState.score >= gameState.targetScore;

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
            </motion.div>
          </motion.div>
        )}

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
                  return (
                    <button
                      key={lvl}
                      disabled={isLocked}
                      onClick={() => handleStartGame(lvl)}
                      className={`
                        aspect-square min-h-0 rounded-xl sm:rounded-2xl flex items-center justify-center font-candy text-sm sm:text-base
                        ${isLocked
                          ? 'bg-black/40 text-white/20 border border-white/5 cursor-not-allowed'
                          : 'bg-gradient-to-br from-indigo-400 to-purple-600 text-white border-b-4 border-indigo-900 shadow-lg hover:scale-110 active:scale-95'
                        }
                        transition-all touch-manipulation
                      `}
                    >
                      {isLocked ? '🔒' : lvl}
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

        {view === 'GAME' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl flex-1 min-h-0 min-w-0 px-2 sm:px-4 overflow-hidden"
          >
            <div className="w-full flex justify-between items-center gap-2 sm:gap-4 px-2 sm:px-6 mb-2 sm:mb-4 flex-shrink-0">
              <button onClick={() => setView('LEVEL_SELECT')} className="p-2 sm:p-3 bg-white/5 rounded-xl text-indigo-300 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>

              <div className="flex gap-3 sm:gap-8 items-center bg-indigo-950/40 backdrop-blur-md px-4 py-2 sm:px-8 sm:py-3 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl min-w-0">
                <div className="text-center min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-400 tracking-widest">{t.score}</p>
                  <p className="text-xl sm:text-3xl font-candy text-yellow-400 leading-none truncate">{gameState.score}</p>
                  <p className="text-[9px] sm:text-[10px] text-white/50 mt-0.5">{t.goal}: {gameState.targetScore}</p>
                </div>
                <div className="h-8 sm:h-10 w-px bg-white/10 flex-shrink-0" />
                <div className="text-center min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-400 tracking-widest">{t.moves}</p>
                  <p className={`text-xl sm:text-3xl font-candy leading-none ${gameState.moves < 5 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
                    {gameState.moves}
                  </p>
                </div>
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
                        onDragStart={(row, col) => setDragSource({ row, col })}
                        onDrop={(row, col) => {
                          if (dragSource) {
                            performSwap(dragSource, { row, col });
                            setDragSource(null);
                          }
                        }}
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
                      <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 mb-4 sm:mb-8">
                        <p className="text-indigo-200 text-sm sm:text-base">{t.requirement}: <span className="text-white font-bold">{gameState.targetScore} {t.points}</span></p>
                      </div>
                      <button
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
                {isGameEnded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 rounded-[32px] backdrop-blur-xl border-4 border-white/5"
                  >
                    <div className="text-center px-4 sm:px-10">
                      <h1 className="text-3xl sm:text-6xl md:text-7xl font-candy text-white mb-1 sm:mb-2 italic leading-tight">
                        {isWin ? t.missionClear : t.systemFail}
                      </h1>
                      <p className="text-indigo-300 text-base sm:text-xl mb-6 sm:mb-10">
                        {isWin ? t.winMessage : t.loseMessage}
                      </p>

                      <div className="flex flex-col gap-3 sm:gap-4">
                        <button
                          onClick={isWin ? handleNextLevel : () => handleStartGame(gameState.level)}
                          className="py-4 sm:py-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-candy text-xl sm:text-2xl text-white shadow-2xl hover:scale-105 touch-manipulation min-h-[48px]"
                        >
                          {isWin ? t.nextSector : t.retry}
                        </button>
                        <button
                          onClick={() => setView('LEVEL_SELECT')}
                          className="text-indigo-400 font-bold tracking-widest uppercase text-xs sm:text-sm hover:text-white touch-manipulation py-2"
                        >
                          {t.backToStarMap}
                        </button>
                      </div>
                    </div>
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
