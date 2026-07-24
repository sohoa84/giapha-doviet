import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelFile =
    path.join(__dirname, "../data/DATA_GIAPHA.xlsx");

const outputFile =
    path.join(__dirname, "../public/data/genealogy.json");

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

const personsRaw   = readSheet("PERSONS");
const marriagesRaw = readSheet("MARRIAGES");
const eventsRaw    = readSheet("EVENTS");
const tieusuRaw    = readSheet("TIEUSU");
const mediaRaw     = readSheet("MEDIA");


// ======================================
// Kiểm tra ID trùng
// ======================================

const idSet = new Set();

personsRaw.forEach(p => {

    if (idSet.has(p.ID)) {

        throw new Error(`Trùng ID: ${p.ID}`);

    }

    idSet.add(p.ID);

});


// ======================================
// Tạo personMap
// ======================================

const personMap = {};

personsRaw.forEach(p => {

    const generation =
        parseInt(
            String(p.ID)
                .match(/VA-(\d+)/)?.[1] || 0
        );

    personMap[p.ID] = {

        ...p,

        generation,

        children: [],

        spouses: [],

        events: [],

        media: [],

        biography: ""

    };

});


// ======================================
// Build Children
// ======================================

personsRaw.forEach(p => {

    const father = p.Father;
    const mother = p.Mother;

    if (father && personMap[father]) {

        personMap[father].children.push(p.ID);

    }

    if (
        mother &&
        personMap[mother] &&
        !personMap[mother].children.includes(p.ID)
    ) {

        personMap[mother].children.push(p.ID);

    }

});


// ======================================
// Build Marriage
// ======================================

marriagesRaw.forEach(m => {

    const husband = m.Husband;
    const wife = m.Wife;

    if (
        husband &&
        wife &&
        personMap[husband]
    ) {

        personMap[husband].spouses.push(wife);

    }

    if (
        husband &&
        wife &&
        personMap[wife]
    ) {

        personMap[wife].spouses.push(husband);

    }

});


// ======================================
// Biography
// ======================================

tieusuRaw.forEach(t => {

    if (
        t.ID &&
        personMap[t.ID]
    ) {

        personMap[t.ID].biography =
            t.Biography || t.Tieusu || "";

    }

});


// ======================================
// Events
// ======================================

eventsRaw.forEach(e => {

    if (
        e.PersonID &&
        personMap[e.PersonID]
    ) {

        personMap[e.PersonID].events.push(e);

    }

});


// ======================================
// Media
// ======================================

mediaRaw.forEach(m => {

    if (
        m.PersonID &&
        personMap[m.PersonID]
    ) {

        personMap[m.PersonID].media.push(m);

    }

});


// ======================================
// Validate Father / Mother
// ======================================

personsRaw.forEach(p => {

    if (
        p.Father &&
        !personMap[p.Father]
    ) {

        console.warn(
            `⚠ ${p.ID} có Father không tồn tại: ${p.Father}`
        );

    }

    if (
        p.Mother &&
        !personMap[p.Mother]
    ) {

        console.warn(
            `⚠ ${p.ID} có Mother không tồn tại: ${p.Mother}`
        );

    }

});


// ======================================
// Convert personMap -> persons[]
// ======================================

const persons =
    Object.values(personMap);


// ======================================
// Output
// ======================================

const genealogy = {

    generated:
        new Date().toISOString(),

    stats: {

        persons:
            persons.length,

        marriages:
            marriagesRaw.length,

        events:
            eventsRaw.length,

        media:
            mediaRaw.length

    },

    persons,

    personMap

};


// ======================================
// Save
// ======================================

fs.writeFileSync(
    outputFile,
    JSON.stringify(genealogy, null, 2),
    "utf8"
);

console.log("");
console.log("================================");
console.log("✓ genealogy.json created");
console.log(`Persons   : ${persons.length}`);
console.log(`Marriages : ${marriagesRaw.length}`);
console.log(`Events    : ${eventsRaw.length}`);
console.log(`Media     : ${mediaRaw.length}`);
console.log("================================");