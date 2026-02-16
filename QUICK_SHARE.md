# 🚀 Hızlı Paylaşım - Arkadaşınızla Test Etme

## Adım 1: Dev Server'ı Başlat
```bash
npm run dev
```

Server `http://0.0.0.0:3000` adresinde başlayacak.

## Adım 2: Yerel IP Adresinizi Bulun

### Linux/Mac:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
# veya
hostname -I
```

### Windows:
```bash
ipconfig
# "IPv4 Address" satırını bulun
```

Örnek IP: `192.168.1.100`

## Adım 3: Arkadaşınıza Paylaşın

Arkadaşınız tarayıcıda şu adrese gitsin:
```
http://192.168.1.100:3000
```

**ÖNEMLİ:** 
- ✅ Aynı WiFi ağında olmanız gerekiyor
- ✅ Firewall'unuzun 3000 portunu engellemediğinden emin olun
- ✅ IP adresiniz değişebilir (DHCP), her seferinde kontrol edin

---

## Alternatif: Build + Basit Sunucu

### 1. Build Al
```bash
npm run build
```

### 2. Basit Sunucu Başlat
```bash
cd dist
python3 -m http.server 8000
```

### 3. IP Adresini Paylaş
Arkadaşınız `http://YEREL_IP:8000` adresine gidebilir.

---

## Kalıcı Çözüm: GitHub + Netlify

Detaylar için `DEPLOY.md` dosyasına bakın!
