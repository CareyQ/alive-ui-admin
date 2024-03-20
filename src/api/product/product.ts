import request from '@/utils/axios'

export interface ProductParamDTO {
  id?: number
  attributeId: number
  value: string
}

export interface ProductSpecDTO {
  attributeId: number
  attributeName: string
  valueId: number
  value: string
}

export interface ProductDTO {
  id?: number
  categoryId?: number
  brandId?: number
  snCode?: string
  name?: string
  pic?: string
  status?: number
  sort?: number
  price?: number
  marketPrice?: number
  stock?: number
  unit?: string
  detailHtml: string
  detailMobileHtml: string
  giftPoint?: number
  giftGrowth?: number
  usePointLimit?: number
  newStatus?: boolean
  recommendStatus?: boolean
  serviceIds?: Array<number>
  subTitle?: string
  keyword?: string
  intro?: string
  param?: Array<ProductParamDTO>
  skus: Array<ProductSkuDTO>
}

export interface ProductSkuDTO {
  uid?: number
  id?: number
  productId?: number
  spec?: Array<ProductSpecDTO>
  skuCode?: string
  price?: number
  marketPrice?: number
  stock?: number
  albumPics?: Array<string>
  weight?: number
  volume?: number
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

// 新增商品信息
export const createProduct = async (data: ProductDTO) => {
  return await request.post({ url: `/product/create`, data })
}

// 删除商品信息
export const del = async (id: number) => {
  return await request.delete({ url: `/product/del?id=` + id })
}
