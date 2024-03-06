import request from '@/utils/axios'

export interface ProductAttributeGroupDTO {
  id?: number
  categoryId?: number
  name?: string
  sort?: number
}

export interface ProductAttributeGroupPageDTO {
  categoryId?: number
  name?: string
  startDate?: string
  endDate?: string
  current: number
  size: number
}

// 查询商品属性分组分页
export const getAttributeGroupPage = async (data: ProductAttributeGroupPageDTO) => {
  return await request.post({ url: `/product/attribute/group/page`, data })
}

// 查询商品属性分组详情
export const getAttributeGroupDetail = async (id: number) => {
  return await request.get({ url: `/product/attribute/group/detail?id=` + id })
}

// 保存商品属性分组
export const saveAttributeGroup = async (data: ProductAttributeGroupDTO) => {
  return await request.post({ url: `/product/attribute/group/save`, data })
}

// 删除商品属性分组
export const delAttributeGroup = async (id: number) => {
  return await request.delete({ url: `/product/attribute/group/del?id=` + id })
}
