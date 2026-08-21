<template>

  <div class="members-page container">

    <!-- ===================================== -->
    <!-- HEADER -->
    <!-- ===================================== -->

    <div class="page-header">

      <div>

        <h1>
          Thành viên {{ familyConfig.familyName }}
        </h1>

        <p>
          Danh sách thành viên trong gia phả
        </p>

      </div>

    </div>


    <!-- ===================================== -->
    <!-- LOADING -->
    <!-- ===================================== -->

    <div
      v-if="loading"
      class="loading-box"
    >

      <div
        class="spinner-border"
        role="status"
      ></div>

      <div class="loading-text">
        Đang tải dữ liệu...
      </div>

    </div>


    <!-- ===================================== -->
    <!-- ERROR -->
    <!-- ===================================== -->

    <div
      v-else-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>


    <!-- ===================================== -->
    <!-- CONTENT -->
    <!-- ===================================== -->

    <div v-else>


      <!-- =================================== -->
      <!-- SEARCH -->
      <!-- =================================== -->

      <div class="search-box">

        <i class="bi bi-search"></i>

        <input
          v-model="searchKeyword"
          type="search"
          :placeholder="`Tìm tên, Tên Tự hoặc mã ${familyConfig.familyCode}...`"
        >

        <button
          v-if="searchKeyword"
          type="button"
          class="clear-search"
          aria-label="Xóa tìm kiếm"
          @click="searchKeyword = ''"
        >
          ×
        </button>

      </div>


      <!-- =================================== -->
      <!-- FILTER -->
      <!-- =================================== -->

      <div class="filter-grid">

        <div class="filter-item">

          <label for="generation">
            Đời
          </label>

          <select
            id="generation"
            v-model="selectedGeneration"
          >

            <option value="">
              Tất cả
            </option>

            <option
              v-for="generation in generations"
              :key="generation"
              :value="generation"
            >
              Đời {{ generation }}
            </option>

          </select>

        </div>


        <div class="filter-item">

          <label for="gender">
            Giới tính
          </label>

          <select
            id="gender"
            v-model="selectedGender"
          >

            <option value="">
              Tất cả
            </option>

            <option value="Nam">
              Nam
            </option>

            <option value="Nữ">
              Nữ
            </option>

          </select>

        </div>

      </div>


      <!-- =================================== -->
      <!-- RESULT BAR -->
      <!-- =================================== -->

      <div class="result-bar">

        <div class="result-count">

          <strong>
            {{ filteredPersons.length }}
          </strong>

          thành viên

          <span
            v-if="selectedGeneration"
            class="result-extra"
          >
            • Đời {{ selectedGeneration }}
          </span>

        </div>


        <button
          v-if="hasFilter"
          type="button"
          class="reset-filter"
          @click="resetFilters"
        >
          Xóa lọc
        </button>

      </div>


      <!-- =================================== -->
      <!-- EMPTY -->
      <!-- =================================== -->

      <div
        v-if="filteredPersons.length === 0"
        class="empty-result"
      >

        <div class="empty-icon">
          🔍
        </div>

        <div class="empty-title">
          Không tìm thấy thành viên
        </div>

        <div class="empty-text">
          Hãy thử tên khác hoặc xóa bộ lọc.
        </div>

        <button
          type="button"
          class="empty-reset"
          @click="resetFilters"
        >
          Xóa bộ lọc
        </button>

      </div>


      <!-- =================================== -->
      <!-- PERSON CARDS -->
      <!-- =================================== -->

      <div
        v-else
        class="members-grid"
      >

        <PersonCard
          v-for="person in filteredPersons"
          :key="person.ID"
          :person="person"
        />

      </div>

    </div>


    <!-- ===================================== -->
    <!-- BACK TO TOP -->
    <!-- ===================================== -->

    <button
      v-show="showBackToTop"
      type="button"
      class="back-to-top"
      title="Lên đầu trang"
      aria-label="Lên đầu trang"
      @click="scrollToTop"
    >
      ↑
    </button>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue';

import {
  getFamilyOrder
} from '../services/dataService';

import PersonCard
  from '../components/PersonCard.vue';

import familyConfig
  from '../config/family.config';


// ======================================
// DATA
// ======================================

const persons =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');

const searchKeyword =
  ref('');

const selectedGeneration =
  ref('');

const selectedGender =
  ref('');

const showBackToTop =
  ref(false);


// ======================================
// NORMALIZE TEXT
// TÌM ĐƯỢC CẢ KHÔNG DẤU
// ======================================

function normalizeText(value) {

  return String(
    value || ''
  )
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /đ/g,
      'd'
    )
    .replace(
      /Đ/g,
      'D'
    )
    .toLowerCase()
    .trim();

}


// ======================================
// XÁC ĐỊNH DÂU / RỂ
// ======================================

function isSpouse(person) {

  if (!person?.ID) {
    return false;
  }

  const id =
    String(person.ID);


  const hasSpouseSuffix =
    /S\d+$/.test(id);


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
// VA-10.02S1 → VA-10.02
// ======================================

function getBasePersonId(spouseId) {

  if (!spouseId) {
    return null;
  }

  const match =
    String(spouseId)
      .match(/^(.+)S\d+$/);


  if (!match) {
    return null;
  }


  return match[1];

}


// ======================================
// LẤY SỐ VỢ / CHỒNG
// S1 → 1
// S2 → 2
// ======================================

function getSpouseNumber(spouseId) {

  if (!spouseId) {
    return 0;
  }

  const match =
    String(spouseId)
      .match(/S(\d+)$/);


  if (!match) {
    return 0;
  }


  return Number(match[1]);

}


// ======================================
// TÌM VỢ / CHỒNG CỦA MỘT NGƯỜI
// ======================================

function getSpousesForPerson(person) {

  if (!person?.ID) {
    return [];
  }

  const baseId =
    String(person.ID);


  return persons.value

    .filter(candidate => {

      if (!isSpouse(candidate)) {
        return false;
      }

      return (
        getBasePersonId(
          candidate.ID
        ) === baseId
      );

    })

    .sort((a, b) => {

      return (
        getSpouseNumber(a.ID) -
        getSpouseNumber(b.ID)
      );

    });

}


// ======================================
// THÀNH VIÊN CHÍNH
// ======================================

const corePersons =
  computed(() => {

    return persons.value.filter(
      person =>
        !isSpouse(person)
    );

  });


// ======================================
// DANH SÁCH HIỂN THỊ
//
// Người chính
// → S1
// → S2
// → người chính tiếp theo
// ======================================

const orderedPersons =
  computed(() => {

    const result = [];


    corePersons.value.forEach(
      person => {

        result.push(person);


        const spouses =
          getSpousesForPerson(
            person
          );


        result.push(
          ...spouses
        );

      }
    );


    return result;

  });


// ======================================
// FILTER
// ======================================

const filteredPersons =
  computed(() => {

    const keyword =
      normalizeText(
        searchKeyword.value
      );


    return orderedPersons.value

      .filter(person => {


        // ------------------------------
        // GENERATION
        // ------------------------------

        const generation =
          person.generation ??
          person['Đời'];


        const matchGeneration =
          !selectedGeneration.value ||
          Number(generation) ===
          Number(
            selectedGeneration.value
          );


        // ------------------------------
        // GENDER
        // ------------------------------

        const matchGender =
          !selectedGender.value ||
          person['Giới tính'] ===
          selectedGender.value;


        // ------------------------------
        // SEARCH
        // ------------------------------

        const searchableText =
          normalizeText(
            [
              person.ID,
              person['Họ'],
              person['Tên'],
              person['Tên Tự']
            ]
              .filter(Boolean)
              .join(' ')
          );


        const matchKeyword =
          !keyword ||
          searchableText.includes(
            keyword
          );


        return (
          matchGeneration &&
          matchGender &&
          matchKeyword
        );

      });

  });


// ======================================
// GENERATIONS
// ======================================

const generations =
  computed(() => {

    return [

      ...new Set(

        persons.value

          .map(person => {

            return Number(
              person.generation ??
              person['Đời']
            );

          })

          .filter(Boolean)

      )

    ].sort(
      (a, b) => a - b
    );

  });


// ======================================
// HAS FILTER
// ======================================

const hasFilter =
  computed(() => {

    return (
      Boolean(
        searchKeyword.value.trim()
      ) ||
      Boolean(
        selectedGeneration.value
      ) ||
      Boolean(
        selectedGender.value
      )
    );

  });


// ======================================
// RESET FILTER
// ======================================

function resetFilters() {

  searchKeyword.value =
    '';

  selectedGeneration.value =
    '';

  selectedGender.value =
    '';

}


// ======================================
// LOAD PERSONS
// ======================================

async function loadPersons() {

  try {

    loading.value =
      true;

    error.value =
      '';


    const familyOrder =
      await getFamilyOrder();


    /*
      Giữ nguyên thứ tự gia phả.

      getFamilyOrder() trả:

      {
        person,
        depth
      }
    */

    persons.value =
      familyOrder
        .map(item => {

          return {

            ...item.person,

            _familyDepth:
              item.depth

          };

        });

  }
  catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể tải danh sách thành viên';

  }
  finally {

    loading.value =
      false;

  }

}


// ======================================
// BACK TO TOP
// ======================================

function handleScroll() {

  showBackToTop.value =
    window.scrollY > 600;

}


function scrollToTop() {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


// ======================================
// INIT
// ======================================

onMounted(() => {

  loadPersons();

  window.addEventListener(
    'scroll',
    handleScroll,
    {
      passive: true
    }
  );

});


onUnmounted(() => {

  window.removeEventListener(
    'scroll',
    handleScroll
  );

});

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.members-page {

  padding-top: 28px;

  padding-bottom: 70px;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.page-header {

  margin-bottom: 22px;

}


.page-header h1 {

  margin: 0;

  font-size: 1.8rem;

  font-weight: 700;

  color: #343a40;

}


.page-header p {

  margin:
    5px 0 0;

  color: #6c757d;

  font-size: 0.95rem;

}


/* ===================================== */
/* LOADING */
/* ===================================== */

.loading-box {

  padding: 70px 0;

  text-align: center;

}


.loading-text {

  margin-top: 10px;

  color: #6c757d;

}


/* ===================================== */
/* SEARCH */
/* ===================================== */

.search-box {

  position: relative;

  display: flex;

  align-items: center;

  min-height: 48px;

  margin-bottom: 12px;

  border:
    1px solid
    #ced4da;

  border-radius: 12px;

  background: #ffffff;

  overflow: hidden;

}


.search-box > i {

  margin-left: 15px;

  color: #868e96;

  font-size: 17px;

}


.search-box input {

  flex: 1;

  min-width: 0;

  height: 48px;

  padding:
    0 42px
    0 11px;

  border: 0;

  outline: none;

  background: transparent;

  font-size: 0.97rem;

  color: #343a40;

}


.clear-search {

  position: absolute;

  right: 8px;

  width: 32px;

  height: 32px;

  border: 0;

  border-radius: 50%;

  background: #f1f3f5;

  color: #6c757d;

  font-size: 20px;

  line-height: 1;

}


/* ===================================== */
/* FILTER */
/* ===================================== */

.filter-grid {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin-bottom: 14px;

}


.filter-item label {

  display: block;

  margin-bottom: 5px;

  font-size: 0.75rem;

  font-weight: 700;

  color: #6c757d;

  text-transform: uppercase;

  letter-spacing: 0.03em;

}


.filter-item select {

  width: 100%;

  height: 43px;

  padding:
    0 34px
    0 11px;

  border:
    1px solid
    #ced4da;

  border-radius: 10px;

  background-color: #ffffff;

  color: #343a40;

  font-size: 0.9rem;

}


/* ===================================== */
/* RESULT BAR */
/* ===================================== */

.result-bar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin:
    8px 0
    15px;

  min-height: 34px;

}


.result-count {

  color: #6c757d;

  font-size: 0.88rem;

}


.result-count strong {

  color: #343a40;

}


.result-extra {

  white-space: nowrap;

}


.reset-filter {

  flex-shrink: 0;

  border: 0;

  background: transparent;

  color: var(--family-primary);

  font-size: 0.84rem;

  font-weight: 700;

}


/* ===================================== */
/* GRID */
/* ===================================== */

.members-grid {

  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 14px;

}


/* ===================================== */
/* EMPTY */
/* ===================================== */

.empty-result {

  padding:
    55px 15px;

  text-align: center;

}


.empty-icon {

  font-size: 35px;

  margin-bottom: 10px;

}


.empty-title {

  font-weight: 700;

  color: #343a40;

}


.empty-text {

  margin-top: 4px;

  color: #6c757d;

  font-size: 0.9rem;

}


.empty-reset {

  margin-top: 15px;

  padding:
    8px 16px;

  border: 0;

  border-radius: 8px;

  background: var(--family-primary);

  color: #ffffff;

}


/* ===================================== */
/* BACK TO TOP */
/* ===================================== */

.back-to-top {

  position: fixed;

  right: 18px;

  bottom: 22px;

  z-index: 900;

  width: 45px;

  height: 45px;

  border: 0;

  border-radius: 50%;

  background:
    rgba(
      118,
      28,
      28,
      0.92
    );

  color: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(
      0,
      0,
      0,
      0.2
    );

  font-size: 22px;

}


/* ===================================== */
/* TABLET */
/* ===================================== */

@media (max-width: 992px) {

  .members-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

  }

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .members-page {

    padding-top: 18px;

    padding-left: 12px;

    padding-right: 12px;

  }


  .page-header {

    margin-bottom: 16px;

  }


  .page-header h1 {

    font-size: 1.35rem;

  }


  .page-header p {

    font-size: 0.84rem;

  }


  .members-grid {

    grid-template-columns: 1fr;

    gap: 9px;

  }


  .result-bar {

    margin-bottom: 10px;

  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .filter-grid {

    gap: 7px;

  }


  .filter-item select {

    padding-left: 8px;

    font-size: 0.84rem;

  }

}

</style>
