import request from '@/utils/axios'

export interface DictType {
  id: number | string
  name: string
  type: string
  status: number
}

export interface DictData {
  id: number | string
  label: string
  value: string
  dictType: string
  remark: string
  status: number
}

export interface DictDataPageDTO {
  label: string
  dictType: string
  status: number | undefined
  current: number
  size: number
}

// 字典类型
export const getDictTypeList = () => {
  return request.get({ url: '/system/dict-type/list' })
}

export const saveDictType = (data: DictType) => {
  return request.post({ url: '/system/dict-type/save', data })
}

export const getDictTypeDetail = (id: number) => {
  return request.get({ url: '/system/dict-type/detail?id=' + id })
}

export const delDictType = (id: number) => {
  return request.delete({ url: '/system/dict-type/del?id=' + id })
}

// 字典数据
export const getDictDataPage = (data: DictDataPageDTO) => {
  return request.post({ url: '/system/dict-data/page', data })
}

export const saveDictData = (data: DictData) => {
  return request.post({ url: '/system/dict-data/save', data })
}

export const getDictDataDetail = (id: number) => {
  return request.get({ url: '/system/dict-data/detail?id=' + id })
}

export const getDictList = () => {
  return request.get({ url: '/system/dict-data/list' })
}

export const delDictData = (id: number) => {
  return request.delete({ url: '/system/dict-data/del?id=' + id })
}
