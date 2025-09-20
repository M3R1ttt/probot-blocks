# Probot Blocks Setup Guide

This project is a Vite + React single-page application that compiles down to
static assets. Deploying it means building the production bundle and serving
the generated files with any web server that can host static content (Nginx,
Apache, Caddy, GitHub Pages, Netlify, etc.). The steps below describe how to
run the build locally and host it on a self-managed machine (e.g. a home
server) behind `blocks.probotstudio.com`.

---

## 1. Gereksinimler

- Node.js 20+ (LTS önerilir) ve npm
- Eğer sunucu üzerinde kaynak kodu derleyecekseniz: git
- Statik dosyaları sunmak için bir web sunucusu (örneğin Nginx)
- `blocks.probotstudio.com` alan adını yönlendirebileceğiniz DNS erişimi

> **Not:** Projeyi yerelde çalıştırmak için sadece Node.js ve npm yeterli. Sunucuya
> aktarırken derlenmiş `dist/` klasörünü doğrudan kopyalayabilirsiniz.

## 2. Kaynak Kodunu Alma

```bash
git clone git@github.com:tunapro1234/probot-blocks.git
cd probot-blocks
npm ci   # veya npm install
```

Geliştirme sırasında canlı sunucuya ihtiyaç duyarsanız:

```bash
npm run dev -- --host 0.0.0.0 --port 8006
```

Bu komut editörü http://localhost:8006 adresinde çalıştırır ve aynı ağdaki diğer
cihazlardan erişilebilmesi için host ayarı yapılmıştır.

## 3. Üretim Derlemesi

```bash
npm run build
```

Komut `dist/` klasörü altında üretim için optimize edilmiş dosyaları üretir. İki
yaygın yaklaşım:

1. **Sunucuda derleme:** Sunucuda `npm run build` çalıştırın ve `dist/`
   klasörünü web sunucusunun kök dizinine taşıyın.
2. **Yerelde derleyip kopyalama:** Yerelde `npm run build` çalıştırın,
   `rsync/scp` ile `dist/` içeriğini sunucuya aktarın.

## 4. Nginx ile Yayına Alma

Sunucuda `dist/` içeriğini örneğin `/var/www/blocks` altına kopyalayın ve
`/etc/nginx/sites-available/blocks.probotstudio.com` dosyasını aşağıdaki gibi
oluşturun:

```nginx
server {
    listen 80;
    server_name blocks.probotstudio.com;

    root /var/www/blocks;
    index index.html;

    location / {
        # React SPA olduğundan tüm istekleri index.html'e yönlendiriyoruz
        try_files $uri $uri/ /index.html;
    }
}
```

Sitenin etkin olduğunu doğrulamak için:

```bash
ln -s /etc/nginx/sites-available/blocks.probotstudio.com \
      /etc/nginx/sites-enabled/blocks.probotstudio.com
sudo nginx -t
sudo systemctl reload nginx
```

### HTTPS (Önerilir)

- DNS kayıtlarında `blocks.probotstudio.com` alan adını sunucu IP’sine yönlendirin.
- Let’s Encrypt/Certbot ile TLS sertifikası alın:

  ```bash
  sudo certbot --nginx -d blocks.probotstudio.com
  ```

- Sertifika yenilemeleri için `systemctl status certbot.timer` ile zamanlayıcıyı
  kontrol edin.

## 5. Güncellemeleri Yaygınlaştırma

Yeni sürüm derlenince:

```bash
git pull
npm ci
npm run build
sudo rm -rf /var/www/blocks/*
sudo cp -r dist/* /var/www/blocks/
sudo systemctl reload nginx
```

Eğer yerelde derleyip kopyalıyorsanız, `dist/` klasörünü tekrar yollamak ve
sunucuda eski dosyaları temizlemek yeterli.

## 6. Opsiyonel: Systemd ile Yerel Sunucu

Statik dosya yerine Node/Vite önizleme sunucusunu kalıcı çalıştırmak isterseniz
`npm run dev` için bir systemd servisi yazabilirsiniz. Ancak üretim için
statik dosya sunumu hem daha hafif hem de bakım açısından daha kolaydır.

## 7. Yedekleme ve Versiyonlama

- `blocks.probotstudio.com` kullanıcılarının indirdiği `.probot.json` dosyaları
  blok düzenlerini içerir. İsterseniz sunucuda ayrıca yedekleme mekanizması veya
  bulut depolama entegrasyonu sağlayabilirsiniz.
- Uygulama yapılandırmasını (`SETUP.md`, `README.md`, vb.) sürüm kontrolünde
  tutmak güncellemeleri takip etmeyi kolaylaştırır.

---

### Sorular & Destek

- **Derleme hatası** alırsanız: Node sürümünü kontrol edin, `node_modules`
  klasörünü silip `npm ci` ile yeniden kurmayı deneyin.
- **Çalışmayan site**: Nginx hata loglarını (`/var/log/nginx/error.log`)
  inceleyin; çoğunlukla eksik `try_files` ayarı veya yanlış `root` dizini
  kaynaklıdır.
- **HTTPS sertifika uyarısı**: DNS kayıtlarının doğru olduğundan ve port 80/443’ün
  yönlendirilmiş olduğundan emin olun.

Kurulum sırasında takıldığınız noktaları not etmeyi unutmayın; proje büyüdükçe
kurulum sürecini otomatikleştirmek için bu belgeyi temel alabilirsiniz.

