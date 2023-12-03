import type { RouteMeta } from 'vue-router'
import { findPath } from '@/utils/tree'
import { isEmpty } from 'lodash-es'

type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean }

interface HasOneShowingChild {
  oneShowingChild?: boolean
  onlyOneChild?: OnlyOneChildType
}

export const getAllParentPath = <T = Recordable>(treeData: T[], path: string) => {
  const menuList = findPath(treeData, (n) => n.path === path) as AppRouteRecordRaw[]
  return (menuList || []).map((item) => item.path)
}

export const hasOneShowingChild = (
  children: AppRouteRecordRaw[] = [],
  parent: AppRouteRecordRaw
): HasOneShowingChild => {
  const onlyOneChild = ref<OnlyOneChildType>()

  const showingChildren = filterChild(children)

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1 && isEmpty(showingChildren[0].children)) {
    return {
      oneShowingChild: true,
      onlyOneChild: showingChildren[0]
    }
  }

  // Show parent if there are no child router to display
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return {
      oneShowingChild: true,
      onlyOneChild: unref(onlyOneChild)
    }
  }

  return {
    oneShowingChild: false,
    onlyOneChild: unref(onlyOneChild)
  }
}

export const filterChild = (children: AppRouteRecordRaw[] = []) => {
  return children.filter((v) => {
    const meta = (v.meta ?? {}) as RouteMeta
    return !meta.hidden
  })
}
