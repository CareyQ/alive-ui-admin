import { store } from '../index'
import { defineStore } from 'pinia'
import { CACHE_KEY, useCache } from '@/hooks/useCache'
import { getMenuTree } from '@/api/login'

interface UserInfo {
  menus: AppCustomRouteRecordRaw[]
  isSetUser: boolean
}

const { wsCache } = useCache()

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfo => ({
    menus: [],
    isSetUser: false
  }),
  getters: {
    getMenus(): AppCustomRouteRecordRaw[] {
      return this.menus
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    }
  },
  actions: {
    async fetchMenus() {
      let routers = wsCache.get(CACHE_KEY.ROUTERS)
      if (!routers) {
        routers = await getMenuTree()
      }

      this.menus = routers
      this.isSetUser = true
      wsCache.set(CACHE_KEY.ROUTERS, routers)
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
