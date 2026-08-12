<template>
<div class="container py-5">
  <!-- Loading -->
  <div
    v-if="loading"
    class="text-center py-5"
  >

    <div class="spinner-border"></div>

    <p class="mt-3">
      Đang tải thông tin...
    </p>

  </div>


  <!-- Error -->
  <div
    v-else-if="error"
    class="alert alert-danger"
  >

    {{ error }}

  </div>


  <!-- Person -->
  <div
    v-else-if="person"
  >

    <!-- ====================================== -->
    <!-- HEADER -->
    <!-- ====================================== -->

    <div class="card shadow-sm mb-4">

      <div class="card-body">

        <div class="row align-items-center">

          <!-- Photo -->

          <div
            class="col-md-3 text-center mb-3 mb-md-0"
          >

            <img
              v-if="person.Photo"
              :src="getPhotoUrl(person.Photo)"
              :alt="fullName"
              class="person-photo"
            >

            <div
              v-else
              class="person-placeholder"
            >

              <i class="bi bi-person"></i>

            </div>

          </div>


          <!-- Basic information -->

          <div class="col-md-9">

            <div class="text-muted small">

              {{ person.ID }}

              · Đời {{ person.generation }}

            </div>


            <h1 class="display-6 fw-bold mb-2">

              {{ fullName }}

            </h1>


            <div
              v-if="person['Tên Tự']"
              class="text-muted mb-3"
            >

              Tên tự:
              {{ person['Tên Tự'] }}

            </div>


            <div class="row">

              <div class="col-sm-6 mb-2">

                <strong>Giới tính:</strong>

                {{ person['Giới tính'] || '—' }}

              </div>


              <div class="col-sm-6 mb-2">

                <strong>Năm sinh:</strong>

                {{ person['Năm sinh'] || '—' }}

              </div>


              <div class="col-sm-6 mb-2">

                <strong>Năm mất:</strong>

                {{ person['Năm mất'] || '—' }}

              </div>


              <div class="col-sm-6 mb-2">

                <strong>Đời:</strong>

                {{ person.generation || '—' }}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


    <!-- ====================================== -->
    <!-- PARENTS -->
    <!-- ====================================== -->

    <section
      v-if="parents.length"
      class="mb-4"
    >

      <h2 class="h4 border-bottom pb-2">

        <i class="bi bi-people me-2"></i>

        Cha mẹ

      </h2>


      <div class="row">

        <div
          v-for="parent in parents"
          :key="parent.ID"
          class="col-md-6 mb-3"
        >

          <PersonCard
            :person="parent"
          />

        </div>

      </div>

    </section>


    <!-- ====================================== -->
    <!-- SPOUSES -->
    <!-- ====================================== -->

    <section
      v-if="spouses.length"
      class="mb-4"
    >

      <h2 class="h4 border-bottom pb-2">

        <i class="bi bi-heart me-2"></i>

        Vợ / Chồng

      </h2>


      <div class="row">

        <div
          v-for="spouse in spouses"
          :key="spouse.ID"
          class="col-md-6 mb-3"
        >

          <PersonCard
            :person="spouse"
          />

        </div>

      </div>

    </section>


    <!-- ====================================== -->
    <!-- CHILDREN -->
    <!-- ====================================== -->

    <section
      v-if="children.length"
      class="mb-4"
    >

      <h2 class="h4 border-bottom pb-2">

        <i class="bi bi-diagram-3 me-2"></i>

        Con

      </h2>


      <div class="row">

        <div
          v-for="child in children"
          :key="child.ID"
          class="col-md-6 col-lg-4 mb-3"
        >

          <PersonCard
            :person="child"
          />

        </div>

      </div>

    </section>


    <!-- ====================================== -->
    <!-- BIOGRAPHY -->
    <!-- ====================================== -->

    <section
      v-if="person.biography"
      class="mb-4"
    >

      <h2 class="h4 border-bottom pb-2">

        <i class="bi bi-book me-2"></i>

        Tiểu sử

      </h2>


      <div class="card">

        <div class="card-body biography">

          {{ person.biography }}

        </div>

      </div>

    </section>


    <!-- ====================================== -->
    <!-- EVENTS -->
    <!-- ====================================== -->

    <!-- ====================================== -->
<!-- EVENTS -->
<!-- ====================================== -->

<section
  v-if="person.events && person.events.length"
  class="mb-4"
>

  <h2 class="h4 border-bottom pb-2">

    <i class="bi bi-calendar-event me-2"></i>

    Sự kiện

  </h2>


  <div class="card">

    <div class="card-body">

      <div
        v-for="(event, index) in person.events"
        :key="index"
        class="event-item"
      >

        <!-- Loại sự kiện -->

        <div class="fw-semibold">

          <i class="bi bi-calendar-event me-2"></i>

          {{ event.LOAI || 'Sự kiện' }}

        </div>


        <!-- Ngày âm lịch -->

        <div
          v-if="event['NGÀY ÂM LỊCH']"
          class="text-muted small mt-1"
        >

          <i class="bi bi-calendar3 me-1"></i>

          Ngày:
          {{ event['NGÀY ÂM LỊCH'] }}

        </div>


        <!-- Nội dung -->

        <div
          v-if="event['NOI DUNG']"
          class="mt-2"
        >

          {{ event['NOI DUNG'] }}

        </div>


        <!-- Mộ phần -->

        <div
          v-if="event['MỘ PHẦN']"
          class="text-muted small mt-2"
        >

          <i class="bi bi-geo-alt me-1"></i>

          Mộ phần:
          {{ event['MỘ PHẦN'] }}

        </div>

      </div>

    </div>

  </div>

</section>


    <!-- ====================================== -->
    <!-- MEDIA -->
    <!-- ====================================== -->

    <section
  v-if="publicMedia.length"
  class="mb-4"
>

  <h2 class="h4 border-bottom pb-2">

    <i class="bi bi-images me-2"></i>

    Hình ảnh

  </h2>


  <div class="row g-3">

    <div
      v-for="(media, index) in publicMedia"
      :key="index"
      class="col-12 col-md-6 col-lg-4"
    >

      <div class="card h-100 shadow-sm">

        <img
          v-if="media.FILE"
          :src="getMediaUrl(media.FILE)"
          :alt="media.Caption || fullName"
          class="card-img-top person-media"
        >

        <div
          v-if="media.Caption"
          class="card-body"
        >

          <div class="text-muted">
            {{ media.Caption }}
          </div>

        </div>

      </div>

    </div>

  </div>

</section>


    <!-- ====================================== -->
    <!-- NOTES -->
    <!-- ====================================== -->

    <section
      v-if="person['Ghi chú']"
      class="mb-4"
    >

      <h2 class="h4 border-bottom pb-2">

        <i class="bi bi-info-circle me-2"></i>

        Ghi chú

      </h2>


      <div class="alert alert-light">

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
  getPerson,
  getParents,
  getChildren,
  getSpouses
} from '../services/dataService';


import PersonCard
  from '../components/PersonCard.vue';


import {
  useRoute
} from 'vue-router';


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
// PUBLIC MEDIA
// ======================================

const publicMedia = computed(() => {

  if (!person.value?.media) {
    return [];
  }

  return person.value.media.filter(media =>
    String(media.VISIBILITY || '')
      .trim()
      .toLowerCase() === 'public'
  );

});

// ======================================
// PHOTO URL
// ======================================

function getPhotoUrl(photo) {

  if (!photo) {

    return '';

  }


  return `${import.meta.env.BASE_URL}${photo}`;

}

// ======================================
// MEDIA URL
// ======================================

function getMediaUrl(file) {

  if (!file) {
    return '';
  }

  return `${import.meta.env.BASE_URL}${file}`;
}

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
        console.log('PERSON:', result);
        console.log('MEDIA:', result.media);

        parents.value =
        await getParents(id);
        

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

  () => {

    loadPerson();

  }

);

</script>


<style scoped>

.person-photo,
.person-placeholder {

  width: 180px;

  height: 180px;

  object-fit: cover;

  border-radius: 50%;

}

.person-media {
  width: 100%;
  height: 280px;
  object-fit: cover;
}
.person-placeholder {

  margin: auto;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f1f3f5;

  font-size: 4rem;

  color: #adb5bd;

}


.biography {

  white-space: pre-line;

  line-height: 1.8;

}


/* ======================================
   EVENTS
====================================== */

.event-item {

  padding: 12px 0;

  border-bottom: 1px solid #dee2e6;

}


.event-item:last-child {

  border-bottom: none;

}


/* ======================================
   MEDIA
====================================== */

.media-image {

  width: 100%;

  height: 200px;

  object-fit: cover;

  display: block;

}

</style>