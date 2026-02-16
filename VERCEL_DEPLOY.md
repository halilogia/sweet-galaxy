# 🚀 Vercel Deploy Talimatları

## Adım 1: GitHub'a Push

Değişiklikler zaten commit edildi. Şimdi push edin:

```bash
git add .
git commit -m "Add lock obstacle, leaderboard, daily rewards UI"
git push origin main
```

## Adım 2: Vercel'e Deploy

### Yöntem 1: Vercel Web Arayüzü (Önerilen)

1. **Vercel'e Git:**
   - https://vercel.com adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Yeni Proje Oluştur:**
   - "Add New..." → "Project" tıklayın
   - GitHub repo'larınızdan `halilogia/sweet-galaxy` seçin
   - "Import" tıklayın

3. **Build Ayarları:**
   - **Framework Preset:** Vite (otomatik algılanır)
   - **Root Directory:** `./` (boş bırakın)
   - **Build Command:** `npm run build` (otomatik)
   - **Output Directory:** `dist` (otomatik)
   - **Install Command:** `npm install` (otomatik)

4. **Deploy:**
   - "Deploy" butonuna tıklayın
   - 1-2 dakika içinde deploy tamamlanır!

### Yöntem 2: Vercel CLI

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Proje dizininde
vercel

# İlk deploy için:
# - Set up and deploy? Yes
# - Which scope? (Hesabınızı seçin)
# - Link to existing project? No
# - Project name? sweet-galaxy-match-3
# - Directory? ./
# - Override settings? No

# Production deploy için:
vercel --prod
```

## Adım 3: Otomatik Deploy

Her GitHub push'unda otomatik deploy olur! 🎉

## Önemli Notlar

- ✅ `vercel.json` dosyası eklendi (SPA routing için)
- ✅ Build output: `dist` klasörü
- ✅ Framework: Vite (otomatik algılanır)
- ✅ HTTPS otomatik aktif
- ✅ Custom domain eklenebilir

## Sorun Giderme

### Build Hatası
- `package.json` içinde `build` script'i var mı kontrol edin
- `node_modules` ve `dist` klasörlerinin `.gitignore`'da olduğundan emin olun

### Routing Sorunu (404)
- `vercel.json` dosyasındaki `rewrites` kuralı SPA routing için gerekli
- Zaten eklendi, sorun olmamalı

### Environment Variables
- Şu an gerekli değişken yok
- İleride API key vs. eklemek için: Vercel Dashboard → Settings → Environment Variables

## URL

Deploy sonrası şu formatta bir URL alacaksınız:
```
https://sweet-galaxy-match-3.vercel.app
```

veya custom domain:
```
https://sweet-galaxy.halilogia.com
```

---

**Hazır!** 🎉 Artık arkadaşınız internet üzerinden oyunu test edebilir!
