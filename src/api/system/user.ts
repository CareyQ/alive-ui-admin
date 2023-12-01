import request from '@/utils/axios'

export interface User {
  id?: number
  username: string
  nickname: string
  password: string
  remark?: string
  deptId?: number
  postIds?: number[]
  gender?: number
  email?: string
  mobile?: string
  status?: number
}

export interface UserPageDTO {
  username?: string
  deptId?: number
  gender?: number
  mobile?: string
  status?: number
  createStartDate?: string
  createEndDate?: string
  current: number
  size: number
}

export const getPage = (data: UserPageDTO) => {
  return request.post({ url: '/system/user/page', data })
}

export const save = (data: User) => {
  return request.post({ url: '/system/user/save', data })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/user/detail?id=' + id })
}

export const updateStatus = (id: number, status: number) => {
  return request.put({ url: `/system/user/status?id=${id}&status=${status}` })
}

export const updatePassword = (id: number, password: string) => {
  return request.put({ url: `/system/user/password?id=${id}&password=${password}` })
}
