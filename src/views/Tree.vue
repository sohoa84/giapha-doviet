<template>

  <div class="tree-page">

    <!-- ================================= -->
    <!-- HEADER -->
    <!-- ================================= -->

    <div class="tree-header mb-4">

      <div>

        <h2 class="fw-bold mb-1">
          🌳 Cây gia phả
        </h2>

        <p class="text-muted mb-0">
          Quan hệ các thế hệ trong dòng họ Nguyễn Xuân
        </p>

      </div>

    </div>


    <!-- ================================= -->
    <!-- LOADING -->
    <!-- ================================= -->

    <div
      v-if="loading"
      class="text-center py-5"
    >

      <div
        class="spinner-border"
        role="status"
      ></div>

      <div class="mt-2 text-muted">
        Đang xây dựng cây gia phả...
      </div>

    </div>


    <!-- ================================= -->
    <!-- ERROR -->
    <!-- ================================= -->

    <div
      v-else-if="error"
      class="alert alert-danger"
    >

      {{ error }}

    </div>


    <!-- ================================= -->
    <!-- TREE -->
    <!-- ================================= -->

    <div
      v-else
      class="tree-wrapper"
      :class="{ fullscreen: isFullscreen }"
    >

      <!-- ================================= -->
      <!-- TOOLBAR -->
      <!-- ================================= -->

      <div class="tree-toolbar">

        <div class="toolbar-left">

          <span class="tree-title">
            🌳 Sơ đồ gia phả
          </span>

        </div>


<!-- TREE CONTROLS -->

<div class="tree-controls mb-3">

  <button
    type="button"
    class="btn"
    :class="
      showSpouses
        ? 'btn-primary'
        : 'btn-outline-secondary'
    "
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

    {{ showSpouses
      ? 'Đang hiển thị dâu / rể'
      : 'Đang ẩn dâu / rể'
    }}

  </button>

</div>




        <div class="toolbar-controls">

          <!-- Zoom out -->

          <button
            class="tree-btn"
            title="Thu nhỏ"
            @click="zoomOut"
          >
            −
          </button>


          <!-- Zoom -->

          <button
            class="zoom-value"
            title="Đặt lại 100%"
            @click="resetZoom"
          >
            {{ Math.round(scale * 100) }}%
          </button>


          <!-- Zoom in -->

          <button
            class="tree-btn"
            title="Phóng to"
            @click="zoomIn"
          >
            +
          </button>


          <!-- Reset -->

          <button
            class="tree-btn tree-reset"
            title="Đặt lại kích thước"
            @click="resetZoom"
          >
            ↺
          </button>


          <!-- Fullscreen -->

          <button
            class="tree-btn"
            title="Toàn màn hình"
            @click="toggleFullscreen"
          >

            {{ isFullscreen ? '⛶' : '⛶' }}

          </button>

        </div>

      </div>


      <!-- ================================= -->
      <!-- TREE VIEWPORT -->
      <!-- ================================= -->

      <div
        ref="treeViewport"
        class="tree-viewport"
      >

        <div
          class="tree-canvas"
          :style="{
            transform: `scale(${scale})`,
            transformOrigin: 'top center'
          }"
        >

          <TreeNode
            v-for="node in treeNodes"
            :key="node.person.ID"
            :node="node"
            :show-spouses="showSpouses"
          />

        </div>

      </div>


      <!-- ================================= -->
      <!-- HELP -->
      <!-- ================================= -->

      <div class="tree-help">

        <span>
          🖱️ Kéo ngang/dọc để xem cây
        </span>

        <span>
          🔍 Dùng + / − để thu phóng
        </span>

        <span>
          📂 Bấm − trên từng nhánh để thu gọn
        </span>

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  onMounted,
  onUnmounted
} from 'vue';

import {
  getFamilyOrder
} from '../services/dataService';

import TreeNode from '../components/TreeNode.vue';


// ======================================
// DATA
// ======================================

const treeNodes =
  ref([]);

const loading =
  ref(true);

const error =
  ref('');

// ======================================
// HIỂN THỊ DÂU / RỂ
// ======================================

const showSpouses =
  ref(true);


// ======================================
// ZOOM
// ======================================

const scale =
  ref(0.85);


function zoomIn() {

  scale.value =
    Math.min(
      1.5,
      scale.value + 0.1
    );

}


function zoomOut() {

  scale.value =
    Math.max(
      0.3,
      scale.value - 0.1
    );

}


function resetZoom() {

  scale.value = 0.85;

}


// ======================================
// FULLSCREEN
// ======================================

const isFullscreen =
  ref(false);


function toggleFullscreen() {

  isFullscreen.value =
    !isFullscreen.value;

}


function handleEscape(event) {

  if (
    event.key === 'Escape' &&
    isFullscreen.value
  ) {

    isFullscreen.value = false;

  }

}


// ======================================
// LOAD TREE
// ======================================

async function loadTree() {

  try {

    loading.value = true;

    error.value = '';


    const familyOrder =
  await getFamilyOrder();


// ==================================
// TẠO MAP NGƯỜI
// ==================================

const personMap = new Map();

familyOrder.forEach(item => {

  personMap.set(
    item.person.ID,
    item.person
  );

});


// ==================================
// TẠO NODE
// ==================================

const nodeMap = new Map();

familyOrder.forEach(item => {

  nodeMap.set(
    item.person.ID,
    {

      person:
        item.person,

      depth:
        item.depth || 0,

      spouses: [],

      children: []

    }
  );

});


// ==================================
// GẮN DÂU / RỂ
// ==================================

familyOrder.forEach(item => {

  const person =
    item.person;

  const node =
    nodeMap.get(
      person.ID
    );

  const spouseIds =
    person.spouses || [];


  spouseIds.forEach(
    spouseId => {

      const spouse =
        personMap.get(
          spouseId
        );

      if (spouse) {

        node.spouses.push(
          spouse
        );

      }

    }
  );

});


// ==================================
// GẮN CON
// ==================================

familyOrder.forEach(item => {

  const person =
    item.person;

  const node =
    nodeMap.get(
      person.ID
    );

  const childIds =
    person.children || [];


  childIds.forEach(
    childId => {

      const childNode =
        nodeMap.get(
          childId
        );

      if (childNode) {

        node.children.push(
          childNode
        );

      }

    }
  );

});

// ==================================
// TÌM ROOT THỰC SỰ
// ==================================

const roots = familyOrder.filter(item => {

  const person =
    item.person;

  const father =
    person.Father;

  const mother =
    person.Mother;


  const hasFather =
    father &&
    personMap.has(father);

  const hasMother =
    mother &&
    personMap.has(mother);


  // Người không có cha/mẹ
  // trong dữ liệu gia phả = ROOT

  return !hasFather &&
         !hasMother;

});


// ==================================
// CHỈ LẤY ROOT ĐẦU TIÊN
// ==================================

treeNodes.value =
  roots.length
    ? [
        nodeMap.get(
          roots[0].person.ID
        )
      ]
    : [];


// ==================================
// DEBUG
// ==================================

    console.log(
    'ROOT CANDIDATES:',
    roots.map(item =>
        item.person.ID
    )
    );

    console.log(
    'ACTUAL ROOT:',
    treeNodes.value.map(node =>
        node.person.ID
    )
    );

    console.log(
    'Tree total:',
    familyOrder.length
    );


  }

  catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể xây dựng cây gia phả';

  }

  finally {

    loading.value = false;

  }

}


// ======================================
// INIT
// ======================================

onMounted(() => {

  loadTree();

  window.addEventListener(
    'keydown',
    handleEscape
  );

});


onUnmounted(() => {

  window.removeEventListener(
    'keydown',
    handleEscape
  );

});

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.tree-page {

  width: 100%;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.tree-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

}


/* ===================================== */
/* TREE WRAPPER */
/* ===================================== */

.tree-wrapper {

  background: #ffffff;

  border:
    1px solid #dee2e6;

  border-radius: 12px;

  overflow: hidden;

}


/* ===================================== */
/* FULLSCREEN */
/* ===================================== */

.tree-wrapper.fullscreen {

  position: fixed;

  inset: 0;

  z-index: 9999;

  border-radius: 0;

  background: #ffffff;

}


/* ===================================== */
/* TOOLBAR */
/* ===================================== */

.tree-toolbar {

  height: 54px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    0 15px;

  background: #f8f9fa;

  border-bottom:
    1px solid #dee2e6;

}


.tree-title {

  font-weight: 600;

  color: #495057;

}

/* ===================================== */
/* TREE CONTROLS */
/* ===================================== */

.tree-controls {

  display: flex;

  align-items: center;

  gap: 10px;

}


.tree-controls .btn {

  border-radius: 8px;

  font-size: 0.9rem;

  font-weight: 600;

  padding: 7px 14px;

}


.tree-controls .bi {

  margin-right: 5px;

}

/* ===================================== */
/* CONTROLS */
/* ===================================== */

.toolbar-controls {

  display: flex;

  align-items: center;

  gap: 5px;

}


.tree-btn,
.zoom-value {

  height: 34px;

  min-width: 34px;

  border:
    1px solid #ced4da;

  background: #ffffff;

  border-radius: 6px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 16px;

  transition:
    background 0.15s ease;

}


.tree-btn:hover,
.zoom-value:hover {

  background: #e9ecef;

}


.zoom-value {

  min-width: 55px;

  font-size: 13px;

  font-weight: 600;

}


.tree-reset {

  margin-left: 5px;

}


/* ===================================== */
/* VIEWPORT */
/* ===================================== */

.tree-viewport {

  width: 100%;

  height: 70vh;

  min-height: 500px;

  overflow: auto;

  background:
    #f8f9fa;

  cursor: grab;

}


.tree-viewport:active {

  cursor: grabbing;

}


/* ===================================== */
/* CANVAS */
/* ===================================== */

.tree-canvas {

  display: inline-flex;

  flex-direction: column;

  align-items: center;

  min-width: max-content;

  padding:
    50px 80px 100px;

}


/* ===================================== */
/* HELP */
/* ===================================== */

.tree-help {

  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 20px;

  padding:
    9px 15px;

  font-size: 12px;

  color: #6c757d;

  background: #ffffff;

  border-top:
    1px solid #dee2e6;

}


/* ===================================== */
/* FULLSCREEN VIEWPORT */
/* ===================================== */

.fullscreen .tree-viewport {

  height:
    calc(100vh - 90px);

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .tree-toolbar {

    padding:
      0 8px;

  }


  .tree-title {

    font-size: 14px;

  }


  .tree-viewport {

    height: 65vh;

  }


  .tree-canvas {

    padding:
      30px 30px 80px;

  }


  .tree-help {

    display: none;

  }

}

</style>