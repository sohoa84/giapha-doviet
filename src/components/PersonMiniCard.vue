<template>

  <div
    class="mini-person"
    :class="cardClass"
    :title="tooltip"
    @click="$emit('click')"
  >

    <!-- Ảnh / biểu tượng -->

    <div class="mini-avatar">

      <img
        v-if="person.Photo"
        :src="getPhotoUrl(person.Photo)"
        :alt="fullName"
      >

      <i
        v-else
        class="bi bi-person"
      ></i>

    </div>


    <!-- Thông tin -->

    <div class="mini-info">

      <div class="mini-name">

        <span class="mini-gender">
          {{ genderIcon }}
        </span>

        {{ fullName }}

        <span
          v-if="person['Năm mất']"
          class="mini-deceased"
        >
          †
        </span>

      </div>


      <!-- Nhãn DÂU / RỂ -->

      <div
        v-if="showLabel && relationship"
        class="mini-label"
      >

        {{ relationship }}

      </div>


      <!-- Mã thành viên -->

      <div class="mini-id">

        {{ person.ID }}

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  computed
} from 'vue';


// ======================================
// PROPS
// ======================================

const props = defineProps({

  person: {

    type: Object,

    required: true

  },

  showLabel: {

    type: Boolean,

    default: false

  }

});


// ======================================
// EMITS
// ======================================

defineEmits([
  'click'
]);


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
// DÂU / RỂ
// ======================================

const isSpouse =
  computed(() => {

    return String(
      props.person.ID || ''
    ).includes('S');

  });


// ======================================
// QUAN HỆ
// ======================================

const relationship =
  computed(() => {

    if (!isSpouse.value) {

      return '';

    }


    return props.person[
      'Giới tính'
    ] === 'Nữ'

      ? 'DÂU'

      : 'RỂ';

  });


// ======================================
// ICON GIỚI TÍNH
// ======================================

const genderIcon =
  computed(() => {

    return props.person[
      'Giới tính'
    ] === 'Nữ'

      ? '♀'

      : '♂';

  });


// ======================================
// CLASS
// ======================================

const cardClass =
  computed(() => {

    /*
     * Dâu / Rể ưu tiên trước
     */

    if (isSpouse.value) {

      if (
        props.person[
          'Giới tính'
        ] === 'Nữ'
      ) {

        return 'person-dau';

      }

      return 'person-re';

    }


    /*
     * Thành viên trong dòng họ
     */

    if (
      props.person[
        'Giới tính'
      ] === 'Nữ'
    ) {

      return 'person-female';

    }


    return 'person-male';

  });


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
// TOOLTIP
// ======================================

const tooltip =
  computed(() => {

    const lines = [];


    /*
     * Họ tên
     */

    if (fullName.value) {

      lines.push(
        fullName.value
      );

    }


    /*
     * Tên tự
     */

    if (
      props.person[
        'Tên Tự'
      ]
    ) {

      lines.push(
        `Tên tự: ${props.person['Tên Tự']}`
      );

    }


    /*
     * Dâu / Rể
     */

    if (
      relationship.value
    ) {

      lines.push(
        relationship.value
      );

    }


    /*
     * Giới tính
     */

    if (
      props.person[
        'Giới tính'
      ]
    ) {

      lines.push(
        `Giới tính: ${props.person['Giới tính']}`
      );

    }


    /*
     * Năm sinh
     */

    if (
      props.person[
        'Năm sinh'
      ]
    ) {

      lines.push(
        `Sinh: ${props.person['Năm sinh']}`
      );

    }


    /*
     * Năm mất
     */

    if (
      props.person[
        'Năm mất'
      ]
    ) {

      lines.push(
        `Mất: ${props.person['Năm mất']}`
      );

    }


    /*
     * Mã
     */

    if (
      props.person.ID
    ) {

      lines.push(
        `Mã: ${props.person.ID}`
      );

    }


    return lines.join('\n');

  });

</script>


<style scoped>

/* ====================================== */
/* CARD */
/* ====================================== */

.mini-person {

  width: 190px;

  min-height: 66px;

  padding: 7px 9px;

  display: flex;

  align-items: center;

  gap: 9px;

  border: 2px solid #ced4da;

  border-radius: 9px;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  box-shadow:
    0 2px 5px
    rgba(0, 0, 0, 0.06);

  user-select: none;

}


.mini-person:hover {

  transform:
    translateY(-3px);

  box-shadow:
    0 6px 14px
    rgba(0, 0, 0, 0.13);

}


/* ====================================== */
/* NAM */
/* ====================================== */

.person-male {

  background: #f4f8ff;

  border-color: #9ec5fe;

}


/* ====================================== */
/* NỮ */
/* ====================================== */

.person-female {

  background: #fff6f7;

  border-color: #f1aeb5;

}


/* ====================================== */
/* DÂU */
/* ====================================== */

.person-dau {

  background: #fff0f6;

  border-color: #d63384;

  border-style: dashed;

}


.person-dau .mini-name {

  font-style: italic;

}


/* ====================================== */
/* RỂ */
/* ====================================== */

.person-re {

  background: #f3f0ff;

  border-color: #7950f2;

  border-style: dashed;

}


.person-re .mini-name {

  font-style: italic;

}


/* ====================================== */
/* AVATAR */
/* ====================================== */

.mini-avatar {

  width: 40px;

  height: 40px;

  min-width: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #e9ecef;

  color: #6c757d;

  font-size: 1.1rem;

}


.mini-avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


/* ====================================== */
/* INFO */
/* ====================================== */

.mini-info {

  min-width: 0;

  flex: 1;

}


.mini-name {

  max-width: 125px;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  font-size: 0.78rem;

  font-weight: 700;

  line-height: 1.25;

}


.mini-gender {

  margin-right: 2px;

}


.mini-deceased {

  color: #495057;

  font-weight: 800;

}


/* ====================================== */
/* DÂU / RỂ LABEL */
/* ====================================== */

.mini-label {

  display: inline-block;

  margin-top: 2px;

  padding: 1px 6px;

  border-radius: 8px;

  background: rgba(255,255,255,0.75);

  font-size: 0.55rem;

  font-weight: 800;

  letter-spacing: 0.3px;

}


/* ====================================== */
/* ID */
/* ====================================== */

.mini-id {

  margin-top: 3px;

  color: #6c757d;

  font-size: 0.6rem;

}


/* ====================================== */
/* MOBILE */
/* ====================================== */

@media (max-width: 768px) {

  .mini-person {

    width: 175px;

  }

}


@media (max-width: 480px) {

  .mini-person {

    width: 100%;

    max-width: 300px;

  }

}

</style>