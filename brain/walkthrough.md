# 🚶 Walkthrough & Notes

Geliştirme notları ve alınan kararlar.

---

## 16.02.2026

- **Brain güncellendi:** ROADMAP.md yol haritası çizildi (v0.1 tamamlandı, v0.2–v1.0 hedefleri). implementation_plan, CHANGELOG, knowledge, project_map, task, walkthrough senkronize edildi.
- **Daha önce (özet):** Proje domain/infrastructure/presentation’a ayrıldı; i18n (TR/EN) eklendi; 500 seviye, sayfalı level select (sol/sağ ok), hint, responsive, user-select kapatıldı; Google/Gemini kaldırıldı; GitHub’a (halilogia/sweet-galaxy) push yapıldı. Match-3 stale closure hatası boardRef ile giderildi.

---

## Kararlar

- **Seviye sayfalama:** Dikey scroll yerine sayfa başına 20 level, sol/sağ ok (LEVELS_PER_PAGE, levelSelectPage).
- **Metin seçimi:** Oyun arayüzünde seçim kapalı (body/#root user-select: none, ::selection şeffaf).
- **Commit author:** Bu repo için halilemrekuyupinar@proton.me kullanıldı (GitHub push).

---

*Yol haritası: **ROADMAP.md**. Teknik adımlar: **implementation_plan.md**.*
