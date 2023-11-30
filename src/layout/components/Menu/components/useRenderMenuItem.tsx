import type { RouteMeta } from 'vue-router'
import { hasOneShowingChild } from '../helper'
import { isUrl } from '@/utils/utils'
import MenuTitle from './useRenderMenuTitle'
import { useRenderMenuGroup } from './useRenderMenuGroup'
import { pathResolve } from '@/utils/routerHelper'

export const useRenderMenuItem = () => {
  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/') => {
    const handleClick = (elementRef: Ref<HTMLElement | null>) => {
      if (elementRef.value) {
        const parentElement = elementRef.value.parentElement
        if (parentElement) {
          const siblings = Array.from(parentElement.children) as HTMLElement[]
          siblings.forEach((sibling) => {
            if (sibling !== elementRef.value) {
              sibling.classList.remove('clicked')
            }
          })
          elementRef.value.classList.toggle('clicked')
        }
      }
    }

    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      if (meta.hidden) {
        return
      }

      const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)

      const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)

      const one = oneShowingChild && (!onlyOneChild?.children || onlyOneChild?.noShowingChildren)

      const { renderMenuGroup } = useRenderMenuGroup()
      const elementRef = ref<HTMLElement | null>(null)

      return (
        <li
          ref={elementRef}
          class={['no-wrap', one ? 'menu-item' : 'sub-menu']}
          onClick={() => handleClick(elementRef)}
        >
          <MenuTitle meta={onlyOneChild ? onlyOneChild?.meta : meta} once={one} />
          {one ? null : (
            <div class="menu-group-warpper" onClick={(event) => event.stopPropagation()}>
              {renderMenuGroup(v.children, fullPath)}
            </div>
          )}
        </li>
      )
    })
  }

  return {
    renderMenuItem
  }
}
