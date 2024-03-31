import request from '@/utils/axios'

export interface ProductAttributeSpecDTO {
  id?: number
  name: string
}

export interface ProductAttributePageDTO {
  name?: string
  current: number
  size: number
}

// 查询商品属性分页
export const getAttributePage = async (data: ProductAttributePageDTO) => {
  return await request.post({ url: `/product/attribute/page`, data })
}

// 查询商品属性详情
export const getAttributeDetail = async (id: number) => {
  return await request.get({ url: `/product/attribute/detail?id=${id}` })
}

// 保存商品属性
export const saveAttribute = async (name: string) => {
  return await request.post({ url: `/product/attribute/save?name=${name}` })
}

// 删除商品属性
export const delAttribute = async (id: number) => {
  return await request.delete({ url: `/product/attribute/del?id=${id}` })
}
