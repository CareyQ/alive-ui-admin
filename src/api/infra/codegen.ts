import request from '@/utils/axios'

export interface TablePageDTO {
  tableName?: string
  tableComment?: string
  startDate?: string
  endDate?: string
  current: number
  size: number
}

export interface CodegenPreviewVO {
  filePath: string
  code: string
}

export const getDbList = (params) => {
  return request.get({ url: '/infra/codegen/db/table/list', params })
}

export const importCodegenTable = (data) => {
  return request.post({ url: '/infra/codegen/import', data })
}

export const getPage = (data: TablePageDTO) => {
  return request.post({ url: '/infra/codegen/table/page', data })
}

export const getDetail = (tableId: number) => {
  return request.get({ url: '/infra/codegen/detail?tableId=' + tableId })
}

export const previewCodegen = (tableId: number) => {
  return request.get({ url: '/infra/codegen/preview?tableId=' + tableId })
}

export const delCodegen = (tableId: number) => {
  return request.delete({ url: '/infra/codegen/del?tableId=' + tableId })
}

export const updateCodegen = (data: any) => {
  return request.post({ url: '/infra/codegen/update', data })
}
