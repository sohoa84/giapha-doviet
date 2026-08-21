import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { applyFamilyTheme } from './config/applyTheme'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

applyFamilyTheme()

createApp(App)
  .use(router)
  .mount('#app')