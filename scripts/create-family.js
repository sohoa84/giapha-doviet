import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = "") {
  return new Promise(resolve => {
    const suffix = defaultValue ? ` [${defaultValue}]` : "";
    rl.question(`${question}${suffix}: `, answer => {
      const value = String(answer || "").trim();
      resolve(value || defaultValue);
    });
  });
}

function normalizeBasePath(value) {
  let result = String(value || "").trim();
  if (!result) return "/";
  if (!result.startsWith("/")) result = "/" + result;
  if (!result.endsWith("/")) result = result + "/";
  return result;
}

function esc(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

console.log("\n========================================");
console.log("     TẠO CẤU HÌNH GIA PHẢ MỚI");
console.log("========================================\n");

const familyName = await ask("Tên dòng họ", "Họ Trần Văn");
const familyShortName = await ask(
  "Tên họ ngắn",
  familyName.replace(/^Họ\s+/i, "")
);
const branchName = await ask("Tên chi", "");
const branchShortName = await ask(
  "Tên chi ngắn",
  branchName.replace(/^Chi\s+/i, "")
);

const familyCode = (await ask("Mã dòng họ/chi", "TV"))
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, "");

const slogan = await ask(
  "Slogan",
  "Gìn giữ nguồn cội · Kết nối các thế hệ"
);
const heritageQuote = await ask(
  "Thông điệp truyền thống",
  "Uống nước nhớ nguồn"
);

const primary = await ask("Màu chủ đạo", "#356859");
const primaryDark = await ask("Màu chủ đạo đậm", "#24483e");
const primarySoft = await ask("Màu nền nhạt", "#eef7f2");
const accent = await ask("Màu nhấn", "#c89b3c");
const headerText = await ask("Màu chữ Header", "#ffffff");

const banner = await ask("Đường dẫn banner", "images/banner.jpg");
const basePath = normalizeBasePath(
  await ask("GitHub Pages basePath", "/giapha/")
);

const copyrightYear = await ask(
  "Năm copyright",
  String(new Date().getFullYear())
);

const siteTitle = branchName
  ? `Gia phả ${familyName} – ${branchName}`
  : `Gia phả ${familyName}`;

const config = `export default {
  familyName: '${esc(familyName)}',
  familyShortName: '${esc(familyShortName)}',
  branchName: '${esc(branchName)}',
  branchShortName: '${esc(branchShortName)}',

  siteTitle: '${esc(siteTitle)}',
  brandTitle: 'Gia phả ${esc(familyShortName)}',

  heroTitle: '${esc(familyShortName.toUpperCase())}',
  heroSubtitle: '${esc(branchName.toUpperCase())}',

  slogan: '${esc(slogan)}',
  heritageQuote: '${esc(heritageQuote)}',

  familyCode: '${esc(familyCode)}',

  images: {
    banner: '${esc(banner)}'
  },

  theme: {
    primary: '${esc(primary)}',
    primaryDark: '${esc(primaryDark)}',
    primarySoft: '${esc(primarySoft)}',
    accent: '${esc(accent)}',
    headerText: '${esc(headerText)}'
  },

  deployment: {
    basePath: '${esc(basePath)}'
  },

  footer: {
    copyrightYear: ${Number(copyrightYear) || new Date().getFullYear()},
    description: 'Website gia phả điện tử ${esc(siteTitle)}.'
  }
};
`;

const configDir = path.join(root, "src/config");
const configFile = path.join(configDir, "family.config.js");

fs.mkdirSync(configDir, { recursive: true });

if (fs.existsSync(configFile)) {
  const backup = path.join(
    configDir,
    `family.config.backup-${Date.now()}.js`
  );
  fs.copyFileSync(configFile, backup);
  console.log(`\n✓ Backup config cũ: ${path.basename(backup)}`);
}

fs.writeFileSync(configFile, config, "utf8");
console.log("✓ Đã tạo src/config/family.config.js");

const templateExcel = path.join(
  root,
  "templates/MAU_DU_LIEU_GIA_PHA.xlsx"
);
const dataDir = path.join(root, "data");
const targetExcel = path.join(dataDir, "DATA_GIAPHA.xlsx");

if (fs.existsSync(templateExcel)) {
  const copyExcel = (
    await ask("Tạo DATA_GIAPHA.xlsx từ file mẫu? (y/n)", "n")
  ).toLowerCase();

  if (copyExcel === "y" || copyExcel === "yes") {
    fs.mkdirSync(dataDir, { recursive: true });

    if (fs.existsSync(targetExcel)) {
      const overwrite = (
        await ask("DATA_GIAPHA.xlsx đã tồn tại. Ghi đè? (y/n)", "n")
      ).toLowerCase();

      if (overwrite === "y" || overwrite === "yes") {
        const excelBackup = path.join(
          dataDir,
          `DATA_GIAPHA.backup-${Date.now()}.xlsx`
        );
        fs.copyFileSync(targetExcel, excelBackup);
        fs.copyFileSync(templateExcel, targetExcel);
        console.log(`✓ Backup Excel cũ: ${path.basename(excelBackup)}`);
        console.log("✓ Đã tạo DATA_GIAPHA.xlsx từ mẫu");
      } else {
        console.log("• Giữ nguyên DATA_GIAPHA.xlsx hiện tại");
      }
    } else {
      fs.copyFileSync(templateExcel, targetExcel);
      console.log("✓ Đã tạo data/DATA_GIAPHA.xlsx từ mẫu");
    }
  }
}

console.log("\n========================================");
console.log("HOÀN THÀNH CẤU HÌNH");
console.log("========================================");
console.log(`Tên : ${siteTitle}`);
console.log(`Mã  : ${familyCode}`);
console.log(`Base: ${basePath}`);
console.log("\nTiếp theo:");
console.log("1. Thay banner/ảnh trong public/images");
console.log("2. Nhập dữ liệu Excel");
console.log("3. npm run genealogy:validate");
console.log("4. npm run genealogy:build\n");

rl.close();
