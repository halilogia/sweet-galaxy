# 🚀 Deploy Talimatları

## Hızlı Test İçin (Yerel Paylaşım)

### 1. Build Al
```bash
npm run build
```

### 2. Basit HTTP Sunucusu Başlat
```bash
# Python 3 ile
cd dist
python3 -m http.server 8000

# veya Node.js ile
npx serve dist -p 8000
```

### 3. Yerel IP Adresini Bul
```bash
# Linux/Mac
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Arkadaşınız tarayıcıda `http://YEREL_IP:8000` adresine gidebilir.

---

## GitHub + Netlify Deploy (Kalıcı Çözüm)

### 1. GitHub Repo Oluştur
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/sweet-galaxy-match-3.git
git push -u origin main
```

### 2. Netlify'e Deploy
1. [Netlify](https://www.netlify.com/) hesabı oluştur
2. "Add new site" → "Import an existing project"
3. GitHub repo'yu seç
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy!

### 3. Vercel Alternatifi
1. [Vercel](https://vercel.com/) hesabı oluştur
2. GitHub repo'yu import et
3. Framework: Vite
4. Deploy!

---

## GitHub Pages (Ücretsiz)

### 1. GitHub Actions Workflow Oluştur
`.github/workflows/deploy.yml` dosyası oluştur:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2. GitHub Repo Ayarları
- Settings → Pages
- Source: GitHub Actions
- Artık her push'ta otomatik deploy olur!

---

## ngrok ile Geçici Paylaşım

```bash
# ngrok kurulumu
npm install -g ngrok

# Dev server başlat
npm run dev

# Başka terminalde
ngrok http 5173
```

ngrok size bir URL verecek (örn: `https://abc123.ngrok.io`). Bu URL'i arkadaşınızla paylaşın.

---

## Notlar

- **LocalStorage:** Bazı tarayıcılar `file://` protokolünde localStorage'ı engeller. Bu yüzden HTTP sunucusu gerekli.
- **CORS:** Production build'de CORS sorunu olmaz.
- **HTTPS:** Netlify/Vercel otomatik HTTPS sağlar.
