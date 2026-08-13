<template>

  <router-link
    :to="{
      name: 'person-detail',
      params: {
        id: person.ID
      }
    }"
    class="person-link"
  >

    <article
      class="person-card"
      :class="genderClass"
    >

      <!-- ================================= -->
      <!-- AVATAR -->
      <!-- ================================= -->

      <div class="avatar-wrap">

        <img
          v-if="person.Photo"
          :src="getPhotoUrl(person.Photo)"
          :alt="fullName"
          class="avatar"
          loading="lazy"
        >

        <div
          v-else
          class="avatar avatar-placeholder"
        >
          <i class="bi bi-person"></i>
        </div>

      </div>


      <!-- ================================= -->
      <!-- INFO -->
      <!-- ================================= -->

      <div class="person-info">

        <div class="person-name">

          {{ fullName }}

        </div>


        <div
          v-if="person['Tên Tự']"
          class="person-alias"
        >

          Tên Tự:
          {{ person['Tên Tự'] }}

        </div>


        <div class="person-meta">

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


        <div
          v-if="lifeText"
          class="person-life"
        >

          {{ lifeText }}

        </div>

      </div>


      <!-- ================================= -->
      <!-- ARROW -->
      <!-- ================================= -->

      <div class="person-arrow">

        ›

      </div>

    </article>

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
// FULL NAME
// ======================================

const fullName =
  computed(() => {

    return [

      props.person['Họ'],
      props.person['Tên']

    ]
      .filter(Boolean)
      .join(' ');

  });


// ======================================
// GENERATION
// ======================================

const generation =
  computed(() => {

    return (
      props.person.generation ??
      props.person['Đời'] ??
      ''
    );

  });


// ======================================
// LIFE
// ======================================

const lifeText =
  computed(() => {

    const birth =
      props.person['Năm sinh'];

    const death =
      props.person['Năm mất'];


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
// GENDER STYLE
// ======================================
const genderClass =
  computed(() => {

    const id =
      String(
        props.person.ID || ''
      );


    // ==================================
    // KIỂM TRA DÂU / RỂ
    // ==================================
    //
    // Quy ước dự án:
    // VA-10.02S1
    // VA-10.02S2
    // ...
    //
    // Đồng thời Cha và Mẹ đều trống.
    //

    const isSpouse =
      /S\d+$/i.test(id) &&
      !props.person['Cha'] &&
      !props.person['Mẹ'];


    // ==================================
    // DÂU
    // Nữ + spouse
    // ==================================

    if (
      isSpouse &&
      props.person['Giới tính'] === 'Nữ'
    ) {

      return 'person-daughter-in-law';

    }


    // ==================================
    // RỂ
    // Nam + spouse
    // ==================================

    if (
      isSpouse &&
      props.person['Giới tính'] === 'Nam'
    ) {

      return 'person-son-in-law';

    }


    // ==================================
    // NAM CHÍNH / CON TRAI
    // ==================================

    if (
      props.person['Giới tính'] === 'Nam'
    ) {

      return 'person-male';

    }


    // ==================================
    // NỮ CHÍNH / CON GÁI
    // ==================================

    if (
      props.person['Giới tính'] === 'Nữ'
    ) {

      return 'person-female';

    }


    return '';

  });

</script>


<style scoped>

/* ===================================== */
/* LINK */
/* ===================================== */

.person-link {

  display: block;

  height: 100%;

  color: inherit;

  text-decoration: none;

}


/* ===================================== */
/* CARD */
/* ===================================== */

.person-card {

  position: relative;

  min-height: 92px;

  height: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    13px 38px
    13px 13px;

  border:
    1px solid
    #e3e6e8;

  border-left-width: 4px;

  border-radius: 12px;

  background: #ffffff;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;

}


/* ===================================== */
/* GENDER */
/* ===================================== */

.person-male {

  border-left-color:
    #4dabf7;

}


.person-female {

  border-left-color:
    #f783ac;

}

/* ===================================== */
/* DÂU - HỒNG NÉT ĐỨT */
/* ===================================== */

.person-daughter-in-law {

  border-left-color: #f783ac;

  border-left-style: dashed;

}


/* ===================================== */
/* RỂ - XANH NÉT ĐỨT */
/* ===================================== */

.person-son-in-law {

  border-left-color: #4dabf7;

  border-left-style: dashed;

}

/* ===================================== */
/* HOVER */
/* ===================================== */

.person-link:hover .person-card {

  transform:
    translateY(-2px);

  box-shadow:
    0 5px 16px
    rgba(
      0,
      0,
      0,
      0.08
    );

}


/* ===================================== */
/* AVATAR */
/* ===================================== */

.avatar-wrap {

  flex-shrink: 0;

}


.avatar {

  width: 62px;

  height: 62px;

  object-fit: cover;

  border-radius: 50%;

  background: #f1f3f5;

}


.avatar-placeholder {

  display: flex;

  align-items: center;

  justify-content: center;

  color: #adb5bd;

  font-size: 1.6rem;

}


/* ===================================== */
/* INFORMATION */
/* ===================================== */

.person-info {

  flex: 1;

  min-width: 0;

}


.person-name {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #343a40;

  font-size: 0.98rem;

  font-weight: 700;

}


.person-alias {

  margin-top: 2px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #795548;

  font-size: 0.78rem;

  font-style: italic;

}


.person-meta {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 4px;

  color: #6c757d;

  font-size: 0.77rem;

}


.meta-dot {

  color: #adb5bd;

}


.person-life {

  margin-top: 3px;

  color: #868e96;

  font-size: 0.77rem;

}


/* ===================================== */
/* ARROW */
/* ===================================== */

.person-arrow {

  position: absolute;

  right: 13px;

  top: 50%;

  transform:
    translateY(-50%);

  color: #adb5bd;

  font-size: 26px;

  font-weight: 300;

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .person-card {

    min-height: 84px;

    gap: 11px;

    padding:
      10px 36px
      10px 10px;

    border-radius: 10px;

  }


  .avatar {

    width: 56px;

    height: 56px;

  }


  .person-name {

    font-size: 0.94rem;

  }


  .person-meta,
  .person-life {

    font-size: 0.74rem;

  }


  .person-arrow {

    right: 10px;

  }

}


/* ===================================== */
/* MOBILE RẤT NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .avatar {

    width: 50px;

    height: 50px;

  }


  .person-card {

    min-height: 76px;

  }


  .person-name {

    font-size: 0.9rem;

  }

}

</style>