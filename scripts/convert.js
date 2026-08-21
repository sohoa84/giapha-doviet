import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import familyConfig
    from "../src/config/family.config.js";

// ======================================
// VERSION
// ======================================

const VERSION = "4.0.0";

// ======================================
// PATH
// ======================================

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const projectRoot =
    path.resolve(
        __dirname,
        ".."
    );

const excelFile =
    path.join(
        projectRoot,
        "data/DATA_GIAPHA.xlsx"
    );

const outputFile =
    path.join(
        projectRoot,
        "public/data/genealogy.json"
    );

// ======================================
// CONFIG
// ======================================

const FAMILY_CODE =
    String(
        familyConfig.familyCode || ""
    )
        .trim()
        .toUpperCase();

if (!FAMILY_CODE) {
    throw new Error(
        "family.config.js chưa khai báo familyCode"
    );
}

const escapedFamilyCode =
    FAMILY_CODE.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

const PERSON_ID_REGEX =
    new RegExp(
        `^${escapedFamilyCode}-\\d+\\.\\d+(?:S\\d+)?$`,
        "i"
    );

const SPOUSE_ID_REGEX =
    /S(\d+)$/i;

// ======================================
// HELPERS
// ======================================

function clean(value) {

    return String(
        value ?? ""
    ).trim();

}

function numberOrZero(value) {

    const number =
        Number.parseInt(
            value,
            10
        );

    return Number.isFinite(number)
        ? number
        : 0;

}

function addUnique(
    array,
    value
) {

    if (
        value &&
        !array.includes(value)
    ) {

        array.push(value);

    }

}

function isSpouseId(id) {

    return /S\d+$/i.test(
        clean(id)
    );

}

function getBasePersonId(id) {

    const value =
        clean(id);

    const match =
        value.match(
            /^(.+)S\d+$/i
        );

    return match
        ? match[1]
        : null;

}

// ======================================
// READ EXCEL
// ======================================

if (
    !fs.existsSync(
        excelFile
    )
) {

    throw new Error(
        `Không tìm thấy Excel: ${excelFile}`
    );

}

const workbook =
    XLSX.readFile(
        excelFile
    );

function readSheet(
    name,
    required = false
) {

    const sheet =
        workbook.Sheets[name];

    if (!sheet) {

        if (required) {

            throw new Error(
                `Thiếu sheet bắt buộc: ${name}`
            );

        }

        console.warn(
            `⚠ Sheet ${name} không tồn tại`
        );

        return [];

    }

    return XLSX.utils.sheet_to_json(
        sheet,
        {
            defval: "",
            raw: false
        }
    );

}

// ======================================
// LOAD DATA
// ======================================

const personsRaw =
    readSheet(
        "PERSONS",
        true
    );

const marriagesRaw =
    readSheet("MARRIAGES");

const eventsRaw =
    readSheet("EVENTS");

const tieusuRaw =
    readSheet("TIEUSU");

const mediaRaw =
    readSheet("MEDIA");

// ======================================
// START
// ======================================

console.log("");
console.log(
    `Gia phả Converter v${VERSION}`
);
console.log(
    `Dòng họ       : ${familyConfig.familyName}`
);
console.log(
    `Chi           : ${familyConfig.branchName}`
);
console.log(
    `Mã dữ liệu    : ${FAMILY_CODE}`
);
console.log(
    "--------------------------------"
);

// ======================================
// 1. VALIDATE PERSON IDs
// ======================================

const idSet =
    new Set();

personsRaw.forEach(
    (person, index) => {

        const row =
            index + 2;

        const id =
            clean(person.ID);

        if (!id) {

            throw new Error(
                `PERSONS dòng ${row}: thiếu ID`
            );

        }

        if (
            !PERSON_ID_REGEX.test(id)
        ) {

            throw new Error(
                `PERSONS dòng ${row}: ID "${id}" không đúng mã ${FAMILY_CODE}. ` +
                `Mẫu hợp lệ: ${FAMILY_CODE}-10.01 hoặc ${FAMILY_CODE}-10.01S1`
            );

        }

        if (
            idSet.has(id)
        ) {

            throw new Error(
                `Trùng ID trong PERSONS: ${id}`
            );

        }

        idSet.add(id);

    }
);

// ======================================
// 2. BUILD PERSON MAP
// ======================================

const personMap = {};

personsRaw.forEach(
    person => {

        const id =
            clean(person.ID);

        const generation =
            numberOrZero(
                person["Đời"]
            );

        if (
            generation <= 0
        ) {

            console.warn(
                `⚠ ${id}: Đời chưa hợp lệ`
            );

        }

        personMap[id] = {

            ...person,

            Father:
                clean(
                    person["Cha"]
                ),

            Mother:
                clean(
                    person["Mẹ"]
                ),

            generation,

            parents: [],

            children: [],

            spouses: [],

            events: [],

            media: [],

            biography: ""

        };

    }
);

// ======================================
// 3. VALIDATE RELATIONS
// ======================================

personsRaw.forEach(
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
            !personMap[father]
        ) {

            console.warn(
                `⚠ ${id}: Cha không tồn tại: ${father}`
            );

        }

        if (
            mother &&
            !personMap[mother]
        ) {

            console.warn(
                `⚠ ${id}: Mẹ không tồn tại: ${mother}`
            );

        }

        // spouse dạng S1/S2 phải để Cha + Mẹ trống
        if (
            isSpouseId(id) &&
            (
                father ||
                mother
            )
        ) {

            console.warn(
                `⚠ ${id}: ID dạng spouse nhưng Cha/Mẹ không trống`
            );

        }

    }
);

// ======================================
// 4. BUILD PARENTS + CHILDREN
// ======================================
//
// Giữ nguyên thứ tự PERSONS trong Excel.
// Không sort children theo ID.
//

personsRaw.forEach(
    person => {

        const childId =
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
            personMap[father]
        ) {

            addUnique(
                personMap[childId]
                    .parents,
                father
            );

            addUnique(
                personMap[father]
                    .children,
                childId
            );

        }

        if (
            mother &&
            personMap[mother]
        ) {

            addUnique(
                personMap[childId]
                    .parents,
                mother
            );

            addUnique(
                personMap[mother]
                    .children,
                childId
            );

        }

    }
);

// ======================================
// 5. BUILD MARRIAGES (OPTIONAL)
// ======================================
//
// MARRIAGES không còn bắt buộc.
// Nếu có thì vẫn đọc để tương thích dữ liệu cũ.
//

marriagesRaw.forEach(
    (marriage, index) => {

        const husband =
            clean(
                marriage.CHONG
            );

        const wife =
            clean(
                marriage.VO
            );

        const row =
            index + 2;

        if (
            !husband &&
            !wife
        ) {

            return;

        }

        if (
            husband &&
            !personMap[husband]
        ) {

            console.warn(
                `⚠ MARRIAGES dòng ${row}: CHONG không tồn tại: ${husband}`
            );

        }

        if (
            wife &&
            !personMap[wife]
        ) {

            console.warn(
                `⚠ MARRIAGES dòng ${row}: VO không tồn tại: ${wife}`
            );

        }

        if (
            personMap[husband] &&
            personMap[wife]
        ) {

            addUnique(
                personMap[husband]
                    .spouses,
                wife
            );

            addUnique(
                personMap[wife]
                    .spouses,
                husband
            );

        }

    }
);

// ======================================
// 6. AUTO BUILD SPOUSES FROM ID
// ======================================
//
// VD:
//
// TV-10.02S1
// TV-10.02S2
//
// tự động là spouse của:
//
// TV-10.02
//
// Điều kiện spouse:
// - ID kết thúc S+số
// - Cha trống
// - Mẹ trống
//

personsRaw.forEach(
    person => {

        const spouseId =
            clean(person.ID);

        if (
            !isSpouseId(
                spouseId
            )
        ) {

            return;

        }

        const father =
            clean(
                person["Cha"]
            );

        const mother =
            clean(
                person["Mẹ"]
            );

        if (
            father ||
            mother
        ) {

            return;

        }

        const baseId =
            getBasePersonId(
                spouseId
            );

        if (
            !baseId ||
            !personMap[baseId]
        ) {

            console.warn(
                `⚠ ${spouseId}: không tìm thấy người gốc ${baseId || ""}`
            );

            return;

        }

        addUnique(
            personMap[baseId]
                .spouses,
            spouseId
        );

        addUnique(
            personMap[spouseId]
                .spouses,
            baseId
        );

    }
);

// sort riêng spouse S1/S2/S3...
Object.values(
    personMap
).forEach(
    person => {

        person.spouses.sort(
            (a, b) => {

                const numberA =
                    Number(
                        clean(a)
                            .match(
                                SPOUSE_ID_REGEX
                            )?.[1]
                        || 0
                    );

                const numberB =
                    Number(
                        clean(b)
                            .match(
                                SPOUSE_ID_REGEX
                            )?.[1]
                        || 0
                    );

                return (
                    numberA -
                    numberB
                );

            }
        );

    }
);

// ======================================
// 7. BIOGRAPHY
// ======================================

tieusuRaw.forEach(
    item => {

        const id =
            clean(
                item.ID ||
                item.PersonID
            );

        if (
            id &&
            personMap[id]
        ) {

            personMap[id]
                .biography =
                item.Biography ||
                item.Tieusu ||
                item.Content ||
                "";

        }

    }
);

// ======================================
// 8. EVENTS
// ======================================

eventsRaw.forEach(
    (event, index) => {

        const personId =
            clean(
                event.PersonID ||
                event.PERSONID ||
                event.ID
            );

        if (!personId) {
            return;
        }

        if (
            !personMap[personId]
        ) {

            console.warn(
                `⚠ EVENTS dòng ${index + 2}: PersonID không tồn tại: ${personId}`
            );

            return;

        }

        personMap[personId]
            .events
            .push(event);

    }
);

// ======================================
// 9. MEDIA
// ======================================

mediaRaw.forEach(
    (media, index) => {

        const personId =
            clean(
                media.PERSONID ||
                media.PersonID
            );

        if (!personId) {
            return;
        }

        if (
            !personMap[personId]
        ) {

            console.warn(
                `⚠ MEDIA dòng ${index + 2}: PERSONID không tồn tại: ${personId}`
            );

            return;

        }

        const file =
            clean(
                media.FILE
            );

        if (file) {

            const mediaPath =
                path.join(
                    projectRoot,
                    "public",
                    file
                );

            if (
                !fs.existsSync(
                    mediaPath
                )
            ) {

                console.warn(
                    `⚠ MEDIA dòng ${index + 2}: thiếu file ${file}`
                );

            }

        }

        personMap[personId]
            .media
            .push(media);

    }
);

// ======================================
// 10. PERSON ARRAY
// ======================================

const persons =
    Object.values(
        personMap
    );

// ======================================
// 11. STATISTICS
// ======================================

const generations =
    [
        ...new Set(
            persons
                .map(
                    person =>
                        person.generation
                )
                .filter(
                    generation =>
                        generation > 0
                )
        )
    ]
        .sort(
            (a, b) =>
                a - b
        );

const living =
    persons.filter(
        person =>
            !clean(
                person["Năm mất"]
            )
    ).length;

const deceased =
    persons.length -
    living;

const spousePersons =
    persons.filter(
        person =>
            isSpouseId(
                person.ID
            ) &&
            !clean(
                person["Cha"]
            ) &&
            !clean(
                person["Mẹ"]
            )
    ).length;

const stats = {

    persons:
        persons.length,

    corePersons:
        persons.length -
        spousePersons,

    spousePersons,

    living,

    deceased,

    marriages:
        marriagesRaw.length,

    events:
        eventsRaw.length,

    media:
        mediaRaw.length,

    generations:
        generations.length,

    generationList:
        generations

};

// ======================================
// 12. OUTPUT
// ======================================

const genealogy = {

    meta: {

        version:
            VERSION,

        familyCode:
            FAMILY_CODE,

        familyName:
            familyConfig.familyName,

        branchName:
            familyConfig.branchName,

        generated:
            new Date()
                .toISOString()

    },

    stats,

    persons,

    personMap

};

const outputDir =
    path.dirname(
        outputFile
    );

fs.mkdirSync(
    outputDir,
    {
        recursive: true
    }
);

fs.writeFileSync(

    outputFile,

    JSON.stringify(
        genealogy,
        null,
        2
    ),

    "utf8"

);

// ======================================
// RESULT
// ======================================

console.log("");
console.log(
    "================================"
);
console.log(
    "✓ genealogy.json created"
);
console.log(
    `Family code  : ${FAMILY_CODE}`
);
console.log(
    `Persons      : ${persons.length}`
);
console.log(
    `Core persons : ${stats.corePersons}`
);
console.log(
    `Spouses      : ${stats.spousePersons}`
);
console.log(
    `Living       : ${living}`
);
console.log(
    `Deceased     : ${deceased}`
);
console.log(
    `Events       : ${eventsRaw.length}`
);
console.log(
    `Media        : ${mediaRaw.length}`
);
console.log(
    `Generations  : ${generations.length}`
);
console.log(
    "================================"
);
console.log("");
