# 🏗️ Implementation Plan

Bu dosya ROADMAP.md ile uyumlu, faz bazlı teknik adımları listeler.

---

## Phase 1: Foundation ✅ (Tamamlandı – v0.1)

- [x] Proje yapısı (Vite, React, TS, Tailwind, Framer Motion)
- [x] Domain: `types.ts`, `gameConstants.ts`
- [x] Infrastructure: i18n (TR/EN, localeStorage, I18nContext), progressStorage
- [x] Presentation: App, Tile, LanguageSelector, useMatch3, candyIcons
- [x] Match-3 çekirdek: swap, match, gravity, score
- [x] Level select: 500 level, sayfa başına 20, sol/sağ ok
- [x] Hint (idle 6s → geçerli hamle blink)
- [x] Responsive, scroll yok, user-select none
- [x] GitHub: halilogia/sweet-galaxy, ilk push

---

## Phase 2: Core Feel (v0.2)

- [ ] Ses altyapısı: Web Audio veya Howler, ses dosyaları için `public/sounds/`
- [ ] SFX: swap, match, level complete, fail
- [ ] Müzik: menü/oyun arka plan (loop, sessiz açılış)
- [ ] Görsel: match patlaması (Framer Motion veya CSS), isteğe bağlı particle
- [ ] Hamle limiti: `gameConstants` veya seviye bazlı moveLimit, UI’da gösterim, limit bitince fail ekranı
- [ ] UI: hamle sayacı, hedef metni (çevirilerle)

---

## Phase 3: Content (v0.3) ✅ (Büyük Ölçüde Tamamlandı)

- [x] Hedef tipleri: score, moves, collect (belirli candy tipi) ✅
- [x] Özel şekerler (tümü): striped-h/v (row/col clear), wrapped (3x3) – üretim + match sonrası tetikleme ✅
- [x] Combo bonusları: Ardışık eşleşmelerde çarpan (+50%, +100%, ...) ✅
- [x] Seviye verisi: engel/boş hücre (stone, jelly, empty) ✅
- [x] Color-bomb kombinasyonları: İki özel şeker swap → color-bomb ✅
- [x] Color-bomb patlama: Color-bomb + normal → renk temizleme ✅
- [x] Jelatin/Taş/Lock mantığı: Temizleme/kırma/açma mekaniği ✅
- [ ] Güçlendirme: joker/boost slot ve kullanım (opsiyonel)

---

## Phase 4: Release (v1.0) ✅ (Kısmen Tamamlandı)

- [x] Leaderboard: Yerel skor tablosu, seviye bazlı en yüksek skorlar ✅
- [x] Daily rewards: Günlük ödüller, login bonusu, streak sistemi ✅
- [ ] PWA: manifest, service worker, offline fallback
- [ ] Capacitor: config hazır; build & sign (iOS/Android)
- [ ] Polish: loading state, hata mesajları, aria/focus
- [ ] Analytics: Opsiyonel analytics entegrasyonu

---

*Detaylı hedefler için **ROADMAP.md** dosyasına bakın.*
