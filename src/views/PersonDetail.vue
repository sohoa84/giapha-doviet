<template>

  <div class="person-detail-page container">

    <!-- ===================================== -->
    <!-- LOADING -->
    <!-- ===================================== -->

    <div
      v-if="loading"
      class="loading-box"
    >
      <div class="spinner-border"></div>

      <div class="loading-text">
        Đang tải thông tin...
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
    <!-- PERSON -->
    <!-- ===================================== -->

    <div v-else-if="person">

      <!-- =================================== -->
      <!-- HERO / PROFILE -->
      <!-- =================================== -->

      <section
        class="profile-card"
        :class="personTypeClass"
      >

        <div class="profile-photo-wrap">

          <img
            v-if="person.Photo"
            :src="getPhotoUrl(person.Photo)"
            :alt="fullName"
            class="person-photo"
          >

          <div
            v-else
            class="person-photo person-placeholder"
          >
            <i class="bi bi-person"></i>
          </div>

        </div>


        <div class="profile-content">

          <!-- ID + ĐỜI -->

          <div class="profile-meta">

            <span>
              {{ person.ID }}
            </span>

            <span class="meta-dot">
              •
            </span>

            <span>
              Đời {{ generation }}
            </span>

          </div>


          <!-- NAME -->

          <h1 class="person-name">

            {{ fullName }}

          </h1>


          <!-- TÊN TỰ -->

          <div
            v-if="person['Tên Tự']"
            class="person-alias"
          >
            Tên Tự:
            {{ person['Tên Tự'] }}
          </div>


          <!-- BADGES -->

          <div class="profile-badges">

            <span
              class="person-badge"
              :class="genderBadgeClass"
            >
              {{ personRole }}
            </span>

            <span
              v-if="lifeText"
              class="life-badge"
            >
              {{ lifeText }}
            </span>

          </div>

        </div>

      </section>


      <!-- =================================== -->
      <!-- BASIC INFORMATION -->
      <!-- =================================== -->

      <section class="detail-section">

        <h2 class="section-title">

          <i class="bi bi-person-vcard"></i>

          Thông tin

        </h2>


        <div class="info-grid">

          <div class="info-item">

            <div class="info-label">
              Giới tính
            </div>

            <div class="info-value">
              {{ person['Giới tính'] || '—' }}
            </div>

          </div>


          <div class="info-item">

            <div class="info-label">
              Đời
            </div>

            <div class="info-value">
              {{ generation || '—' }}
            </div>

          </div>


          <div class="info-item">

            <div class="info-label">
              Năm sinh
            </div>

            <div class="info-value">
              {{ person['Năm sinh'] || '—' }}
            </div>

          </div>


          <div class="info-item">

            <div class="info-label">
              Năm mất
            </div>

            <div class="info-value">
              {{ person['Năm mất'] || '—' }}
            </div>

          </div>

        </div>

      </section>


      <!-- =================================== -->
      <!-- PARENTS -->
      <!-- =================================== -->

      <section
        v-if="parents.length"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-people"></i>

          Cha mẹ

        </h2>


        <div class="relation-grid">

          <PersonCard
            v-for="parent in parents"
            :key="parent.ID"
            :person="parent"
          />

        </div>

      </section>


      <!-- =================================== -->
      <!-- SPOUSES -->
      <!-- =================================== -->

      <section
        v-if="spouses.length"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-heart"></i>

          Vợ / Chồng

        </h2>


        <div class="relation-grid">

          <PersonCard
            v-for="spouse in spouses"
            :key="spouse.ID"
            :person="spouse"
          />

        </div>

      </section>


      <!-- =================================== -->
      <!-- CHILDREN -->
      <!-- =================================== -->

      <section
        v-if="children.length"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-diagram-3"></i>

          Con

          <span class="section-count">
            {{ children.length }}
          </span>

        </h2>


        <div class="relation-grid children-grid">

          <PersonCard
            v-for="child in children"
            :key="child.ID"
            :person="child"
          />

        </div>

      </section>


      <!-- =================================== -->
      <!-- BIOGRAPHY -->
      <!-- =================================== -->

      <section
        v-if="person.biography"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-book"></i>

          Tiểu sử

        </h2>


        <div class="content-card biography">

          {{ person.biography }}

        </div>

      </section>


      <!-- =================================== -->
      <!-- EVENTS -->
      <!-- =================================== -->

      <section
        v-if="
          person.events &&
          person.events.length
        "
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-calendar-event"></i>

          Sự kiện

          <span class="section-count">
            {{ person.events.length }}
          </span>

        </h2>


        <div class="event-list">

          <article
            v-for="(event, index) in person.events"
            :key="index"
            class="event-card"
          >

            <div class="event-header">

              <div class="event-icon">
                📅
              </div>

              <div>

                <div class="event-type">
                  {{ event.LOAI || 'Sự kiện' }}
                </div>

                <div
                  v-if="event['NGÀY ÂM LỊCH']"
                  class="event-date"
                >
                  {{ event['NGÀY ÂM LỊCH'] }} âm lịch
                </div>

              </div>

            </div>


            <div
              v-if="event['NOI DUNG']"
              class="event-content"
            >
              {{ event['NOI DUNG'] }}
            </div>


            <div
              v-if="event['MỘ PHẦN']"
              class="event-location"
            >

              <i class="bi bi-geo-alt"></i>

              {{ event['MỘ PHẦN'] }}

            </div>

          </article>

        </div>

      </section>


      <!-- =================================== -->
      <!-- MEDIA -->
      <!-- =================================== -->

      <section
        v-if="publicMedia.length"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-images"></i>

          Hình ảnh

          <span class="section-count">
            {{ publicMedia.length }}
          </span>

        </h2>


        <div class="media-grid">

          <figure
            v-for="(media, index) in publicMedia"
            :key="index"
            class="media-card"
          >

            <img
              v-if="media.FILE"
              :src="getMediaUrl(media.FILE)"
              :alt="media.Caption || fullName"
              class="person-media"
              loading="lazy"
            >

            <figcaption
              v-if="media.Caption"
              class="media-caption"
            >
              {{ media.Caption }}
            </figcaption>

          </figure>

        </div>

      </section>


      <!-- =================================== -->
      <!-- NOTES -->
      <!-- =================================== -->

      <section
        v-if="person['Ghi chú']"
        class="detail-section"
      >

        <h2 class="section-title">

          <i class="bi bi-info-circle"></i>

          Ghi chú

        </h2>


        <div class="content-card notes">

          {{ person['Ghi chú'] }}

        </div>

      </section>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue';


import {
  useRoute
} from 'vue-router';


import {
  getPerson,
  getParents,
  getChildren,
  getSpouses
} from '../services/dataService';


import PersonCard
  from '../components/PersonCard.vue';


// ======================================
// ROUTE
// ======================================

const route =
  useRoute();


// ======================================
// STATE
// ======================================

const person =
  ref(null);

const parents =
  ref([]);

const children =
  ref([]);

const spouses =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');


// ======================================
// GENERATION
// ======================================

const generation =
  computed(() => {

    if (!person.value) {
      return '';
    }

    return (
      person.value.generation ??
      person.value['Đời'] ??
      ''
    );

  });


// ======================================
// FULL NAME
// ======================================

const fullName =
  computed(() => {

    if (!person.value) {
      return '';
    }

    return [
      person.value['Họ'],
      person.value['Tên']
    ]
      .filter(Boolean)
      .join(' ');

  });


// ======================================
// LIFE TEXT
// ======================================

const lifeText =
  computed(() => {

    if (!person.value) {
      return '';
    }

    const birth =
      person.value['Năm sinh'];

    const death =
      person.value['Năm mất'];


    if (
      birth &&
      death
    ) {

      return `${birth} – ${death}`;

    }


    if (birth) {

      return `Sinh ${birth}`;

    }


    if (death) {

      return `Mất ${death}`;

    }


    return '';

  });


// ======================================
// SPOUSE CHECK
// ======================================

const isSpouse =
  computed(() => {

    if (!person.value) {
      return false;
    }

    const id =
      String(
        person.value.ID || ''
      );


    const hasSpouseSuffix =
      /S\d+$/i.test(id);


    const noFather =
      !person.value['Cha'] &&
      !person.value.Father;


    const noMother =
      !person.value['Mẹ'] &&
      !person.value.Mother;


    return (
      hasSpouseSuffix &&
      noFather &&
      noMother
    );

  });


// ======================================
// PERSON ROLE
// ======================================

const personRole =
  computed(() => {

    if (!person.value) {
      return '';
    }


    if (isSpouse.value) {

      if (
        person.value['Giới tính'] ===
        'Nữ'
      ) {

        return 'Dâu';

      }


      if (
        person.value['Giới tính'] ===
        'Nam'
      ) {

        return 'Rể';

      }

    }


    return (
      person.value['Giới tính'] ||
      'Thành viên'
    );

  });


// ======================================
// PROFILE STYLE
// ======================================

const personTypeClass =
  computed(() => {

    if (!person.value) {
      return '';
    }


    if (isSpouse.value) {

      if (
        person.value['Giới tính'] ===
        'Nữ'
      ) {

        return 'profile-dau';

      }


      if (
        person.value['Giới tính'] ===
        'Nam'
      ) {

        return 'profile-re';

      }

    }


    if (
      person.value['Giới tính'] ===
      'Nam'
    ) {

      return 'profile-male';

    }


    if (
      person.value['Giới tính'] ===
      'Nữ'
    ) {

      return 'profile-female';

    }


    return '';

  });


// ======================================
// BADGE STYLE
// ======================================

const genderBadgeClass =
  computed(() => {

    if (!person.value) {
      return '';
    }


    if (isSpouse.value) {

      if (
        person.value['Giới tính'] ===
        'Nữ'
      ) {

        return 'badge-dau';

      }


      if (
        person.value['Giới tính'] ===
        'Nam'
      ) {

        return 'badge-re';

      }

    }


    if (
      person.value['Giới tính'] ===
      'Nam'
    ) {

      return 'badge-male';

    }


    if (
      person.value['Giới tính'] ===
      'Nữ'
    ) {

      return 'badge-female';

    }


    return '';

  });


// ======================================
// PUBLIC MEDIA
// ======================================

const publicMedia =
  computed(() => {

    if (!person.value?.media) {
      return [];
    }


    return person.value.media

      .filter(media => {

        return (
          String(
            media.VISIBILITY || ''
          )
            .trim()
            .toLowerCase() ===
          'public'
        );

      });

  });


// ======================================
// PHOTO URL
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
// LOAD PERSON
// ======================================

async function loadPerson() {

  try {

    loading.value =
      true;

    error.value =
      '';


    const id =
      route.params.id;


    const result =
      await getPerson(id);


    if (!result) {

      throw new Error(
        `Không tìm thấy thành viên: ${id}`
      );

    }


    person.value =
      result;


    parents.value =
      await getParents(id);


    children.value =
      await getChildren(id);


    spouses.value =
      await getSpouses(id);

  }

  catch (err) {

    console.error(err);


    error.value =
      err.message ||
      'Không thể tải dữ liệu';

  }

  finally {

    loading.value =
      false;

  }

}


// ======================================
// INIT
// ======================================

onMounted(
  loadPerson
);


// ======================================
// WATCH PERSON ID
// ======================================

watch(
  () => route.params.id,
  async () => {

    await loadPerson();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
);

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.person-detail-page {

  padding-top: 28px;

  padding-bottom: 60px;

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
/* PROFILE */
/* ===================================== */

.profile-card {

  display: flex;

  align-items: center;

  gap: 24px;

  padding: 24px;

  margin-bottom: 28px;

  border:
    1px solid
    #e3e6e8;

  border-left-width: 5px;

  border-radius: 16px;

  background: #ffffff;

}


/* ===================================== */
/* NAM / NỮ */
/* ===================================== */

.profile-male {

  border-left-color: #4dabf7;

}


.profile-female {

  border-left-color: #f783ac;

}


/* ===================================== */
/* DÂU / RỂ */
/* ===================================== */

.profile-dau {

  border-color: #f783ac;

  border-style: dashed;

  border-left-width: 5px;

}


.profile-re {

  border-color: #4dabf7;

  border-style: dashed;

  border-left-width: 5px;

}


/* ===================================== */
/* PHOTO */
/* ===================================== */

.profile-photo-wrap {

  flex-shrink: 0;

}


.person-photo {

  width: 165px;

  height: 165px;

  object-fit: cover;

  border-radius: 50%;

  border:
    4px solid
    #f1f3f5;

  background: #f1f3f5;

}


.person-placeholder {

  display: flex;

  align-items: center;

  justify-content: center;

  color: #adb5bd;

  font-size: 4rem;

}


/* ===================================== */
/* PROFILE CONTENT */
/* ===================================== */

.profile-content {

  min-width: 0;

  flex: 1;

}


.profile-meta {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 6px;

  margin-bottom: 5px;

  color: #868e96;

  font-size: 0.82rem;

}


.meta-dot {

  color: #adb5bd;

}


.person-name {

  margin: 0;

  color: #343a40;

  font-size: 2rem;

  font-weight: 700;

}


.person-alias {

  margin-top: 5px;

  color: #795548;

  font-size: 0.9rem;

  font-style: italic;

}


.profile-badges {

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 13px;

}


.person-badge,
.life-badge {

  display: inline-flex;

  align-items: center;

  min-height: 28px;

  padding:
    4px 10px;

  border-radius: 999px;

  font-size: 0.78rem;

  font-weight: 700;

}


.life-badge {

  background: #f1f3f5;

  color: #495057;

}


/* ===================================== */
/* BADGES */
/* ===================================== */

.badge-male {

  background: #e7f5ff;

  color: #1971c2;

}


.badge-female {

  background: #fff0f6;

  color: #c2255c;

}


.badge-dau {

  border:
    1px dashed
    #f783ac;

  background: #fff0f6;

  color: #c2255c;

}


.badge-re {

  border:
    1px dashed
    #4dabf7;

  background: #e7f5ff;

  color: #1971c2;

}


/* ===================================== */
/* SECTIONS */
/* ===================================== */

.detail-section {

  margin-bottom: 28px;

}


.section-title {

  display: flex;

  align-items: center;

  gap: 8px;

  margin:
    0 0
    12px;

  padding-bottom: 8px;

  border-bottom:
    1px solid
    #dee2e6;

  color: #343a40;

  font-size: 1.15rem;

  font-weight: 700;

}


.section-title > i {

  color: #922525;

}


.section-count {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 23px;

  height: 23px;

  padding:
    0 6px;

  margin-left: 2px;

  border-radius: 999px;

  background: #f1f3f5;

  color: #6c757d;

  font-size: 0.72rem;

}


/* ===================================== */
/* INFO */
/* ===================================== */

.info-grid {

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 10px;

}


.info-item {

  padding: 13px;

  border:
    1px solid
    #e9ecef;

  border-radius: 10px;

  background: #ffffff;

}


.info-label {

  margin-bottom: 3px;

  color: #868e96;

  font-size: 0.74rem;

}


.info-value {

  color: #343a40;

  font-size: 0.92rem;

  font-weight: 700;

}


/* ===================================== */
/* RELATIONS */
/* ===================================== */

.relation-grid {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

}


.children-grid {

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

}


/* ===================================== */
/* CONTENT CARD */
/* ===================================== */

.content-card {

  padding: 17px;

  border:
    1px solid
    #e9ecef;

  border-radius: 12px;

  background: #ffffff;

}


.biography {

  white-space: pre-line;

  line-height: 1.8;

  color: #495057;

}


.notes {

  white-space: pre-line;

  line-height: 1.65;

  background: #f8f9fa;

}


/* ===================================== */
/* EVENTS */
/* ===================================== */

.event-list {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

}


.event-card {

  padding: 15px;

  border:
    1px solid
    #e9ecef;

  border-radius: 12px;

  background: #ffffff;

}


.event-header {

  display: flex;

  align-items: center;

  gap: 10px;

}


.event-icon {

  width: 38px;

  height: 38px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #fff3bf;

}


.event-type {

  font-weight: 700;

  color: #343a40;

}


.event-date {

  margin-top: 2px;

  color: #868e96;

  font-size: 0.78rem;

}


.event-content {

  margin-top: 11px;

  color: #495057;

  line-height: 1.55;

}


.event-location {

  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 9px;

  color: #868e96;

  font-size: 0.8rem;

}


/* ===================================== */
/* MEDIA */
/* ===================================== */

.media-grid {

  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 10px;

}


.media-card {

  margin: 0;

  overflow: hidden;

  border:
    1px solid
    #e9ecef;

  border-radius: 12px;

  background: #ffffff;

}


.person-media {

  display: block;

  width: 100%;

  height: 250px;

  object-fit: cover;

}


.media-caption {

  padding:
    9px 11px;

  color: #6c757d;

  font-size: 0.8rem;

}


/* ===================================== */
/* TABLET */
/* ===================================== */

@media (max-width: 992px) {

  .children-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

  }


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

  .person-detail-page {

    padding-top: 14px;

    padding-left: 12px;

    padding-right: 12px;

  }


  /* ------------------------------ */
  /* PROFILE */
  /* ------------------------------ */

  .profile-card {

    flex-direction: column;

    gap: 13px;

    padding: 17px 14px;

    margin-bottom: 20px;

    text-align: center;

    border-radius: 13px;

  }


  .person-photo {

    width: 118px;

    height: 118px;

  }


  .person-placeholder {

    font-size: 3rem;

  }


  .profile-meta {

    justify-content: center;

  }


  .person-name {

    font-size: 1.5rem;

  }


  .person-alias {

    font-size: 0.82rem;

  }


  .profile-badges {

    justify-content: center;

    margin-top: 10px;

  }


  /* ------------------------------ */
  /* SECTIONS */
  /* ------------------------------ */

  .detail-section {

    margin-bottom: 22px;

  }


  .section-title {

    margin-bottom: 9px;

    font-size: 1rem;

  }


  /* ------------------------------ */
  /* INFO */
  /* ------------------------------ */

  .info-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 7px;

  }


  .info-item {

    padding: 10px;

  }


  /* ------------------------------ */
  /* RELATIONS */
  /* ------------------------------ */

  .relation-grid,
  .children-grid {

    grid-template-columns: 1fr;

    gap: 8px;

  }


  /* ------------------------------ */
  /* EVENTS */
  /* ------------------------------ */

  .event-list {

    grid-template-columns: 1fr;

    gap: 8px;

  }


  /* ------------------------------ */
  /* MEDIA */
  /* ------------------------------ */

  .media-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 7px;

  }


  .person-media {

    height: 175px;

  }


  .media-caption {

    padding: 7px 8px;

    font-size: 0.74rem;

  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .person-photo {

    width: 105px;

    height: 105px;

  }


  .person-name {

    font-size: 1.35rem;

  }


  .person-media {

    height: 150px;

  }

}

</style>