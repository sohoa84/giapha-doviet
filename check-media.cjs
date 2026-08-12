const XLSX = require("xlsx");

const workbook = XLSX.readFile("./data/DATA_GIAPHA.xlsx");

const sheet = workbook.Sheets["MEDIA"];

const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false
});

console.log("MEDIA columns:");
console.log(
    Object.keys(rows[0] || {})
);

console.log("");
console.log("Dòng có VA-10.02:");

console.table(
    rows.filter(row =>
        Object.values(row).some(
            value =>
                String(value).trim() === "VA-10.02"
        )
    )
);