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
          Quan hệ các thế hệ trong {{ familyConfig.familyName }}
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

          <button
            type="button"
            class="spouse-toggle"
            :class="{ active: showSpouses }"
            @click="showSpouses = !showSpouses"
            :title="
              showSpouses
                ? 'Ẩn dâu / rể'
                : 'Hiện dâu / rể'
            "
          >

            <i
              class="bi"
              :class="
                showSpouses
                  ? 'bi-people-fill'
                  : 'bi-person-fill'
              "
            ></i>

            <span class="spouse-label-desktop">
              {{
                showSpouses
                  ? 'Đang hiện dâu / rể'
                  : 'Đang ẩn dâu / rể'
              }}
            </span>

            <span class="spouse-label-mobile">
              Dâu/rể
            </span>

          </button>

          <button
            type="button"
            class="external-toggle"
            :class="{ active: showExternal }"
            @click="toggleExternal"
            :title="
              showExternal
                ? 'Ẩn hậu duệ nhánh ngoại'
                : 'Hiện hậu duệ nhánh ngoại'
            "
          >
            <i class="bi bi-diagram-3-fill"></i>

            <span class="external-label-desktop">
              {{
                showExternal
                  ? 'Đang hiện nhánh ngoại'
                  : 'Chỉ dòng nội'
              }}
            </span>

            <span class="external-label-mobile">
              Ngoại
            </span>
          </button>

        </div>


        <div class="toolbar-controls">

          <button
            class="tree-btn"
            title="Thu nhỏ"
            aria-label="Thu nhỏ cây"
            @click="zoomOut"
          >
            −
          </button>

          <button
            class="zoom-value"
            title="Đặt lại mức thu phóng"
            @click="resetZoom"
          >
            {{ Math.round(scale * 100) }}%
          </button>

          <button
            class="tree-btn"
            title="Phóng to"
            aria-label="Phóng to cây"
            @click="zoomIn"
          >
            +
          </button>

          <button
            class="tree-btn fit-btn"
            title="Vừa màn hình"
            aria-label="Thu cây vừa màn hình"
            @click="fitToScreen"
          >
            ⤢
          </button>

          <button
            class="tree-btn fullscreen-btn"
            title="Toàn màn hình"
            aria-label="Bật hoặc tắt toàn màn hình"
            @click="toggleFullscreen"
          >
            ⛶
          </button>

        </div>

      </div>


      <!-- ================================= -->
      <!-- TREE VIEWPORT -->
      <!-- ================================= -->

      <div
        ref="treeViewport"
        class="tree-viewport"
        @touchstart="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >

        <div
          ref="treeCanvas"
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
            :show-external="showExternal"
          />

        </div>

      </div>


      <!-- ================================= -->
      <!-- HELP -->
      <!-- ================================= -->

      <div class="tree-help">

        <span>
          ↔️ Kéo ngang/dọc để xem cây
        </span>

        <span>
          🔍 Dùng + / −, ⤢ hoặc chụm 2 ngón tay để zoom
        </span>

        <span>
          🟣 Bật/tắt hậu duệ nhánh ngoại
        </span>

        <span>
          📂 Bấm − trên từng nhánh để thu gọn
        </span>

      </div>

    </div>

  </div>

</template>


<script setup>

import familyConfig
  from '../config/family.config';

import {
  ref,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue';

import {
  getFamilyOrder,
  getPersons
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
// HIỂN THỊ NHÁNH NGOẠI
// ======================================
//
// Con gái của dòng họ vẫn thuộc dòng nội.
// Con của người con gái đó bắt đầu nhánh ngoại.
// Một khi đã vào nhánh ngoại thì toàn bộ hậu duệ
// tiếp tục là nhánh ngoại.
//

const showExternal =
  ref(true);


// ======================================
// VIEWPORT / MOBILE
// ======================================

const treeViewport =
  ref(null);

const treeCanvas =
  ref(null);


function isMobileView() {

  return window.innerWidth <= 768;

}


function defaultScale() {

  return isMobileView()
    ? 0.5
    : 0.85;

}


// ======================================
// ZOOM
// ======================================

const scale =
  ref(0.85);


function zoomIn() {

  scale.value =
    Math.min(
      MAX_SCALE,
      Number(
        (scale.value + 0.1).toFixed(2)
      )
    );

}


function zoomOut() {

  scale.value =
    Math.max(
      0.18,
      Number(
        (scale.value - 0.1).toFixed(2)
      )
    );

}


async function centerTree() {

  await nextTick();

  const viewport =
    treeViewport.value;

  const canvas =
    treeCanvas.value;

  if (!viewport || !canvas) {
    return;
  }

  const scaledWidth =
    canvas.scrollWidth *
    scale.value;

  viewport.scrollLeft =
    Math.max(
      0,
      (
        scaledWidth -
        viewport.clientWidth
      ) / 2
    );

  viewport.scrollTop = 0;

}


async function resetZoom() {

  scale.value =
    defaultScale();

  await centerTree();

}


async function fitToScreen() {

  await nextTick();

  const viewport =
    treeViewport.value;

  const canvas =
    treeCanvas.value;

  if (!viewport || !canvas) {
    return;
  }

  const naturalWidth =
    canvas.scrollWidth;

  if (!naturalWidth) {
    return;
  }

  const availableWidth =
    Math.max(
      200,
      viewport.clientWidth - 24
    );

  const fittedScale =
    availableWidth /
    naturalWidth;

  scale.value =
    Math.max(
      0.18,
      Math.min(
        isMobileView()
          ? 0.62
          : 1,
        fittedScale
      )
    );

  await nextTick();
  await centerTree();

}


function handleResize() {

  if (isMobileView()) {
    fitToScreen();
  }

}


// ======================================
// TOUCH: KÉO 1 NGÓN + PINCH TO ZOOM 2 NGÓN
// ======================================

const MIN_SCALE = 0.22;
const MAX_SCALE = 1.5;

let touchMode = null;

let panStartX = 0;
let panStartY = 0;
let panStartScrollLeft = 0;
let panStartScrollTop = 0;

let pinchStartDistance = 0;
let pinchStartScale = 1;
let pinchStartMidX = 0;
let pinchStartMidY = 0;
let pinchStartScrollLeft = 0;
let pinchStartScrollTop = 0;


function getTouchDistance(touches) {

  if (!touches || touches.length < 2) {
    return 0;
  }

  const dx =
    touches[0].clientX -
    touches[1].clientX;

  const dy =
    touches[0].clientY -
    touches[1].clientY;

  return Math.hypot(dx, dy);

}


function getTouchMidpoint(touches) {

  if (!touches || touches.length < 2) {

    return {
      x: 0,
      y: 0
    };

  }

  return {
    x:
      (
        touches[0].clientX +
        touches[1].clientX
      ) / 2,

    y:
      (
        touches[0].clientY +
        touches[1].clientY
      ) / 2
  };

}


function clampScale(value) {

  return Math.max(
    MIN_SCALE,
    Math.min(
      MAX_SCALE,
      value
    )
  );

}


function startPan(touch) {

  const viewport =
    treeViewport.value;

  if (!viewport || !touch) {
    return;
  }

  touchMode = 'pan';

  panStartX =
    touch.clientX;

  panStartY =
    touch.clientY;

  panStartScrollLeft =
    viewport.scrollLeft;

  panStartScrollTop =
    viewport.scrollTop;

}


function startPinch(touches) {

  const viewport =
    treeViewport.value;

  if (
    !viewport ||
    !touches ||
    touches.length < 2
  ) {
    return;
  }

  touchMode = 'pinch';

  pinchStartDistance =
    getTouchDistance(touches);

  pinchStartScale =
    scale.value;

  const midpoint =
    getTouchMidpoint(touches);

  const rect =
    viewport.getBoundingClientRect();

  pinchStartMidX =
    midpoint.x -
    rect.left;

  pinchStartMidY =
    midpoint.y -
    rect.top;

  pinchStartScrollLeft =
    viewport.scrollLeft;

  pinchStartScrollTop =
    viewport.scrollTop;

}


function handleTouchStart(event) {

  if (!isMobileView()) {
    return;
  }

  if (event.touches.length >= 2) {

    startPinch(
      event.touches
    );

    return;
  }

  if (event.touches.length === 1) {

    startPan(
      event.touches[0]
    );

  }

}


function handleTouchMove(event) {

  if (!isMobileView()) {
    return;
  }

  const viewport =
    treeViewport.value;

  if (!viewport) {
    return;
  }


  // ==================================
  // PINCH 2 NGÓN
  // ==================================

  if (event.touches.length >= 2) {

    if (touchMode !== 'pinch') {

      startPinch(
        event.touches
      );

    }

    const currentDistance =
      getTouchDistance(
        event.touches
      );

    if (
      !pinchStartDistance ||
      !currentDistance
    ) {
      return;
    }

    const zoomRatio =
      currentDistance /
      pinchStartDistance;

    const oldScale =
      scale.value;

    const newScale =
      clampScale(
        pinchStartScale *
        zoomRatio
      );

    if (
      Math.abs(
        newScale -
        oldScale
      ) < 0.002
    ) {
      return;
    }

    const midpoint =
      getTouchMidpoint(
        event.touches
      );

    const rect =
      viewport.getBoundingClientRect();

    const currentMidX =
      midpoint.x -
      rect.left;

    const currentMidY =
      midpoint.y -
      rect.top;

    /*
      Giữ vùng đang nằm giữa hai ngón tay
      gần như cố định khi zoom.
    */
    const contentX =
      (
        pinchStartScrollLeft +
        pinchStartMidX
      ) /
      pinchStartScale;

    const contentY =
      (
        pinchStartScrollTop +
        pinchStartMidY
      ) /
      pinchStartScale;

    scale.value =
      Number(
        newScale.toFixed(3)
      );

    viewport.scrollLeft =
      Math.max(
        0,
        contentX *
        scale.value -
        currentMidX
      );

    viewport.scrollTop =
      Math.max(
        0,
        contentY *
        scale.value -
        currentMidY
      );

    return;

  }


  // ==================================
  // KÉO 1 NGÓN
  // ==================================

  if (event.touches.length === 1) {

    if (touchMode !== 'pan') {

      startPan(
        event.touches[0]
      );

    }

    const touch =
      event.touches[0];

    const deltaX =
      touch.clientX -
      panStartX;

    const deltaY =
      touch.clientY -
      panStartY;

    viewport.scrollLeft =
      panStartScrollLeft -
      deltaX;

    viewport.scrollTop =
      panStartScrollTop -
      deltaY;

  }

}


function handleTouchEnd(event) {

  if (!isMobileView()) {
    return;
  }

  /*
    Nếu từ pinch còn lại 1 ngón,
    chuyển ngay về chế độ kéo 1 ngón.
  */
  if (event.touches.length === 1) {

    startPan(
      event.touches[0]
    );

    return;

  }

  if (event.touches.length === 0) {

    touchMode = null;

  }

}


// ======================================
// TOGGLE NHÁNH NGOẠI
// ======================================

async function toggleExternal() {

  showExternal.value =
    !showExternal.value;

  await nextTick();

  if (isMobileView()) {
    await fitToScreen();
  }
  else {
    await centerTree();
  }

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


    // ==================================
    // LOAD THỨ TỰ + TOÀN BỘ PERSON
    // ==================================
    //
    // getFamilyOrder:
    //   giữ thứ tự vai vế / thứ tự Excel.
    //
    // getPersons:
    //   đảm bảo Tree có đầy đủ mọi người,
    //   kể cả hậu duệ qua con gái.
    //

    const [
      familyOrder,
      allPersons
    ] =
      await Promise.all([
        getFamilyOrder(),
        getPersons()
      ]);


    // ==================================
    // NHẬN DIỆN DÂU / RỂ
    // ==================================

    function isSpousePerson(person) {

      if (!person?.ID) {
        return false;
      }

      const id =
        String(person.ID);

      const father =
        String(
          person.Father ||
          person['Cha'] ||
          ''
        ).trim();

      const mother =
        String(
          person.Mother ||
          person['Mẹ'] ||
          ''
        ).trim();

      return (
        /S\d+$/i.test(id) &&
        !father &&
        !mother
      );

    }


    // ==================================
    // MAP TOÀN BỘ NGƯỜI
    // ==================================

    const personMap =
      new Map();

    allPersons.forEach(person => {

      personMap.set(
        person.ID,
        person
      );

    });


    // ==================================
    // THỨ TỰ THÀNH VIÊN CHÍNH
    // ==================================
    //
    // Không đưa S1/S2/S3 vào node chính.
    //

    const coreOrder =
      familyOrder.filter(
        item =>
          !isSpousePerson(
            item.person
          )
      );


    // ==================================
    // NODE MAP - CHỈ NGƯỜI CHÍNH
    // ==================================

    const nodeMap =
      new Map();

    coreOrder.forEach(item => {

      nodeMap.set(
        item.person.ID,
        {

          person:
            item.person,

          depth:
            item.depth || 0,

          spouses: [],

          children: [],

          isExternal: false

        }
      );

    });


    // ==================================
    // GẮN DÂU / RỂ
    // ==================================

    coreOrder.forEach(item => {

      const person =
        item.person;

      const node =
        nodeMap.get(
          person.ID
        );

      if (!node) {
        return;
      }


      /*
        Ưu tiên spouses[] do converter sinh.

        Nếu một ID không tồn tại hoặc không phải
        spouse thì bỏ qua.
      */

      const spouseIds =
        person.spouses || [];

      spouseIds.forEach(
        spouseId => {

          const spouse =
            personMap.get(
              spouseId
            );

          if (
            spouse &&
            isSpousePerson(spouse) &&
            !node.spouses.some(
              item =>
                item.ID === spouse.ID
            )
          ) {

            node.spouses.push(
              spouse
            );

          }

        }
      );

    });


    // ==================================
    // XÁC ĐỊNH "CHA/MẸ THUỘC CÂY CHÍNH"
    // ==================================
    //
    // Đây là phần quan trọng để hỗ trợ NHÁNH NGOẠI.
    //
    // Ví dụ:
    //
    // Đỗ Thị A         = người trong họ
    // Trần Văn B S1    = rể
    //       |
    //       +-- Con C
    //
    // C có:
    //
    // Father = ID của rể
    // Mother = ID của Đỗ Thị A
    //
    // Tree phải gắn C dưới Đỗ Thị A,
    // KHÔNG gắn dưới người rể.
    //

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
          ? personMap.get(fatherId)
          : null;

      const mother =
        motherId
          ? personMap.get(motherId)
          : null;


      const fatherIsCore =
        father &&
        !isSpousePerson(father) &&
        nodeMap.has(fatherId);

      const motherIsCore =
        mother &&
        !isSpousePerson(mother) &&
        nodeMap.has(motherId);


      // Thông thường chỉ một bên là người của dòng họ.
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


      /*
        Trường hợp hiếm cả Cha và Mẹ đều có node chính:
        giữ ưu tiên Cha để tương thích cây cũ.
      */

      if (fatherIsCore) {
        return fatherId;
      }

      if (motherIsCore) {
        return motherId;
      }


      return null;

    }


    // ==================================
    // GẮN CON - MỖI NGƯỜI CHỈ 1 PARENT NODE
    // ==================================
    //
    // Duyệt theo coreOrder để giữ nguyên thứ tự
    // anh/chị/em từ getFamilyOrder().
    //

    coreOrder.forEach(item => {

      const child =
        item.person;

      const childNode =
        nodeMap.get(
          child.ID
        );

      if (!childNode) {
        return;
      }


      const parentId =
        getCoreParentId(
          child
        );


      if (!parentId) {
        return;
      }


      const parentNode =
        nodeMap.get(
          parentId
        );


      if (
        parentNode &&
        !parentNode.children.some(
          node =>
            node.person.ID ===
            child.ID
        )
      ) {

        parentNode.children.push(
          childNode
        );

      }

    });


    // ==================================
    // ĐÁNH DẤU NHÁNH NGOẠI ĐỆ QUY
    // ==================================
    //
    // Quy tắc đã thống nhất:
    //
    // 1. Con gái của dòng họ:
    //       vẫn là NỘI.
    //
    // 2. Con của người con gái:
    //       bắt đầu NGOẠI.
    //
    // 3. Từ đó trở xuống:
    //       tất cả đều NGOẠI.
    //

    function markExternalBranch(
      node,
      inheritedExternal = false
    ) {

      if (!node) {
        return;
      }


      node.isExternal =
        inheritedExternal;


      const childrenAreExternal =
        inheritedExternal ||
        node.person?.['Giới tính'] ===
          'Nữ';


      (node.children || [])
        .forEach(child => {

          markExternalBranch(
            child,
            childrenAreExternal
          );

        });

    }


    // ==================================
    // TÌM ROOT THỰC SỰ
    // ==================================
    //
    // Chỉ xét thành viên chính,
    // không xét dâu/rể S1/S2.
    //

    const roots =
      coreOrder.filter(item => {

        const person =
          item.person;

        return (
          !getCoreParentId(person)
        );

      });


    // ==================================
    // GIỮ CÁCH CŨ:
    // CHỈ LẤY ROOT ĐẦU TIÊN
    // ==================================

    const rootNode =
      roots.length
        ? nodeMap.get(
            roots[0].person.ID
          )
        : null;


    if (rootNode) {

      markExternalBranch(
        rootNode,
        false
      );

    }


    treeNodes.value =
      rootNode
        ? [rootNode]
        : [];


    // ==================================
    // DEBUG NHÁNH NGOẠI
    // ==================================

    const allCoreNodes =
      Array.from(
        nodeMap.values()
      );

    const externalNodes =
      allCoreNodes.filter(
        node =>
          node.isExternal
      );


    console.log(
      'TREE ROOT:',
      rootNode?.person?.ID || ''
    );

    console.log(
      'CORE PERSONS:',
      allCoreNodes.length
    );

    console.log(
      'EXTERNAL PERSONS:',
      externalNodes.length
    );

    console.log(
      'EXTERNAL IDS:',
      externalNodes.map(
        node =>
          node.person.ID
      )
    );


    // ==================================
    // CĂN CÂY CHO MÀN HÌNH
    // ==================================

    await nextTick();

    if (isMobileView()) {
      await fitToScreen();
    }
    else {
      scale.value = 0.85;
      await centerTree();
    }

  }
  catch (err) {

    console.error(err);

    error.value =
      err.message ||
      'Không thể xây dựng cây gia phả';

  }
  finally {

    loading.value =
      false;

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

  window.addEventListener(
    'resize',
    handleResize
  );

});


onUnmounted(() => {

  window.removeEventListener(
    'keydown',
    handleEscape
  );

  window.removeEventListener(
    'resize',
    handleResize
  );

});

</script>


<style scoped>

/* ===================================== */
/* PAGE */
/* ===================================== */

.tree-page {
  width: 100%;
  min-width: 0;
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
  border: 1px solid #dee2e6;
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
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.toolbar-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tree-title {
  white-space: nowrap;
  font-weight: 700;
  color: #495057;
}


/* ===================================== */
/* SPOUSE TOGGLE */
/* ===================================== */

.spouse-toggle,
.external-toggle {
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: #ffffff;
  color: #495057;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.spouse-toggle.active {
  border-color: #0d6efd;
  background: #0d6efd;
  color: #ffffff;
}

.external-toggle.active {
  border-color: #7950f2;
  background: #7950f2;
  color: #ffffff;
}

.spouse-label-mobile,
.external-label-mobile {
  display: none;
}


/* ===================================== */
/* ZOOM CONTROLS */
/* ===================================== */

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.tree-btn,
.zoom-value {
  height: 36px;
  min-width: 36px;
  border: 1px solid #ced4da;
  background: #ffffff;
  color: #343a40;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  line-height: 1;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.tree-btn:hover,
.zoom-value:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.zoom-value {
  min-width: 56px;
  padding: 0 7px;
  font-size: 12px;
  font-weight: 700;
}


/* ===================================== */
/* VIEWPORT */
/* ===================================== */

.tree-viewport {
  width: 100%;
  height: 70vh;
  min-height: 500px;
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  background: #f8f9fa;
  cursor: grab;
  scrollbar-gutter: stable;
}

.tree-viewport:active {
  cursor: grabbing;
}

.tree-viewport {
  -webkit-tap-highlight-color: transparent;
}


/* ===================================== */
/* CANVAS */
/* ===================================== */

.tree-canvas {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: max-content;
  padding: 50px 80px 100px;
  will-change: transform;
  transition: transform 0.12s ease-out;
}


/* ===================================== */
/* HELP */
/* ===================================== */

.tree-help {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 9px 15px;
  font-size: 12px;
  color: #6c757d;
  background: #ffffff;
  border-top: 1px solid #dee2e6;
}


/* ===================================== */
/* FULLSCREEN VIEWPORT */
/* ===================================== */

.fullscreen .tree-viewport {
  height: calc(100vh - 56px);
  min-height: 0;
}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .tree-page {
    margin-left: -8px;
    margin-right: -8px;
    width: calc(100% + 16px);
  }

  .tree-header {
    margin-bottom: 10px !important;
    padding: 0 8px;
  }

  .tree-header h2 {
    font-size: 1.25rem;
  }

  .tree-header p {
    font-size: 0.82rem;
    line-height: 1.35;
  }

  .tree-wrapper {
    border-radius: 10px;
  }

  .tree-toolbar {
    min-height: 54px;
    gap: 6px;
    padding: 7px 6px;
  }

  .toolbar-left {
    gap: 5px;
  }

  .tree-title {
    display: none;
  }

  .spouse-toggle,
  .external-toggle {
    height: 36px;
    min-width: 42px;
    padding: 0 8px;
    border-radius: 8px;
    font-size: 0.72rem;
  }

  .spouse-toggle .bi,
  .external-toggle .bi {
    font-size: 14px;
  }

  .spouse-label-desktop,
  .external-label-desktop {
    display: none;
  }

  .spouse-label-mobile,
  .external-label-mobile {
    display: inline;
  }

  .toolbar-controls {
    gap: 3px;
  }

  .tree-btn,
  .zoom-value {
    height: 36px;
    min-width: 36px;
    border-radius: 8px;
  }

  .zoom-value {
    min-width: 48px;
    padding: 0 4px;
    font-size: 11px;
  }

  .fullscreen-btn {
    display: none;
  }

  .tree-viewport {
    height: 72vh;
    min-height: 520px;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .tree-canvas {
    padding: 28px 18px 70px;
    transform-origin: top center !important;
  }

  .tree-help {
    display: none;
  }

}


/* ===================================== */
/* MOBILE NHỎ */
/* ===================================== */

@media (max-width: 390px) {

  .spouse-label-mobile,
  .external-label-mobile {
    display: none;
  }

  .spouse-toggle,
  .external-toggle {
    min-width: 36px;
    padding: 0 6px;
  }

  .tree-btn,
  .zoom-value {
    height: 34px;
    min-width: 34px;
  }

  .zoom-value {
    min-width: 44px;
  }

  .tree-viewport {
    height: 74vh;
  }

}


/* ===================================== */
/* LANDSCAPE MOBILE */
/* ===================================== */

@media (max-width: 900px) and (orientation: landscape) {

  .tree-header {
    display: none;
  }

  .tree-viewport {
    height: calc(100vh - 58px);
    min-height: 0;
  }

}

</style>