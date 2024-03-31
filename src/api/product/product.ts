import request from '@/utils/axios'

export interface ProductDTO {
  id?: number
  categoryId?: number | string
  brandId?: number | string
  name?: string
  slidePic?: Array<string>
  status?: number
  sort?: number
  price?: number
  stock?: number
  unit?: string
  detailHtml: string
  detailMobileHtml: string
  giftPoint?: number
  giftGrowth?: number
  usePointLimit?: number
  newStatus?: boolean
  recommendStatus?: boolean
  service?: Array<number>
  subTitle?: string
  keyword?: string
  skus?: Array<ProductSkuDTO>
}

export interface ProductSkuDTO {
  id?: number
  productId?: number
  spec?: Array<ProductSpec>
  snCode?: string
  price?: number
  stock?: number
  pic?: string
  weight?: number
  volume?: number
}

export interface ProductSpec {
  attributeId: number
  attributeName: string
  value: string
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

// 更新商品信息
export const updateProduct = async (data: ProductDTO) => {
  return await request.post({ url: `/product/update`, data })
}

// 删除商品信息
export const del = async (id: number) => {
  return await request.delete({ url: `/product/del?id=` + id })
}

// 更新商品状态
export const updateStatus = async (id: number, status: number) => {
  return await request.put({ url: `/product/update-status?id=${id}&status=${status}` })
}
