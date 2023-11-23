import request from '@/utils/axios'

export const getDictType = () => {
  return request.get({ url: '/system/dict-type/list' })
}

export const getSimpleMenus = (type: number) => {
  return request.get({ url: '/system/menu/simple-list?type=' + type })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/menu/detail?id=' + id })
}
