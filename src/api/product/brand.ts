import request from '@/utils/axios'

export interface ProductBrandDTO {
  id?: number
  name?: string
  sort?: number
  logo?: string
  description?: string
  status?: number
}

export interface ProductBrandPageDTO {
  name?: string
  status?: number
  createTime?: Date
  current: number
  size: number
}

// 查询商品品牌分页
export const getPage = async (data: ProductBrandPageDTO) => {
  return await request.post({ url: `/product/brand/page`, data })
}

// 查询商品品牌详情
export const getDetail = async (id: number) => {
  return await request.get({ url: `/product/brand/detail?id=` + id })
}

// 保存商品品牌
export const save = async (data: ProductBrandDTO) => {
  return await request.post({ url: `/product/brand/save`, data })
}

// 删除商品品牌
export const del = async (id: number) => {
  return await request.delete({ url: `/product/brand/del?id=` + id })
}

// 查询商品品牌列表
export const getBrandList = async () => {
  return await request.get({ url: `/product/brand/list` })
}
