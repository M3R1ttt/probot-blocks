# Katkı Rehberi (TR)

Katkınız için teşekkürler! Bu rehber, Probot Blocks deposunda nasıl çalıştığımızı,
PR/issue açarken neler beklediğimizi ve geliştirme ortamını nasıl hazırlayacağınızı
özetler.

## Dallar ve Akış
- `main`: Üretim/dağıtım dalı. Yayınlanmaya hazır değişiklikler burada tutulur.
- Özellik/onarım çalışmaları için `main` üzerinden bir dal açın:
  - `feature/...`, `fix/...`, `docs/...` gibi isimler kullanın.
  - PR’ınızı tekrar `main` hedefine açın.

Önerilen adımlar:
1. `git checkout -b feature/blok-isimleri`
2. Küçük ve odaklı değişiklikler yapın, gerekirse `README.md`/`SETUP.md` güncelleyin
3. `npm run build` ile derlemenin geçtiğini doğrulayın
4. Açıklayıcı bir PR mesajı, test adımları ve ekran görüntüsü ekleyin

## Geliştirme Ortamı
- Node.js 20+ (LTS önerilir)
- npm (veya yarn/pnpm, yine de repo npm lock ile geliyor)

Komutlar:

```bash
npm ci              # bağımlılıkları kur
npm run dev         # http://localhost:8006 üzerinde geliştirme sunucusu
npm run build       # üretim derlemesi (dist/ klasörü)
npm run lint        # (opsiyonel) lint kontrolü
```

> Not: Blok kaydetme/indirme özellikleri tarayıcı tabanlıdır; `npm run dev`
> ile açılan arayüz üzerinden test edebilirsiniz.

## Kod Stili
- TypeScript/React için mevcut ESLint ayarlarına uyun (`npm run lint`).
- Blok eklerken açıklayıcı `tooltip` ve mantıklı varsayılan değerler verin.
- Kullanıcı arayüzü değişikliklerinde responsive durumlarını gözden geçirin.
- C++ kod jeneratöründe yapılan değişiklikler için örnek çıktı eklemeyi düşünün.

Commit mesajları (öneri): `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `chore: …`

## Test Beklentileri
- `npm run build` çıktısının başarılı olması
- Kritik akışlar (blok ekleme, kod üretme, blok indir/yükle) tarayıcıda manuel test
- Gerekirse ekran kaydı veya ekran görüntüsü paylaşın

## Issue Açarken
- Tarayıcı ve işletim sistemi (örn. Chrome 131 / Windows 11)
- Yapılan adımlar ve beklenen/görülen sonuç
- Konsol hataları veya ekran görüntüsü
- Blok JSON’u varsa (`.probot.json`) paylaşabilirsiniz

## Lisans ve Davranış Kuralları
- Katkılarınız **MIT + Commons Clause** lisansı altında yayınlanır (bkz. `LICENSE*`).
- Etkileşimlerde `CODE_OF_CONDUCT.md` kapsamındaki kurallara uyun.

Sorular ve hızlı destek için: **tunagul54@gmail.com** veya WhatsApp
**+90 538 040 81 48**

---

# Contributing Guide (EN)

Thank you for contributing! This document summarizes how to collaborate on the
Probot Blocks repository, what we expect in PRs/issues, and how to set up the dev
environment.

## Branches & Workflow
- `main`: production-ready branch. All feature work branches off `main`.
- Create feature branches from `main` (e.g. `feature/...`, `fix/...`, `docs/...`).
- Open PRs targeting `main`; keep changes focused and well documented.

Recommended flow:
1. `git checkout -b feature/add-new-block`
2. Implement the change, update `README.md`/`SETUP.md` if behaviour changes
3. Run `npm run build` to ensure the bundle succeeds
4. Open a PR with description, testing notes, and screenshots if UI changes

## Development Environment
- Node.js 20+ recommended
- npm (project ships with `package-lock.json`)

Commands:

```bash
npm ci              # install dependencies
npm run dev         # dev server at http://localhost:8006
npm run build       # production build (outputs to dist/)
npm run lint        # optional lint run
```

## Coding Guidelines
- Follow the existing ESLint/TypeScript setup.
- When adding Blockly blocks, provide clear tooltips and sensible defaults.
- Check responsive states for UI changes (desktop/tablet/mobile widths).
- Update C++ generator outputs and docs when code generation changes.

Commit message convention (suggested): `feat: …`, `fix: …`, `docs: …`, `refactor: …`,
`chore: …`

## Testing Expectations
- `npm run build` must succeed before submitting a PR.
- Manually verify core flows (block editing, code preview, export/import).
- Share screenshots or short screen recordings for major UI updates.

## Filing Issues
Please include:
- Browser and OS (e.g., Chrome 131 / Windows 11)
- Reproduction steps and expected vs actual behaviour
- Console errors or relevant screenshots
- Optional: `.probot.json` block export demonstrating the problem

## License & Code of Conduct
- Contributions are distributed under the **MIT + Commons Clause** license
  (`LICENSE`, `LICENSE-commercial`).
- Interactions are governed by the included `CODE_OF_CONDUCT.md`.

Questions or direct support: **tunagul54@gmail.com** or WhatsApp
**+90 538 040 81 48**
