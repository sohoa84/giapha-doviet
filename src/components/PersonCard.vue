<template>

  <router-link
    :to="`/nguoi/${person.ID}`"
    class="text-decoration-none"
  >

    <div class="card person-card h-100">

      <div class="card-body">

        <div class="d-flex align-items-center">

          <!-- Photo -->

          <img
            v-if="person.Photo"
            :src="getPhotoUrl(person.Photo)"
            :alt="fullName"
            class="avatar me-3"
          >

          <div
            v-else
            class="avatar avatar-placeholder me-3"
          >
            <i class="bi bi-person"></i>
          </div>


          <!-- Information -->

          <div>

            <div class="fw-bold">
              {{ fullName }}
            </div>

            <div class="small text-muted">
              {{ person.ID }}
            </div>

            <div class="small text-muted">
              Đời {{ person.generation }}
            </div>

          </div>

        </div>

      </div>

    </div>

  </router-link>

</template>


<script setup>

import {
  computed
} from 'vue';


const props =
  defineProps({

    person: {
      type: Object,
      required: true
    }

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



const fullName =
  computed(() => {

    return [

      props.person['Họ'],
      props.person['Tên']

    ]
      .filter(Boolean)
      .join(' ');

  });

</script>


<style scoped>

.person-card {

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}

.person-card:hover {

  transform: translateY(-3px);

  box-shadow:
    0 0.5rem 1rem
    rgba(0, 0, 0, 0.12);

}


.avatar {

  width: 55px;
  height: 55px;

  object-fit: cover;

  border-radius: 50%;

}


.avatar-placeholder {

  display: flex;

  align-items: center;
  justify-content: center;

  background: #f1f3f5;

  color: #adb5bd;

  font-size: 1.5rem;

}

</style>