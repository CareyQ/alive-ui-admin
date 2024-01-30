import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import { setupStore } from '@/store'

import 'element-plus/es/hooks/use-locale/index'

import './permission'

// 导入全局的svg图标
import '@/plugins/svgIcon'
// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.scss'

// 解决v-html 的安全隐患
import VueDOMPurifyHTML from 'vue-dompurify-html'

const setupAll = async () => {
  const app = createApp(App)
  setupElementPlus(app)
  setupStore(app)
  setupRouter(app)
  await router.isReady()

  app.use(VueDOMPurifyHTML)
  app.mount('#app')
}

setupAll()
