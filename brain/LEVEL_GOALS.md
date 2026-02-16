# Seviye Hedefleri (Level Goals)

Bir seviyede birden fazla farklı görev tanımlanabilir. Seviye tamamlanır ancak **tüm hedefler** aynı anda sağlanırsa.

---

## Hedef tipleri

### 1. `score` – Puan hedefi
- **Açıklama:** Bu seviyede en az X puan topla.
- **Örnek:** "1500 puan topla"
- **İlerleme:** Anlık skor gösterilir; hedefe ulaşınca tamamlanır.
- **Kazanma:** `score >= targetScore`

---

### 2. `collect` – Renk toplama
- **Açıklama:** Belirtilen renkte Y adet şeker patlat (eşleştir).
- **Örnek:** "20 kırmızı şeker patlat", "15 mavi topla"
- **İlerleme:** O seviyede o renkte kaç şeker patlatıldığı sayılır (current / target).
- **Kazanma:** `collected[color] >= target`

---

### 3. `moves` – Hamle sınırı
- **Açıklama:** Seviyeyi en fazla Z hamlede bitir (ve diğer hedefleri de sağla).
- **Örnek:** "20 hamlede bitir"
- **İlerleme:** Kalan hamle gösterilir; 0 olunca hamle yapılamaz.
- **Kazanma:** Hamle bitmeden önce diğer tüm hedefler sağlanmış olmalı; hamle 0 olduğunda hedefler tamam değilse kaybedilir.

---

## İleride eklenebilecek hedefler

### 4. `clear` – Engelleri temizle *(planlanan)*
- Belirli sayıda engel (taş, kilit vb.) temizle.
- Engel mekaniği eklendiğinde kullanılacak.

### 5. `bring_down` – Öğeleri indir *(planlanan)*
- Belirli sayıda öğeyi (paket, hedef hücre vb.) tabana indir.
- Özel hücreler eklendiğinde kullanılacak.

### 6. `survive` – Süre / hamle boyunca hayatta kal *(planlanan)*
- X hamle veya X saniye boyunca belirli bir koşulu koru (örn. skor düşmesin).

---

## Seviye başına birden fazla hedef

- Her seviyede **hedef listesi** vardır: `[score, collect(red, 20), moves(25)]`.
- **Kazanma koşulu:** Tüm hedefler sağlanmış olmalı (ve hamle bitmeden).
- **Kaybetme:** Hamle 0 olduğunda herhangi bir hedef tamamlanmamışsa.

---

## Veri yapısı (özet)

| Hedef tipi | Parametreler | Takip edilen |
|------------|--------------|--------------|
| `score`    | `target: number` | `gameState.score` |
| `collect`  | `color: CandyColor`, `target: number` | `gameState.collected[color]` |
| `moves`    | `limit: number`   | `gameState.moves` (kalan) |

Bu doküman, `src/domain` içindeki tipler ve `useMatch3` / App’teki hedef mantığı ile senkron tutulacak.
