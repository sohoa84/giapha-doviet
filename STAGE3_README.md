# STAGE 3 – CREATE FAMILY

Copy vào project template:

```text
scripts/create-family.js
CREATE_FAMILY.bat
templates/MAU_DU_LIEU_GIA_PHA.xlsx
```

Khuyến nghị: trước khi tạo họ mới, copy nguyên thư mục `giapha-template`
thành một thư mục mới.

Ví dụ:

```text
C:\GiaPha\giapha-doviet
```

Sau đó double-click:

```text
CREATE_FAMILY.bat
```

Script sẽ hỏi tên họ, tên chi, familyCode, màu chủ đạo, banner và basePath.
Nó tự sinh `src/config/family.config.js`.

Config cũ được backup trước khi ghi.

Script cũng có thể copy Excel mẫu thành:

```text
data/DATA_GIAPHA.xlsx
```

nhưng chỉ khi bạn xác nhận.

Sau khi nhập dữ liệu:

```powershell
npm run genealogy:validate
npm run genealogy:build
```
