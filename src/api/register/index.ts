import request from '@/utils/axios'

export const checkMobile = (mobile: string) => {
  return request.get({ url: '/system/auth/check-mobile?mobile=' + mobile })
}
