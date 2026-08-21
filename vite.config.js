import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import familyConfig from './src/config/family.config.js'

export default defineConfig({
  plugins: [vue()],
  base: familyConfig.deployment?.basePath || '/',
})
