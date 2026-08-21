<template>

  <footer class="site-footer mt-5 py-4">

    <div class="container text-center">

      <p class="mb-1 footer-title">
        © {{ familyConfig.footer.copyrightYear }}
        {{ familyConfig.siteTitle }}
      </p>

      <small class="footer-description">
        {{ familyConfig.footer.description }}
      </small>

    </div>

  </footer>

</template>


<script setup>

import familyConfig
  from '../config/family.config';

</script>


<style scoped>

.site-footer {

  background:
    linear-gradient(
      135deg,
      var(--family-primary),
      var(--family-primary-dark)
    );

  color:
    var(--family-header-text);

  border-top:
    3px solid
    var(--family-accent);

}


.footer-title {

  color:
    var(--family-header-text);

  font-weight: 600;

}


.footer-description {

  color:
    var(--family-header-text);

  opacity: 0.8;

}

</style>