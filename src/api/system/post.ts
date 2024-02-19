import request from '@/utils/axios'

export interface Post {
  id?: number
  name: string
  remark?: string
  status?: number
}

export interface PostPageDTO {
  name: string
  status?: number
  current: number
  size: number
}

export const getPage = (data: PostPageDTO) => {
  return request.post({ url: '/system/post/page', data })
}

export const save = (data: Post) => {
  return request.post({ url: '/system/post/save', data })
}

export const getDetail = (id: number) => {
  return request.get({ url: '/system/post/detail?id=' + id })
}

export const del = (id: number) => {
  return request.delete({ url: '/system/post/del?id=' + id })
}

export const getSimpleList = () => {
  return request.get({ url: '/system/post/simple-list' })
}
