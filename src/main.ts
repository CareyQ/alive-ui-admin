import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import { setupStore } from '@/store'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.scss'

const setupAll = async () => {
  const app = createApp(App)
  setupElementPlus(app)
  setupStore(app)
  setupRouter(app)
  await router.isReady()
  app.mount('#app')
}

setupAll()
