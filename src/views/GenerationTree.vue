<template>

  <div class="generation-page container-fluid">

    <!-- ===================================== -->
    <!-- HEADER -->
    <!-- ===================================== -->

    <header class="page-header">

      <div class="header-icon">
        🌳
      </div>

      <div>

        <h1>
          Cây gia phả theo thế hệ
        </h1>

        <p>
          Thành viên được sắp xếp theo đúng thứ tự vai vế trong họ
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

      <div
        class="spinner-border"
        role="status"
      ></div>

      <div class="loading-text">
        Đang xây dựng cây theo thế hệ...
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
      <!-- TOOLBAR -->
      <!-- =================================== -->

      <div class="generation-toolbar">

        <div class="toolbar-actions">

          <button
            type="button"
            class="toolbar-button"
            :class="{ active: showSpouses }"
            @click="showSpouses = !showSpouses"
          >

            <i
              class="bi"
              :class="
                showSpouses
                  ? 'bi-people-fill'
                  : 'bi-person-fill'
              "
            ></i>

            <span class="desktop-label">
              {{
                showSpouses
                  ? 'Ẩn dâu / rể'
                  : 'Hiện dâu / rể'
              }}
            </span>

            <span class="mobile-label">
              Dâu/rể
            </span>

          </button>


          <button
            type="button"
            class="toolbar-button external-button"
            :class="{ active: showExternal }"
            @click="showExternal = !showExternal"
            :title="
              showExternal
                ? 'Ẩn hậu duệ nhánh ngoại'
                : 'Hiện hậu duệ nhánh ngoại'
            "
          >
            <i class="bi bi-diagram-3-fill"></i>

            <span class="desktop-label">
              {{
                showExternal
                  ? 'Đang hiện nhánh ngoại'
                  : 'Chỉ dòng nội'
              }}
            </span>

            <span class="mobile-label">
              Ngoại
            </span>
          </button>


          <button
            type="button"
            class="toolbar-button"
            @click="toggleAll"
          >

            <i
              class="bi"
              :class="
                allExpanded
                  ? 'bi-arrows-collapse'
                  : 'bi-arrows-expand'
              "
            ></i>

            <span class="desktop-label">
              {{
                allExpanded
                  ? 'Thu gọn các đời'
                  : 'Mở rộng các đời'
              }}
            </span>

            <span class="mobile-label">
              {{
                allExpanded
                  ? 'Thu'
                  : 'Mở'
              }}
            </span>

          </button>

        </div>


        <div class="toolbar-info">

          <strong>
            {{ totalPersons }}
          </strong>

          thành viên chính

          <span class="dot-separator">
            •
          </span>

          <strong>
            {{ generations.length }}
          </strong>

          đời

        </div>

      </div>


      <!-- =================================== -->
      <!-- LEGEND -->
      <!-- =================================== -->

      <div class="legend">

        <div class="legend-item">

          <span
            class="legend-line male"
          ></span>

          Nam

        </div>


        <div class="legend-item">

          <span
            class="legend-line female"
          ></span>

          Nữ

        </div>


        <div
          v-if="showExternal"
          class="legend-item"
        >
          <span class="legend-line external-male"></span>
          Nam ngoại
        </div>


        <div
          v-if="showExternal"
          class="legend-item"
        >
          <span class="legend-line external-female"></span>
          Nữ ngoại
        </div>


        <div
          v-if="showSpouses"
          class="legend-item"
        >

          <span
            class="legend-line dau"
          ></span>

          Dâu

        </div>


        <div
          v-if="showSpouses"
          class="legend-item"
        >

          <span
            class="legend-line re"
          ></span>

          Rể

        </div>

      </div>


      <!-- =================================== -->
      <!-- GENERATIONS -->
      <!-- =================================== -->

      <div class="generations">

        <section
          v-for="generation in generations"
          :key="generation"
          class="generation-section"
        >

          <!-- ================================= -->
          <!-- GENERATION HEADER -->
          <!-- ================================= -->

          <button
            type="button"
            class="generation-header"
            @click="toggleGeneration(generation)"
          >

            <div class="generation-title">

              <span class="generation-number">
                ĐỜI {{ generation }}
              </span>

              <span class="generation-count">

                {{
                  peopleByGeneration(
                    generation
                  ).length
                }}

                thành viên

              </span>

            </div>


            <span class="generation-chevron">

              <i
                class="bi"
                :class="
                  isExpanded(generation)
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down'
                "
              ></i>

            </span>

          </button>


          <!-- ================================= -->
          <!-- FAMILY LIST -->
          <!-- ================================= -->

          <div
            v-if="isExpanded(generation)"
            class="generation-people"
          >

            <div
              v-for="
                family in
                familyBlocksByGeneration(
                  generation
                )
              "
              :key="family.person.ID"
              class="family-block"
            >

              <!-- =============================== -->
              <!-- CORE PERSON -->
              <!-- =============================== -->

              <button
                type="button"
                class="person-wrapper"
                @click="
                  openPerson(
                    family.person.ID
                  )
                "
              >

                <div
                  class="person-card"
                  :class="
                    personCardClass(
                      family.person
                    )
                  "
                  :title="
                    personTooltip(
                      family.person
                    )
                  "
                >

                  <div class="person-avatar">

                    <img
                      v-if="family.person.Photo"
                      :src="
                        getPhotoUrl(
                          family.person.Photo
                        )
                      "
                      :alt="
                        fullName(
                          family.person
                        )
                      "
                      loading="lazy"
                    >

                    <i
                      v-else
                      class="bi bi-person"
                    ></i>

                  </div>


                  <div class="person-info">

                    <div class="person-name">

                      <span class="gender-icon">

                        {{
                          genderIcon(
                            family.person
                          )
                        }}

                      </span>


                      <span class="name-text">

                        {{
                          fullName(
                            family.person
                          )
                        }}

                      </span>


                      <span
                        v-if="
                          isDeceased(
                            family.person
                          )
                        "
                        class="deceased"
                      >
                        †
                      </span>

                    </div>


                    <div
                      v-if="
                        family.person['Tên Tự']
                      "
                      class="person-alias"
                    >

                      Tự:
                      {{
                        family.person[
                          'Tên Tự'
                        ]
                      }}

                    </div>


                    <div
                      v-if="isExternalPerson(family.person)"
                      class="external-meta-row"
                    >
                      <span class="relationship-label label-ngoai">
                        NGOẠI
                      </span>
                    </div>


                    <div class="person-meta">

                      {{ family.person.ID }}

                      <span
                        v-if="
                          family.person[
                            'Năm sinh'
                          ] ||
                          family.person[
                            'Năm mất'
                          ]
                        "
                      >
                        •
                        {{
                          family.person[
                            'Năm sinh'
                          ] || '?'
                        }}
                        –
                        {{
                          family.person[
                            'Năm mất'
                          ] || ''
                        }}
                      </span>

                    </div>

                  </div>


                  <div class="open-arrow">
                    ›
                  </div>

                </div>

              </button>


              <!-- =============================== -->
              <!-- SPOUSES -->
              <!-- =============================== -->

              <template
                v-if="
                  showSpouses &&
                  family.spouses.length
                "
              >

                <div class="marriage-link">

                  <span class="marriage-line"></span>

                  <span class="heart">
                    ♥
                  </span>

                  <span class="marriage-line"></span>

                </div>


                <div class="spouses">

                  <button
                    v-for="
                      spouse in
                      family.spouses
                    "
                    :key="spouse.ID"
                    type="button"
                    class="person-wrapper spouse-wrapper"
                    @click="
                      openPerson(
                        spouse.ID
                      )
                    "
                  >

                    <div
                      class="person-card"
                      :class="
                        personCardClass(
                          spouse
                        )
                      "
                      :title="
                        personTooltip(
                          spouse
                        )
                      "
                    >

                      <div class="person-avatar">

                        <img
                          v-if="spouse.Photo"
                          :src="
                            getPhotoUrl(
                              spouse.Photo
                            )
                          "
                          :alt="
                            fullName(
                              spouse
                            )
                          "
                          loading="lazy"
                        >

                        <i
                          v-else
                          class="bi bi-person"
                        ></i>

                      </div>


                      <div class="person-info">

                        <div class="person-name">

                          <span class="gender-icon">

                            {{
                              genderIcon(
                                spouse
                              )
                            }}

                          </span>


                          <span class="name-text">

                            {{
                              fullName(
                                spouse
                              )
                            }}

                          </span>


                          <span
                            v-if="
                              isDeceased(
                                spouse
                              )
                            "
                            class="deceased"
                          >
                            †
                          </span>

                        </div>


                        <div
                          v-if="
                            spouse['Tên Tự']
                          "
                          class="person-alias"
                        >

                          Tự:
                          {{
                            spouse[
                              'Tên Tự'
                            ]
                          }}

                        </div>


                        <div class="spouse-meta-row">

                          <span
                            class="relationship-label"
                            :class="
                              relationshipType(
                                spouse
                              ) === 'DÂU'
                                ? 'label-dau'
                                : 'label-re'
                            "
                          >

                            {{
                              relationshipType(
                                spouse
                              )
                            }}

                          </span>


                          <span class="person-meta">

                            {{ spouse.ID }}

                          </span>

                        </div>

                      </div>


                      <div class="open-arrow">
                        ›
                      </div>

                    </div>

                  </button>

                </div>

              </template>

            </div>


            <div
              v-if="
                !familyBlocksByGeneration(
                  generation
                ).length
              "
              class="empty-generation"
            >
              Không có thành viên.
            </div>

          </div>

        </section>

      </div>

    </template>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue';

import {
  useRouter
} from 'vue-router';

import {
  getFamilyOrder
} from '../services/dataService';


// ======================================
// ROUTER
// ======================================

const router =
  useRouter();


// ======================================
// DATA
// ======================================

const persons =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');


// ======================================
// UI STATE
// ======================================

const showSpouses =
  ref(true);


// ======================================
// HIỂN THỊ NHÁNH NGOẠI
// ======================================
//
// Con gái của dòng họ vẫn là NỘI.
// Con của người con gái bắt đầu NGOẠI.
// Từ đó, toàn bộ hậu duệ tiếp tục là NGOẠI.
//

const showExternal =
  ref(true);


const expandedGenerations =
  ref(new Set());


// ======================================
// LOAD DATA
// ======================================

async function loadGenerationTree() {

  try {

    loading.value = true;

    error.value = '';


    const result =
      await getFamilyOrder();


    /*
     * getFamilyOrder() trả:
     *
     * [
     *   {
     *     person: {...},
     *     depth: 0
     *   }
     * ]
     */

    persons.value =
      (result || [])

        .map(
          item =>
            item?.person
        )

        .filter(Boolean);


    externalMemo.clear();

  }

  catch (err) {

    console.error(
      'GenerationTree error:',
      err
    );

    error.value =
      err.message ||
      'Không thể tải cây gia phả';

  }

  finally {

    loading.value = false;

  }

}


// ======================================
// XÁC ĐỊNH DÂU / RỂ
// ======================================

function isSpouse(person) {

  if (!person?.ID) {

    return false;

  }


  /*
   * Quy tắc dữ liệu:
   *
   * VA-10.02
   * VA-10.02S1
   * VA-10.02S2
   *
   * Đồng thời Cha / Mẹ phải trống.
   */

  const id =
    String(
      person.ID
    );


  const hasSpouseSuffix =
    /S\d+$/.test(
      id
    );


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
// ======================================

function getBasePersonId(
  spouseId
) {

  if (!spouseId) {

    return null;

  }


  const match =
    String(
      spouseId
    ).match(
      /^(.+)S\d+$/
    );


  if (!match) {

    return null;

  }


  return match[1];

}


// ======================================
// LẤY SỐ DÂU / RỂ
// ======================================

function getSpouseNumber(
  spouseId
) {

  if (!spouseId) {

    return null;

  }


  const match =
    String(
      spouseId
    ).match(
      /S(\d+)$/
    );


  if (!match) {

    return null;

  }


  return Number(
    match[1]
  );

}


// ======================================
// TÌM NGƯỜI THEO ID
// ======================================

function findPerson(
  id
) {

  if (!id) {

    return null;

  }


  return persons.value.find(
    person =>
      person.ID === id
  ) || null;

}


// ======================================
// CHA / MẸ THUỘC CÂY CHÍNH
// ======================================

function getCoreParentId(
  person
) {

  if (!person) {
    return null;
  }

  const fatherId =
    String(
      person.Father ||
      person['Cha'] ||
      ''
    ).trim();

  const motherId =
    String(
      person.Mother ||
      person['Mẹ'] ||
      ''
    ).trim();

  const father =
    fatherId
      ? findPerson(fatherId)
      : null;

  const mother =
    motherId
      ? findPerson(motherId)
      : null;

  const fatherIsCore =
    father &&
    !isSpouse(father);

  const motherIsCore =
    mother &&
    !isSpouse(mother);

  if (
    fatherIsCore &&
    !motherIsCore
  ) {
    return fatherId;
  }

  if (
    motherIsCore &&
    !fatherIsCore
  ) {
    return motherId;
  }

  if (fatherIsCore) {
    return fatherId;
  }

  if (motherIsCore) {
    return motherId;
  }

  return null;
}


// ======================================
// XÁC ĐỊNH NHÁNH NGOẠI
// ======================================

const externalMemo =
  new Map();


function isExternalPerson(
  person,
  visited = new Set()
) {

  if (
    !person ||
    isSpouse(person)
  ) {
    return false;
  }

  if (
    externalMemo.has(
      person.ID
    )
  ) {
    return externalMemo.get(
      person.ID
    );
  }

  if (
    visited.has(
      person.ID
    )
  ) {
    return false;
  }

  const nextVisited =
    new Set(visited);

  nextVisited.add(
    person.ID
  );

  const parentId =
    getCoreParentId(
      person
    );

  if (!parentId) {

    externalMemo.set(
      person.ID,
      false
    );

    return false;
  }

  const parent =
    findPerson(
      parentId
    );

  if (!parent) {

    externalMemo.set(
      person.ID,
      false
    );

    return false;
  }

  // Con của một người nữ trong dòng họ
  // bắt đầu nhánh NGOẠI.
  if (
    parent['Giới tính'] ===
    'Nữ'
  ) {

    externalMemo.set(
      person.ID,
      true
    );

    return true;
  }

  // Nếu cha/mẹ core đã là ngoại,
  // hậu duệ tiếp tục là ngoại.
  const result =
    isExternalPerson(
      parent,
      nextVisited
    );

  externalMemo.set(
    person.ID,
    result
  );

  return result;
}


// ======================================
// LẤY DÂU / RỂ CỦA NGƯỜI GỐC
// ======================================

function getSpousesForPerson(
  person
) {

  if (!person?.ID) {

    return [];

  }


  const baseId =
    String(
      person.ID
    );


  /*
   * KHÔNG dùng person.spouses.
   *
   * Tìm trực tiếp trong persons
   * theo ID:
   *
   * VA-10.02S1
   * VA-10.02S2
   * ...
   */

  return persons.value

    .filter(
      candidate => {

        if (
          !isSpouse(
            candidate
          )
        ) {

          return false;

        }


        return (
          getBasePersonId(
            candidate.ID
          ) === baseId
        );

      }
    )

    .sort(
      (a, b) => {

        return (
          getSpouseNumber(
            a.ID
          ) || 0
        ) -
        (
          getSpouseNumber(
            b.ID
          ) || 0
        );

      }
    );

}


// ======================================
// THÀNH VIÊN CHÍNH
// ======================================

const corePersons =
  computed(() => {

    /*
     * Chỉ người KHÔNG phải dâu/rể.
     */

    return persons.value.filter(
      person =>
        !isSpouse(
          person
        )
    );

  });


// ======================================
// SỐ THÀNH VIÊN
// ======================================

const totalPersons =
  computed(() =>
    corePersons.value.length
  );


// ======================================
// LẤY ĐỜI
// ======================================

function getGeneration(
  person
) {

  if (!person) {

    return null;

  }


  /*
   * Ưu tiên generation
   * vì dataService đã tính sẵn.
   */

  if (
    person.generation !== undefined &&
    person.generation !== null &&
    person.generation !== ''
  ) {

    const value =
      Number(
        person.generation
      );


    if (
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  /*
   * Fallback sang trường Đời.
   */

  if (
    person['Đời'] !== undefined &&
    person['Đời'] !== null &&
    person['Đời'] !== ''
  ) {

    const value =
      Number(
        person['Đời']
      );


    if (
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  return null;

}


// ======================================
// DANH SÁCH ĐỜI
// ======================================

const generations =
  computed(() => {

    const values =
      corePersons.value

        .map(
          person =>
            getGeneration(
              person
            )
        )

        .filter(
          value =>
            value !== null
        );


    return [
      ...new Set(
        values
      )
    ].sort(
      (a, b) =>
        a - b
    );

  });


// ======================================
// NGƯỜI TRONG TỪNG ĐỜI
// ======================================

function peopleByGeneration(
  generation
) {

  /*
   * CỰC KỲ QUAN TRỌNG:
   *
   * Không sort lại.
   *
   * Giữ nguyên thứ tự
   * từ getFamilyOrder().
   */

  return corePersons.value.filter(
    person => {

      const sameGeneration =
        getGeneration(
          person
        ) === Number(
          generation
        );

      if (!sameGeneration) {
        return false;
      }

      if (showExternal.value) {
        return true;
      }

      return !isExternalPerson(
        person
      );

    }
  );

}


// ======================================
// FAMILY BLOCKS
// ======================================

function familyBlocksByGeneration(
  generation
) {

  return peopleByGeneration(
    generation
  ).map(
    person => ({

      person,

      spouses:
        getSpousesForPerson(
          person
        )

    })
  );

}


// ======================================
// FULL NAME
// ======================================

function fullName(
  person
) {

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
// GIỚI TÍNH
// ======================================

function genderIcon(
  person
) {

  if (
    person?.['Giới tính'] ===
    'Nam'
  ) {

    return '♂';

  }


  if (
    person?.['Giới tính'] ===
    'Nữ'
  ) {

    return '♀';

  }


  return '';

}


// ======================================
// ĐÃ MẤT
// ======================================

function isDeceased(
  person
) {

  return Boolean(
    person?.['Năm mất']
  );

}


// ======================================
// DÂU / RỂ
// ======================================

function relationshipType(
  person
) {

  if (
    !isSpouse(
      person
    )
  ) {

    return '';

  }


  if (
    person['Giới tính'] ===
    'Nữ'
  ) {

    return 'DÂU';

  }


  if (
    person['Giới tính'] ===
    'Nam'
  ) {

    return 'RỂ';

  }


  return '';

}


// ======================================
// CSS CLASS CARD
// ======================================

function personCardClass(
  person
) {

  // Dâu / Rể
  if (
    isSpouse(
      person
    )
  ) {

    if (
      person['Giới tính'] ===
      'Nữ'
    ) {
      return 'card-dau';
    }

    if (
      person['Giới tính'] ===
      'Nam'
    ) {
      return 'card-re';
    }

  }


  // Nhánh ngoại
  if (
    isExternalPerson(
      person
    )
  ) {

    if (
      person['Giới tính'] ===
      'Nữ'
    ) {
      return 'card-external-female';
    }

    if (
      person['Giới tính'] ===
      'Nam'
    ) {
      return 'card-external-male';
    }

  }


  // Dòng nội
  if (
    person['Giới tính'] ===
    'Nam'
  ) {
    return 'card-male';
  }

  if (
    person['Giới tính'] ===
    'Nữ'
  ) {
    return 'card-female';
  }

  return 'card-unknown';
}

// ======================================
// TOOLTIP
// ======================================

function personTooltip(
  person
) {

  if (!person) {

    return '';

  }


  const name =
    fullName(
      person
    );


  const tenTu =
    person['Tên Tự']
      ? `\nTên tự: ${person['Tên Tự']}`
      : '';


  const gender =
    person['Giới tính']
      ? `\nGiới tính: ${person['Giới tính']}`
      : '';


  const birth =
    person['Năm sinh']
      ? `\nSinh: ${person['Năm sinh']}`
      : '';


  const death =
    person['Năm mất']
      ? `\nMất: ${person['Năm mất']}`
      : '';


  const relation =
    isSpouse(person)
      ? `\n${relationshipType(person)}`
      : '';


  const branch =
    !isSpouse(person) &&
    isExternalPerson(person)
      ? '\nNhánh: NGOẠI'
      : '';


  return (
    `${name}` +
    `${tenTu}` +
    `${gender}` +
    `${birth}` +
    `${death}` +
    `${relation}` +
    `${branch}`
  );

}


// ======================================
// EXPAND / COLLAPSE
// ======================================

function isExpanded(
  generation
) {

  return expandedGenerations.value.has(
    generation
  );

}


function toggleGeneration(
  generation
) {

  const next =
    new Set(
      expandedGenerations.value
    );


  if (
    next.has(
      generation
    )
  ) {

    next.delete(
      generation
    );

  }
  else {

    next.add(
      generation
    );

  }


  expandedGenerations.value =
    next;

}


// ======================================
// ALL EXPANDED
// ======================================

const allExpanded =
  computed(() => {

    if (
      !generations.value.length
    ) {

      return false;

    }


    return generations.value.every(
      generation =>
        expandedGenerations.value.has(
          generation
        )
    );

  });


// ======================================
// TOGGLE ALL
// ======================================

function toggleAll() {

  if (
    allExpanded.value
  ) {

    expandedGenerations.value =
      new Set();

  }
  else {

    expandedGenerations.value =
      new Set(
        generations.value
      );

  }

}


// ======================================
// OPEN PERSON
// ======================================

function openPerson(
  id
) {

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


// ======================================
// INIT
// ======================================

onMounted(
  async () => {

    await loadGenerationTree();


    /*
     * Mở tất cả các đời
     * sau khi dữ liệu load xong.
     */

    expandedGenerations.value =
      new Set(
        generations.value
      );

  }
);

</script>

<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.generation-page {

  width: 100%;

  padding:
    26px 18px
    70px;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.page-header {

  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 18px;

}


.header-icon {

  width: 50px;

  height: 50px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #eef7ee;

  font-size: 25px;

}


.page-header h1 {

  margin: 0;

  color: #343a40;

  font-size: 1.65rem;

  font-weight: 750;

}


.page-header p {

  margin:
    4px 0 0;

  color: #6c757d;

  font-size: 0.9rem;

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
/* TOOLBAR */
/* ===================================== */

.generation-toolbar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 10px;

  padding:
    10px 12px;

  border:
    1px solid
    #e3e6e8;

  border-radius: 12px;

  background: #ffffff;

}


.toolbar-actions {

  display: flex;

  align-items: center;

  gap: 7px;

}


.toolbar-button {

  min-height: 38px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding:
    7px 11px;

  border:
    1px solid
    #ced4da;

  border-radius: 9px;

  background: #ffffff;

  color: #495057;

  font-size: 0.82rem;

  font-weight: 700;

}


.toolbar-button.active {

  border-color: #0d6efd;

  background: #0d6efd;

  color: #ffffff;

}


.external-button.active {

  border-color: #7950f2;

  background: #7950f2;

  color: #ffffff;

}


.toolbar-info {

  color: #6c757d;

  font-size: 0.83rem;

}


.toolbar-info strong {

  color: #343a40;

}


.dot-separator {

  margin:
    0 4px;

  color: #adb5bd;

}


.mobile-label {

  display: none;

}


/* ===================================== */
/* LEGEND */
/* ===================================== */

.legend {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 16px;

  margin-bottom: 16px;

  padding:
    8px 11px;

  border-radius: 10px;

  background: #f8f9fa;

}


.legend-item {

  display: flex;

  align-items: center;

  gap: 6px;

  color: #5f676e;

  font-size: 0.75rem;

  font-weight: 700;

}


.legend-line {

  width: 22px;

  height: 0;

  border-top-width: 3px;

  border-top-style: solid;

}


.legend-line.male {

  border-color: #4dabf7;

}


.legend-line.female {

  border-color: #f783ac;

}


.legend-line.external-male {

  border-color: #7950f2;

}


.legend-line.external-female {

  border-color: #f08c46;

}


.legend-line.dau {

  border-color: #f783ac;

  border-top-style: dashed;

}


.legend-line.re {

  border-color: #4dabf7;

  border-top-style: dashed;

}


/* ===================================== */
/* GENERATION */
/* ===================================== */

.generations {

  display: grid;

  gap: 14px;

}


.generation-section {

  overflow: hidden;

  border:
    1px solid
    #dee2e6;

  border-radius: 13px;

  background: #ffffff;

}


/* ===================================== */
/* GENERATION HEADER */
/* ===================================== */

.generation-header {

  width: 100%;

  min-height: 54px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    9px 14px;

  border: 0;

  border-bottom:
    1px solid
    #e9ecef;

  background:
    linear-gradient(
      90deg,
      #fafafa,
      #f4f6f7
    );

  color: #343a40;

  text-align: left;

}


.generation-title {

  display: flex;

  align-items: center;

  gap: 9px;

  min-width: 0;

}


.generation-number {

  font-size: 0.94rem;

  font-weight: 850;

  letter-spacing: 0.04em;

}


.generation-count {

  padding:
    3px 8px;

  border-radius: 999px;

  background: #e9ecef;

  color: #6c757d;

  font-size: 0.68rem;

  font-weight: 700;

}


.generation-chevron {

  width: 32px;

  height: 32px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid
    #d8dde1;

  border-radius: 50%;

  background: #ffffff;

  color: #495057;

}


/* ===================================== */
/* FAMILY LIST */
/* ===================================== */

.generation-people {

  display: flex;

  flex-wrap: wrap;

  align-items: flex-start;

  gap: 12px;

  padding: 14px;

}


.family-block {

  display: flex;

  align-items: center;

  flex: 0 0 auto;

  gap: 6px;

  padding:
    5px 6px;

  border-radius: 11px;

  background: #fbfbfb;

}


/* ===================================== */
/* PERSON BUTTON */
/* ===================================== */

.person-wrapper {

  flex: 0 0 auto;

  padding: 0;

  border: 0;

  background: transparent;

  text-align: left;

  cursor: pointer;

}


/* ===================================== */
/* PERSON CARD */
/* ===================================== */

.person-card {

  position: relative;

  width: 235px;

  min-height: 80px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding:
    9px 31px
    9px 10px;

  border:
    1px solid
    #dee2e6;

  border-left-width: 4px;

  border-radius: 11px;

  background: #ffffff;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}


.person-wrapper:hover
.person-card {

  transform:
    translateY(-2px);

  box-shadow:
    0 5px 14px
    rgba(
      0,
      0,
      0,
      0.09
    );

}


/* ===================================== */
/* NAM / NỮ */
/* ===================================== */

.card-male {

  border-left-color: #4dabf7;

}


.card-female {

  border-left-color: #f783ac;

}


/* ===================================== */
/* NAM NGOẠI - TÍM NÉT LIỀN */
/* ===================================== */

.card-external-male {

  border-color: #7950f2;

  border-style: solid;

  border-left-width: 4px;

  background: #f3f0ff;

}


/* ===================================== */
/* NỮ NGOẠI - CAM HỒNG NÉT LIỀN */
/* ===================================== */

.card-external-female {

  border-color: #f08c46;

  border-style: solid;

  border-left-width: 4px;

  background: #fff4e8;

}


/* ===================================== */
/* DÂU / RỂ */
/* ===================================== */

.card-dau {

  border-color: #f783ac;

  border-style: dashed;

  border-left-width: 4px;

  background: #fff8fb;

}


.card-re {

  border-color: #4dabf7;

  border-style: dashed;

  border-left-width: 4px;

  background: #f7fbff;

}


.card-unknown {

  border-left-color: #adb5bd;

}


/* ===================================== */
/* AVATAR */
/* ===================================== */

.person-avatar {

  width: 48px;

  height: 48px;

  flex: 0 0 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #f1f3f5;

  color: #adb5bd;

  font-size: 1.3rem;

}


.person-avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


/* ===================================== */
/* PERSON INFO */
/* ===================================== */

.person-info {

  flex: 1;

  min-width: 0;

}


.person-name {

  display: flex;

  align-items: center;

  min-width: 0;

  color: #343a40;

  font-size: 0.9rem;

  font-weight: 750;

}


.name-text {

  min-width: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}


.gender-icon {

  margin-right: 4px;

  flex-shrink: 0;

  font-size: 0.8rem;

}


.deceased {

  margin-left: 4px;

  color: #6c757d;

}


.person-alias {

  margin-top: 2px;

  overflow: hidden;

  color: #795548;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.69rem;

  font-style: italic;

}


.person-meta {

  margin-top: 3px;

  color: #868e96;

  font-size: 0.7rem;

}


.open-arrow {

  position: absolute;

  right: 9px;

  top: 50%;

  transform:
    translateY(-50%);

  color: #adb5bd;

  font-size: 22px;

}


/* ===================================== */
/* RELATIONSHIP LABEL */
/* ===================================== */

.spouse-meta-row {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 3px;

}


.spouse-meta-row
.person-meta {

  margin-top: 0;

}


.relationship-label {

  display: inline-flex;

  padding:
    1px 6px;

  border-radius: 999px;

  font-size: 0.55rem;

  font-weight: 850;

  letter-spacing: 0.04em;

}


.label-dau {

  border:
    1px dashed
    #f783ac;

  background: #fff0f6;

  color: #c2255c;

}


.label-re {

  border:
    1px dashed
    #4dabf7;

  background: #e7f5ff;

  color: #1971c2;

}


.label-ngoai {

  border:
    1px solid
    #c4b5fd;

  background: #ede9fe;

  color: #5f3dc4;

}


.external-meta-row {

  margin-top: 3px;

}


/* ===================================== */
/* MARRIAGE LINK */
/* ===================================== */

.marriage-link {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 4px;

  flex-shrink: 0;

  color: #c92a2a;

}


.marriage-line {

  width: 13px;

  height: 1px;

  background: #cfd4da;

}


.heart {

  font-size: 0.8rem;

}


/* ===================================== */
/* SPOUSES */
/* ===================================== */

.spouses {

  display: flex;

  align-items: center;

  gap: 6px;

}


/* ===================================== */
/* EMPTY */
/* ===================================== */

.empty-generation {

  width: 100%;

  padding: 25px;

  color: #6c757d;

  text-align: center;

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .generation-page {

    padding:
      16px 10px
      60px;

  }


  .page-header {

    gap: 9px;

    margin-bottom: 13px;

  }


  .header-icon {

    width: 42px;

    height: 42px;

    font-size: 21px;

  }


  .page-header h1 {

    font-size: 1.25rem;

  }


  .page-header p {

    font-size: 0.76rem;

    line-height: 1.35;

  }


  /* TOOLBAR */

  .generation-toolbar {

    position: sticky;

    top: 62px;

    z-index: 15;

    align-items: stretch;

    padding:
      7px;

    border-radius: 10px;

    background:
      rgba(
        255,
        255,
        255,
        0.96
      );

    backdrop-filter:
      blur(8px);

  }


  .toolbar-actions {

    flex: 1;

  }


  .toolbar-button {

    flex: 1;

    min-height: 37px;

    padding:
      6px 8px;

    font-size: 0.74rem;

  }


  .desktop-label {

    display: none;

  }


  .mobile-label {

    display: inline;

  }


  .toolbar-info {

    width: 100%;

    padding:
      2px 3px
      0;

    font-size: 0.72rem;

  }


  .legend {

    gap: 12px;

    margin-bottom: 11px;

    padding:
      7px 9px;

  }


  .legend-item {

    font-size: 0.68rem;

  }


  /* GENERATION */

  .generations {

    gap: 10px;

  }


  .generation-section {

    border-radius: 11px;

  }


  .generation-header {

    min-height: 49px;

    padding:
      7px 10px;

  }


  .generation-number {

    font-size: 0.86rem;

  }


  .generation-count {

    font-size: 0.62rem;

  }


  /*
    QUAN TRỌNG:
    Mobile KHÔNG cuộn ngang nữa.
    Mỗi family block xếp dọc,
    thành viên chính → ♥ → spouse.
  */

  .generation-people {

    display: grid;

    grid-template-columns: 1fr;

    gap: 10px;

    padding:
      10px 8px;

  }


  .family-block {

    width: 100%;

    display: flex;

    flex-direction: column;

    align-items: stretch;

    gap: 5px;

    padding:
      8px;

    border:
      1px solid
      #eef0f2;

    border-radius: 11px;

    background: #fafafa;

  }


  .person-wrapper {

    width: 100%;

  }


  .person-card {

    width: 100%;

    min-height: 75px;

    padding:
      8px 30px
      8px 9px;

  }


  .person-avatar {

    width: 46px;

    height: 46px;

    flex-basis: 46px;

  }


  .person-name {

    font-size: 0.88rem;

  }


  .person-meta {

    font-size: 0.68rem;

  }


  /* HEART XẾP DỌC */

  .marriage-link {

    height: 25px;

    flex-direction: column;

    gap: 1px;

  }


  .marriage-line {

    width: 1px;

    height: 6px;

  }


  .spouses {

    width: 100%;

    display: grid;

    grid-template-columns: 1fr;

    gap: 6px;

  }


  .spouse-wrapper {

    width: 100%;

  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 390px) {

  .generation-page {

    padding-left: 7px;

    padding-right: 7px;

  }


  .generation-count {

    display: none;

  }


  .person-avatar {

    width: 42px;

    height: 42px;

    flex-basis: 42px;

  }


  .person-card {

    min-height: 69px;

  }

}

</style>
