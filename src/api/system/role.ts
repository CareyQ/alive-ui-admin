import request from '@/utils/axios'

export interface Role {
  id: number | string
  name: string
  code: string
  remark: string
}

export interface RolePageDTO {
  name: string
  current: number
  size: number
}

export const getPage = (data: RolePageDTO) => {
  return request.post({ url: '/system/role/page', data })
}

export const save = (data: Role) => {
  return request.post({ url: '/system/role/save', data })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/role/detail?id=' + id })
}

export const del = (id: number) => {
  return request.delete({ url: '/system/role/del?id=' + id })
}

export const changeDefault = (id: number, isDefault: boolean) => {
  return request.put({
    url: `/system/role/default?id=${id}&isDefault=${isDefault}`
  })
}

export const getList = () => {
  return request.get({ url: '/system/role/list' })
}
