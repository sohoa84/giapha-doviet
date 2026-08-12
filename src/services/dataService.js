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

    return person.parents
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

    return person.children
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

    return person.spouses
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