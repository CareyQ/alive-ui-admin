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

export interface ProductAttributeParamDTO {
  id?: number
  groupId?: number
  type?: number
  name?: string
  selectType?: number
  inputType?: number
  inputList?: string
  sort?: number
  filterType?: number
  searchType?: number
  relatedStatus?: number
  addition?: boolean
}

export interface ProductAttributeSpecDTO {
  id?: number
  name: string
}

export interface ProductAttributePageDTO {
  groupId?: number
  type?: number
  name?: string
  current: number
  size: number
}

export interface ProductAttributeValueDTO {
  id?: number
  attributeId: number
  value: string
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

// 查询商品属性分组列表
export const getAttributeGroupList = async (categoryId: number) => {
  return await request.get({ url: `/product/attribute/group/list?categoryId=` + categoryId })
}

// 查询商品属性分页
export const getAttributePage = async (data: ProductAttributePageDTO) => {
  return await request.post({ url: `/product/attribute/page`, data })
}

// 查询商品属性详情
export const getAttributeDetail = async (id: number) => {
  return await request.get({ url: `/product/attribute/detail?id=` + id })
}

// 保存商品属性参数
export const saveAttributeParam = async (data: ProductAttributeParamDTO) => {
  return await request.post({ url: `/product/attribute/param/save`, data })
}

// 保存商品属性规格
export const saveAttributeSpec = async (data: ProductAttributeSpecDTO) => {
  return await request.post({ url: `/product/attribute/spec/save`, data })
}

// 删除商品属性
export const delAttribute = async (id: number) => {
  return await request.delete({ url: `/product/attribute/del?id=` + id })
}

// 查询商品属性相关枚举
export const getAttributeEnums = async () => {
  return await request.get({ url: `/product/attribute/enums` })
}

// 查询商品属性列表
export const getAttributeList = async (categoryId: number) => {
  return await request.get({ url: `/product/attribute/list?categoryId=${categoryId}` })
}

// 保存商品属性值
export const saveAttributeValue = async (data: ProductAttributeValueDTO) => {
  return await request.post({ url: `/product/attribute/value/save`, data })
}

// 删除商品属性值
export const delAttributeValue = async (id: number) => {
  return await request.delete({ url: `/product/attribute/value/del?id=` + id })
}
