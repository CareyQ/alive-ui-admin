import request from '@/utils/axios'
import type { LoginDTO } from './types'

export const login = (data: LoginDTO) => {
  return request.post({ url: '/system/auth/login', data })
}

export const logout = () => {
  return request.post({ url: '/system/auth/logout' })
}

export const getMenuTree = () => {
  return request.get({ url: '/system/auth/router' })
}
