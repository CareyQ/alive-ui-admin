import request from '@/utils/axios'

export interface Dept {
  id?: number | string
  name: string
  parentId: number | string
  sort: number
  managerId?: number
  mobile?: string
  remark?: string
  status: number
}

export interface DeptListDTO {
  name: string
  status: number | undefined
}

export const getList = (data: DeptListDTO) => {
  return request.post({ url: '/system/dept/list', data })
}

export const save = (data: Dept) => {
  return request.post({ url: '/system/dept/save', data })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/dept/detail?id=' + id })
}

export const del = (id: number) => {
  return request.delete({ url: '/system/dept/del?id=' + id })
}

export const getSimpleList = () => {
  return request.get({ url: '/system/dept/simple-list' })
}
