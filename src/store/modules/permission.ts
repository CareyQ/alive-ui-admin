import { store } from '../index'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { CACHE_KEY, useCache } from '@/hooks/useCache'
import { flatMultiLevelRoutes, generateRoute } from '@/utils/routerHelper'
import staticRouter from '@/router/modules/static'

const { wsCache } = useCache()

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    async generateRoutes(): Promise<unknown> {
      return new Promise<void>(async (resolve) => {
        // 获得菜单列表，它在登录的时候，setUserInfoAction 方法中已经进行获取
        let res: AppCustomRouteRecordRaw[] = []
        if (wsCache.get(CACHE_KEY.ROUTERS)) {
          res = wsCache.get(CACHE_KEY.ROUTERS) as AppCustomRouteRecordRaw[]
        }
        const routerRes: AppRouteRecordRaw[] = generateRoute(res)

        // 动态路由，404一定要放到最后面
        this.addRouters = routerRes.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])

        // 渲染菜单的所有路由
        this.routers = cloneDeep(staticRouter).concat(routerRes)
        resolve()
      })
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
