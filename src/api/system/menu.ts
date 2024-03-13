import request from '@/utils/axios'

export interface MenuVO {
  id?: number | string
  parentId: number | string
  type: number
  name: string
  permission?: string
  path?: string
  component: string
  componentName: string
  icon: string
  keepAlive: boolean
  visible: boolean
  status: number
  sort: number
  createTime?: Date
}

export const getMenuTree = () => {
  return request.get({ url: '/system/menu/tree' })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/menu/detail?id=' + id })
}

export const saveMenu = (data: MenuVO) => {
  return request.post({ url: '/system/menu/save', data })
}

export const delMenu = (id: number) => {
  return request.delete({ url: '/system/menu/del?id=' + id })
}

export const getSimpleTree = () => {
  return request.get({ url: '/system/menu/simple-tree' })
}
