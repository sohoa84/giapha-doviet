# Gia phả Template – Cấu hình Giai đoạn 1

Mục tiêu: nhân bản website sang dòng họ khác mà không sửa các View chính.

## 1. File cần sửa khi tạo một dòng họ mới

`src/config/family.config.js`

Các trường quan trọng:

- `familyName`: tên đầy đủ, ví dụ `Họ Trần Văn`
- `familyShortName`: tên ngắn, ví dụ `Trần Văn`
- `branchName`: tên chi, ví dụ `Chi Đông Anh`
- `branchShortName`: tên chi ngắn, ví dụ `Đông Anh`
- `siteTitle`, `brandTitle`
- `heroTitle`, `heroSubtitle`
- `slogan`, `heritageQuote`
- `familyCode`: mã gợi ý dùng khi nhập liệu, ví dụ `TV`
- `images.banner`: ảnh banner trong `public/`
- `theme`: toàn bộ màu nhận diện chính
- `deployment.basePath`: base path khi build GitHub Pages

## 2. Đổi màu Header/toàn website

Ví dụ xanh rêu:

```js
theme: {
  primary: '#356859',
  primaryDark: '#24483e',
  primarySoft: '#eef7f2',
  accent: '#c89b3c',
  headerText: '#ffffff'
}
```

Không cần sửa CSS của Header/Events/Media/Members/About/PersonDetail.

## 3. Nội dung riêng

Các file Markdown trong `src/content/about/` vẫn là nội dung riêng của từng dòng họ và cần thay khi nhân bản.

## 4. Dữ liệu

Giai đoạn 1 chưa thay đổi pipeline Excel, `getFamilyOrder()`, Tree hoặc GenerationTree. Điều này nhằm bảo toàn bản đã chạy ổn định.
