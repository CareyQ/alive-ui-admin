import request from '@/utils/axios'

export interface CaptchaCheck {
  token: string
  point: string
}

export const get = () => {
  return request.get({ url: '/system/captcha/get' })
}

export const check = (data: CaptchaCheck) => {
  return request.post({ url: '/system/captcha/check', data })
}
