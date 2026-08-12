// ======================================
// Gia Phả - Data Service
// ======================================

let genealogyData = null;

// ======================================
// LOAD DATA
// ======================================

export async function loadGenealogy() {

    if (genealogyData) {
        return genealogyData;
    }

    const response = await fetch(
        `${import.meta.env.BASE_URL}data/genealogy.json`
    );

    if (!response.ok) {
        throw new Error(
            `Không thể tải genealogy.json: ${response.status}`
        );
    }

    genealogyData =
        await response.json();

    return genealogyData;
}

// ======================================
// GET PERSON
// ======================================

export async function getPerson(id) {

    const data =
        await loadGenealogy();

    return data.personMap[id] || null;
}

// ======================================
// GET ALL PERSONS
// ======================================

export async function getPersons() {

    const data =
        await loadGenealogy();

    return data.persons || [];
}

// ======================================
// GET PARENTS
// ======================================

export async function getParents(id) {

    const person =
        await getPerson(id);

    if (!person) {
        return [];
    }

    return (person.parents || [])
        .map(parentId =>
            dataPerson(parentId)
        )
        .filter(Boolean);
}

// ======================================
// GET CHILDREN
// ======================================

export async function getChildren(id) {

    const person =
        await getPerson(id);

    if (!person) {
        return [];
    }

    return (person.children || [])
        .map(childId =>
            dataPerson(childId)
        )
        .filter(Boolean);
}

// ======================================
// GET SPOUSES
// ======================================

export async function getSpouses(id) {

    const person =
        await getPerson(id);

    if (!person) {
        return [];
    }

    return (person.spouses || [])
        .map(spouseId =>
            dataPerson(spouseId)
        )
        .filter(Boolean);
}

// ======================================
// INTERNAL PERSON LOOKUP
// ======================================

function dataPerson(id) {

    if (!genealogyData) {
        return null;
    }

    return genealogyData
        .personMap[id] || null;
}

// ======================================
// GET GENERATION
// ======================================

export async function getGeneration(
    generation
) {

    const persons =
        await getPersons();

    return persons.filter(
        person =>
            Number(person.generation) ===
            Number(generation)
    );
}

// ======================================
// GET STATISTICS
// ======================================

export async function getStats() {

    const data =
        await loadGenealogy();

    return data.stats;
}

// ======================================
// SEARCH PERSON
// ======================================

export async function searchPersons(
    keyword
) {

    const persons =
        await getPersons();

    const search =
        String(keyword || "")
            .trim()
            .toLowerCase();

    if (!search) {
        return persons;
    }

    return persons.filter(person => {

        const text = [

            person.ID,
            person["Họ"],
            person["Tên"],
            person["Tên Tự"]

        ]
            .join(" ")
            .toLowerCase();

        return text.includes(search);

    });
}

// ======================================
// BUILD FAMILY ORDER
// ======================================
//
// Nguyên tắc:
//
// 1. Không sort theo ID
// 2. Không dùng SortOrder
// 3. Không dùng số .xx trong ID
// 4. Thứ tự anh/chị/em lấy từ children[]
// 5. children[] đã được tạo theo thứ tự Excel
// 6. Duyệt đệ quy từ cha/mẹ xuống con
//
// Kết quả:
// [
//   {
//      person: ...,
//      depth: 0
//   },
//   {
//      person: ...,
//      depth: 1
//   },
//   ...
// ]
//

export async function getFamilyOrder() {

    const data =
        await loadGenealogy();

    const persons =
        data.persons || [];

    const personMap =
        data.personMap || {};

    const result = [];

    const visited =
        new Set();

    // ==================================
    // TÌM ROOT
    // ==================================

    const roots =
        persons.filter(person => {

            const father =
                person.Father;

            const mother =
                person.Mother;

            const hasFather =
                father &&
                personMap[father];

            const hasMother =
                mother &&
                personMap[mother];

            return !hasFather &&
                   !hasMother;

        });

    // ==================================
    // DUYỆT CÂY
    // ==================================

    function visit(
        person,
        depth
    ) {

        if (!person) {
            return;
        }

        if (
            visited.has(person.ID)
        ) {
            return;
        }

        visited.add(person.ID);

        // --------------------------------
        // Lưu người + depth
        // --------------------------------

        result.push({

            person,

            depth

        });

        // --------------------------------
        // Duyệt con
        // --------------------------------
        //
        // QUAN TRỌNG:
        //
        // Không sort children.
        //
        // Giữ nguyên thứ tự từ Excel.
        //

        const children =
            person.children || [];

        children.forEach(
            childId => {

                const child =
                    personMap[childId];

                if (child) {

                    visit(
                        child,
                        depth + 1
                    );

                }

            }
        );

    }

    // ==================================
    // BẮT ĐẦU TỪ ROOT
    // ==================================

    roots.forEach(
        root => {

            visit(
                root,
                0
            );

        }
    );

    // ==================================
    // BỔ SUNG NGƯỜI CHƯA DUYỆT
    // ==================================

    persons.forEach(
        person => {

            if (
                !visited.has(
                    person.ID
                )
            ) {

                visit(
                    person,
                    0
                );

            }

        }
    );

    return result;
}