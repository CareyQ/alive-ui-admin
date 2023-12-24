import request from '@/utils/axios'

export interface DataSourceConfigDTO {
  id?: number
  name?: string
  url?: string
  username?: string
  password?: string
}

export const saveConfig = (data: DataSourceConfigDTO) => {
  return request.post({ url: '/infra/data-source-config/save', data })
}

export const getConfigList = () => {
  return request.get({ url: '/infra/data-source-config/list' })
}

export const getConfigDetail = (id: number) => {
  return request.get({ url: '/infra/data-source-config/detail?id=' + id })
}

export const delConfig = (id: number) => {
  return request.delete({ url: '/infra/data-source-config/del?id=' + id })
}
