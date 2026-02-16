# 🗺️ Project Structure Map

Güncelleme: 16.02.2026 (Güncellendi: Lock özelliği eklendi ✅)

```text
├── 📁 brain
│   ├── 📖 CHANGELOG.md
│   ├── 📖 implementation_plan.md
│   ├── 📖 knowledge.md
│   ├── 📖 LEVEL_GOALS.md   (seviye hedef tipleri: score, collect, moves)
│   ├── 📖 project_map.md
│   ├── 📖 ROADMAP.md
│   ├── 📖 task.md
│   └── 📖 walkthrough.md
├── 📁 src
│   ├── 📁 domain
│   │   ├── 🟦 gameConstants.ts
│   │   ├── 🟦 levelGoals.ts   (getLevelGoals, getLevelLayout, allGoalsMet)
│   │   └── 🟦 types.ts   (CandyType, CellKind: play/empty/stone/jelly/lock, LevelLayout)
│   ├── 📁 infrastructure
│   │   ├── 📁 i18n
│   │   │   ├── 🟦 I18nContext.tsx
│   │   │   ├── 🟦 index.ts
│   │   │   ├── 🟦 localeStorage.ts
│   │   │   └── 🟦 translations.ts
│   │   └── 📁 storage
│   │       ├── 🟦 progressStorage.ts
│   │       ├── 🟦 leaderboardStorage.ts
│   │       └── 🟦 dailyRewardsStorage.ts
│   ├── 📁 presentation
│   │   ├── 📁 components
│   │   │   ├── 🟦 LanguageSelector.tsx
│   │   │   └── 🟦 Tile.tsx
│   │   ├── 📁 constants
│   │   │   └── 🟦 candyIcons.tsx   (CANDY_SVG, SPECIAL_CANDY_SVG)
│   │   ├── 📁 hooks
│   │   │   └── 🟦 useMatch3.ts   (combo, özel şekerler, engeller, boş hücreler)
│   │   └── 🟦 App.tsx
│   ├── 🎨 index.css
│   └── 🟦 main.tsx
├── ⚙️ capacitor.config.json
├── 🌐 index.html
├── ⚙️ metadata.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📖 README.md
├── ⚙️ tsconfig.json
└── ⚙️ vite.config.ts
```

- **domain:** Oyun tipi ve sabitleri. Seviye düzeni (layout), hedefler.
- **infrastructure:** i18n, ilerleme kaydı (ve ileride ses/API).
- **presentation:** Tüm UI ve oyun mantığı hook'u. Özel şekerler, combo, engeller.

**Yeni Özellikler:**
- ✅ Özel şekerler: striped-h/v, wrapped (üretim + patlama)
- ✅ Color-bomb: İki özel şeker swap → color-bomb, color-bomb + normal → renk temizleme ✅
- ✅ Combo bonusları: Ardışık eşleşmelerde çarpan
- ✅ Seviye engelleri: Stone, jelly, lock (görsel + mantık) ✅
- ✅ Jelatin/Taş/Lock mantığı: Komşu eşleşmeyle temizleme/kırma/açma ✅
- ✅ Boş hücreler: Empty cells (seviye 4+)
- ✅ Leaderboard: Yerel skor tablosu, seviye bazlı en yüksek skorlar ✅
- ✅ Daily rewards: Günlük ödüller, login bonusu, streak sistemi ✅
- ❌ Ses sistemi (eksik)
