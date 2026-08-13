<template>
  <header class="header">
    <div class="container">
      <h1>Gia phả Họ Nguyễn Xuân</h1>
      <nav>
        <router-link to="/">Trang chủ</router-link>
        <router-link to="/tree">Cây gia phả</router-link>
        <router-link to="/generation-tree">Cây thế hệ</router-link>
        <router-link to="/members">Thành viên</router-link>
        <router-link to="/about">Giới thiệu</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #7b1e1e;
  color: white;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: auto;
}

h1 {
  margin: 0 0 12px;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>