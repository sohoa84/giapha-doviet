<template>

  <div class="tree-node">

    <!-- ================================= -->
    <!-- VỢ / CHỒNG -->
    <!-- ================================= -->

    <div class="couple-row">

      <!-- ================================= -->
      <!-- NGƯỜI TRONG HỌ -->
      <!-- ================================= -->

      <div
        class="person-wrapper"
        @click="openPerson(node.person.ID)"
      >

        <div
          class="person-card"
          :class="
            personCardClass(
              node.person,
              node.isExternal
            )
          "
        >

          <!-- Avatar -->

          <div
            class="avatar"
            :class="
              avatarClass(
                node.person,
                node.isExternal
              )
            "
          >

            <img
              v-if="node.person.Photo"
              :src="getPhotoUrl(node.person.Photo)"
              :alt="fullName(node.person)"
            >

            <i
              v-else
              class="bi bi-person"
            ></i>

          </div>


          <!-- Information -->

          <div class="person-info">

            <div
            class="person-name"
            :title="personTooltip(node.person)"
            >

            <span class="gender-icon">
                {{ genderIcon(node.person) }}
            </span>

            {{ fullName(node.person) }}

            <span
                v-if="isDeceased(node.person)"
                class="deceased"
            >
                †
            </span>

            </div>


            <div
              v-if="node.isExternal"
              class="relationship-label label-ngoai"
            >
              NGOẠI
            </div>

            <div class="person-meta">

              {{ node.person.ID }}

              <span
                v-if="node.person.generation"
              >
                · Đời {{ node.person.generation }}
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- ================================= -->
      <!-- DÂU / RỂ -->
      <!-- ================================= -->

      <template
        v-if="showSpouses"
        v-for="spouse in node.spouses"
        :key="spouse.ID"
        >

        <!-- Marriage -->

        <div class="marriage-symbol">
          ♥
        </div>


        <!-- Spouse -->

        <div
          class="person-wrapper spouse-wrapper"
          @click="openPerson(spouse.ID)"
        >

          <div
            class="person-card spouse-card"
            :class="spouseClass(spouse)"
          >

            <!-- Avatar -->

            <div class="avatar spouse-avatar">

              <img
                v-if="spouse.Photo"
                :src="getPhotoUrl(spouse.Photo)"
                :alt="fullName(spouse)"
              >

              <i
                v-else
                class="bi bi-person"
              ></i>

            </div>


            <!-- Information -->

            <div class="person-info">

              <div class="person-name spouse-name"
                    :title="personTooltip(spouse)"
                    >

                <span class="gender-icon">
                  {{ genderIcon(spouse) }}
                </span>

                {{ fullName(spouse) }}

                <span
                  v-if="isDeceased(spouse)"
                  class="deceased"
                >
                  †
                </span>

              </div>


              <!-- DÂU / RỂ -->

              <div
                class="relationship-label"
                :class="
                  relationshipType(spouse) === 'DÂU'
                    ? 'label-dau'
                    : 'label-re'
                "
              >

                {{ relationshipType(spouse) }}

              </div>


              <div class="person-meta">

                {{ spouse.ID }}

                <span
                  v-if="spouse.generation"
                >
                  · Đời {{ spouse.generation }}
                </span>

              </div>

            </div>

          </div>

        </div>

      </template>

    </div>


    <!-- ================================= -->
    <!-- CON -->
    <!-- ================================= -->

    <div
      v-if="visibleChildren.length"
      class="children-area"
    >

      <!-- Vertical line -->

      <div class="vertical-line"></div>


      <!-- Collapse button -->

      <button
        class="collapse-button"
        :title="
          expanded
            ? 'Thu gọn nhánh'
            : 'Mở rộng nhánh'
        "
        @click.stop="toggle"
      >

        {{ expanded ? '−' : '+' }}

      </button>


      <!-- Children -->

      <div
        v-if="expanded"
        class="children-list"
      >

        <TreeNode
          v-for="child in visibleChildren"
          :key="child.person.ID"
          :node="child"
          :show-spouses="showSpouses"
          :show-external="showExternal"
        />

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed
} from 'vue';

import {
  useRouter
} from 'vue-router';


// ======================================
// PROPS
// ======================================

const props = defineProps({

  node: {
    type: Object,
    required: true
  },

  showSpouses: {
    type: Boolean,
    default: true
  },

  showExternal: {
    type: Boolean,
    default: true
  }

});


// ======================================
// STATE
// ======================================

const expanded =
  ref(true);


// ======================================
// ROUTER
// ======================================

const router =
  useRouter();


// ======================================
// CON ĐƯỢC PHÉP HIỂN THỊ
// ======================================

const visibleChildren =
  computed(() => {

    const children =
      props.node.children || [];

    if (props.showExternal) {
      return children;
    }

    return children.filter(
      child =>
        !child.isExternal
    );

  });


// ======================================
// CLASS CARD NGƯỜI
// ======================================

function personCardClass(
  person,
  isExternal
) {

  if (isExternal) {

    if (
      person?.['Giới tính'] === 'Nữ'
    ) {
      return 'person-external-female';
    }

    return 'person-external-male';

  }

  if (
    person?.['Giới tính'] === 'Nữ'
  ) {
    return 'person-female';
  }

  if (
    person?.['Giới tính'] === 'Nam'
  ) {
    return 'person-male';
  }

  return 'person-unknown';

}


// ======================================
// CLASS AVATAR
// ======================================
function avatarClass(
  person,
  isExternal
) {

  if (isExternal) {

    if (
      person?.['Giới tính'] === 'Nữ'
    ) {
      return 'avatar-external-female';
    }

    return 'avatar-external-male';
  }


  if (
    person?.['Giới tính'] === 'Nữ'
  ) {
    return 'avatar-female';
  }


  if (
    person?.['Giới tính'] === 'Nam'
  ) {
    return 'avatar-male';
  }


  return '';
}

// ======================================
// TOGGLE
// ======================================

function toggle() {

  expanded.value =
    !expanded.value;

}


// ======================================
// FULL NAME
// ======================================

function fullName(person) {

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
// TOOLTIP THÔNG TIN NGƯỜI
// ======================================

function personTooltip(person) {

  if (!person) {
    return '';
  }

  const lines = [];

  const name =
    fullName(person);

  if (name) {
    lines.push(name);
  }

  if (person['Tên Tự']) {
    lines.push(
      `Tên tự: ${person['Tên Tự']}`
    );
  }

  if (person.ID) {
    lines.push(
      `Mã: ${person.ID}`
    );
  }

  if (person.generation) {
    lines.push(
      `Đời: ${person.generation}`
    );
  }

  return lines.join('\n');
}
// ======================================
// GENDER ICON
// ======================================

function genderIcon(person) {

  if (!person) {

    return '';

  }


  if (
    person['Giới tính'] === 'Nữ'
  ) {

    return '♀';

  }


  if (
    person['Giới tính'] === 'Nam'
  ) {

    return '♂';

  }


  return '';

}


// ======================================
// DECEASED
// ======================================

function isDeceased(person) {

  if (!person) {

    return false;

  }


  return Boolean(
    person['Năm mất']
  );

}


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
// XÁC ĐỊNH DÂU / RỂ
// ======================================

function relationshipType(person) {

  if (!person) {

    return '';

  }


  if (
    person['Giới tính'] === 'Nữ'
  ) {

    return 'DÂU';

  }


  if (
    person['Giới tính'] === 'Nam'
  ) {

    return 'RỂ';

  }


  return 'DÂU / RỂ';

}


// ======================================
// SPOUSE CLASS
// ======================================

function spouseClass(person) {

  if (
    person?.['Giới tính'] === 'Nữ'
  ) {

    return 'spouse-female';

  }


  if (
    person?.['Giới tính'] === 'Nam'
  ) {

    return 'spouse-male';

  }


  return '';

}


// ======================================
// OPEN PERSON
// ======================================

function openPerson(id) {

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

</script>


<style scoped>

/* ===================================== */
/* NODE */
/* ===================================== */

.tree-node {

  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

}


/* ===================================== */
/* COUPLE ROW */
/* ===================================== */

.couple-row {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

}


/* ===================================== */
/* PERSON WRAPPER */
/* ===================================== */

.person-wrapper {

  cursor: pointer;

  transition:
    transform 0.15s ease;

}


.person-wrapper:hover {

  transform:
    translateY(-3px);

}


/* ===================================== */
/* PERSON CARD */
/* ===================================== */

.person-card {

  width: 170px;

  min-height: 70px;

  padding: 8px 10px;

  display: flex;

  align-items: center;

  gap: 9px;

  background: #ffffff;

  border: 2px solid #ced4da;

  border-radius: 10px;

  box-shadow:
    0 2px 6px
    rgba(0, 0, 0, 0.08);

  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;

}


.person-wrapper:hover .person-card {

  box-shadow:
    0 5px 12px
    rgba(0, 0, 0, 0.14);

}


/* ===================================== */
/* NAM TRONG HỌ */
/* ===================================== */

.person-card.person-male {
  border-color: #9ec5fe;
  background: #f4f8ff;
}


/* ===================================== */
/* NỮ TRONG HỌ */
/* ===================================== */

.person-card.person-female {
  border-color: #f1aeb5;
  background: #fff6f7;
}


/* ===================================== */
/* NAM NHÁNH NGOẠI */
/* ===================================== */

.person-card.person-external-male {
  border-color: #7950f2;
  background: #f3f0ff;
}


/* ===================================== */
/* NỮ NHÁNH NGOẠI */
/* ===================================== */

.person-card.person-external-female {
  border-color: #f1aeb5;
  background: #faf5ff;
}


/* ===================================== */
/* KHÔNG XÁC ĐỊNH */
/* ===================================== */

.person-card.person-unknown {
  border-color: #ced4da;
  background: #ffffff;
}


/* ===================================== */
/* SPOUSE CARD */
/* ===================================== */

.spouse-card {

  border-style:
    dashed;

}


/* ===================================== */
/* DÂU */
/* ===================================== */

.spouse-female {

  border-color:
    #d63384 !important;

  background:
    #fff0f6 !important;

}


/* ===================================== */
/* RỂ */
/* ===================================== */

.spouse-male {

  border-color:
    #7950f2 !important;

  background:
    #f3f0ff !important;

}


/* ===================================== */
/* AVATAR */
/* ===================================== */

.avatar {

  width: 40px;

  height: 40px;

  min-width: 40px;

  border-radius: 50%;

  overflow: hidden;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    #e9ecef;

  color:
    #6c757d;

  font-size:
    1.3rem;

}


.avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


/* ===================================== */
/* AVATAR NAM */
/* ===================================== */

.avatar.avatar-male {
  background: #dbeafe;
  color: #2563eb;
}


/* ===================================== */
/* AVATAR NỮ */
/* ===================================== */

.avatar.avatar-female {
  background: #ffe0e6;
  color: #d6336c;
}


/* ===================================== */
/* AVATAR NHÁNH NGOẠI */
/* ===================================== */

.avatar.avatar-external {
  background: #e5dbff;
  color: #6741d9;
}

/* NAM NGOẠI */

.avatar.avatar-external-male {
  background: #e5dbff;
  color: #6741d9;
}


/* NỮ NGOẠI */

.avatar.avatar-external-female {
  background: #ffe8d6;
  color: #e8590c;
}

/* ===================================== */
/* SPOUSE AVATAR */
/* ===================================== */

.spouse-female
.spouse-avatar {

  background:
    #ffd6e7;

  color:
    #d63384;

}


.spouse-male
.spouse-avatar {

  background:
    #e5dbff;

  color:
    #6741d9;

}


/* ===================================== */
/* PERSON INFO */
/* ===================================== */

.person-info {

  min-width: 0;

}


/* ===================================== */
/* NAME */
/* ===================================== */

.person-name {

  font-size:
    0.88rem;

  font-weight:
    700;

  line-height:
    1.25;

  white-space:
    nowrap;

  overflow:
    hidden;

  text-overflow:
    ellipsis;

}


/* ===================================== */
/* DÂU / RỂ → IN NGHIÊNG */
/* ===================================== */

.spouse-name {

  font-style:
    italic;

  font-weight:
    600;

}


/* ===================================== */
/* GENDER ICON */
/* ===================================== */

.gender-icon {

  font-size:
    0.85rem;

  margin-right:
    2px;

  font-style:
    normal;

}


/* ===================================== */
/* META */
/* ===================================== */

.person-meta {

  margin-top:
    3px;

  font-size:
    0.68rem;

  color:
    #6c757d;

  white-space:
    nowrap;

}


/* ===================================== */
/* DECEASED */
/* ===================================== */

.deceased {

  margin-left:
    2px;

  font-weight:
    700;

  color:
    #495057;

}


/* ===================================== */
/* DÂU / RỂ LABEL */
/* ===================================== */

.relationship-label {

  display:
    inline-block;

  margin-top:
    3px;

  padding:
    1px 6px;

  border-radius:
    10px;

  font-size:
    0.58rem;

  font-weight:
    700;

  letter-spacing:
    0.4px;

}


/* ===================================== */
/* DÂU */
/* ===================================== */

.label-dau {

  color:
    #a61e4d;

  background:
    #ffd6e7;

}


/* ===================================== */
/* RỂ */
/* ===================================== */

.label-re {

  color:
    #5f3dc4;

  background:
    #e5dbff;

}


/* ===================================== */
/* NGOẠI */
/* ===================================== */

.label-ngoai {
  color: #5f3dc4;
  background: #ede9fe;
  border: 1px solid #c4b5fd;
}


/* ===================================== */
/* MARRIAGE */
/* ===================================== */

.marriage-symbol {

  color:
    #dc3545;

  font-size:
    14px;

  font-weight:
    700;

}


/* ===================================== */
/* CHILDREN AREA */
/* ===================================== */

.children-area {

  position: relative;

  margin-top:
    24px;

  padding-top:
    25px;

}


/* ===================================== */
/* VERTICAL LINE */
/* ===================================== */

.vertical-line {

  position: absolute;

  top:
    0;

  left:
    50%;

  width:
    2px;

  height:
    25px;

  background:
    #adb5bd;

}


/* ===================================== */
/* COLLAPSE BUTTON */
/* ===================================== */

.collapse-button {

  position: absolute;

  top:
    17px;

  left:
    50%;

  transform:
    translate(-50%, -50%);

  z-index:
    5;

  width:
    23px;

  height:
    23px;

  padding:
    0;

  border:
    1px solid #adb5bd;

  border-radius:
    50%;

  background:
    #ffffff;

  color:
    #495057;

  font-size:
    15px;

  font-weight:
    700;

  line-height:
    18px;

  cursor:
    pointer;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  box-shadow:
    0 1px 3px
    rgba(0,0,0,0.12);

}


.collapse-button:hover {

  background:
    #e9ecef;

  border-color:
    #6c757d;

}


/* ===================================== */
/* CHILDREN LIST */
/* ===================================== */

.children-list {

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    center;

  gap:
    12px;

  position:
    relative;

  padding-top:
    5px;

}


/* ===================================== */
/* RESPONSIVE */
/* ===================================== */

@media (max-width: 768px) {

  .person-card {

    width:
      165px;

  }


  .children-list {

    gap:
      15px;

  }


  .person-name {

    font-size:
      0.82rem;

  }

}

</style>