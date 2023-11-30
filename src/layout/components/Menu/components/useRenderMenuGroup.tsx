import type { RouteMeta } from 'vue-router'
import { filterChild } from '../helper'
import { isUrl } from '@/utils/utils'
import { pathResolve } from '@/utils/routerHelper'
import { useAppStore } from '@/store/modules/app'

export const useRenderMenuGroup = () => {
  const router = useRouter()
  const appStore = useAppStore()

  const pushRouter = (event: MouseEvent, path: string) => {
    // 阻止事件冒泡
    event.stopPropagation()
    router.push({ path })
    appStore.setCollapse(true)
  }

  const renderMenuGroupChild = (routers: AppRouteRecordRaw[], parentPath = '/') => {
    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)
      return (
        <li class="menu-group-link">
          <span class="pointer" onClick={(event) => pushRouter(event, fullPath)}>
            {meta.title}
          </span>
        </li>
      )
    })
  }

  const renderMenuGroup = (routers: AppRouteRecordRaw[] = [], parentPath = '/') => {
    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      const children = filterChild(v.children ?? ([] as AppRouteRecordRaw[]))
      if (meta.hidden || children.length <= 0) {
        return
      }

      const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)

      const hasChild = children && children.length > 0
      return (
        <ul class="menu-group">
          <li class="menu-item-group">
            <div class="menu-item-group__title">
              <span>{meta.title as string}</span>
            </div>
            <div class="menu-item-group__links">{hasChild ? renderMenuGroupChild(children, fullPath) : null}</div>
          </li>
        </ul>
      )
    })
  }

  return {
    renderMenuGroup
  }
}
