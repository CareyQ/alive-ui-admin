import request from '@/utils/axios'

export interface ProductCategoryDTO {
  id?: number
  parentId?: number
  name?: string
  level?: number
  sort?: number
  icon?: string
  status?: number
}

export interface ProductCategoryPageDTO {
  parentId?: number
  name?: string
  level?: number
  sort?: number
  icon?: string
  status?: number
  createTime?: Date
  current: number
  size: number
}

// 查询商品分类列表
export const getList = async (params: any) => {
  return await request.get({ url: `/product/category/list`, params })
}

// 查询商品分类详情
export const getDetail = async (id: number) => {
  return await request.get({ url: `/product/category/detail?id=` + id })
}

// 保存商品分类
export const save = async (data: ProductCategoryDTO) => {
  return await request.post({ url: `/product/category/save`, data })
}

// 删除商品分类
export const del = async (id: number) => {
  return await request.delete({ url: `/product/category/del?id=` + id })
}

// 查询商品分类树
export const getTree = async () => {
  return await request.get({ url: `/product/category/tree` })
}
