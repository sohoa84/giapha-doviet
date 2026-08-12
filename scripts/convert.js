import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ======================================
// VERSION
// ======================================

const VERSION = "3.1.1";

// ======================================
// PATH
// ======================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelFile = path.join(
    __dirname,
    "../data/DATA_GIAPHA.xlsx"
);

const outputFile = path.join(
    __dirname,
    "../public/data/genealogy.json"
);

// ======================================
// READ EXCEL
// ======================================

const workbook = XLSX.readFile(excelFile);

function readSheet(name) {

    const sheet = workbook.Sheets[name];

    if (!sheet) {
        console.warn(`⚠ Sheet ${name} không tồn tại`);
        return [];
    }

    return XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false
    });
}

// ======================================
// LOAD DATA
// ======================================

const personsRaw = readSheet("PERSONS");
const marriagesRaw = readSheet("MARRIAGES");
const eventsRaw = readSheet("EVENTS");
const tieusuRaw = readSheet("TIEUSU");
const mediaRaw = readSheet("MEDIA");

// ======================================
// HELPER
// ======================================

function clean(value) {
    return String(value ?? "").trim();
}

function numberOrZero(value) {
    const number = Number.parseInt(value, 10);
    return Number.isFinite(number) ? number : 0;
}

function birthYear(person) {
    return numberOrZero(person["Năm sinh"]);
}

// ======================================
// VALIDATION
// ======================================

console.log("");
console.log(`Gia phả Converter v${VERSION}`);
console.log("--------------------------------");
console.log("Kiểm tra dữ liệu...");
console.log("");

// ======================================
// 1. VALIDATE PERSON IDs
// ======================================

const idSet = new Set();

personsRaw.forEach((person, index) => {

    const id = clean(person.ID);

    if (!id) {
        throw new Error(
            `PERSONS dòng ${index + 2}: thiếu ID`
        );
    }

    if (idSet.has(id)) {
        throw new Error(
            `Trùng ID trong PERSONS: ${id}`
        );
    }

    idSet.add(id);
});

// ======================================
// 2. BUILD PERSON MAP
// ======================================

const personMap = {};

personsRaw.forEach(person => {

    const id = clean(person.ID);

    // Lấy Đời trực tiếp từ Excel
    const generation =
        numberOrZero(person["Đời"]);

    personMap[id] = {

        ...person,

        generation,

        parents: [],

        children: [],

        spouses: [],

        events: [],

        media: [],

        biography: ""

    };

});

// ======================================
// 3. VALIDATE FATHER / MOTHER
// ======================================

personsRaw.forEach(person => {

    const id = clean(person.ID);

    const father = clean(person["Cha"]);
    const mother = clean(person["Mẹ"]);

    // ----------------------------------
    // Father
    // ----------------------------------

    if (
        father &&
        !personMap[father]
    ) {

        console.warn(
            `⚠ ${id} có Cha không tồn tại: ${father}`
        );

    }

    // ----------------------------------
    // Mother
    // ----------------------------------

    if (
        mother &&
        !personMap[mother]
    ) {

        console.warn(
            `⚠ ${id} có Mẹ không tồn tại: ${mother}`
        );

    }

});

// ======================================
// 4. BUILD PARENTS + CHILDREN
// ======================================

personsRaw.forEach(person => {

    const childId =
        clean(person.ID);

    const father =
        clean(person["Cha"]);

    const mother =
        clean(person["Mẹ"]);

    // ----------------------------------
    // Father
    // ----------------------------------

    if (
        father &&
        personMap[father]
    ) {

        personMap[childId]
            .parents
            .push(father);

        personMap[father]
            .children
            .push(childId);

    }

    // ----------------------------------
    // Mother
    // ----------------------------------

    if (
        mother &&
        personMap[mother]
    ) {

        if (
            !personMap[childId]
                .parents
                .includes(mother)
        ) {

            personMap[childId]
                .parents
                .push(mother);

        }

        if (
            !personMap[mother]
                .children
                .includes(childId)
        ) {

            personMap[mother]
                .children
                .push(childId);

        }

    }

});

// ======================================
// 5. REMOVE DUPLICATE CHILDREN
// ======================================

Object.values(personMap).forEach(person => {

    person.children =
        [...new Set(person.children)];

});

// ======================================
// 6. SORT CHILDREN
// ======================================
//
// Hiện tại Excel chưa có ChildNo.
//
// Vì vậy:
//   1. Năm sinh
//   2. STT trong Excel
//
// được dùng để sắp xếp.
//
// Không dùng số .xx trong mã VA để
// quyết định thứ tự anh/chị/em.
//

Object.values(personMap).forEach(person => {

    person.children.sort((idA, idB) => {

        const childA =
            personMap[idA];

        const childB =
            personMap[idB];

        const yearA =
            birthYear(childA);

        const yearB =
            birthYear(childB);

        // Có năm sinh và khác nhau
        if (
            yearA > 0 &&
            yearB > 0 &&
            yearA !== yearB
        ) {

            return yearA - yearB;

        }

        // Có năm sinh, người kia không có
        if (
            yearA > 0 &&
            yearB === 0
        ) {

            return -1;

        }

        if (
            yearA === 0 &&
            yearB > 0
        ) {

            return 1;

        }

        // Cuối cùng dùng STT Excel
        const sttA =
            numberOrZero(
                childA.STT
            );

        const sttB =
            numberOrZero(
                childB.STT
            );

        return sttA - sttB;

    });

});

// ======================================
// 7. BUILD MARRIAGES
// ======================================

marriagesRaw.forEach((marriage, index) => {

    const husband =
        clean(marriage.CHONG);

    const wife =
        clean(marriage.VO);

    const row =
        index + 2;

    // ----------------------------------
    // Empty row
    // ----------------------------------

    if (
        !husband &&
        !wife
    ) {

        console.warn(
            `⚠ MARRIAGES dòng ${row}: thiếu CHONG và VO`
        );

        return;

    }

    // ----------------------------------
    // Validate husband
    // ----------------------------------

    if (
        husband &&
        !personMap[husband]
    ) {

        console.warn(
            `⚠ MARRIAGES dòng ${row}: CHONG không tồn tại: ${husband}`
        );

    }

    // ----------------------------------
    // Validate wife
    // ----------------------------------

    if (
        wife &&
        !personMap[wife]
    ) {

        console.warn(
            `⚠ MARRIAGES dòng ${row}: VO không tồn tại: ${wife}`
        );

    }

    // ----------------------------------
    // Husband → Wife
    // ----------------------------------

    if (
        personMap[husband] &&
        wife &&
        personMap[wife]
    ) {

        if (
            !personMap[husband]
                .spouses
                .includes(wife)
        ) {

            personMap[husband]
                .spouses
                .push(wife);

        }

    }

    // ----------------------------------
    // Wife → Husband
    // ----------------------------------

    if (
        personMap[wife] &&
        husband &&
        personMap[husband]
    ) {

        if (
            !personMap[wife]
                .spouses
                .includes(husband)
        ) {

            personMap[wife]
                .spouses
                .push(husband);

        }

    }

});

// ======================================
// 8. BIOGRAPHY
// ======================================

tieusuRaw.forEach(item => {

    const id =
        clean(
            item.ID ||
            item.PersonID
        );

    if (
        id &&
        personMap[id]
    ) {

        personMap[id].biography =
            item.Biography ||
            item.Tieusu ||
            item.Content ||
            "";

    }

});

// ======================================
// 9. EVENTS
// ======================================

eventsRaw.forEach(event => {

    const personId =
        clean(
            event.PersonID ||
            event.ID
        );

    if (
        personId &&
        personMap[personId]
    ) {

        personMap[personId]
            .events
            .push(event);

    }

});

// ======================================
// 10. MEDIA
// ======================================

mediaRaw.forEach(media => {

    const personId =
        clean(
            media.PersonID ||
            media.ID
        );

    if (
        personId &&
        personMap[personId]
    ) {

        personMap[personId]
            .media
            .push(media);

    }

});

// ======================================
// 11. PERSON ARRAY
// ======================================

const persons =
    Object.values(personMap);

// ======================================
// 12. GENERATIONS
// ======================================

const generations =
    [
        ...new Set(
            persons
                .map(person =>
                    person.generation
                )
                .filter(
                    generation =>
                        generation > 0
                )
        )
    ]
    .sort(
        (a, b) => a - b
    );

// ======================================
// 13. LIVING / DECEASED
// ======================================

const living =
    persons.filter(person => {

        return !clean(
            person["Năm mất"]
        );

    }).length;

const deceased =
    persons.length - living;

// ======================================
// 14. STATISTICS
// ======================================

const stats = {

    persons:
        persons.length,

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
// 15. GENEALOGY OBJECT
// ======================================

const genealogy = {

    meta: {

        version:
            VERSION,

        generated:
            new Date().toISOString()

    },

    stats,

    persons,

    personMap

};

// ======================================
// 16. CREATE OUTPUT DIRECTORY
// ======================================

const outputDir =
    path.dirname(outputFile);

if (
    !fs.existsSync(outputDir)
) {

    fs.mkdirSync(
        outputDir,
        {
            recursive: true
        }
    );

}

// ======================================
// 17. WRITE JSON
// ======================================

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
console.log("================================");
console.log("✓ genealogy.json created");
console.log(`Version     : ${VERSION}`);
console.log(`Persons     : ${persons.length}`);
console.log(`Living      : ${living}`);
console.log(`Deceased    : ${deceased}`);
console.log(`Marriages   : ${marriagesRaw.length}`);
console.log(`Events      : ${eventsRaw.length}`);
console.log(`Media       : ${mediaRaw.length}`);
console.log(`Generations : ${generations.length}`);
console.log("================================");
console.log("");