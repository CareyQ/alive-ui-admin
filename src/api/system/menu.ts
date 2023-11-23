import request from '@/utils/axios'

export interface MenuVO {
  id: number
  parentId: number
  type: number
  name: string
  permission: string
  path: string
  component: string
  componentName: string
  icon: string
  keepAlive: boolean
  status: number
  sort: number
  createTime?: Date
}

export const getMenuTree = () => {
  return request.get({ url: '/system/menu/tree' })
}

export const getSimpleMenus = (type: number) => {
  return request.get({ url: '/system/menu/simple-list?type=' + type })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/menu/detail?id=' + id })
}

export const saveMenu = (data: MenuVO) => {
  return request.post({ url: '/system/menu/save', data })
}
