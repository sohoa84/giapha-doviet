import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import familyConfig
    from "../src/config/family.config.js";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const root =
    path.resolve(
        __dirname,
        ".."
    );

const file =
    path.join(
        root,
        "data/DATA_GIAPHA.xlsx"
    );

const code =
    String(
        familyConfig.familyCode || ""
    )
        .trim()
        .toUpperCase();

let errors = 0;
let warnings = 0;

function error(message) {
    errors++;
    console.error(
        `✗ ${message}`
    );
}

function warning(message) {
    warnings++;
    console.warn(
        `⚠ ${message}`
    );
}

function clean(value) {
    return String(
        value ?? ""
    ).trim();
}

console.log("");
console.log(
    "KIỂM TRA DỮ LIỆU GIA PHẢ"
);
console.log(
    "========================"
);

if (!code) {
    error(
        "family.config.js thiếu familyCode"
    );
}

if (
    !fs.existsSync(file)
) {

    error(
        `Không tìm thấy ${file}`
    );

}
else {

    const workbook =
        XLSX.readFile(file);

    const personSheet =
        workbook.Sheets.PERSONS;

    if (!personSheet) {

        error(
            "Thiếu sheet PERSONS"
        );

    }
    else {

        const persons =
            XLSX.utils.sheet_to_json(
                personSheet,
                {
                    defval: "",
                    raw: false
                }
            );

        const ids =
            new Set();

        const escaped =
            code.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const idRegex =
            new RegExp(
                `^${escaped}-\\d+\\.\\d+(?:S\\d+)?$`,
                "i"
            );

        persons.forEach(
            (person, index) => {

                const row =
                    index + 2;

                const id =
                    clean(person.ID);

                if (!id) {

                    error(
                        `PERSONS dòng ${row}: thiếu ID`
                    );

                    return;

                }

                if (
                    ids.has(id)
                ) {

                    error(
                        `Trùng ID: ${id}`
                    );

                }

                ids.add(id);

                if (
                    !idRegex.test(id)
                ) {

                    error(
                        `${id}: sai định dạng mã ${code}`
                    );

                }

            }
        );

        persons.forEach(
            person => {

                const id =
                    clean(person.ID);

                const father =
                    clean(
                        person["Cha"]
                    );

                const mother =
                    clean(
                        person["Mẹ"]
                    );

                if (
                    father &&
                    !ids.has(father)
                ) {

                    warning(
                        `${id}: Cha không tồn tại ${father}`
                    );

                }

                if (
                    mother &&
                    !ids.has(mother)
                ) {

                    warning(
                        `${id}: Mẹ không tồn tại ${mother}`
                    );

                }

                if (
                    /S\d+$/i.test(id) &&
                    (
                        father ||
                        mother
                    )
                ) {

                    warning(
                        `${id}: spouse S nhưng Cha/Mẹ không trống`
                    );

                }

                if (
                    /S\d+$/i.test(id) &&
                    !father &&
                    !mother
                ) {

                    const baseId =
                        id.replace(
                            /S\d+$/i,
                            ""
                        );

                    if (
                        !ids.has(baseId)
                    ) {

                        error(
                            `${id}: không tìm thấy người gốc ${baseId}`
                        );

                    }

                }

            }
        );

        console.log(
            `Persons: ${persons.length}`
        );

    }

}

console.log("");
console.log(
    "------------------------"
);
console.log(
    `Lỗi     : ${errors}`
);
console.log(
    `Cảnh báo: ${warnings}`
);

if (errors > 0) {

    console.log(
        "\n✗ Dữ liệu chưa đạt. Hãy sửa lỗi trước khi build."
    );

    process.exit(1);

}

console.log(
    "\n✓ Dữ liệu đạt kiểm tra cơ bản."
);
