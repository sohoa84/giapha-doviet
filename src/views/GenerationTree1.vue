<template>

  <div class="generation-page container-fluid py-4">

    <!-- ====================================== -->
    <!-- HEADER -->
    <!-- ====================================== -->

    <div class="page-header mb-4">

      <h2 class="fw-bold mb-1">
        🌳 Cây gia phả theo thế hệ
      </h2>

      <p class="text-muted mb-0">
        Thành viên được sắp xếp theo đúng thứ tự vai vế trong họ
      </p>

    </div>


    <!-- ====================================== -->
    <!-- LOADING -->
    <!-- ====================================== -->

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


    <!-- ====================================== -->
    <!-- ERROR -->
    <!-- ====================================== -->

    <div
      v-else-if="error"
      class="alert alert-danger"
    >

      {{ error }}

    </div>


    <!-- ====================================== -->
    <!-- CONTENT -->
    <!-- ====================================== -->

    <div v-else>

      <!-- ====================================== -->
      <!-- TOOLBAR -->
      <!-- ====================================== -->

      <div class="generation-toolbar mb-3">

        <div class="toolbar-left">

          <!-- HIỆN / ẨN DÂU RỂ -->

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
                ? 'Ẩn dâu / rể'
                : 'Hiện dâu / rể'
            }}

          </button>


          <!-- THU / MỞ TẤT CẢ -->

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


        <!-- THỐNG KÊ -->

        <div class="toolbar-info">

          Có

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


      <!-- ====================================== -->
      <!-- CHÚ THÍCH -->
      <!-- ====================================== -->

      <div class="legend mb-4">

        <div class="legend-item">

          <span
            class="legend-dot dot-male"
          ></span>

          Nam

        </div>


        <div class="legend-item">

          <span
            class="legend-dot dot-female"
          ></span>

          Nữ

        </div>


        <div
          v-if="showSpouses"
          class="legend-item"
        >

          <span
            class="legend-dot dot-dau"
          ></span>

          Dâu

        </div>


        <div
          v-if="showSpouses"
          class="legend-item"
        >

          <span
            class="legend-dot dot-re"
          ></span>

          Rể

        </div>

      </div>


      <!-- ====================================== -->
      <!-- CÁC ĐỜI -->
      <!-- ====================================== -->

      <div class="generations">

        <section
          v-for="generation in generations"
          :key="generation"
          class="generation-section"
        >

          <!-- ================================== -->
          <!-- HEADER ĐỜI -->
          <!-- ================================== -->

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

                {{ peopleByGeneration(generation).length }}

                thành viên

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


          <!-- ================================== -->
          <!-- PEOPLE -->
          <!-- ================================== -->

          <div
            v-if="
              isExpanded(generation)
            "
            class="generation-people"
          >

            <!-- ================================= -->
            <!-- FAMILY BLOCK -->
            <!-- ================================= -->

            <div
              v-for="
                family in familyBlocksByGeneration(
                  generation
                )"
              :key="family.person.ID"
              class="family-block"
            >

              <!-- ================================= -->
              <!-- NGƯỜI TRONG HỌ -->
              <!-- ================================= -->

              <div
                class="person-wrapper"
                @click="
                  openPerson(
                    family.person.ID
                  )
                "
              >

                <div
                  class="person-card"
                  :class="
                    personCardClass(
                      family.person
                    )
                  "
                  :title="
                    personTooltip(
                      family.person
                    )
                  "
                >

                  <!-- PHOTO -->

                  <div class="person-avatar">

                    <img
                      v-if="
                        family.person.Photo
                      "
                      :src="
                        getPhotoUrl(
                          family.person.Photo
                        )
                      "
                      :alt="
                        fullName(
                          family.person
                        )
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
                          genderIcon(
                            family.person
                          )
                        }}
                      </span>

                      {{
                        fullName(
                          family.person
                        )
                      }}

                      <span
                        v-if="
                          isDeceased(
                            family.person
                          )
                        "
                        class="deceased"
                      >
                        †
                      </span>

                    </div>


                    <div class="person-meta">

                      {{ family.person.ID }}

                    </div>

                  </div>

                </div>

              </div>


              <!-- ================================= -->
              <!-- VỢ / CHỒNG -->
              <!-- ================================= -->

              <template
                v-if="
                  showSpouses &&
                  family.spouses.length
                "
              >

                <div class="marriage-line">

                  <span>♥</span>

                </div>


                <div class="spouses">

                  <div
                    v-for="
                      spouse in family.spouses
                    "
                    :key="spouse.ID"
                    class="person-wrapper spouse-wrapper"
                    @click="
                      openPerson(
                        spouse.ID
                      )
                    "
                  >

                    <div
                      class="person-card"
                      :class="
                        personCardClass(
                          spouse
                        )
                      "
                      :title="
                        personTooltip(
                          spouse
                        )
                      "
                    >

                      <!-- PHOTO -->

                      <div
                        class="person-avatar"
                      >

                        <img
                          v-if="
                            spouse.Photo
                          "
                          :src="
                            getPhotoUrl(
                              spouse.Photo
                            )
                          "
                          :alt="
                            fullName(
                              spouse
                            )
                          "
                        >

                        <i
                          v-else
                          class="bi bi-person"
                        ></i>

                      </div>


                      <!-- INFO -->

                      <div
                        class="person-info"
                      >

                        <div
                          class="person-name"
                        >

                          <span
                            class="gender-icon"
                          >
                            {{
                              genderIcon(
                                spouse
                              )
                            }}
                          </span>

                          {{
                            fullName(
                              spouse
                            )
                          }}

                          <span
                            v-if="
                              isDeceased(
                                spouse
                              )
                            "
                            class="deceased"
                          >
                            †
                          </span>

                        </div>


                        <!-- DÂU / RỂ -->

                        <div
                          class="relationship-label"
                          :class="
                            relationshipType(
                              spouse
                            ) === 'DÂU'
                              ? 'label-dau'
                              : 'label-re'
                          "
                        >

                          {{
                            relationshipType(
                              spouse
                            )
                          }}

                        </div>


                        <div
                          class="person-meta"
                        >

                          {{ spouse.ID }}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </template>

            </div>


            <!-- ================================= -->
            <!-- EMPTY -->
            <!-- ================================= -->

            <div
              v-if="
                !familyBlocksByGeneration(
                  generation
                ).length
              "
              class="empty-generation"
            >

              Không có thành viên.

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
  useRouter
} from 'vue-router';

import {
  getFamilyOrder
} from '../services/dataService';


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
// UI STATE
// ======================================

const showSpouses =
  ref(true);

const expandedGenerations =
  ref(new Set());


// ======================================
// LOAD DATA
// ======================================

async function loadGenerationTree() {

  try {

    loading.value = true;

    error.value = '';


    const result =
      await getFamilyOrder();


    /*
     * getFamilyOrder() trả:
     *
     * [
     *   {
     *     person: {...},
     *     depth: 0
     *   }
     * ]
     */

    persons.value =
      (result || [])

        .map(
          item =>
            item?.person
        )

        .filter(Boolean);


    console.log(
      'GenerationTree persons:',
      persons.value
    );

    console.log(
      'GenerationTree total:',
      persons.value.length
    );

  }

  catch (err) {

    console.error(
      'GenerationTree error:',
      err
    );

    error.value =
      err.message ||
      'Không thể tải cây gia phả';

  }

  finally {

    loading.value = false;

  }

}


// ======================================
// XÁC ĐỊNH DÂU / RỂ
// ======================================

function isSpouse(person) {

  if (!person?.ID) {

    return false;

  }


  /*
   * Quy tắc dữ liệu:
   *
   * VA-10.02
   * VA-10.02S1
   * VA-10.02S2
   *
   * Đồng thời Cha / Mẹ phải trống.
   */

  const id =
    String(
      person.ID
    );


  const hasSpouseSuffix =
    /S\d+$/.test(
      id
    );


  const noFather =
    !person['Cha'] &&
    !person.Father;


  const noMother =
    !person['Mẹ'] &&
    !person.Mother;


  return (
    hasSpouseSuffix &&
    noFather &&
    noMother
  );

}


// ======================================
// LẤY ID NGƯỜI GỐC
// ======================================

function getBasePersonId(
  spouseId
) {

  if (!spouseId) {

    return null;

  }


  const match =
    String(
      spouseId
    ).match(
      /^(.+)S\d+$/
    );


  if (!match) {

    return null;

  }


  return match[1];

}


// ======================================
// LẤY SỐ DÂU / RỂ
// ======================================

function getSpouseNumber(
  spouseId
) {

  if (!spouseId) {

    return null;

  }


  const match =
    String(
      spouseId
    ).match(
      /S(\d+)$/
    );


  if (!match) {

    return null;

  }


  return Number(
    match[1]
  );

}


// ======================================
// TÌM NGƯỜI THEO ID
// ======================================

function findPerson(
  id
) {

  if (!id) {

    return null;

  }


  return persons.value.find(
    person =>
      person.ID === id
  ) || null;

}


// ======================================
// LẤY DÂU / RỂ CỦA NGƯỜI GỐC
// ======================================

function getSpousesForPerson(
  person
) {

  if (!person?.ID) {

    return [];

  }


  const baseId =
    String(
      person.ID
    );


  /*
   * KHÔNG dùng person.spouses.
   *
   * Tìm trực tiếp trong persons
   * theo ID:
   *
   * VA-10.02S1
   * VA-10.02S2
   * ...
   */

  return persons.value

    .filter(
      candidate => {

        if (
          !isSpouse(
            candidate
          )
        ) {

          return false;

        }


        return (
          getBasePersonId(
            candidate.ID
          ) === baseId
        );

      }
    )

    .sort(
      (a, b) => {

        return (
          getSpouseNumber(
            a.ID
          ) || 0
        ) -
        (
          getSpouseNumber(
            b.ID
          ) || 0
        );

      }
    );

}


// ======================================
// THÀNH VIÊN CHÍNH
// ======================================

const corePersons =
  computed(() => {

    /*
     * Chỉ người KHÔNG phải dâu/rể.
     */

    return persons.value.filter(
      person =>
        !isSpouse(
          person
        )
    );

  });


// ======================================
// SỐ THÀNH VIÊN
// ======================================

const totalPersons =
  computed(() =>
    corePersons.value.length
  );


// ======================================
// LẤY ĐỜI
// ======================================

function getGeneration(
  person
) {

  if (!person) {

    return null;

  }


  /*
   * Ưu tiên generation
   * vì dataService đã tính sẵn.
   */

  if (
    person.generation !== undefined &&
    person.generation !== null &&
    person.generation !== ''
  ) {

    const value =
      Number(
        person.generation
      );


    if (
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  /*
   * Fallback sang trường Đời.
   */

  if (
    person['Đời'] !== undefined &&
    person['Đời'] !== null &&
    person['Đời'] !== ''
  ) {

    const value =
      Number(
        person['Đời']
      );


    if (
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  return null;

}


// ======================================
// DANH SÁCH ĐỜI
// ======================================

const generations =
  computed(() => {

    const values =
      corePersons.value

        .map(
          person =>
            getGeneration(
              person
            )
        )

        .filter(
          value =>
            value !== null
        );


    return [
      ...new Set(
        values
      )
    ].sort(
      (a, b) =>
        a - b
    );

  });


// ======================================
// NGƯỜI TRONG TỪNG ĐỜI
// ======================================

function peopleByGeneration(
  generation
) {

  /*
   * CỰC KỲ QUAN TRỌNG:
   *
   * Không sort lại.
   *
   * Giữ nguyên thứ tự
   * từ getFamilyOrder().
   */

  return corePersons.value.filter(
    person =>
      getGeneration(
        person
      ) === Number(
        generation
      )
  );

}


// ======================================
// FAMILY BLOCKS
// ======================================

function familyBlocksByGeneration(
  generation
) {

  return peopleByGeneration(
    generation
  ).map(
    person => ({

      person,

      spouses:
        getSpousesForPerson(
          person
        )

    })
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
// PHOTO URL
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
// GIỚI TÍNH
// ======================================

function genderIcon(
  person
) {

  if (
    person?.['Giới tính'] ===
    'Nam'
  ) {

    return '♂';

  }


  if (
    person?.['Giới tính'] ===
    'Nữ'
  ) {

    return '♀';

  }


  return '';

}


// ======================================
// ĐÃ MẤT
// ======================================

function isDeceased(
  person
) {

  return Boolean(
    person?.['Năm mất']
  );

}


// ======================================
// DÂU / RỂ
// ======================================

function relationshipType(
  person
) {

  if (
    !isSpouse(
      person
    )
  ) {

    return '';

  }


  if (
    person['Giới tính'] ===
    'Nữ'
  ) {

    return 'DÂU';

  }


  if (
    person['Giới tính'] ===
    'Nam'
  ) {

    return 'RỂ';

  }


  return '';

}


// ======================================
// CSS CLASS CARD
// ======================================

function personCardClass(
  person
) {

  if (
    isSpouse(
      person
    )
  ) {

    if (
      person['Giới tính'] ===
      'Nữ'
    ) {

      return 'card-dau';

    }


    if (
      person['Giới tính'] ===
      'Nam'
    ) {

      return 'card-re';

    }

  }


  if (
    person['Giới tính'] ===
    'Nam'
  ) {

    return 'card-male';

  }


  if (
    person['Giới tính'] ===
    'Nữ'
  ) {

    return 'card-female';

  }


  return 'card-unknown';

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


  const name =
    fullName(
      person
    );


  const tenTu =
    person['Tên Tự']
      ? `\nTên tự: ${person['Tên Tự']}`
      : '';


  const gender =
    person['Giới tính']
      ? `\nGiới tính: ${person['Giới tính']}`
      : '';


  const birth =
    person['Năm sinh']
      ? `\nSinh: ${person['Năm sinh']}`
      : '';


  const death =
    person['Năm mất']
      ? `\nMất: ${person['Năm mất']}`
      : '';


  const relation =
    isSpouse(person)
      ? `\n${relationshipType(person)}`
      : '';


  return (
    `${name}` +
    `${tenTu}` +
    `${gender}` +
    `${birth}` +
    `${death}` +
    `${relation}`
  );

}


// ======================================
// EXPAND / COLLAPSE
// ======================================

function isExpanded(
  generation
) {

  return expandedGenerations.value.has(
    generation
  );

}


function toggleGeneration(
  generation
) {

  const next =
    new Set(
      expandedGenerations.value
    );


  if (
    next.has(
      generation
    )
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
// ALL EXPANDED
// ======================================

const allExpanded =
  computed(() => {

    if (
      !generations.value.length
    ) {

      return false;

    }


    return generations.value.every(
      generation =>
        expandedGenerations.value.has(
          generation
        )
    );

  });


// ======================================
// TOGGLE ALL
// ======================================

function toggleAll() {

  if (
    allExpanded.value
  ) {

    expandedGenerations.value =
      new Set();

  }
  else {

    expandedGenerations.value =
      new Set(
        generations.value
      );

  }

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
  async () => {

    await loadGenerationTree();


    /*
     * Mở tất cả các đời
     * sau khi dữ liệu load xong.
     */

    expandedGenerations.value =
      new Set(
        generations.value
      );


    console.log(
      'GenerationTree total:',
      totalPersons.value
    );

    console.log(
      'GenerationTree generations:',
      generations.value
    );

  }
);

</script>


<style scoped>

/* ====================================== */
/* PAGE */
/* ====================================== */

.generation-page {

  width: 100%;

}


/* ====================================== */
/* HEADER */
/* ====================================== */

.page-header {

  padding-bottom: 15px;

  border-bottom:
    1px solid #dee2e6;

}


/* ====================================== */
/* TOOLBAR */
/* ====================================== */

.generation-toolbar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 12px;

}


.toolbar-left {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

}


.toolbar-left .btn {

  font-size: 0.85rem;

  font-weight: 600;

  border-radius: 8px;

}


.toolbar-info {

  color: #6c757d;

  font-size: 0.9rem;

}


/* ====================================== */
/* LEGEND */
/* ====================================== */

.legend {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 20px;

  padding: 10px 14px;

  border: 1px solid #e9ecef;

  border-radius: 8px;

  background: #f8f9fa;

}


.legend-item {

  display: flex;

  align-items: center;

  gap: 6px;

  font-size: 0.8rem;

  font-weight: 600;

}


.legend-dot {

  width: 12px;

  height: 12px;

  flex: 0 0 12px;

  border-radius: 50%;

}


.dot-male {

  background: #9ec5fe;

}


.dot-female {

  background: #f1aeb5;

}


.dot-dau {

  background: #d63384;

}


.dot-re {

  background: #7950f2;

}


/* ====================================== */
/* GENERATION */
/* ====================================== */

.generation-section {

  margin-bottom: 18px;

  overflow: hidden;

  border:
    1px solid #dee2e6;

  border-radius: 10px;

  background: #fff;

  box-shadow:
    0 2px 6px
    rgba(0, 0, 0, 0.04);

}


/* ====================================== */
/* HEADER ĐỜI */
/* ====================================== */

.generation-header {

  min-height: 54px;

  padding: 8px 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  cursor: pointer;

  background: #f8f9fa;

  border-bottom:
    1px solid #dee2e6;

}


.generation-header:hover {

  background: #f1f3f5;

}


.generation-title {

  display: flex;

  align-items: center;

  gap: 10px;

}


.generation-number {

  font-size: 0.95rem;

  font-weight: 800;

  letter-spacing: 0.5px;

}


.generation-count {

  padding: 3px 9px;

  border-radius: 20px;

  background: #e9ecef;

  color: #6c757d;

  font-size: 0.72rem;

  font-weight: 600;

}


.generation-toggle {

  width: 32px;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid #ced4da;

  border-radius: 50%;

  background: #fff;

  color: #495057;

}


/* ====================================== */
/* PEOPLE */
/* ====================================== */

.generation-people {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 12px;

  padding: 15px;

}


/* ====================================== */
/* FAMILY BLOCK */
/* ====================================== */

.family-block {

  display: flex;

  align-items: center;

  flex: 0 0 auto;

  gap: 7px;

}


/* ====================================== */
/* PERSON WRAPPER */
/* ====================================== */

.person-wrapper {

  cursor: pointer;

  flex: 0 0 auto;

}


/* ====================================== */
/* CARD */
/* ====================================== */

.person-card {

  width: 230px;

  min-height: 76px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 8px 10px;

  border:
    1px solid #dee2e6;

  border-radius: 10px;

  background: #fff;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}


.person-wrapper:hover
.person-card {

  transform:
    translateY(-2px);

  box-shadow:
    0 5px 14px
    rgba(0, 0, 0, 0.10);

}


/* ====================================== */
/* NAM */
/* ====================================== */

.card-male {

  border-left:
    4px solid #4dabf7;

}


/* ====================================== */
/* NỮ */
/* ====================================== */

.card-female {

  border-left:
    4px solid #f783ac;

}


/* ====================================== */
/* DÂU */
/* ====================================== */

.card-dau {

  border-left:
    4px dashed #d63384;

  background:
    #fff5fa;

}


/* ====================================== */
/* RỂ */
/* ====================================== */

.card-re {

  border-left:
    4px dashed #7950f2;

  background:
    #f7f3ff;

}


/* ====================================== */
/* UNKNOWN */
/* ====================================== */

.card-unknown {

  border-left:
    4px solid #adb5bd;

}


/* ====================================== */
/* AVATAR */
/* ====================================== */

.person-avatar {

  width: 48px;

  min-width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #f1f3f5;

  color: #adb5bd;

  font-size: 1.35rem;

}


.person-avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


/* ====================================== */
/* INFO */
/* ====================================== */

.person-info {

  min-width: 0;

  flex: 1;

}


.person-name {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.9rem;

  font-weight: 650;

}


.gender-icon {

  margin-right: 3px;

  font-size: 0.85rem;

}


.person-meta {

  margin-top: 2px;

  color: #868e96;

  font-size: 0.75rem;

}


/* ====================================== */
/* LABEL DÂU / RỂ */
/* ====================================== */

.relationship-label {

  display: inline-block;

  margin-top: 3px;

  padding: 1px 6px;

  border-radius: 8px;

  font-size: 0.58rem;

  font-weight: 800;

  letter-spacing: 0.3px;

}


.label-dau {

  background: #fce4ec;

  color: #c2185b;

}


.label-re {

  background: #ede7f6;

  color: #5e35b1;

}


/* ====================================== */
/* DECEASED */
/* ====================================== */

.deceased {

  color: #6c757d;

  margin-left: 3px;

}


/* ====================================== */
/* MARRIAGE */
/* ====================================== */

.marriage-line {

  display: flex;

  align-items: center;

  justify-content: center;

  color: #dc3545;

  font-size: 0.9rem;

  font-weight: 700;

}


.marriage-line::before {

  content: '';

  width: 14px;

  height: 1px;

  margin-right: 4px;

  background: #ced4da;

}


.marriage-line::after {

  content: '';

  width: 14px;

  height: 1px;

  margin-left: 4px;

  background: #ced4da;

}


/* ====================================== */
/* SPOUSES */
/* ====================================== */

.spouses {

  display: flex;

  align-items: center;

  gap: 6px;

}


.spouse-wrapper {

  flex: 0 0 auto;

}


/* ====================================== */
/* EMPTY */
/* ====================================== */

.empty-generation {

  width: 100%;

  padding: 25px;

  color: #6c757d;

  text-align: center;

}


/* ====================================== */
/* MOBILE */
/* ====================================== */

@media (max-width: 768px) {

  .generation-toolbar {

    align-items: flex-start;

  }


  .toolbar-info {

    width: 100%;

  }


  .generation-people {

    overflow-x: auto;

    flex-wrap: nowrap;

    padding-bottom: 15px;

  }


  .person-card {

    width: 210px;

  }

}


/* ====================================== */
/* SMALL MOBILE */
/* ====================================== */

@media (max-width: 480px) {

  .generation-page {

    padding-left: 10px !important;

    padding-right: 10px !important;

  }


  .person-card {

    width: 200px;

  }


  .person-avatar {

    width: 44px;

    min-width: 44px;

    height: 44px;

  }

}

</style>