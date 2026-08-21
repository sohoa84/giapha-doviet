# STAGE 4 – GITHUB PAGES DEPLOY

## Mục tiêu

Sau khi cài Stage 4, quy trình cập nhật website:

```text
Sửa Excel / ảnh / nội dung
        ↓
double-click PUBLISH_GITHUB.bat
        ↓
validate
        ↓
convert
        ↓
build local
        ↓
git commit + push
        ↓
GitHub Actions
        ↓
GitHub Pages
```

---

## File Stage 4

```text
.github/workflows/deploy-pages.yml
scripts/check-deploy.js
PUBLISH_GITHUB.ps1
PUBLISH_GITHUB.bat
.gitignore
```

---

## package.json

Thêm script:

```json
"deploy:check": "node scripts/check-deploy.js"
```

Ví dụ đầy đủ:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",

  "genealogy:validate": "node scripts/validate.js",
  "genealogy:convert": "node scripts/convert.js",
  "genealogy:build": "npm run genealogy:validate && npm run genealogy:convert && npm run build",

  "deploy:check": "node scripts/check-deploy.js"
}
```

---

# THIẾT LẬP LẦN ĐẦU

## 1. Tạo GitHub repository

Ví dụ:

```text
giapha-doviet
```

Không cần tạo README nếu source local đã có.

## 2. family.config.js

Nếu repo tên:

```text
giapha-doviet
```

thì:

```js
deployment: {
  basePath: '/giapha-doviet/'
}
```

Nếu repo đặc biệt là:

```text
username.github.io
```

thì dùng:

```js
basePath: '/'
```

## 3. Khởi tạo Git nếu cần

```powershell
git init
git branch -M main
```

## 4. Gắn repository

```powershell
git remote add origin https://github.com/USERNAME/giapha-doviet.git
```

## 5. Publish

Double-click:

```text
PUBLISH_GITHUB.bat
```

Hoặc:

```powershell
.\PUBLISH_GITHUB.ps1
```

## 6. Bật GitHub Pages

Trên GitHub:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source: GitHub Actions
```

Thông thường workflow `deploy-pages.yml` cũng sẽ hướng GitHub vào cơ chế Pages Actions,
nhưng lần đầu vẫn nên kiểm tra mục Settings → Pages.

---

# CẬP NHẬT WEBSITE SAU NÀY

Không cần thao tác Git phức tạp.

Chỉ:

1. Sửa Excel / ảnh / Markdown.
2. Double-click `PUBLISH_GITHUB.bat`.
3. Chờ GitHub Actions deploy.

---

# LƯU Ý DỮ LIỆU CÁ NHÂN

Repository GitHub public sẽ làm các file trong source có thể được tải xuống,
bao gồm cả `DATA_GIAPHA.xlsx`.

Nếu gia phả có dữ liệu riêng tư, số điện thoại, địa chỉ hoặc media private thực sự nhạy cảm,
không nên coi `VISIBILITY=private` là biện pháp bảo mật nếu dữ liệu vẫn nằm trong repository/public build.

Muốn bảo mật thực sự cần một kiến trúc private/backend ở giai đoạn sau.
