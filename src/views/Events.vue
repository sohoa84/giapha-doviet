<template>

  <div class="events-page container">

    <!-- ===================================== -->
    <!-- PAGE HEADER -->
    <!-- ===================================== -->

    <header class="page-header">

      <div class="header-icon">
        🕯️
      </div>

      <div>

        <h1>
          Ngày giỗ & Sự kiện
        </h1>

        <p>
          Các ngày giỗ và sự kiện quan trọng của gia tộc
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
        Đang tải sự kiện...
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
          placeholder="Tìm tên, nội dung, địa điểm..."
        >

        <button
          v-if="searchKeyword"
          type="button"
          class="clear-search"
          @click="searchKeyword = ''"
        >
          ×
        </button>

      </div>


      <!-- =================================== -->
      <!-- FILTER -->
      <!-- =================================== -->

      <div class="filter-tabs">

        <button
          type="button"
          :class="{ active: selectedType === 'all' }"
          @click="selectedType = 'all'"
        >
          Tất cả

          <span>
            {{ events.length }}
          </span>
        </button>


        <button
          type="button"
          :class="{ active: selectedType === 'death' }"
          @click="selectedType = 'death'"
        >
          🕯️ Ngày giỗ

          <span>
            {{ deathEventCount }}
          </span>
        </button>


        <button
          type="button"
          :class="{ active: selectedType === 'other' }"
          @click="selectedType = 'other'"
        >
          📅 Khác

          <span>
            {{ otherEventCount }}
          </span>
        </button>

      </div>


      <!-- =================================== -->
      <!-- RESULT -->
      <!-- =================================== -->

      <div class="result-bar">

        <div>

          <strong>
            {{ filteredEvents.length }}
          </strong>

          sự kiện

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
        v-if="filteredEvents.length === 0"
        class="empty-box"
      >

        <div class="empty-icon">
          📅
        </div>

        <strong>
          Không tìm thấy sự kiện
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
      <!-- EVENT GROUPS -->
      <!-- =================================== -->

      <div
        v-else
        class="event-groups"
      >

        <section
          v-for="group in groupedEvents"
          :key="group.month"
          class="month-section"
        >

          <!-- MONTH HEADER -->

          <div class="month-header">

            <div class="month-number">

              {{ formatMonth(group.month) }}

            </div>


            <div class="month-title">

              <strong>
                Tháng {{ group.month }} âm lịch
              </strong>

              <span>
                {{ group.events.length }}
                sự kiện
              </span>

            </div>

          </div>


          <!-- EVENTS -->

          <div class="event-list">

            <article
              v-for="item in group.events"
              :key="item._key"
              class="event-card"
              :class="{
                'death-event': isDeathEvent(item)
              }"
            >

              <!-- DATE -->

              <div class="event-date">

                <strong>
                  {{ getLunarDay(item) }}
                </strong>

                <span>
                  THÁNG
                  {{ getLunarMonth(item) }}
                </span>

                <small>
                  ÂM LỊCH
                </small>

              </div>


              <!-- CONTENT -->

              <div class="event-content">

                <!-- TYPE -->

                <div class="event-top">

                  <span
                    class="event-type"
                    :class="{
                      death: isDeathEvent(item)
                    }"
                  >

                    {{
                      isDeathEvent(item)
                        ? '🕯️ Ngày giỗ'
                        : '📅 ' + getEventType(item)
                    }}

                  </span>

                </div>


                <!-- TITLE -->

                <h3>

                  {{
                    getEventContent(item)
                    ||
                    getEventType(item)
                  }}

                </h3>


                <!-- PERSON -->

                <router-link
                  v-if="item.person"
                  :to="{
                    name: 'person-detail',
                    params: {
                      id: item.person.ID
                    }
                  }"
                  class="person-link"
                >

                  <div
                    class="mini-avatar"
                    :class="getPersonClass(item.person)"
                  >

                    <img
                      v-if="item.person.Photo"
                      :src="getPhotoUrl(item.person.Photo)"
                      :alt="getFullName(item.person)"
                      loading="lazy"
                    >

                    <i
                      v-else
                      class="bi bi-person"
                    ></i>

                  </div>


                  <div class="person-info">

                    <strong>
                      {{ getFullName(item.person) }}
                    </strong>

                    <span>

                      {{ item.person.ID }}

                      <template
                        v-if="getGeneration(item.person)"
                      >
                        • Đời
                        {{ getGeneration(item.person) }}
                      </template>

                    </span>

                  </div>


                  <div class="person-arrow">
                    ›
                  </div>

                </router-link>


                <!-- LOCATION -->

                <div
                  v-if="getEventLocation(item)"
                  class="event-location"
                >

                  <i class="bi bi-geo-alt"></i>

                  <span>
                    {{ getEventLocation(item) }}
                  </span>

                </div>


                <!-- NOTE -->

                <div
                  v-if="getEventNote(item)"
                  class="event-note"
                >
                  {{ getEventNote(item) }}
                </div>

              </div>

            </article>

          </div>

        </section>

      </div>

    </template>


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

const events =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');

const searchKeyword =
  ref('');

const selectedType =
  ref('all');

const showBackToTop =
  ref(false);


// ======================================
// NORMALIZE TEXT
// ======================================

function normalizeText(value) {

  return String(value || '')

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
// PERSON
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


function getGeneration(person) {

  return (
    person?.generation ??
    person?.['Đời'] ??
    ''
  );

}


// ======================================
// PHOTO
// ======================================

function getPhotoUrl(photo) {

  if (!photo) {
    return '';
  }

  return (
    `${import.meta.env.BASE_URL}${photo}`
  );

}


// ======================================
// PERSON STYLE
// ======================================

function getPersonClass(person) {

  if (!person) {
    return '';
  }


  if (
    person['Giới tính'] === 'Nam'
  ) {

    return 'male';

  }


  if (
    person['Giới tính'] === 'Nữ'
  ) {

    return 'female';

  }


  return '';

}


// ======================================
// EVENT FIELD HELPERS
// ======================================

function getEventType(event) {

  return (
    event.LOAI ||
    event.Loai ||
    event['Loại'] ||
    'Sự kiện'
  );

}


function getEventContent(event) {

  return (
    event['NOI DUNG'] ||
    event['NỘI DUNG'] ||
    event.NOIDUNG ||
    event.NoiDung ||
    ''
  );

}


function getEventLocation(event) {

  return (
    event['MỘ PHẦN'] ||
    event['MO PHAN'] ||
    event.MOPHAN ||
    event.DIADIEM ||
    event['ĐỊA ĐIỂM'] ||
    ''
  );

}


function getEventNote(event) {

  return (
    event.GHICHU ||
    event['GHI CHÚ'] ||
    event['Ghi chú'] ||
    ''
  );

}


// ======================================
// LUNAR DATE
// ======================================

function getLunarDateString(event) {

  return String(

    event['NGÀY ÂM LỊCH'] ||
    event['NGAY AM LICH'] ||
    event.NGAYAMLICH ||
    ''

  ).trim();

}


// ======================================
// PARSE LUNAR DATE
//
// hỗ trợ:
// 15/5
// 15/05
// 15-05
// ======================================

function parseLunarDate(event) {

  const value =
    getLunarDateString(event);


  if (!value) {

    return {
      day: 0,
      month: 0
    };

  }


  const match =
    value.match(
      /(\d{1,2})\s*[\/\-]\s*(\d{1,2})/
    );


  if (!match) {

    return {
      day: 0,
      month: 0
    };

  }


  return {

    day:
      Number(match[1]),

    month:
      Number(match[2])

  };

}


function getLunarDay(event) {

  const date =
    parseLunarDate(event);

  if (!date.day) {
    return '--';
  }

  return String(date.day)
    .padStart(
      2,
      '0'
    );

}


function getLunarMonth(event) {

  const date =
    parseLunarDate(event);

  if (!date.month) {
    return '--';
  }

  return String(date.month)
    .padStart(
      2,
      '0'
    );

}


// ======================================
// DEATH EVENT
// ======================================

function isDeathEvent(event) {

  const text =
    normalizeText(
      [
        getEventType(event),
        getEventContent(event)
      ].join(' ')
    );


  return (
    text.includes('gio') ||
    text.includes('ngay mat') ||
    text.includes('ngay ky')
  );

}


// ======================================
// COUNTS
// ======================================

const deathEventCount =
  computed(() => {

    return events.value.filter(
      isDeathEvent
    ).length;

  });


const otherEventCount =
  computed(() => {

    return events.value.filter(
      event =>
        !isDeathEvent(event)
    ).length;

  });


// ======================================
// FILTERED EVENTS
// ======================================

const filteredEvents =
  computed(() => {

    const keyword =
      normalizeText(
        searchKeyword.value
      );


    return events.value

      .filter(event => {


        // ------------------------------
        // TYPE
        // ------------------------------

        let matchType =
          true;


        if (
          selectedType.value ===
          'death'
        ) {

          matchType =
            isDeathEvent(event);

        }


        if (
          selectedType.value ===
          'other'
        ) {

          matchType =
            !isDeathEvent(event);

        }


        // ------------------------------
        // SEARCH
        // ------------------------------

        const personName =
          getFullName(
            event.person
          );


        const searchable =
          normalizeText(
            [
              personName,
              event.person?.ID,
              getEventType(event),
              getEventContent(event),
              getEventLocation(event),
              getEventNote(event),
              getLunarDateString(event)
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
          matchType &&
          matchSearch
        );

      })

      // ------------------------------
      // SORT BY LUNAR MONTH / DAY
      // ------------------------------

      .sort((a, b) => {

        const dateA =
          parseLunarDate(a);

        const dateB =
          parseLunarDate(b);


        if (
          dateA.month !==
          dateB.month
        ) {

          return (
            dateA.month -
            dateB.month
          );

        }


        return (
          dateA.day -
          dateB.day
        );

      });

  });


// ======================================
// GROUP BY LUNAR MONTH
// ======================================

const groupedEvents =
  computed(() => {

    const groups =
      new Map();


    filteredEvents.value
      .forEach(event => {

        const date =
          parseLunarDate(event);


        const month =
          date.month || 0;


        if (
          !groups.has(month)
        ) {

          groups.set(
            month,
            []
          );

        }


        groups
          .get(month)
          .push(event);

      });


    return Array
      .from(
        groups.entries()
      )

      .map(
        ([month, groupEvents]) => ({

          month,

          events:
            groupEvents

        })
      );

  });


// ======================================
// FORMAT MONTH
// ======================================

function formatMonth(month) {

  if (!month) {
    return '?';
  }

  return String(month)
    .padStart(
      2,
      '0'
    );

}


// ======================================
// FILTER STATUS
// ======================================

const hasFilter =
  computed(() => {

    return (
      Boolean(
        searchKeyword.value.trim()
      ) ||
      selectedType.value !==
      'all'
    );

  });


// ======================================
// RESET FILTER
// ======================================

function resetFilters() {

  searchKeyword.value =
    '';

  selectedType.value =
    'all';

}


// ======================================
// LOAD EVENTS
// ======================================

async function loadEvents() {

  try {

    loading.value =
      true;

    error.value =
      '';


    /*
      getFamilyOrder() giúp ta lấy toàn bộ
      thành viên theo dữ liệu gia phả hiện tại.

      Mỗi person đã có events[] do
      convert.js tạo sẵn.
    */

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

        const personEvents =
          Array.isArray(
            person.events
          )
            ? person.events
            : [];


        personEvents.forEach(
          (event, index) => {

            result.push({

              ...event,

              person,

              _key:
                `${person.ID}-${index}`

            });

          }
        );

      }
    );


    events.value =
      result;

  }

  catch (err) {

    console.error(err);


    error.value =
      err.message ||
      'Không thể tải dữ liệu sự kiện';

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

  loadEvents();


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

.events-page {

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

  font-size: 27px;

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

.filter-tabs {

  display: flex;

  gap: 8px;

  overflow-x: auto;

  padding-bottom: 3px;

  scrollbar-width: none;

}


.filter-tabs::-webkit-scrollbar {

  display: none;

}


.filter-tabs button {

  display: flex;

  align-items: center;

  gap: 6px;

  min-height: 39px;

  padding:
    7px 13px;

  border:
    1px solid
    #dee2e6;

  border-radius: 999px;

  background: #ffffff;

  color: #495057;

  white-space: nowrap;

  font-size: 0.84rem;

}


.filter-tabs button span {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 21px;

  height: 21px;

  padding:
    0 5px;

  border-radius: 999px;

  background: #f1f3f5;

  font-size: 0.7rem;

}


.filter-tabs button.active {

  border-color: #922525;

  background: #922525;

  color: #ffffff;

}


.filter-tabs button.active span {

  background:
    rgba(
      255,
      255,
      255,
      0.2
    );

  color: #ffffff;

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
    15px;

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
/* MONTH */
/* ===================================== */

.month-section {

  margin-bottom: 28px;

}


.month-header {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 10px;

}


.month-number {

  width: 42px;

  height: 42px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #922525;

  color: #ffffff;

  font-size: 1rem;

  font-weight: 700;

}


.month-title {

  display: flex;

  flex-direction: column;

}


.month-title strong {

  color: #343a40;

  font-size: 1rem;

}


.month-title span {

  margin-top: 1px;

  color: #868e96;

  font-size: 0.75rem;

}


/* ===================================== */
/* EVENT LIST */
/* ===================================== */

.event-list {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 11px;

}


/* ===================================== */
/* EVENT CARD */
/* ===================================== */

.event-card {

  display: flex;

  overflow: hidden;

  border:
    1px solid
    #e9ecef;

  border-radius: 13px;

  background: #ffffff;

}


.event-card.death-event {

  border-left:
    4px solid
    #922525;

}


/* ===================================== */
/* EVENT DATE */
/* ===================================== */

.event-date {

  width: 76px;

  flex-shrink: 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding:
    14px 7px;

  border-right:
    1px solid
    #f1f3f5;

  background: #fafafa;

}


.event-date strong {

  color: #922525;

  font-size: 1.65rem;

  line-height: 1;

}


.event-date span {

  margin-top: 5px;

  color: #495057;

  font-size: 0.68rem;

  font-weight: 700;

}


.event-date small {

  margin-top: 2px;

  color: #adb5bd;

  font-size: 0.58rem;

}


/* ===================================== */
/* EVENT CONTENT */
/* ===================================== */

.event-content {

  flex: 1;

  min-width: 0;

  padding: 13px;

}


.event-top {

  margin-bottom: 5px;

}


.event-type {

  display: inline-flex;

  padding:
    3px 8px;

  border-radius: 999px;

  background: #e7f5ff;

  color: #1971c2;

  font-size: 0.68rem;

  font-weight: 700;

}


.event-type.death {

  background: #fff0f0;

  color: #922525;

}


.event-content h3 {

  margin:
    0 0
    10px;

  color: #343a40;

  font-size: 0.98rem;

  line-height: 1.4;

}


/* ===================================== */
/* PERSON */
/* ===================================== */

.person-link {

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    8px 9px;

  border-radius: 9px;

  background: #f8f9fa;

  color: inherit;

  text-decoration: none;

}


.mini-avatar {

  width: 39px;

  height: 39px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border:
    2px solid
    #dee2e6;

  border-radius: 50%;

  color: #adb5bd;

}


.mini-avatar.male {

  border-color: #4dabf7;

}


.mini-avatar.female {

  border-color: #f783ac;

}


.mini-avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


.person-info {

  flex: 1;

  min-width: 0;

}


.person-info strong {

  display: block;

  overflow: hidden;

  color: #343a40;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.84rem;

}


.person-info span {

  display: block;

  margin-top: 1px;

  color: #868e96;

  font-size: 0.7rem;

}


.person-arrow {

  color: #adb5bd;

  font-size: 22px;

}


/* ===================================== */
/* LOCATION */
/* ===================================== */

.event-location {

  display: flex;

  align-items: flex-start;

  gap: 5px;

  margin-top: 9px;

  color: #6c757d;

  font-size: 0.76rem;

}


.event-location i {

  margin-top: 1px;

  color: #922525;

}


/* ===================================== */
/* NOTE */
/* ===================================== */

.event-note {

  margin-top: 8px;

  padding-top: 8px;

  border-top:
    1px dashed
    #dee2e6;

  color: #868e96;

  font-size: 0.75rem;

  line-height: 1.5;

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

  font-size: 35px;

}


.empty-box strong {

  display: block;

  color: #343a40;

}


.empty-box p {

  margin:
    4px 0 14px;

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

  .event-list {

    grid-template-columns: 1fr;

  }

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .events-page {

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


  .month-section {

    margin-bottom: 22px;

  }


  .event-list {

    gap: 8px;

  }


  .event-card {

    border-radius: 11px;

  }


  .event-date {

    width: 66px;

    padding:
      12px 5px;

  }


  .event-date strong {

    font-size: 1.45rem;

  }


  .event-content {

    padding: 11px;

  }


  .event-content h3 {

    font-size: 0.91rem;

  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .event-date {

    width: 59px;

  }


  .event-content {

    padding:
      10px 8px;

  }


  .person-link {

    padding:
      7px;

  }


  .mini-avatar {

    width: 35px;

    height: 35px;

  }

}

</style>