import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

declare global {
  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string
    meta: RouteMetaCustom
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  declare interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    icon: any
    name: string
    meta: RouteMeta
    component: string
    componentName?: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
    keepAlive?: boolean
    parentId?: number
  }
}
