import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { getAccessToken } from '@/utils/auth'

// 路由不重定向白名单
const whiteList = ['/login', '/social-login', '/auth-redirect', '/bind', '/register', '/oauthLogin/gitee']

router.beforeEach(async (to, from, next) => {
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取数据字典
      const dictStore = useDictStoreWithOut()
      if (!dictStore.getIsSetDict) {
        await dictStore.setDictMap()
      }

      const userStore = useUserStoreWithOut()
      if (!userStore.getIsSetUser) {
        await userStore.fetchMenus()
        // 后端过滤菜单
        const permissionStore = usePermissionStoreWithOut()
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw)
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        next(nextData)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})
