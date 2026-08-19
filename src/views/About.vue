<template>

  <div class="about-page container">

    <!-- ===================================== -->
    <!-- HEADER -->
    <!-- ===================================== -->

    <header class="about-header">

      <div class="header-icon">
        📖
      </div>

      <div>
        <div class="eyebrow">
          NGUYỄN XUÂN
        </div>

        <h1>
          Giới thiệu Chi Vĩnh An
        </h1>

        <p>
          Nguồn cội • Lịch sử • Nội quy • Tổ chức dòng họ
        </p>
      </div>

    </header>


    <!-- ===================================== -->
    <!-- MOBILE / DESKTOP TABS -->
    <!-- ===================================== -->

    <nav
      class="about-tabs"
      aria-label="Nội dung giới thiệu"
    >

      <button
        v-for="item in sections"
        :key="item.id"
        type="button"
        class="tab-button"
        :class="{ active: activeSection === item.id }"
        @click="selectSection(item.id)"
      >

        <span class="tab-icon">
          {{ item.icon }}
        </span>

        <span>
          {{ item.label }}
        </span>

      </button>

    </nav>


    <!-- ===================================== -->
    <!-- CONTENT -->
    <!-- ===================================== -->

    <article class="about-document">

      <div class="document-heading">

        <div class="document-icon">
          {{ activeItem.icon }}
        </div>

        <div>
          <div class="document-label">
            GIỚI THIỆU CHI VĨNH AN
          </div>

          <h2>
            {{ activeItem.label }}
          </h2>
        </div>

      </div>


      <div
        class="markdown-content"
        v-html="htmlContent"
      ></div>

    </article>


    <!-- ===================================== -->
    <!-- PREV / NEXT -->
    <!-- ===================================== -->

    <div class="section-navigation">

      <button
        v-if="previousItem"
        type="button"
        class="nav-section-button previous"
        @click="selectSection(previousItem.id)"
      >
        <span>←</span>

        <div>
          <small>Phần trước</small>
          <strong>{{ previousItem.label }}</strong>
        </div>
      </button>

      <div
        v-else
        class="nav-spacer"
      ></div>


      <button
        v-if="nextItem"
        type="button"
        class="nav-section-button next"
        @click="selectSection(nextItem.id)"
      >
        <div>
          <small>Phần tiếp theo</small>
          <strong>{{ nextItem.label }}</strong>
        </div>

        <span>→</span>
      </button>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue';

import MarkdownIt
  from 'markdown-it';


import loinoidauMarkdown
  from '../content/about/loinoidau.md?raw';

import lichsuMarkdown
  from '../content/about/lichsu.md?raw';

import noiquyMarkdown
  from '../content/about/noiquy.md?raw';

import bantochucMarkdown
  from '../content/about/bantochuc.md?raw';


// ======================================
// MARKDOWN
// ======================================

const markdown =
  new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
  });


// ======================================
// SECTIONS
// ======================================

const sections = [

  {
    id: 'loi-noi-dau',
    label: 'Lời nói đầu',
    icon: '🌿',
    markdown: loinoidauMarkdown
  },

  {
    id: 'lich-su',
    label: 'Lịch sử',
    icon: '🏛️',
    markdown: lichsuMarkdown
  },

  {
    id: 'noi-quy',
    label: 'Nội quy 17 điều',
    icon: '📜',
    markdown: noiquyMarkdown
  },

  {
    id: 'ban-to-chuc',
    label: 'Ban tổ chức',
    icon: '👥',
    markdown: bantochucMarkdown
  }

];


const activeSection =
  ref('loi-noi-dau');


// ======================================
// ACTIVE ITEM
// ======================================

const activeIndex =
  computed(() => {

    const index =
      sections.findIndex(
        item =>
          item.id === activeSection.value
      );

    return index >= 0
      ? index
      : 0;

  });


const activeItem =
  computed(() => {

    return sections[
      activeIndex.value
    ];

  });


const previousItem =
  computed(() => {

    if (
      activeIndex.value <= 0
    ) {
      return null;
    }

    return sections[
      activeIndex.value - 1
    ];

  });


const nextItem =
  computed(() => {

    if (
      activeIndex.value >=
      sections.length - 1
    ) {
      return null;
    }

    return sections[
      activeIndex.value + 1
    ];

  });


// ======================================
// RENDER MARKDOWN
// ======================================

const htmlContent =
  computed(() => {

    return markdown.render(
      activeItem.value.markdown
    );

  });


// ======================================
// SELECT SECTION
// ======================================

function selectSection(id) {

  activeSection.value =
    id;


  // Lưu section vào URL hash.
  // Ví dụ:
  // /about#noi-quy

  history.replaceState(
    null,
    '',
    `#${id}`
  );


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


// ======================================
// INIT FROM HASH
// ======================================

onMounted(() => {

  const hash =
    window.location.hash
      .replace('#', '')
      .trim();


  const exists =
    sections.some(
      item =>
        item.id === hash
    );


  if (exists) {

    activeSection.value =
      hash;

  }

});

</script>


<style scoped>

/* ===================================== */
/* ẢNH TRONG BÀI VIẾT MARKDOWN */
/* ===================================== */

.markdown-content :deep(img) {

  display: block;

  width: 100%;

  max-width: 760px;

  height: auto;

  margin:
    22px auto
    8px;

  border-radius: 12px;

  box-shadow:
    0 4px 16px
    rgba(0, 0, 0, 0.12);

}


/* Dòng chữ nghiêng ngay sau ảnh
   dùng làm chú thích ảnh */

.markdown-content :deep(img + em) {

  display: block;

  margin:
    0 auto
    22px;

  color: #8a8178;

  font-size: 0.78rem;

  text-align: center;

}

/* ===================================== */
/* PAGE */
/* ===================================== */

.about-page {

  max-width: 960px;

  padding-top: 28px;

  padding-bottom: 70px;

}


/* ===================================== */
/* HEADER */
/* ===================================== */

.about-header {

  display: flex;

  align-items: center;

  gap: 15px;

  margin-bottom: 22px;

}


.header-icon {

  width: 56px;

  height: 56px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #fff3bf;

  font-size: 28px;

}


.eyebrow {

  margin-bottom: 2px;

  color: #922525;

  font-size: 0.7rem;

  font-weight: 800;

  letter-spacing: 0.12em;

}


.about-header h1 {

  margin: 0;

  color: #382f29;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 1.85rem;

  font-weight: 700;

}


.about-header p {

  margin:
    4px 0 0;

  color: #7b7168;

  font-size: 0.9rem;

}


/* ===================================== */
/* TABS */
/* ===================================== */

.about-tabs {

  position: sticky;

  top: 72px;

  z-index: 20;

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 8px;

  margin-bottom: 18px;

  padding:
    8px 0;

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


.tab-button {

  min-height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    8px 10px;

  border:
    1px solid
    #e5ddd3;

  border-radius: 11px;

  background: #ffffff;

  color: #61574f;

  font-size: 0.84rem;

  font-weight: 700;

  cursor: pointer;

}


.tab-button.active {

  border-color: #922525;

  background: #922525;

  color: #ffffff;

}


.tab-icon {

  font-size: 16px;

}


/* ===================================== */
/* DOCUMENT */
/* ===================================== */

.about-document {

  overflow: hidden;

  border:
    1px solid
    #e8dfd4;

  border-radius: 16px;

  background: #ffffff;

}


.document-heading {

  display: flex;

  align-items: center;

  gap: 11px;

  padding:
    17px 19px;

  border-bottom:
    1px solid
    #eee5da;

  background: #fffaf3;

}


.document-icon {

  width: 42px;

  height: 42px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #f6ead7;

  font-size: 20px;

}


.document-label {

  margin-bottom: 2px;

  color: #a37a4a;

  font-size: 0.65rem;

  font-weight: 800;

  letter-spacing: 0.09em;

}


.document-heading h2 {

  margin: 0;

  color: #4a3d34;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 1.35rem;

}


/* ===================================== */
/* MARKDOWN */
/* ===================================== */

.markdown-content {

  padding:
    22px 24px
    30px;

  color: #4d4640;

  font-size: 0.98rem;

  line-height: 1.82;

}


.markdown-content :deep(h1) {

  margin:
    6px 0
    20px;

  color: #7c2020;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 1.65rem;

  line-height: 1.35;

  text-align: center;

}


.markdown-content :deep(h2) {

  margin:
    30px 0
    12px;

  padding-bottom: 7px;

  border-bottom:
    1px solid
    #ede4d9;

  color: #7c2020;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 1.25rem;

}


.markdown-content :deep(h3) {

  margin:
    24px 0
    8px;

  color: #7c2020;

  font-size: 1.05rem;

  font-weight: 800;

}


.markdown-content :deep(p) {

  margin:
    0 0
    14px;

  text-align: justify;

}


.markdown-content :deep(ul),
.markdown-content :deep(ol) {

  margin:
    8px 0
    17px;

  padding-left: 23px;

}


.markdown-content :deep(li) {

  margin-bottom: 8px;

}


.markdown-content :deep(strong) {

  color: #392f29;

}


.markdown-content :deep(em) {

  color: #6f6258;

}


.markdown-content :deep(blockquote) {

  margin:
    20px 0;

  padding:
    15px 18px;

  border-left:
    4px solid
    #922525;

  border-radius:
    0 10px
    10px 0;

  background: #fff8ef;

  color: #5c4e43;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-style: italic;

}


.markdown-content :deep(blockquote p) {

  margin: 0;

  text-align: left;

}


/* ===================================== */
/* PREV / NEXT */
/* ===================================== */

.section-navigation {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;

  margin-top: 14px;

}


.nav-section-button {

  min-height: 58px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    10px 13px;

  border:
    1px solid
    #e5ddd3;

  border-radius: 11px;

  background: #ffffff;

  color: #61574f;

  cursor: pointer;

}


.nav-section-button.next {

  justify-content:
    flex-end;

  text-align: right;

}


.nav-section-button small {

  display: block;

  margin-bottom: 1px;

  color: #9a8e84;

  font-size: 0.68rem;

}


.nav-section-button strong {

  display: block;

  color: #922525;

  font-size: 0.82rem;

}


.nav-section-button > span {

  color: #922525;

  font-size: 20px;

}


.nav-spacer {

  min-height: 1px;

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .about-page {

    padding:
      17px 12px
      60px;

  }


  .about-header {

    gap: 10px;

    margin-bottom: 13px;

  }


  .header-icon {

    width: 44px;

    height: 44px;

    font-size: 22px;

  }


  .eyebrow {

    font-size: 0.6rem;

  }


  .about-header h1 {

    font-size: 1.28rem;

  }


  .about-header p {

    font-size: 0.75rem;

  }


  /* TAB 2 CỘT TRÊN MOBILE */

  .about-tabs {

    top: 62px;

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 6px;

    margin:
      0 -2px
      12px;

    padding:
      7px 2px;

  }


  .tab-button {

    min-height: 43px;

    padding:
      6px 7px;

    border-radius: 9px;

    font-size: 0.76rem;

  }


  .tab-icon {

    font-size: 14px;

  }


  .about-document {

    border-radius: 12px;

  }


  .document-heading {

    padding:
      13px 14px;

  }


  .document-icon {

    width: 37px;

    height: 37px;

  }


  .document-heading h2 {

    font-size: 1.12rem;

  }


  .markdown-content {

    padding:
      17px 15px
      24px;

    font-size: 0.93rem;

    line-height: 1.75;

  }


  .markdown-content :deep(h1) {

    font-size: 1.35rem;

  }


  .markdown-content :deep(h2) {

    margin-top: 25px;

    font-size: 1.08rem;

  }


  .markdown-content :deep(h3) {

    margin-top: 21px;

    font-size: 0.98rem;

  }


  .markdown-content :deep(p) {

    text-align: left;

  }


  .section-navigation {

    gap: 7px;

  }


  .nav-section-button {

    min-height: 54px;

    padding:
      8px 9px;

  }


  .nav-section-button strong {

    font-size: 0.75rem;

  }

}


/* ===================================== */
/* MOBILE RẤT NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .tab-button {

    font-size: 0.7rem;

  }


  .markdown-content {

    padding:
      15px 13px
      22px;

  }

}

</style>
