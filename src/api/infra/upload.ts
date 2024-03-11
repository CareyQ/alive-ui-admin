import request from '@/utils/axios'

const uploadUrl = import.meta.env.VITE_UPLOAD_URL

// 文件上传
export const upload = (params: FormData) => {
  return request.upload({ url: uploadUrl, data: params })
}
