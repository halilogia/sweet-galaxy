# 🛣️ Sweet Galaxy – Yol Haritası

Son güncelleme: 16.02.2026

---

## 📍 Şu an neredeyiz?

Temel match-3 oyunu oynanabilir durumda: menü, seviye seçimi (sayfalı), sürükle-bırak eşleştirme, hint, skor, ilerleme kaydı, TR/EN dil desteği. Proje GitHub’da: [halilogia/sweet-galaxy](https://github.com/halilogia/sweet-galaxy).

---

## ✅ Tamamlanan (v0.1)

| Özellik | Durum |
|--------|--------|
| Proje yapısı (Vite, React, TypeScript, Tailwind, Framer Motion) | ✅ |
| Domain / Infrastructure / Presentation katmanları | ✅ |
| Match-3 çekirdek (swap, eşleşme, düşme, puan) | ✅ |
| 500 seviye, sayfa başına 20 (sol/sağ ok) | ✅ |
| İlerleme kaydı (açılan seviye) | ✅ |
| i18n (TR/EN, dil seçici) | ✅ |
| Hint (idle sonrası geçerli hamle blink) | ✅ |
| Responsive + dokunmatik, kaydırma yok | ✅ |
| Metin/görsel seçim kapatıldı | ✅ |
| GitHub repo + ilk push | ✅ |

---

## 🔜 Kısa vade (v0.2 – Çekirdek his)

- [ ] **Ses:** Tema müziği (açılış/menü), SFX (swap, match, level complete, fail).
- [ ] **Görsel efektler:** Eşleşme patlaması, yıldız parçacıkları, basit ekran sarsıntısı.
- [ ] **Hareket sınırı:** Seviyede X hamle hakkı; bitince başarısız ekranı.
- [ ] **UI iyileştirme:** Hamle sayacı, hedef metni (ör. “1500 puan”), buton/geçiş animasyonları.

---

## 📅 Orta vade (v0.3 – İçerik)

- [ ] **Seviye hedefleri:** Sadece skor değil; “X puan topla”, “Y hamlede bitir”, “Z şekeri topla” gibi hedef tipleri.
- [ ] **Özel şekerler:** Çizgili (satır/sütun temizleyen), paketli (3x3 patlama) üretimi ve mantığı.
- [ ] **Seviye tasarımı:** Sabit engeller, boş hücreler, farklı grid boyutları (opsiyonel).
- [ ] **Güçlendirmeler:** Sınırlı kullanımlık joker veya boost’lar (opsiyonel).

---

## 🚀 Uzun vade (v1.0 – Yayın)

- [ ] **PWA:** Offline çalışma, “Add to Home Screen”, manifest.
- [ ] **Mobil build:** Capacitor ile iOS/Android paketleme ve mağaza öncesi test.
- [ ] **Polish:** Yükleme ekranı, hata yönetimi, erişilebilirlik (focus, aria).
- [ ] **İsteğe bağlı:** Liderlik tablosu, günlük ödül, basit analytics.

---

## 📐 Görsel özet

```text
v0.1 (Bitti)     v0.2 (Ses & his)   v0.3 (İçerik)      v1.0 (Yayın)
─────────────────────────────────────────────────────────────────►

[=====>          ] [              ] [              ] [              ]
 Temel oyun        Efekt & ses      Hedefler &        PWA & mobil
 + sayfa + i18n    + hamle limiti   özel şekerler     + polish
```

---

## 📁 Brain klasörü rolleri

| Dosya | Amaç |
|-------|------|
| **ROADMAP.md** | Bu dosya – yol haritası ve hedefler. |
| **implementation_plan.md** | Faz bazlı teknik uygulama adımları. |
| **project_map.md** | Proje dizin yapısı. |
| **knowledge.md** | Mimari, kurallar, kavramlar. |
| **CHANGELOG.md** | Sürüm bazlı yapılan değişiklikler. |
| **task.md** | Güncel / aktif görevler. |
| **walkthrough.md** | Geliştirme notları ve kararlar. |

Yol haritasını güncelledikçe bu dosyayı ve ilgili brain dosyalarını birlikte güncellemek faydalı olur.
