<template>
  <div class="container py-4">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
      <p class="mt-3">Đang tải thông tin...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Person -->
    <div v-else-if="person">

      <!-- Header -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">

          <div class="row align-items-center">

            <!-- Photo -->
            <div class="col-md-3 text-center mb-3 mb-md-0">

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
                Tên tự: {{ person['Tên Tự'] }}
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


      <!-- Parents -->
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
            <PersonCard :person="parent" />
          </div>

        </div>

      </section>


      <!-- Spouses -->
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
            <PersonCard :person="spouse" />
          </div>

        </div>

      </section>


      <!-- Children -->
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
            <PersonCard :person="child" />
          </div>

        </div>

      </section>


      <!-- Biography -->
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


      <!-- Notes -->
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
  onMounted
} from 'vue';

import {
  getPerson,
  getParents,
  getChildren,
  getSpouses
} from '../services/dataService';

import PersonCard from '../components/PersonCard.vue';

import { useRoute } from 'vue-router';


// ======================================
// ROUTE
// ======================================

const route = useRoute();


// ======================================
// STATE
// ======================================

const person = ref(null);

const parents = ref([]);

const children = ref([]);

const spouses = ref([]);

const loading = ref(true);

const error = ref('');


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
// FULL NAME
// ======================================

const fullName = computed(() => {

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

    loading.value = true;

    error.value = '';

    const id = route.params.id;

    const result =
      await getPerson(id);

    if (!result) {

      throw new Error(
        `Không tìm thấy thành viên: ${id}`
      );

    }

    person.value = result;

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

    loading.value = false;

  }

}


// ======================================
// INIT
// ======================================

onMounted(
  loadPerson
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

</style>