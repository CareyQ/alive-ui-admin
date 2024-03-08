import request from '@/utils/axios'

export interface ProductDTO {
  id?: number
  categoryId?: number
  brandId?: number
  attributeGroupId?: number
  snCode?: string
  name?: string
  pic?: string
  status?: number
  sort?: number
  salesVolume?: number
  price?: number
  marketPrice?: number
  stock?: number
  unit?: string
  detailHtml?: string
  detailMobileHtml?: string
  giftPoint?: number
  giftGrowth?: number
  usePointLimit?: number
  subTitle?: string
  keyword?: string
  intro?: string
}

export interface ProductPageDTO {
  categoryId?: number
  brandId?: number
  snCode?: string
  name?: string
  status?: number
  current: number
  size: number
}

// 查询商品信息分页
export const getPage = async (data: ProductPageDTO) => {
  return await request.post({ url: `/product/page`, data })
}

// 查询商品信息详情
export const getDetail = async (id: number) => {
  return await request.get({ url: `/product/detail?id=` + id })
}

// 保存商品信息
export const save = async (data: ProductDTO) => {
  return await request.post({ url: `/product/save`, data })
}

// 删除商品信息
export const del = async (id: number) => {
  return await request.delete({ url: `/product/del?id=` + id })
}
