<template>
  <header class="site-header">

    <div class="header-inner">

      <!-- ===================================== -->
      <!-- BRAND / LOGO -->
      <!-- ===================================== -->

      <router-link
        to="/"
        class="brand"
        @click="closeMenu"
      >

        <div class="brand-icon">
          🌳
        </div>

        <div class="brand-text">
          <div class="brand-title">
            Gia phả Nguyễn Xuân
          </div>

          <div class="brand-subtitle">
            Chi Vĩnh An
          </div>
        </div>

      </router-link>


      <!-- ===================================== -->
      <!-- MOBILE MENU BUTTON -->
      <!-- ===================================== -->

      <button
        type="button"
        class="menu-button"
        :class="{ active: menuOpen }"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Mở menu"
      >

        <span></span>
        <span></span>
        <span></span>

      </button>


      <!-- ===================================== -->
      <!-- NAVIGATION -->
      <!-- ===================================== -->

      <nav
        class="main-nav"
        :class="{ open: menuOpen }"
      >

        <router-link
          to="/"
          @click="closeMenu"
        >
          <span class="nav-icon">⌂</span>
          Trang chủ
        </router-link>


        <router-link
          to="/tree"
          @click="closeMenu"
        >
          <span class="nav-icon">🌳</span>
          Cây gia phả
        </router-link>


        <router-link
          to="/generation-tree"
          @click="closeMenu"
        >
          <span class="nav-icon">🧬</span>
          Cây thế hệ
        </router-link>


        <router-link
          to="/members"
          @click="closeMenu"
        >
          <span class="nav-icon">👥</span>
          Thành viên
        </router-link>

        <router-link
          to="/events"
          @click="closeMenu"
        >
          <span class="nav-icon">🕯️</span>
          Ngày giỗ
        </router-link>

        <router-link
          to="/media"
          @click="closeMenu"
        >
          <span class="nav-icon">🖼️</span>
          Hình ảnh
        </router-link> 

        <router-link
          to="/about"
          @click="closeMenu"
        >
          <span class="nav-icon">📜</span>
          Giới thiệu
        </router-link>

      </nav>

    </div>


    <!-- ===================================== -->
    <!-- MOBILE OVERLAY -->
    <!-- ===================================== -->

    <div
      v-if="menuOpen"
      class="menu-overlay"
      @click="closeMenu"
    ></div>

  </header>
</template>


<script setup>

import {
  ref,
  watch,
  onMounted,
  onUnmounted
} from 'vue';

import {
  useRoute
} from 'vue-router';


const route =
  useRoute();


const menuOpen =
  ref(false);


// ======================================
// MENU
// ======================================

function toggleMenu() {

  menuOpen.value =
    !menuOpen.value;

}


function closeMenu() {

  menuOpen.value =
    false;

}


// ======================================
// ĐÓNG MENU KHI CHUYỂN ROUTE
// ======================================

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  }
);


// ======================================
// ESC
// ======================================

function handleEscape(event) {

  if (
    event.key === 'Escape'
  ) {

    closeMenu();

  }

}


// ======================================
// RESIZE
// ======================================

function handleResize() {

  if (
    window.innerWidth > 768
  ) {

    closeMenu();

  }

}


onMounted(() => {

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
/* HEADER */
/* ===================================== */

.site-header {
  position: relative;
  z-index: 1000;

  width: 100%;

  background:
    linear-gradient(
      135deg,
      #761c1c,
      #922525
    );

  color: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(0, 0, 0, 0.15);
}


/* ===================================== */
/* INNER */
/* ===================================== */

.header-inner {

  max-width: 1200px;

  min-height: 74px;

  margin: 0 auto;

  padding:
    0 18px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 25px;

}


/* ===================================== */
/* BRAND */
/* ===================================== */

.brand {

  display: flex;

  align-items: center;

  gap: 10px;

  min-width: 0;

  color: #ffffff;

  text-decoration: none;

}


.brand-icon {

  width: 43px;

  height: 43px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  font-size: 25px;

  background:
    rgba(
      255,
      255,
      255,
      0.13
    );

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.25
    );

}


.brand-text {

  min-width: 0;

}


.brand-title {

  font-size: 1.22rem;

  font-weight: 700;

  line-height: 1.2;

  white-space: nowrap;

}


.brand-subtitle {

  margin-top: 2px;

  font-size: 0.76rem;

  opacity: 0.82;

  letter-spacing: 0.04em;

  text-transform: uppercase;

}


/* ===================================== */
/* NAV DESKTOP */
/* ===================================== */

.main-nav {

  display: flex;

  align-items: center;

  gap: 4px;

}


.main-nav a {

  position: relative;

  display: flex;

  align-items: center;

  gap: 5px;

  padding:
    10px 11px;

  border-radius: 8px;

  color: #ffffff;

  text-decoration: none;

  white-space: nowrap;

  font-size: 0.92rem;

  transition:
    background 0.15s ease;

}


.main-nav a:hover {

  background:
    rgba(
      255,
      255,
      255,
      0.12
    );

}


.main-nav a.router-link-exact-active {

  background:
    rgba(
      255,
      255,
      255,
      0.17
    );

  font-weight: 700;

}


.main-nav a.router-link-exact-active::after {

  content: "";

  position: absolute;

  left: 12px;

  right: 12px;

  bottom: 5px;

  height: 2px;

  border-radius: 10px;

  background: #ffffff;

}


.nav-icon {

  display: none;

}


/* ===================================== */
/* HAMBURGER */
/* ===================================== */

.menu-button {

  display: none;

  width: 44px;

  height: 44px;

  flex-shrink: 0;

  border: 0;

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.12
    );

  cursor: pointer;

  align-items: center;

  justify-content: center;

  flex-direction: column;

  gap: 5px;

}


.menu-button span {

  width: 22px;

  height: 2px;

  border-radius: 10px;

  background: #ffffff;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

}


/* ===================================== */
/* HAMBURGER → X */
/* ===================================== */

.menu-button.active span:nth-child(1) {

  transform:
    translateY(7px)
    rotate(45deg);

}


.menu-button.active span:nth-child(2) {

  opacity: 0;

}


.menu-button.active span:nth-child(3) {

  transform:
    translateY(-7px)
    rotate(-45deg);

}


/* ===================================== */
/* OVERLAY */
/* ===================================== */

.menu-overlay {

  display: none;

}


/* ===================================== */
/* MOBILE */
/* ===================================== */

@media (max-width: 768px) {

  .site-header {

    position: sticky;

    top: 0;

  }


  .header-inner {

    min-height: 62px;

    padding:
      0 12px;

  }


  /* ------------------------------ */
  /* BRAND */
  /* ------------------------------ */

  .brand {

    gap: 8px;

  }


  .brand-icon {

    width: 38px;

    height: 38px;

    font-size: 22px;

  }


  .brand-title {

    font-size: 1rem;

  }


  .brand-subtitle {

    font-size: 0.66rem;

  }


  /* ------------------------------ */
  /* HAMBURGER */
  /* ------------------------------ */

  .menu-button {

    display: flex;

    position: relative;

    z-index: 1003;

  }


  /* ------------------------------ */
  /* MOBILE MENU */
  /* ------------------------------ */

  .main-nav {

    position: absolute;

    top: 62px;

    left: 0;

    right: 0;

    z-index: 1002;

    display: flex;

    flex-direction: column;

    align-items: stretch;

    gap: 4px;

    padding:
      8px 10px
      14px;

    background:
      linear-gradient(
        180deg,
        #852020,
        #721919
      );

    border-top:
      1px solid
      rgba(
        255,
        255,
        255,
        0.15
      );

    box-shadow:
      0 8px 18px
      rgba(
        0,
        0,
        0,
        0.22
      );

    transform:
      translateY(-15px);

    opacity: 0;

    visibility: hidden;

    pointer-events: none;

    transition:
      transform 0.2s ease,
      opacity 0.2s ease,
      visibility 0.2s ease;

  }


  .main-nav.open {

    transform:
      translateY(0);

    opacity: 1;

    visibility: visible;

    pointer-events: auto;

  }


  .main-nav a {

    min-height: 48px;

    padding:
      11px 14px;

    border-radius: 9px;

    font-size: 0.98rem;

  }


  .main-nav a.router-link-exact-active {

    background:
      rgba(
        255,
        255,
        255,
        0.15
      );

  }


  .main-nav a.router-link-exact-active::after {

    display: none;

  }


  .nav-icon {

    width: 28px;

    display: inline-flex;

    justify-content: center;

    font-size: 18px;

  }


  /* ------------------------------ */
  /* OVERLAY */
  /* ------------------------------ */

  .menu-overlay {

    display: block;

    position: fixed;

    inset: 62px 0 0 0;

    z-index: 999;

    background:
      rgba(
        0,
        0,
        0,
        0.35
      );

  }

}


/* ===================================== */
/* MOBILE RẤT NHỎ */
/* ===================================== */

@media (max-width: 360px) {

  .brand-title {

    font-size: 0.93rem;

  }

  .brand-subtitle {

    font-size: 0.61rem;

  }

}

</style>