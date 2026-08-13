<template>

  <div class="generation-page container-fluid py-4">

    <!-- ================================= -->
    <!-- HEADER -->
    <!-- ================================= -->

    <div class="page-header mb-4">

      <div>

        <h2 class="fw-bold mb-1">
          📊 Cây gia phả theo thế hệ
        </h2>

        <p class="text-muted mb-0">
          Thành viên họ Nguyễn Xuân được sắp xếp theo từng đời
        </p>

      </div>

    </div>


    <!-- ================================= -->
    <!-- LOADING -->
    <!-- ================================= -->

    <div
      v-if="loading"
      class="text-center py-5"
    >

      <div
        class="spinner-border"
        role="status"
      ></div>

      <div class="mt-3 text-muted">
        Đang xây dựng cây theo thế hệ...
      </div>

    </div>


    <!-- ================================= -->
    <!-- ERROR -->
    <!-- ================================= -->

    <div
      v-else-if="error"
      class="alert alert-danger"
    >

      {{ error }}

    </div>


    <!-- ================================= -->
    <!-- CONTENT -->
    <!-- ================================= -->

    <div v-else>

      <!-- ================================= -->
      <!-- TOOLBAR -->
      <!-- ================================= -->

      <div class="generation-toolbar mb-4">

        <div class="toolbar-left">

          <button
            type="button"
            class="btn"
            :class="
              showSpouses
                ? 'btn-primary'
                : 'btn-outline-secondary'
            "
            @click="
              showSpouses = !showSpouses
            "
          >

            <i
              class="bi"
              :class="
                showSpouses
                  ? 'bi-people-fill'
                  : 'bi-person-fill'
              "
            ></i>

            {{
              showSpouses
                ? 'Đang hiển thị dâu / rể'
                : 'Đang ẩn dâu / rể'
            }}

          </button>


          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="toggleAll"
          >

            <i
              class="bi"
              :class="
                allExpanded
                  ? 'bi-arrows-collapse'
                  : 'bi-arrows-expand'
              "
            ></i>

            {{
              allExpanded
                ? 'Thu gọn các đời'
                : 'Mở rộng các đời'
            }}

          </button>

        </div>


        <div class="toolbar-info">

          Tổng:

          <strong>
            {{ totalPersons }}
          </strong>

          thành viên

          ·

          <strong>
            {{ generations.length }}
          </strong>

          đời

        </div>

      </div>


      <!-- ================================= -->
      <!-- LEGEND -->
      <!-- ================================= -->

      <div class="legend mb-4">

        <div class="legend-item legend-male">
          <span class="legend-dot"></span>
          Nam
        </div>

        <div class="legend-item legend-female">
          <span class="legend-dot"></span>
          Nữ
        </div>

        <div class="legend-item legend-dau">
          <span class="legend-dot"></span>
          Dâu
        </div>

        <div class="legend-item legend-re">
          <span class="legend-dot"></span>
          Rể
        </div>

      </div>


      <!-- ================================= -->
      <!-- GENERATIONS -->
      <!-- ================================= -->

      <div class="generations">

        <section
          v-for="generation in generations"
          :key="generation"
          class="generation-section"
        >

          <!-- ================================= -->
          <!-- GENERATION HEADER -->
          <!-- ================================= -->

          <div
            class="generation-header"
            @click="
              toggleGeneration(generation)
            "
          >

            <div class="generation-title">

              <span class="generation-number">
                ĐỜI {{ generation }}
              </span>

              <span class="generation-count">

                {{
                  visiblePeopleByGeneration(
                    generation
                  ).length
                }}

                người

              </span>

            </div>


            <button
              type="button"
              class="generation-toggle"
              @click.stop="
                toggleGeneration(generation)
              "
            >

              <i
                class="bi"
                :class="
                  isExpanded(generation)
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down'
                "
              ></i>

            </button>

          </div>


          <!-- ================================= -->
          <!-- PEOPLE -->
          <!-- ================================= -->

          <div
            v-if="isExpanded(generation)"
            class="generation-people"
          >

            <div
              v-for="person in visiblePeopleByGeneration(
                generation
              )"
              :key="person.ID"
              class="person-wrapper"
              @click="
                openPerson(person.ID)
              "
            >

              <div
                class="person-card"
                :class="personCardClass(person)"
                :title="
                  personTooltip(person)
                "
              >

                <!-- PHOTO -->

                <div class="person-avatar">

                  <img
                    v-if="person.Photo"
                    :src="
                      getPhotoUrl(
                        person.Photo
                      )
                    "
                    :alt="
                      fullName(person)
                    "
                  >

                  <i
                    v-else
                    class="bi bi-person"
                  ></i>

                </div>


                <!-- INFO -->

                <div class="person-info">

                  <div class="person-name">

                    <span
                      class="gender-icon"
                    >
                      {{
                        genderIcon(person)
                      }}
                    </span>

                    {{
                      fullName(person)
                    }}

                    <span
                      v-if="
                        isDeceased(person)
                      "
                      class="deceased"
                    >
                      †
                    </span>

                  </div>


                  <!-- DÂU / RỂ -->

                  <div
                    v-if="
                      isSpouse(person)
                    "
                    class="relationship-label"
                    :class="
                      relationshipType(
                        person
                      ) === 'DÂU'
                        ? 'label-dau'
                        : 'label-re'
                    "
                  >

                    {{
                      relationshipType(
                        person
                      )
                    }}

                  </div>


                  <div class="person-meta">

                    {{ person.ID }}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue';

import {
  getFamilyOrder
} from '../services/dataService';

import {
  useRouter
} from 'vue-router';


// ======================================
// ROUTER
// ======================================

const router =
  useRouter();


// ======================================
// DATA
// ======================================

const persons =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');


// ======================================
// OPTIONS
// ======================================

const showSpouses =
  ref(true);


// ======================================
// GENERATION STATE
// ======================================

const expandedGenerations =
  ref(new Set());


// ======================================
// LOAD DATA
// ======================================

async function loadGenerationTree() {

  try {

    loading.value = true;

    error.value = '';


    const familyOrder =
      await getFamilyOrder();


    persons.value =
      familyOrder
        .map(item =>
          item.person
        );


    // ==================================
    // MỞ TẤT CẢ ĐỜI BAN ĐẦU
    // ==================================

    const generationSet =
      new Set(
        persons.value
          .map(person =>
            Number(
              person.generation
            )
          )
          .filter(Boolean)
      );


    expandedGenerations.value =
      new Set(
        generationSet
      );


  }

  catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể tải cây theo thế hệ';

  }

  finally {

    loading.value = false;

  }

}


// ======================================
// GENERATIONS
// ======================================

const generations =
  computed(() => {

    return [
      ...new Set(

        persons.value

          .map(person =>
            Number(
              person.generation
            )
          )

          .filter(Boolean)

      )

    ].sort(
      (a, b) => a - b
    );

  });


// ======================================
// TOTAL
// ======================================

const totalPersons =
  computed(() => {

    return persons.value.length;

  });


// ======================================
// ALL EXPANDED
// ======================================

const allExpanded =
  computed(() => {

    return generations.value.every(
      generation =>
        expandedGenerations.value.has(
          generation
        )
    );

  });


// ======================================
// PERSONS BY GENERATION
// ======================================

function peopleByGeneration(
  generation
) {

  return persons.value.filter(
    person =>
      Number(
        person.generation
      ) === Number(generation)
  );

}


// ======================================
// VISIBLE PEOPLE
// ======================================

function visiblePeopleByGeneration(
  generation
) {

  const people =
    peopleByGeneration(
      generation
    );


  if (showSpouses.value) {

    return people;

  }


  return people.filter(
    person =>
      !isSpouse(person)
  );

}


// ======================================
// TOGGLE GENERATION
// ======================================

function toggleGeneration(
  generation
) {

  const next =
    new Set(
      expandedGenerations.value
    );


  if (
    next.has(generation)
  ) {

    next.delete(
      generation
    );

  }

  else {

    next.add(
      generation
    );

  }


  expandedGenerations.value =
    next;

}


// ======================================
// IS EXPANDED
// ======================================

function isExpanded(
  generation
) {

  return expandedGenerations.value.has(
    generation
  );

}


// ======================================
// TOGGLE ALL
// ======================================

function toggleAll() {

  if (allExpanded.value) {

    expandedGenerations.value =
      new Set();

    return;

  }


  expandedGenerations.value =
    new Set(
      generations.value
    );

}


// ======================================
// FULL NAME
// ======================================

function fullName(
  person
) {

  if (!person) {

    return '';

  }


  return [

    person['Họ'],

    person['Tên']

  ]

    .filter(Boolean)

    .join(' ');

}


// ======================================
// GENDER ICON
// ======================================

function genderIcon(
  person
) {

  if (
    person?.['Giới tính'] === 'Nữ'
  ) {

    return '♀';

  }


  if (
    person?.['Giới tính'] === 'Nam'
  ) {

    return '♂';

  }


  return '';

}


// ======================================
// DECEASED
// ======================================

function isDeceased(
  person
) {

  return Boolean(
    person?.['Năm mất']
  );

}


// ======================================
// PHOTO
// ======================================

function getPhotoUrl(
  photo
) {

  if (!photo) {

    return '';

  }


  return `${import.meta.env.BASE_URL}${photo}`;

}


// ======================================
// XÁC ĐỊNH DÂU / RỂ
// ======================================

function isSpouse(
  person
) {

  if (!person?.ID) {

    return false;

  }


  return person.ID
    .toString()
    .includes('S');

}


// ======================================
// DÂU / RỂ
// ======================================

function relationshipType(
  person
) {

  if (
    person?.['Giới tính'] === 'Nữ'
  ) {

    return 'DÂU';

  }


  if (
    person?.['Giới tính'] === 'Nam'
  ) {

    return 'RỂ';

  }


  return '';

}


// ======================================
// PERSON CARD CLASS
// ======================================

function personCardClass(
  person
) {

  if (
    isSpouse(person)
  ) {

    if (
      person['Giới tính'] === 'Nữ'
    ) {

      return 'person-dau';

    }


    if (
      person['Giới tính'] === 'Nam'
    ) {

      return 'person-re';

    }

  }


  if (
    person['Giới tính'] === 'Nữ'
  ) {

    return 'person-female';

  }


  return 'person-male';

}


// ======================================
// TOOLTIP
// ======================================

function personTooltip(
  person
) {

  if (!person) {

    return '';

  }


  const lines = [];


  const name =
    fullName(person);


  if (name) {

    lines.push(name);

  }


  if (
    person['Tên Tự']
  ) {

    lines.push(
      `Tên tự: ${person['Tên Tự']}`
    );

  }


  if (
    isSpouse(person)
  ) {

    lines.push(
      relationshipType(person)
    );

  }


  if (
    person.ID
  ) {

    lines.push(
      `Mã: ${person.ID}`
    );

  }


  if (
    person.generation
  ) {

    lines.push(
      `Đời: ${person.generation}`
    );

  }


  return lines.join('\n');

}


// ======================================
// OPEN PERSON
// ======================================

function openPerson(
  id
) {

  if (!id) {

    return;

  }


  router.push({

    name:
      'person-detail',

    params: {

      id

    }

  });

}


// ======================================
// INIT
// ======================================

onMounted(
  loadGenerationTree
);

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.generation-page {

  width: 100%;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.page-header {

  border-bottom:
    1px solid #dee2e6;

  padding-bottom:
    15px;

}


/* ===================================== */
/* TOOLBAR */
/* ===================================== */

.generation-toolbar {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    15px;

  flex-wrap:
    wrap;

}


.toolbar-left {

  display:
    flex;

  gap:
    8px;

  flex-wrap:
    wrap;

}


.toolbar-left .btn {

  font-size:
    0.85rem;

  font-weight:
    600;

  border-radius:
    8px;

}


.toolbar-info {

  color:
    #6c757d;

  font-size:
    0.9rem;

}


/* ===================================== */
/* LEGEND */
/* ===================================== */

.legend {

  display:
    flex;

  align-items:
    center;

  gap:
    20px;

  flex-wrap:
    wrap;

  padding:
    10px 14px;

  background:
    #f8f9fa;

  border:
    1px solid #e9ecef;

  border-radius:
    8px;

}


.legend-item {

  display:
    flex;

  align-items:
    center;

  gap:
    6px;

  font-size:
    0.8rem;

  font-weight:
    600;

}


.legend-dot {

  width:
    12px;

  height:
    12px;

  border-radius:
    50%;

  display:
    inline-block;

}


.legend-male
.legend-dot {

  background:
    #9ec5fe;

}


.legend-female
.legend-dot {

  background:
    #f1aeb5;

}


.legend-dau
.legend-dot {

  background:
    #d63384;

}


.legend-re
.legend-dot {

  background:
    #7950f2;

}


/* ===================================== */
/* GENERATION */
/* ===================================== */

.generation-section {

  margin-bottom:
    22px;

  border:
    1px solid #dee2e6;

  border-radius:
    10px;

  overflow:
    hidden;

  background:
    #ffffff;

  box-shadow:
    0 2px 5px
    rgba(0, 0, 0, 0.05);

}


/* ===================================== */
/* GENERATION HEADER */
/* ===================================== */

.generation-header {

  min-height:
    52px;

  padding:
    8px 15px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  background:
    #f8f9fa;

  border-bottom:
    1px solid #dee2e6;

  cursor:
    pointer;

}


.generation-header:hover {

  background:
    #f1f3f5;

}


.generation-title {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.generation-number {

  font-size:
    0.95rem;

  font-weight:
    800;

  letter-spacing:
    0.5px;

}


.generation-count {

  padding:
    2px 8px;

  border-radius:
    12px;

  background:
    #e9ecef;

  color:
    #6c757d;

  font-size:
    0.72rem;

}


.generation-toggle {

  width:
    30px;

  height:
    30px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid #ced4da;

  border-radius:
    50%;

  background:
    #ffffff;

  color:
    #495057;

}


/* ===================================== */
/* PEOPLE */
/* ===================================== */

.generation-people {

  display:
    flex;

  flex-wrap:
    wrap;

  align-items:
    flex-start;

  gap:
    10px;

  padding:
    14px;

}


/* ===================================== */
/* PERSON */
/* ===================================== */

.person-wrapper {

  cursor:
    pointer;

  transition:
    transform 0.15s ease;

}


.person-wrapper:hover {

  transform:
    translateY(-3px);

}


/* ===================================== */
/* CARD */
/* ===================================== */

.person-card {

  width:
    175px;

  min-height:
    65px;

  padding:
    7px 9px;

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  border:
    2px solid #ced4da;

  border-radius:
    9px;

  box-shadow:
    0 2px 5px
    rgba(0, 0, 0, 0.07);

  background:
    #ffffff;

  transition:
    box-shadow 0.15s ease;

}


.person-wrapper:hover
.person-card {

  box-shadow:
    0 5px 12px
    rgba(0, 0, 0, 0.13);

}


/* ===================================== */
/* NAM */
/* ===================================== */

.person-male {

  background:
    #f4f8ff;

  border-color:
    #9ec5fe;

}


/* ===================================== */
/* NỮ */
/* ===================================== */

.person-female {

  background:
    #fff6f7;

  border-color:
    #f1aeb5;

}


/* ===================================== */
/* DÂU */
/* ===================================== */

.person-dau {

  background:
    #fff0f6;

  border-color:
    #d63384;

  border-style:
    dashed;

}


/* ===================================== */
/* RỂ */
/* ===================================== */

.person-re {

  background:
    #f3f0ff;

  border-color:
    #7950f2;

  border-style:
    dashed;

}


/* ===================================== */
/* AVATAR */
/* ===================================== */

.person-avatar {

  width:
    38px;

  height:
    38px;

  min-width:
    38px;

  overflow:
    hidden;

  border-radius:
    50%;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    #e9ecef;

  color:
    #6c757d;

  font-size:
    1.1rem;

}


.person-avatar img {

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

}


/* ===================================== */
/* AVATAR NAM */
/* ===================================== */

.person-male
.person-avatar {

  background:
    #dbeafe;

  color:
    #2563eb;

}


/* ===================================== */
/* AVATAR NỮ */
/* ===================================== */

.person-female
.person-avatar {

  background:
    #ffe0e6;

  color:
    #d6336c;

}


/* ===================================== */
/* AVATAR DÂU */
/* ===================================== */

.person-dau
.person-avatar {

  background:
    #ffd6e7;

  color:
    #d63384;

}


/* ===================================== */
/* AVATAR RỂ */
/* ===================================== */

.person-re
.person-avatar {

  background:
    #e5dbff;

  color:
    #6741d9;

}


/* ===================================== */
/* INFO */
/* ===================================== */

.person-info {

  min-width:
    0;

}


/* ===================================== */
/* NAME */
/* ===================================== */

.person-name {

  font-size:
    0.78rem;

  font-weight:
    700;

  line-height:
    1.2;

  max-width:
    115px;

  white-space:
    nowrap;

  overflow:
    hidden;

  text-overflow:
    ellipsis;

}


.person-dau
.person-name,
.person-re
.person-name {

  font-style:
    italic;

  font-weight:
    600;

}


/* ===================================== */
/* GENDER */
/* ===================================== */

.gender-icon {

  margin-right:
    2px;

  font-size:
    0.8rem;

}


/* ===================================== */
/* META */
/* ===================================== */

.person-meta {

  margin-top:
    3px;

  color:
    #6c757d;

  font-size:
    0.62rem;

  white-space:
    nowrap;

}


/* ===================================== */
/* DECEASED */
/* ===================================== */

.deceased {

  margin-left:
    2px;

  color:
    #495057;

  font-weight:
    700;

}


/* ===================================== */
/* RELATIONSHIP LABEL */
/* ===================================== */

.relationship-label {

  display:
    inline-block;

  margin-top:
    2px;

  padding:
    1px 5px;

  border-radius:
    8px;

  font-size:
    0.54rem;

  font-weight:
    800;

  letter-spacing:
    0.3px;

}


.label-dau {

  color:
    #a61e4d;

  background:
    #ffd6e7;

}


.label-re {

  color:
    #5f3dc4;

  background:
    #e5dbff;

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (
  max-width: 768px
) {

  .generation-toolbar {

    align-items:
      flex-start;

  }


  .toolbar-info {

    width:
      100%;

  }


  .generation-people {

    gap:
      8px;

    padding:
      10px;

  }


  .person-card {

    width:
      160px;

  }

}


@media (
  max-width: 480px
) {

  .person-card {

    width:
      100%;

  }

}

</style>