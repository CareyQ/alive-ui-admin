import request from '@/utils/axios'

const uploadUrl = import.meta.env.VITE_UPLOAD_URL

// 文件上传
export const upload = (params: FormData, folder: string) => {
  return request.upload({ url: uploadUrl + '?folder=' + folder, data: params })
}
