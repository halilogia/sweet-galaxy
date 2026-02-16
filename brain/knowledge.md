# 🧠 Knowledge Base

Proje mimarisi ve kararların özeti.

---

## Mimari

- **Domain:** Oyun kurallarından bağımsız tip ve sabitler. `src/domain/` (types.ts, gameConstants.ts).
- **Infrastructure:** Dış dünya ile konuşan katman: i18n, localStorage, ileride API/ses dosyaları. `src/infrastructure/`.
- **Presentation:** UI ve etkileşim. `src/presentation/` (App.tsx, components/, hooks/, constants/).
- **Giriş noktası:** `src/main.tsx` → App; stil `src/index.css`.

---

## Teknoloji

- **Build:** Vite.
- **UI:** React 18, TypeScript.
- **Stil:** Tailwind CSS.
- **Animasyon:** Framer Motion.
- **Mobil:** Capacitor config mevcut; henüz build yok.

---

## Oyun kuralları (mevcut)

- **Grid:** 8×8 (gameConstants.GRID_SIZE).
- **Swap:** Sadece yatay/dikey komşu; geçerli swap en az 3’lü eşleşme üretmeli.
- **Match:** 3+ aynı tip yatay/dikey; eşleşen taşlar kalkar, üsttekiler düşer, yenileri doldurulur.
- **Skor:** Eşleşme başına puan (sabit formül); seviye numarası zorlukta kullanılabilir.
- **Seviye:** 1–500; açılan son seviye localStorage’da.
- **Hint:** Idle 6s → rastgele geçerli swap’ın iki hücresinde blink.

---

## Kodlama tercihleri

- UI metinleri için her zaman `useI18n().t` kullan; çeviriler `infrastructure/i18n/translations.ts`.
- Oyun state’i `useMatch3` hook’unda; board güncellemesi için `boardRef` ile stale closure’dan kaçınıldı.
- Yeni sabitler (grid boyutu, level sayısı, süreler) `domain/gameConstants.ts` içinde tutulur.

---

*Yol haritası için **ROADMAP.md**, teknik adımlar için **implementation_plan.md**.*
