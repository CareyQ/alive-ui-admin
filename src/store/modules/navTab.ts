import router from '@/router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { defineStore } from 'pinia'
import { store } from '../index'
import { getRawRoute } from '@/utils/routerHelper'
import { findIndex } from '@/utils/utils'

export interface NavTabState {
  // 激活tab的index
  activeIndex: number
  // tab列表
  tabsView: RouteLocationNormalizedLoaded[]
  cachedViews: Set<string>
}

export const useNavTabStore = defineStore('navTab', {
  state: (): NavTabState => ({
    // 激活tab的index
    activeIndex: 0,
    // tab列表
    tabsView: [],
    cachedViews: new Set()
  }),
  getters: {
    getActiveIndex(): number {
      return this.activeIndex
    },
    getTabsView(): RouteLocationNormalizedLoaded[] {
      return this.tabsView
    },
    getCachedViews(): string[] {
      return Array.from(this.cachedViews)
    }
  },
  actions: {
    addTab(route: RouteLocationNormalizedLoaded): void {
      if (this.tabsView.some((v) => v.path === route.path)) return
      if (route.meta?.noTagsView) return

      this.tabsView.push(
        Object.assign({}, route, {
          title: route.meta?.title || 'no-name'
        })
      )
      this.addCachedView()
    },
    addCachedView() {
      const cacheMap: Set<string> = new Set()
      for (const v of this.tabsView) {
        const item = getRawRoute(v)
        if (!item.meta?.keepAlive) {
          continue
        }
        const name = item.name as string
        cacheMap.add(name)
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString()) return
      this.cachedViews = cacheMap
    },
    closeTab(route: RouteLocationNormalizedLoaded) {
      this.tabsView.map((v, k) => {
        if (v.path == route.path) {
          this.tabsView.splice(k, 1)
          return
        }
      })
    },
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex<string>(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },
    closeTabs(retainMenu: RouteLocationNormalizedLoaded | false = false) {
      const filterTabs = this.tabsView.filter((tab) => {
        if (tab.meta.affix) {
          return true
        }
      })

      if (retainMenu) {
        const isRetainMenuInTabs = filterTabs.some((e) => e.path === retainMenu.path)

        if (!isRetainMenuInTabs) {
          filterTabs.push(retainMenu)
          this.tabsView = filterTabs
        } else {
          this.tabsView = [retainMenu]
        }
        this.addCachedView()
      } else {
        this.tabsView = filterTabs
        this.setActiveRoute(this.tabsView[0])
        this.delCachedView()
      }
    },
    setActiveRoute(route: RouteLocationNormalizedLoaded) {
      const currentRouteIndex: number = this.tabsView.findIndex((item: RouteLocationNormalizedLoaded) => {
        return item.path === route.path
      })
      if (currentRouteIndex === -1) return
      this.activeIndex = currentRouteIndex
    }
  }
})

export const useNavTabStoreWithOut = () => {
  return useNavTabStore(store)
}
