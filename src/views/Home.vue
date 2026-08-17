<template>
  <main class="home-page">
    <!-- ============================== -->
    <!-- HERO / BANNER -->
    <!-- ============================== -->
    <section class="hero-section">
      <img
        :src="heroImage"
        alt="Đại gia đình Nguyễn Xuân - Chi Vĩnh An"
        class="hero-image"
      >

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <span class="hero-kicker">GIA PHẢ DÒNG HỌ</span>

        <h1>
          NGUYỄN XUÂN
          <span>CHI VĨNH AN</span>
        </h1>

        <p>
          Lưu giữ nguồn cội · Kết nối các thế hệ
        </p>
      </div>
    </section>

    <div class="home-shell">
      <!-- ============================== -->
      <!-- SEARCH -->
      <!-- ============================== -->
      <section class="search-section section-card">
        <div class="section-heading compact">
          <div>
            <span class="eyebrow">TRA CỨU NHANH</span>
            <h2>Tìm thành viên</h2>
          </div>
        </div>

        <div class="search-box">
          <span class="search-icon">⌕</span>

          <input
            v-model="searchKeyword"
            type="search"
            placeholder="Nhập họ tên, tên tự hoặc mã VA..."
            autocomplete="off"
            @keyup.enter="openFirstSearchResult"
          >

          <button
            v-if="searchKeyword"
            class="clear-search"
            type="button"
            aria-label="Xóa từ khóa"
            @click="searchKeyword = ''"
          >
            ×
          </button>
        </div>

        <div
          v-if="searchKeyword.trim()"
          class="search-results"
        >
          <button
            v-for="person in searchResults"
            :key="person.ID"
            type="button"
            class="search-result-item"
            @click="goToPerson(person.ID)"
          >
            <div class="result-avatar">
              {{ getInitial(person) }}
            </div>

            <div class="result-info">
              <strong>{{ fullName(person) }}</strong>
              <span>
                {{ person.ID }}
                <template v-if="getGeneration(person)">
                  · Đời {{ getGeneration(person) }}
                </template>
              </span>
            </div>

            <span class="result-arrow">›</span>
          </button>

          <div
            v-if="searchResults.length === 0"
            class="empty-search"
          >
            Không tìm thấy thành viên phù hợp.
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- QUICK ACTIONS -->
      <!-- ============================== -->
      <section class="quick-actions">
        <router-link to="/tree" class="quick-card quick-card-primary">
          <span class="quick-icon">🌳</span>
          <strong>Cây gia phả</strong>
          <small>Xem quan hệ các thế hệ</small>
        </router-link>

        <router-link to="/generation-tree" class="quick-card">
          <span class="quick-icon">📜</span>
          <strong>Theo thế hệ</strong>
          <small>Xem thành viên theo từng đời</small>
        </router-link>

        <router-link to="/members" class="quick-card">
          <span class="quick-icon">👥</span>
          <strong>Thành viên</strong>
          <small>Tra cứu toàn bộ gia phả</small>
        </router-link>

        <router-link to="/about" class="quick-card">
          <span class="quick-icon">🏮</span>
          <strong>Về Vĩnh An</strong>
          <small>Câu chuyện và nguồn cội</small>
        </router-link>
      </section>

      <!-- ============================== -->
      <!-- DASHBOARD -->
      <!-- ============================== -->
      <section class="section-card stats-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">TỔNG QUAN</span>
            <h2>Gia phả Vĩnh An</h2>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <strong>{{ stats.persons || persons.length }}</strong>
            <span>Thành viên</span>
          </div>

          <div class="stat-item">
            <strong>{{ stats.generations || generationList.length }}</strong>
            <span>Thế hệ</span>
          </div>

          <div class="stat-item">
            <strong>{{ stats.events || totalEvents }}</strong>
            <span>Sự kiện</span>
          </div>

          <div class="stat-item">
            <strong>{{ publicMediaCount }}</strong>
            <span>Ảnh công khai</span>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- GENERATIONS -->
      <!-- ============================== -->
      <section class="section-card generations-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">DÒNG THỜI GIAN</span>
            <h2>Các thế hệ</h2>
          </div>

          <router-link to="/generation-tree" class="text-link">
            Xem tất cả
          </router-link>
        </div>

        <div class="generation-grid">
          <router-link
            v-for="generation in generationList"
            :key="generation"
            to="/generation-tree"
            class="generation-chip"
          >
            <span>Đời</span>
            <strong>{{ generation }}</strong>
          </router-link>
        </div>
      </section>

      <!-- ============================== -->
      <!-- EVENTS / NGÀY GIỖ -->
      <!-- ============================== -->
      <section
        v-if="homeEvents.length"
        class="section-card events-section"
      >
        <div class="section-heading">
          <div>
            <span class="eyebrow">GHI NHỚ NGUỒN CỘI</span>
            <h2>Ngày giỗ & Sự kiện</h2>
          </div>

          <router-link
            to="/events"
            class="text-link"
          >
            Xem tất cả
          </router-link>
        </div>

        <div class="event-list">
          <article
            v-for="event in homeEvents"
            :key="event.key"
            class="event-item"
          >
            <div class="event-date">
              <strong>{{ event.day }}</strong>
              <span>THÁNG {{ event.month }}</span>
              <small>ÂM LỊCH</small>
            </div>

            <div class="event-content">
              <span
                class="event-type"
                :class="{ death: event.isDeath }"
              >
                {{ event.isDeath ? '🕯️ Ngày giỗ' : '📅 ' + (event.type || 'Sự kiện') }}
              </span>

              <h3>
                {{ event.content || event.type || 'Sự kiện gia tộc' }}
              </h3>

              <router-link
                v-if="event.personId"
                :to="{
                  name: 'person-detail',
                  params: { id: event.personId }
                }"
                class="event-person"
              >
                {{ event.personName }}
                <span>›</span>
              </router-link>

              <p
                v-if="event.place"
                class="event-place"
              >
                📍 {{ event.place }}
              </p>
            </div>
          </article>
        </div>

        <router-link
          to="/events"
          class="events-more"
        >
          Xem toàn bộ ngày giỗ & sự kiện
          <span>→</span>
        </router-link>
      </section>

      <!-- ============================== -->
      <!-- FAMILY MESSAGE -->
      <!-- ============================== -->
      <section class="heritage-section">
        <div class="heritage-mark">❦</div>
        <p class="heritage-label">NGUYỄN XUÂN · CHI VĨNH AN</p>
        <blockquote>
          “Uống nước nhớ nguồn · Ăn quả nhớ người trồng cây”
        </blockquote>
        <p class="heritage-text">
          Nơi lưu giữ thông tin, hình ảnh và ký ức của các thế hệ,
          để con cháu hôm nay và mai sau luôn nhớ về cội nguồn.
        </p>
      </section>
    </div>
  </main>
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
  getPersons,
  getStats
} from '../services/dataService';

const router = useRouter();

const heroImage =
  `${import.meta.env.BASE_URL}images/ChiVinhAn.jpg`;

const persons = ref([]);
const stats = ref({});
const searchKeyword = ref('');

onMounted(async () => {
  try {
    const [personData, statsData] =
      await Promise.all([
        getPersons(),
        getStats()
      ]);

    persons.value = personData || [];
    stats.value = statsData || {};
  }
  catch (error) {
    console.error(
      'Không thể tải dữ liệu trang chủ:',
      error
    );
  }
});

function isSpouse(person) {
  if (!person?.ID) {
    return false;
  }

  const hasSpouseSuffix =
    /S\d+$/.test(String(person.ID));

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

function fullName(person) {
  return [
    person?.['Họ'],
    person?.['Tên']
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function getInitial(person) {
  const name =
    String(person?.['Tên'] || '').trim();

  return name
    ? name.charAt(0).toUpperCase()
    : 'N';
}

function getGeneration(person) {
  const value =
    person?.generation ??
    person?.['Đời'];

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

const searchResults = computed(() => {
  const keyword =
    searchKeyword.value
      .trim()
      .toLowerCase();

  if (!keyword) {
    return [];
  }

  return persons.value
    .filter(person => {
      const text = [
        person.ID,
        person['Họ'],
        person['Tên'],
        person['Tên Tự']
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(keyword);
    })
    .slice(0, 6);
});

const generationList = computed(() => {
  const fromStats =
    stats.value?.generationList;

  if (
    Array.isArray(fromStats) &&
    fromStats.length
  ) {
    return fromStats;
  }

  return [
    ...new Set(
      persons.value
        .filter(person => !isSpouse(person))
        .map(getGeneration)
        .filter(Boolean)
    )
  ].sort((a, b) => a - b);
});

const totalEvents = computed(() => {
  return persons.value.reduce(
    (total, person) =>
      total +
      (Array.isArray(person.events)
        ? person.events.length
        : 0),
    0
  );
});

const publicMediaCount = computed(() => {
  return persons.value.reduce(
    (total, person) => {
      const media =
        Array.isArray(person.media)
          ? person.media
          : [];

      return total +
        media.filter(item =>
          String(item?.VISIBILITY || '')
            .trim()
            .toLowerCase() === 'public'
        ).length;
    },
    0
  );
});

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

function parseLunarDate(value) {
  const text =
    String(value || '').trim();

  const match =
    text.match(
      /(\d{1,2})\s*[\/\-]\s*(\d{1,2})/
    );

  if (!match) {
    return {
      day: 0,
      month: 0
    };
  }

  return {
    day: Number(match[1]),
    month: Number(match[2])
  };
}

function isDeathEvent(event) {
  const text =
    normalizeText(
      [
        event?.['LOAI'],
        event?.['Loại'],
        event?.['NOI DUNG'],
        event?.['NỘI DUNG'],
        event?.['Nội dung']
      ]
        .filter(Boolean)
        .join(' ')
    );

  return (
    text.includes('gio') ||
    text.includes('ngay mat') ||
    text.includes('ngay ky')
  );
}

const homeEvents = computed(() => {

  const result = [];


  persons.value.forEach(person => {

    const personEvents =
      Array.isArray(person.events)
        ? person.events
        : [];


    personEvents.forEach((event, index) => {

      const lunarDate =
        event['NGÀY ÂM LỊCH'] ||
        event['Ngày âm lịch'] ||
        '';


      const parsed =
        parseLunarDate(lunarDate);


      // ==================================
      // THỨ TỰ HIỂN THỊ TRANG HOME
      //
      // Excel EVENTS:
      // ThuTuHienThi = 1, 2, 3, 4...
      //
      // Nếu để trống:
      // → không ưu tiên
      // → xếp sau các event có số
      // ==================================

      const displayOrderRaw =
        event.ThuTuHienThi ??
        event['ThuTuHienThi'] ??
        '';


      const displayOrder =
        displayOrderRaw !== ''
          ? Number(displayOrderRaw)
          : null;


      result.push({

        key:
          `${person.ID}-${index}-${event['LOAI'] || ''}`,


        personId:
          person.ID,


        personName:
          fullName(person),


        type:
          event['LOAI'] ||
          event['Loại'] ||
          '',


        date:
          lunarDate,


        day:
          parsed.day
            ? String(parsed.day)
                .padStart(2, '0')
            : '--',


        month:
          parsed.month
            ? String(parsed.month)
                .padStart(2, '0')
            : '--',


        monthNumber:
          parsed.month,


        dayNumber:
          parsed.day,


        content:
          event['NOI DUNG'] ||
          event['NỘI DUNG'] ||
          event['Nội dung'] ||
          '',


        place:
          event['MỘ PHẦN'] ||
          event['Mộ phần'] ||
          '',


        isDeath:
          isDeathEvent(event),


        // Quan trọng
        displayOrder:
          Number.isFinite(displayOrder)
            ? displayOrder
            : null

      });

    });

  });


  return result

    // ==================================
    // SẮP XẾP ƯU TIÊN
    // ==================================

    .sort((a, b) => {

      const aHasOrder =
        a.displayOrder !== null;

      const bHasOrder =
        b.displayOrder !== null;


      // Event có ThuTuHienThi
      // đứng trước event không có
      if (
        aHasOrder &&
        !bHasOrder
      ) {
        return -1;
      }


      if (
        !aHasOrder &&
        bHasOrder
      ) {
        return 1;
      }


      // Cả hai đều có ThuTuHienThi
      // → sort 1, 2, 3, 4...
      if (
        aHasOrder &&
        bHasOrder
      ) {

        if (
          a.displayOrder !==
          b.displayOrder
        ) {

          return (
            a.displayOrder -
            b.displayOrder
          );

        }

      }


      // Nếu không có thứ tự,
      // hoặc trùng thứ tự,
      // thì sort tiếp theo ngày âm
      if (
        a.monthNumber !==
        b.monthNumber
      ) {

        return (
          a.monthNumber -
          b.monthNumber
        );

      }


      return (
        a.dayNumber -
        b.dayNumber
      );

    })


    // ==================================
    // HOME CHỈ LẤY 4 EVENT
    // ==================================

    .slice(0, 6);

});

function goToPerson(id) {
  if (!id) {
    return;
  }

  router.push({
    name: 'person-detail',
    params: { id }
  });
}

function openFirstSearchResult() {
  if (searchResults.value.length) {
    goToPerson(searchResults.value[0].ID);
  }
}
</script>

<style scoped>
.home-page {
  --heritage-red: #7a1f1f;
  --heritage-red-dark: #521313;
  --heritage-gold: #c9a35d;
  --heritage-gold-soft: #f3e8cc;
  --heritage-cream: #f8f5ee;
  --heritage-ink: #2e2924;
  --heritage-muted: #746d65;
  --heritage-line: #e8dfd2;

  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #f4efe5 0,
      #fbfaf7 420px,
      #f7f4ee 100%
    );
  color: var(--heritage-ink);
}

/* ============================== */
/* HERO */
/* ============================== */

.hero-section {
  position: relative;
  min-height: 58vh;
  max-height: 700px;
  overflow: hidden;
  background: #201818;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.02) 18%,
      rgba(30, 10, 10, 0.08) 45%,
      rgba(30, 8, 8, 0.78) 100%
    );
}

.hero-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding:
    44px
    max(20px, env(safe-area-inset-right))
    28px
    max(20px, env(safe-area-inset-left));
  color: #fff;
  text-align: center;
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 8px;
  padding: 5px 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  background: rgba(70, 15, 15, 0.32);
  backdrop-filter: blur(5px);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2rem, 8vw, 3.8rem);
  line-height: 0.98;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-weight: 800;
  letter-spacing: 0.015em;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.45);
}

.hero-content h1 span {
  display: block;
  margin-top: 8px;
  color: #f5d995;
  font-size: 0.72em;
}

.hero-content p {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.96rem;
}

/* ============================== */
/* LAYOUT */
/* ============================== */

.home-shell {
  width: min(100% - 28px, 1120px);
  margin: -18px auto 0;
  padding-bottom: 44px;
  position: relative;
  z-index: 3;
}

.section-card {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid rgba(126, 96, 55, 0.10);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 28px rgba(75, 48, 25, 0.07);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-heading.compact {
  margin-bottom: 12px;
}

.section-heading h2 {
  margin: 2px 0 0;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size: 1.34rem;
  font-weight: 700;
  color: var(--heritage-red-dark);
}

.eyebrow {
  color: #9b7946;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.text-link {
  flex-shrink: 0;
  color: var(--heritage-red);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
}

/* ============================== */
/* SEARCH */
/* ============================== */

.search-section {
  box-shadow: 0 12px 34px rgba(84, 40, 27, 0.12);
}

.search-box {
  display: flex;
  align-items: center;
  min-height: 52px;
  border: 1px solid var(--heritage-line);
  border-radius: 14px;
  background: var(--heritage-cream);
  overflow: hidden;
  transition: 0.2s ease;
}

.search-box:focus-within {
  border-color: #b68c53;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(182, 140, 83, 0.12);
}

.search-icon {
  padding-left: 16px;
  color: #957548;
  font-size: 1.55rem;
  line-height: 1;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 14px 10px;
  color: var(--heritage-ink);
  font-size: 0.98rem;
}

.search-box input::placeholder {
  color: #9b958d;
}

.clear-search {
  width: 42px;
  height: 42px;
  margin-right: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #8d8378;
  font-size: 1.5rem;
}

.search-results {
  margin-top: 10px;
  overflow: hidden;
  border: 1px solid var(--heritage-line);
  border-radius: 14px;
  background: #fff;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-bottom: 1px solid #f0ebe3;
  background: #fff;
  text-align: left;
}

.search-result-item:last-child {
  border-bottom: 0;
}

.search-result-item:active {
  background: #faf5ec;
}

.result-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f4e8d4;
  color: var(--heritage-red);
  font-family: Georgia, serif;
  font-weight: 800;
}

.result-info {
  min-width: 0;
  flex: 1;
}

.result-info strong,
.result-info span {
  display: block;
}

.result-info strong {
  overflow: hidden;
  color: #342b26;
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-info span {
  margin-top: 2px;
  color: #8c8279;
  font-size: 0.76rem;
}

.result-arrow {
  color: #9a7a4e;
  font-size: 1.6rem;
  line-height: 1;
}

.empty-search {
  padding: 16px;
  color: #81786f;
  font-size: 0.88rem;
  text-align: center;
}

/* ============================== */
/* QUICK ACTIONS */
/* ============================== */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  min-height: 130px;
  padding: 16px;
  border: 1px solid rgba(126, 96, 55, 0.11);
  border-radius: 18px;
  background: #fff;
  color: var(--heritage-ink);
  text-decoration: none;
  box-shadow: 0 6px 18px rgba(75, 48, 25, 0.05);
}

.quick-card-primary {
  background:
    linear-gradient(145deg, #7b1e1e, #541515);
  color: #fff;
}

.quick-icon {
  margin-bottom: auto;
  font-size: 1.65rem;
}

.quick-card strong {
  margin-top: 12px;
  font-family: Georgia, serif;
  font-size: 1rem;
}

.quick-card small {
  margin-top: 4px;
  color: #81786f;
  font-size: 0.73rem;
  line-height: 1.35;
}

.quick-card-primary small {
  color: rgba(255, 255, 255, 0.74);
}

/* ============================== */
/* STATS */
/* ============================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-item {
  padding: 16px 10px;
  border-radius: 16px;
  background: var(--heritage-cream);
  text-align: center;
}

.stat-item strong,
.stat-item span {
  display: block;
}

.stat-item strong {
  color: var(--heritage-red);
  font-family: Georgia, serif;
  font-size: 1.8rem;
  line-height: 1;
}

.stat-item span {
  margin-top: 6px;
  color: #81786f;
  font-size: 0.74rem;
}

/* ============================== */
/* GENERATIONS */
/* ============================== */

.generation-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.generation-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 68px;
  border: 1px solid #eadfcd;
  border-radius: 14px;
  background:
    linear-gradient(180deg, #fffdf9, #f6efe4);
  color: var(--heritage-red-dark);
  text-decoration: none;
}

.generation-chip span {
  color: #9b8975;
  font-size: 0.66rem;
}

.generation-chip strong {
  margin-top: 1px;
  font-family: Georgia, serif;
  font-size: 1.18rem;
}

/* ============================== */
/* EVENTS */
/* ============================== */

.event-list {
  display: grid;
  gap: 10px;
}

.event-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee5d9;
  border-radius: 16px;
  background: var(--heritage-cream);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 0 72px;
  min-height: 78px;
  border-radius: 13px;
  background: var(--heritage-red);
  color: #fff;
  text-align: center;
}

.event-date strong {
  font-family: Georgia, serif;
  font-size: 1.4rem;
  line-height: 1;
}

.event-date span {
  margin-top: 5px;
  font-size: 0.62rem;
  font-weight: 800;
}

.event-date small {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.55rem;
}

.event-content {
  min-width: 0;
  flex: 1;
  padding-top: 2px;
}

.event-type {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3eadb;
  color: #9a713e;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.event-type.death {
  background: #f9e5e5;
  color: var(--heritage-red);
}

.event-content h3 {
  margin: 6px 0;
  color: #42362e;
  font-size: 0.95rem;
  line-height: 1.35;
}

.event-person {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--heritage-red);
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
}

.event-person span {
  font-size: 1.1rem;
  line-height: 1;
}

.event-place {
  margin: 5px 0 0;
  color: #857b71;
  font-size: 0.73rem;
  line-height: 1.4;
}

.events-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 43px;
  margin-top: 12px;
  border: 1px solid #eadbc5;
  border-radius: 12px;
  background: #fffaf2;
  color: var(--heritage-red);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.events-more span {
  font-size: 1rem;
}

/* ============================== */
/* HERITAGE */
/* ============================== */

.heritage-section {
  margin-top: 20px;
  padding: 28px 20px;
  border-radius: 22px;
  background:
    radial-gradient(
      circle at top,
      rgba(232, 201, 132, 0.18),
      transparent 45%
    ),
    #531717;
  color: #fff;
  text-align: center;
  box-shadow: 0 12px 30px rgba(77, 23, 23, 0.14);
}

.heritage-mark {
  color: #e6c77e;
  font-size: 1.8rem;
}

.heritage-label {
  margin: 6px 0 12px;
  color: #efd79e;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.heritage-section blockquote {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 1.08rem;
  font-style: italic;
  line-height: 1.55;
}

.heritage-text {
  max-width: 620px;
  margin: 14px auto 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  line-height: 1.6;
}

/* ============================== */
/* TABLET / DESKTOP */
/* ============================== */

@media (min-width: 768px) {
  .hero-section {
    min-height: 66vh;
  }

  .hero-content {
    padding-bottom: 46px;
  }

  .home-shell {
    width: min(100% - 48px, 1120px);
    margin-top: -28px;
  }

  .quick-actions {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .quick-card {
    min-height: 150px;
  }

  .stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .generation-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .event-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .event-item {
    align-items: center;
  }
}

@media (min-width: 1100px) {
  .hero-image {
    object-position: center 47%;
  }

  .section-card {
    padding: 24px;
  }
}
</style>
