# STAGE 2A – DATA PIPELINE

## Các file cần chép vào project

- `scripts/convert.js`
- `scripts/validate.js`
- `BUILD_GIAPHA.bat`

Sau đó sửa phần `scripts` trong `package.json` thành:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "genealogy:validate": "node scripts/validate.js",
  "genealogy:convert": "node scripts/convert.js",
  "genealogy:build": "npm run genealogy:validate && npm run genealogy:convert && npm run build"
}
```

## Quy trình dùng hằng ngày

Chỉ cập nhật Excel:

`data/DATA_GIAPHA.xlsx`

Sau đó chạy:

```powershell
npm run genealogy:build
```

Hoặc double-click:

`BUILD_GIAPHA.bat`

## Quy tắc ID

`familyCode` nằm trong:

`src/config/family.config.js`

Ví dụ:

```js
familyCode: 'TV'
```

ID trong Excel phải theo:

```text
TV-8.01
TV-8.02
TV-8.02S1
TV-8.02S2
```

Dâu/rể:
- ID kết thúc `S1`, `S2`...
- Cha trống
- Mẹ trống

Sheet `MARRIAGES` từ Stage 2A là tùy chọn. Quan hệ spouse có thể tự sinh từ quy tắc ID.
