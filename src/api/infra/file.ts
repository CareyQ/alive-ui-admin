import request from '@/utils/axios'

export interface FileDTO {
  id?: number
  configId?: number
  name?: string
  path?: string
  url?: string
  type?: string
  size?: number
}

export interface FilePageDTO {
  configId?: number
  name?: string
  path?: string
  createTime?: Date
  current: number
  size: number
}

export interface OssConfigDTO {
  id?: number
  name?: string
  accessKey?: string
  secretKey?: string
  bucket?: string
  endpoint?: string
  region?: string
  master?: boolean
}

export interface OssConfigPageDTO {
  name?: string
  createTime?: Date
  current: number
  size: number
}

// 查询文件分页
export const getFilePage = async (data: FilePageDTO) => {
  return await request.post({ url: `/infra/file/page`, data })
}

// 查询文件详情
export const getFileDetail = async (id: number) => {
  return await request.get({ url: `/infra/file/detail?id=` + id })
}

// 保存文件
export const saveFile = async (data: FileDTO) => {
  return await request.post({ url: `/infra/file/save`, data })
}

// 删除文件
export const delFile = async (id: number) => {
  return await request.delete({ url: `/infra/file/del?id=` + id })
}

// 查询对象存储配置分页
export const getOssConfigPage = async (data: OssConfigPageDTO) => {
  return await request.post({ url: `/infra/oss-config/page`, data })
}

// 查询对象存储配置详情
export const getOssConfigDetail = async (id: number) => {
  return await request.get({ url: `/infra/oss-config/detail?id=` + id })
}

// 保存对象存储配置
export const saveOssConfig = async (data: OssConfigDTO) => {
  return await request.post({ url: `/infra/oss-config/save`, data })
}

// 删除对象存储配置
export const delOssConfig = async (id: number) => {
  return await request.delete({ url: `/infra/oss-config/del?id=` + id })
}

// 获取对象存储配置列表
export const getOssConfigList = async () => {
  return await request.get({ url: `/infra/oss-config/list` })
}
