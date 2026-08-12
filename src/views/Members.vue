<template>

  <!-- Tiêu đề -->

  <div class="mb-4">

    <h1 class="fw-bold">
      Thành viên họ Nguyễn Xuân
    </h1>

    <p class="text-muted mb-0">
      Danh sách các thành viên trong gia phả
    </p>

  </div>


  <!-- Loading -->

  <div
    v-if="loading"
    class="text-center py-5"
  >

    <div
      class="spinner-border"
      role="status"
    ></div>

    <div class="mt-2 text-muted">
      Đang tải dữ liệu...
    </div>

  </div>


  <!-- Error -->

  <div
    v-else-if="error"
    class="alert alert-danger"
  >

    {{ error }}

  </div>


  <!-- Members -->

  <div v-else>


    <!-- ============================== -->
    <!-- SEARCH -->
    <!-- ============================== -->

    <div class="row g-3 mb-4">

      <div class="col-12 col-md-6">

        <div class="input-group">

          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>

          <input
            v-model="searchKeyword"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên hoặc mã thành viên..."
          >

        </div>

      </div>


      <!-- ============================== -->
      <!-- GENERATION -->
      <!-- ============================== -->

      <div class="col-12 col-md-3">

        <label
          for="generation"
          class="form-label fw-semibold"
        >
          Lọc theo đời
        </label>

        <select
          id="generation"
          v-model="selectedGeneration"
          class="form-select"
        >

          <option value="">
            Tất cả các đời
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


      <!-- ============================== -->
      <!-- GENDER -->
      <!-- ============================== -->

      <div class="col-12 col-md-3">

        <label
          for="gender"
          class="form-label fw-semibold"
        >
          Giới tính
        </label>

        <select
          id="gender"
          v-model="selectedGender"
          class="form-select"
        >

          <option value="">
            Tất cả
          </option>

          <option value="Nam">
            Nam
          </option>

          <option value="Nữ">
            Nữ
          </option>

        </select>

      </div>

    </div>


    <!-- ============================== -->
    <!-- TOTAL -->
    <!-- ============================== -->

    <div class="mb-3 text-muted">

      Có
      <strong>{{ filteredPersons.length }}</strong>
      thành viên

    </div>


    <!-- ============================== -->
    <!-- PERSON CARDS -->
    <!-- ============================== -->

    <div class="row g-3">

      <div
        v-for="person in filteredPersons"
        :key="person.ID"
        class="col-12 col-md-6 col-lg-4"
      >

        <PersonCard
          :person="person"
        />

      </div>

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
  getFamilyOrder
} from '../services/dataService';

import PersonCard
  from '../components/PersonCard.vue';


// ======================================
// DATA
// ======================================

const persons =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');

const searchKeyword =
  ref('');

const selectedGeneration =
  ref('');

const selectedGender =
  ref('');


// ======================================
// FILTER
// ======================================

const filteredPersons =
  computed(() => {

    const keyword =
      searchKeyword.value
        .trim()
        .toLowerCase();

    return persons.value

      .filter(person => {

        // ------------------------------
        // Lọc theo đời
        // ------------------------------

        const matchGeneration =
          !selectedGeneration.value ||
          Number(person.generation) ===
          Number(selectedGeneration.value);


        // ------------------------------
        // Lọc theo giới tính
        // ------------------------------

        const matchGender =
          !selectedGender.value ||
          person['Giới tính'] ===
          selectedGender.value;


        // ------------------------------
        // Lọc theo từ khóa
        // ------------------------------

        const text = [

          person.ID,
          person['Họ'],
          person['Tên'],
          person['Tên Tự']

        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchKeyword =
          !keyword ||
          text.includes(keyword);


        // ------------------------------
        // Kết hợp
        // ------------------------------

        return (
          matchGeneration &&
          matchGender &&
          matchKeyword
        );

      });

  });


// ======================================
// DANH SÁCH CÁC ĐỜI
// ======================================

const generations =
  computed(() => {

    return [

      ...new Set(

        persons.value

          .map(person =>
            Number(person.generation)
          )

          .filter(Boolean)

      )

    ].sort(
      (a, b) => a - b
    );

  });


// ======================================
// LOAD MEMBERS
// ======================================

async function loadPersons() {

  try {

    loading.value = true;

    error.value = '';


    // ==================================
    // Lấy thứ tự gia phả
    // ==================================

    const familyOrder =
      await getFamilyOrder();


    // ==================================
    // Chuyển:
    //
    // {
    //   person,
    //   depth
    // }
    //
    // thành:
    //
    // person
    //
    // để PersonCard hiện tại
    // không cần sửa.
    // ==================================

    persons.value =
      familyOrder.map(item => {

        return {

          ...item.person,

          // Giữ lại depth để
          // sử dụng sau này nếu cần.

          _familyDepth:
            item.depth

        };

      });


    // ==================================
    // DEBUG
    // ==================================

    console.log(
      'Family order:',
      persons.value
    );

    console.log(
      'Total:',
      persons.value.length
    );

    console.log(
      'First 20:',
      persons.value
        .slice(0, 20)
        .map(person => ({

          ID:
            person.ID,

          Father:
            person.Father,

          Mother:
            person.Mother,

          generation:
            person.generation,

          depth:
            person._familyDepth

        }))
    );


  } catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể tải danh sách thành viên';

  } finally {

    loading.value = false;

  }

}


// ======================================
// INIT
// ======================================

onMounted(
  loadPersons
);

</script>