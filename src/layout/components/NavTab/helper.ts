import type { RouteMeta, RouteLocationNormalizedLoaded } from 'vue-router'
import { pathResolve } from '@/utils/routerHelper'

export const filterAffixTabs = (routes: AppRouteRecordRaw[], parentPath = '') => {
  let tabs: RouteLocationNormalizedLoaded[] = []
  routes.forEach((route) => {
    const meta = route.meta as RouteMeta
    const tabPath = pathResolve(parentPath, route.path)
    if (meta?.affix) {
      tabs.push({ ...route, path: tabPath, fullPath: tabPath } as RouteLocationNormalizedLoaded)
    }
    if (route.children) {
      const tempTabs: RouteLocationNormalizedLoaded[] = filterAffixTabs(route.children, tabPath)
      if (tempTabs.length >= 1) {
        tabs = [...tabs, ...tempTabs]
      }
    }
  })

  return tabs
}

export const filterNotAffixTabView = (tabs: RouteLocationNormalizedLoaded[], self: RouteLocationNormalizedLoaded) => {
  const res: RouteLocationNormalizedLoaded[] = []
  tabs.forEach((tab) => {
    if (tab.fullPath === self.fullPath) {
      return
    }
    const meta = tab.meta as RouteMeta
    if (!meta?.affix) {
      res.push(tab)
    }
  })
  return res
}
