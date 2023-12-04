import request from '@/utils/axios'

export interface LoginLogPageDTO {
  username?: string
  ip?: string
  startDate?: string
  endDate?: string
  current: number
  size: number
}

export const getLoginLog = (data: LoginLogPageDTO) => {
  return request.post({ url: '/system/log/login-log', data })
}
