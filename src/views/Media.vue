<template>

  <div class="media-page container">

    <!-- ===================================== -->
    <!-- HEADER -->
    <!-- ===================================== -->

    <header class="page-header">

      <div class="header-icon">
        🖼️
      </div>

      <div>

        <h1>
          Album ảnh gia tộc
        </h1>

        <p>
          Những hình ảnh và khoảnh khắc của các thế hệ
        </p>

      </div>

    </header>


    <!-- ===================================== -->
    <!-- LOADING -->
    <!-- ===================================== -->

    <div
      v-if="loading"
      class="loading-box"
    >

      <div class="spinner-border"></div>

      <div class="loading-text">
        Đang tải hình ảnh...
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

    <template v-else>

      <!-- =================================== -->
      <!-- SEARCH -->
      <!-- =================================== -->

      <div class="search-box">

        <i class="bi bi-search"></i>

        <input
          v-model="searchKeyword"
          type="search"
          placeholder="Tìm tên, mã thành viên, chú thích..."
        >

        <button
          v-if="searchKeyword"
          type="button"
          class="clear-search"
          @click="searchKeyword = ''"
          aria-label="Xóa tìm kiếm"
        >
          ×
        </button>

      </div>


      <!-- =================================== -->
      <!-- FILTER -->
      <!-- =================================== -->

      <div class="filter-row">

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

          <label for="person">
            Thành viên
          </label>

          <select
            id="person"
            v-model="selectedPerson"
          >

            <option value="">
              Tất cả
            </option>

            <option
              v-for="person in personsWithMedia"
              :key="person.ID"
              :value="person.ID"
            >
              {{ getFullName(person) }}
            </option>

          </select>

        </div>

      </div>


      <!-- =================================== -->
      <!-- RESULT BAR -->
      <!-- =================================== -->

      <div class="result-bar">

        <div>

          <strong>
            {{ filteredMedia.length }}
          </strong>

          hình ảnh

        </div>


        <button
          v-if="hasFilter"
          type="button"
          class="reset-button"
          @click="resetFilters"
        >
          Xóa lọc
        </button>

      </div>


      <!-- =================================== -->
      <!-- EMPTY -->
      <!-- =================================== -->

      <div
        v-if="filteredMedia.length === 0"
        class="empty-box"
      >

        <div class="empty-icon">
          🖼️
        </div>

        <strong>
          Không tìm thấy hình ảnh
        </strong>

        <p>
          Hãy thử từ khóa hoặc bộ lọc khác.
        </p>

        <button
          type="button"
          @click="resetFilters"
        >
          Xóa bộ lọc
        </button>

      </div>


      <!-- =================================== -->
      <!-- MEDIA GRID -->
      <!-- =================================== -->

      <div
        v-else
        class="media-grid"
      >

        <article
          v-for="item in filteredMedia"
          :key="item.key"
          class="media-card"
          @click="openLightbox(item)"
        >

          <!-- IMAGE -->

          <div class="image-wrap">

            <img
              :src="item.url"
              :alt="item.caption || item.personName"
              loading="lazy"
            >

            <div class="image-overlay">

              <i class="bi bi-arrows-fullscreen"></i>

            </div>

          </div>


          <!-- CONTENT -->

          <div class="media-content">

            <h3>

              {{
                item.caption ||
                'Hình ảnh gia tộc'
              }}

            </h3>


            <router-link
              v-if="item.personId"
              :to="{
                name: 'person-detail',
                params: {
                  id: item.personId
                }
              }"
              class="person-link"
              @click.stop
            >

              <span>
                {{ item.personName }}
              </span>

              <span class="arrow">
                ›
              </span>

            </router-link>


            <div class="media-meta">

              <span>
                {{ item.personId }}
              </span>

              <span
                v-if="item.generation"
              >
                • Đời {{ item.generation }}
              </span>

            </div>

          </div>

        </article>

      </div>

    </template>


    <!-- ===================================== -->
    <!-- LIGHTBOX -->
    <!-- ===================================== -->

    <div
      v-if="activeMedia"
      class="lightbox"
      @click="closeLightbox"
    >

      <div
        class="lightbox-dialog"
        @click.stop
      >

        <!-- CLOSE -->

        <button
          type="button"
          class="lightbox-close"
          @click="closeLightbox"
          aria-label="Đóng ảnh"
        >
          ×
        </button>


        <!-- IMAGE -->

        <div class="lightbox-image-wrap">

          <img
            :src="activeMedia.url"
            :alt="
              activeMedia.caption ||
              activeMedia.personName
            "
          >

        </div>


        <!-- INFO -->

        <div class="lightbox-content">

          <h2>

            {{
              activeMedia.caption ||
              'Hình ảnh gia tộc'
            }}

          </h2>


          <router-link
            v-if="activeMedia.personId"
            :to="{
              name: 'person-detail',
              params: {
                id: activeMedia.personId
              }
            }"
            class="lightbox-person"
            @click="closeLightbox"
          >

            <div>

              <strong>
                {{ activeMedia.personName }}
              </strong>

              <span>

                {{ activeMedia.personId }}

                <template
                  v-if="activeMedia.generation"
                >
                  • Đời
                  {{ activeMedia.generation }}
                </template>

              </span>

            </div>


            <div class="lightbox-arrow">
              ›
            </div>

          </router-link>

        </div>

      </div>

    </div>


    <!-- ===================================== -->
    <!-- BACK TO TOP -->
    <!-- ===================================== -->

    <button
      v-show="showBackToTop"
      type="button"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Lên đầu trang"
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


// ======================================
// STATE
// ======================================

const persons =
  ref([]);

const mediaItems =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');

const searchKeyword =
  ref('');

const selectedGeneration =
  ref('');

const selectedPerson =
  ref('');

const activeMedia =
  ref(null);

const showBackToTop =
  ref(false);


// ======================================
// TEXT NORMALIZE
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
// FULL NAME
// ======================================

function getFullName(person) {

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
// GENERATION
// ======================================

function getGeneration(person) {

  return (
    person?.generation ??
    person?.['Đời'] ??
    ''
  );

}


// ======================================
// MEDIA URL
// ======================================

function getMediaUrl(file) {

  if (!file) {
    return '';
  }

  return (
    `${import.meta.env.BASE_URL}${file}`
  );

}


// ======================================
// PUBLIC IMAGE
// ======================================

function isPublicImage(media) {

  if (!media) {
    return false;
  }


  const visibility =
    String(
      media.VISIBILITY || ''
    )
      .trim()
      .toLowerCase();


  const type =
    String(
      media.Type ||
      media.TYPE ||
      ''
    )
      .trim()
      .toLowerCase();


  return (
    visibility === 'public' &&
    type === 'image' &&
    Boolean(media.FILE)
  );

}


// ======================================
// GENERATIONS
// ======================================

const generations =
  computed(() => {

    return [

      ...new Set(

        mediaItems.value

          .map(
            item =>
              Number(
                item.generation
              )
          )

          .filter(Boolean)

      )

    ]
      .sort(
        (a, b) =>
          a - b
      );

  });


// ======================================
// PERSONS WITH MEDIA
// ======================================

const personsWithMedia =
  computed(() => {

    const ids =
      new Set(
        mediaItems.value.map(
          item =>
            item.personId
        )
      );


    return persons.value

      .filter(
        person =>
          ids.has(
            person.ID
          )
      );

  });


// ======================================
// FILTERED MEDIA
// ======================================

const filteredMedia =
  computed(() => {

    const keyword =
      normalizeText(
        searchKeyword.value
      );


    return mediaItems.value

      .filter(item => {


        // ------------------------------
        // GENERATION
        // ------------------------------

        const matchGeneration =
          !selectedGeneration.value ||
          Number(
            item.generation
          ) ===
          Number(
            selectedGeneration.value
          );


        // ------------------------------
        // PERSON
        // ------------------------------

        const matchPerson =
          !selectedPerson.value ||
          item.personId ===
          selectedPerson.value;


        // ------------------------------
        // SEARCH
        // ------------------------------

        const searchable =
          normalizeText(
            [
              item.personId,
              item.personName,
              item.caption
            ]
              .filter(Boolean)
              .join(' ')
          );


        const matchSearch =
          !keyword ||
          searchable.includes(
            keyword
          );


        return (
          matchGeneration &&
          matchPerson &&
          matchSearch
        );

      });

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
        selectedPerson.value
      )
    );

  });


// ======================================
// RESET
// ======================================

function resetFilters() {

  searchKeyword.value =
    '';

  selectedGeneration.value =
    '';

  selectedPerson.value =
    '';

}


// ======================================
// LIGHTBOX
// ======================================

function openLightbox(item) {

  activeMedia.value =
    item;


  document.body.style.overflow =
    'hidden';

}


function closeLightbox() {

  activeMedia.value =
    null;


  document.body.style.overflow =
    '';

}


// ======================================
// ESC
// ======================================

function handleEscape(event) {

  if (
    event.key === 'Escape' &&
    activeMedia.value
  ) {

    closeLightbox();

  }

}


// ======================================
// LOAD MEDIA
// ======================================

async function loadMedia() {

  try {

    loading.value =
      true;

    error.value =
      '';


    const familyOrder =
      await getFamilyOrder();


    persons.value =
      familyOrder.map(
        item =>
          item.person
      );


    const result = [];


    persons.value.forEach(
      person => {

        const media =
          Array.isArray(
            person.media
          )
            ? person.media
            : [];


        media
          .filter(
            isPublicImage
          )

          .forEach(
            (item, index) => {

              result.push({

                key:
                  `${person.ID}-${index}-${item.FILE}`,

                personId:
                  person.ID,

                personName:
                  getFullName(
                    person
                  ),

                generation:
                  getGeneration(
                    person
                  ),

                caption:
                  item.Caption ||
                  item.CAPTION ||
                  '',

                file:
                  item.FILE,

                url:
                  getMediaUrl(
                    item.FILE
                  ),

                raw:
                  item

              });

            }
          );

      }
    );


    mediaItems.value =
      result;

  }

  catch (err) {

    console.error(err);


    error.value =
      err.message ||
      'Không thể tải dữ liệu hình ảnh';

  }

  finally {

    loading.value =
      false;

  }

}


// ======================================
// SCROLL
// ======================================

function handleScroll() {

  showBackToTop.value =
    window.scrollY > 700;

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

  loadMedia();


  window.addEventListener(
    'keydown',
    handleEscape
  );


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
    'keydown',
    handleEscape
  );


  window.removeEventListener(
    'scroll',
    handleScroll
  );


  document.body.style.overflow =
    '';

});

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.media-page {

  padding-top: 28px;

  padding-bottom: 70px;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.page-header {

  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 22px;

}


.header-icon {

  width: 52px;

  height: 52px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #fff3bf;

  font-size: 26px;

}


.page-header h1 {

  margin: 0;

  color: #343a40;

  font-size: 1.8rem;

  font-weight: 700;

}


.page-header p {

  margin:
    4px 0 0;

  color: #6c757d;

  font-size: 0.92rem;

}


/* ===================================== */
/* LOADING */
/* ===================================== */

.loading-box {

  padding:
    70px 0;

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

}


.search-box > i {

  margin-left: 15px;

  color: #868e96;

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

  font-size: 0.95rem;

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

}


/* ===================================== */
/* FILTER */
/* ===================================== */

.filter-row {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

}


.filter-item label {

  display: block;

  margin-bottom: 5px;

  color: #6c757d;

  font-size: 0.74rem;

  font-weight: 700;

  text-transform: uppercase;

}


.filter-item select {

  width: 100%;

  height: 43px;

  padding:
    0 10px;

  border:
    1px solid
    #ced4da;

  border-radius: 10px;

  background: #ffffff;

  color: #343a40;

  font-size: 0.88rem;

}


/* ===================================== */
/* RESULT */
/* ===================================== */

.result-bar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 38px;

  margin:
    9px 0
    14px;

  color: #6c757d;

  font-size: 0.85rem;

}


.result-bar strong {

  color: #343a40;

}


.reset-button {

  border: 0;

  background: transparent;

  color: #922525;

  font-size: 0.82rem;

  font-weight: 700;

}


/* ===================================== */
/* GRID */
/* ===================================== */

.media-grid {

  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 13px;

}


/* ===================================== */
/* CARD */
/* ===================================== */

.media-card {

  overflow: hidden;

  border:
    1px solid
    #e9ecef;

  border-radius: 13px;

  background: #ffffff;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}


.media-card:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 6px 18px
    rgba(
      0,
      0,
      0,
      0.08
    );

}


/* ===================================== */
/* IMAGE */
/* ===================================== */

.image-wrap {

  position: relative;

  overflow: hidden;

  aspect-ratio: 4 / 3;

  background: #f1f3f5;

}


.image-wrap img {

  width: 100%;

  height: 100%;

  display: block;

  object-fit: cover;

}


.image-overlay {

  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(
      0,
      0,
      0,
      0.28
    );

  color: #ffffff;

  font-size: 25px;

  opacity: 0;

  transition:
    opacity 0.15s ease;

}


.media-card:hover
.image-overlay {

  opacity: 1;

}


/* ===================================== */
/* CONTENT */
/* ===================================== */

.media-content {

  padding: 11px;

}


.media-content h3 {

  margin: 0;

  overflow: hidden;

  color: #343a40;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.9rem;

  font-weight: 700;

}


.person-link {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin-top: 7px;

  color: #922525;

  text-decoration: none;

  font-size: 0.79rem;

  font-weight: 700;

}


.person-link .arrow {

  font-size: 18px;

}


.media-meta {

  display: flex;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 4px;

  color: #868e96;

  font-size: 0.7rem;

}


/* ===================================== */
/* EMPTY */
/* ===================================== */

.empty-box {

  padding:
    55px 15px;

  text-align: center;

  color: #6c757d;

}


.empty-icon {

  margin-bottom: 8px;

  font-size: 36px;

}


.empty-box strong {

  display: block;

  color: #343a40;

}


.empty-box p {

  margin:
    4px 0
    14px;

  font-size: 0.85rem;

}


.empty-box button {

  padding:
    8px 15px;

  border: 0;

  border-radius: 8px;

  background: #922525;

  color: #ffffff;

}


/* ===================================== */
/* LIGHTBOX */
/* ===================================== */

.lightbox {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 18px;

  background:
    rgba(
      0,
      0,
      0,
      0.86
    );

}


.lightbox-dialog {

  position: relative;

  width: min(
    900px,
    100%
  );

  max-height:
    calc(
      100vh - 30px
    );

  overflow: auto;

  border-radius: 15px;

  background: #ffffff;

}


.lightbox-close {

  position: absolute;

  top: 8px;

  right: 8px;

  z-index: 2;

  width: 38px;

  height: 38px;

  border: 0;

  border-radius: 50%;

  background:
    rgba(
      0,
      0,
      0,
      0.62
    );

  color: #ffffff;

  font-size: 24px;

}


.lightbox-image-wrap {

  display: flex;

  align-items: center;

  justify-content: center;

  min-height: 200px;

  background: #111111;

}


.lightbox-image-wrap img {

  display: block;

  max-width: 100%;

  max-height:
    72vh;

  object-fit: contain;

}


.lightbox-content {

  padding: 14px;

}


.lightbox-content h2 {

  margin:
    0 0
    10px;

  color: #343a40;

  font-size: 1.05rem;

}


.lightbox-person {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  padding: 10px;

  border-radius: 10px;

  background: #f8f9fa;

  color: inherit;

  text-decoration: none;

}


.lightbox-person strong {

  display: block;

  color: #343a40;

  font-size: 0.87rem;

}


.lightbox-person span {

  display: block;

  margin-top: 2px;

  color: #868e96;

  font-size: 0.72rem;

}


.lightbox-arrow {

  color: #adb5bd;

  font-size: 25px;

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

  .media-grid {

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

  .media-page {

    padding-top: 17px;

    padding-left: 12px;

    padding-right: 12px;

  }


  .page-header {

    gap: 10px;

    margin-bottom: 16px;

  }


  .header-icon {

    width: 44px;

    height: 44px;

    font-size: 22px;

  }


  .page-header h1 {

    font-size: 1.3rem;

  }


  .page-header p {

    font-size: 0.78rem;

  }


  .filter-row {

    gap: 7px;

  }


  .media-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 8px;

  }


  .media-card {

    border-radius: 10px;

  }


  .image-wrap {

    aspect-ratio: 1 / 1;

  }


  .image-overlay {

    display: none;

  }


  .media-content {

    padding: 8px;

  }


  .media-content h3 {

    font-size: 0.8rem;

  }


  .person-link {

    margin-top: 5px;

    font-size: 0.72rem;

  }


  .media-meta {

    font-size: 0.64rem;

  }


  /* LIGHTBOX MOBILE */

  .lightbox {

    padding: 0;

  }


  .lightbox-dialog {

    width: 100%;

    max-height: 100vh;

    border-radius: 0;

  }


  .lightbox-image-wrap img {

    max-height: 78vh;

  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .filter-item select {

    font-size: 0.8rem;

  }


  .media-content {

    padding: 7px;

  }

}

</style>