import request from '@/utils/axios'

export interface LoginLogPageDTO {
  nickname?: string
  ip?: string
  startDate?: string
  endDate?: string
  current: number
  size: number
}

export interface OperateLogPageDTO {
  nickname?: string
  module?: string
  type?: number
  success?: boolean
  startDate?: string
  endDate?: string
  current: number
  size: number
}

export interface ErrorLogPageDTO {
  username?: string
  userType?: number
  requestUrl?: string
  processStatus?: number
  startDate?: string
  endDate?: string
  current: number
  size: number
}

export const getLoginLog = (data: LoginLogPageDTO) => {
  return request.post({ url: '/infra/log/login-log', data })
}

export const getOperateLog = (data: OperateLogPageDTO) => {
  return request.post({ url: '/infra/log/operate-log', data })
}

export const getOperateLogDtail = (id: number) => {
  return request.get({ url: '/infra/log/operate-log/detail?id=' + id })
}

export const getErrorLog = (data: ErrorLogPageDTO) => {
  return request.post({ url: '/infra/log/error-log', data })
}

export const getErrorLogDtail = (id: number) => {
  return request.get({ url: '/infra/log/error-log/detail?id=' + id })
}

export const updateErrorProcessStatus = (id: number, processStatus: number) => {
  return request.put({ url: '/infra/log/error-log/process-status?id=' + id + '&processStatus=' + processStatus })
}
