import request from '@/utils/axios'

export interface FileDTO {
  id?: number
  folder?: string
  name?: string
  path?: string
  url?: string
  type?: string
  size?: number
}

export interface FilePageDTO {
  name?: string
  path?: string
  createTime?: Date
  current: number
  size: number
}

// 查询文件目录
export const getFileFolder = async () => {
  return await request.get({ url: `/infra/file/folder` })
}

// 查询文件分页
export const getFilePage = async (data: FilePageDTO) => {
  return await request.post({ url: `/infra/file/page`, data })
}

// 查询文件详情
export const getFileDetail = async (id: number) => {
  return await request.get({ url: `/infra/file/detail?id=` + id })
}

// 删除文件
export const delFile = async (id: number) => {
  return await request.delete({ url: `/infra/file/del?id=` + id })
}
