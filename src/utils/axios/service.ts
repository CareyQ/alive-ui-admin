import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import qs from 'qs'
import errorCode from './errorCode'
import { config } from '@/utils/axios/config'

const { result_code, base_url, request_timeout } = config
const whiteList: string[] = ['/login']
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期' // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]

const service: AxiosInstance = axios.create({
  baseURL: base_url,
  timeout: request_timeout,
  withCredentials: false
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let hasToken = (config!.headers || {}).isToken === false
    whiteList.some((e) => {
      if (config.url) {
        config.url?.indexOf(e) > -1
        return (hasToken = false)
      }
    })

    const data = config.data || false
    if (
      config.method?.toUpperCase() === 'POST' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data)
    }

    const params = config.params || {}
    if (config.method?.toUpperCase() === 'GET' && params) {
      let url = config.url + '?'
      for (const propName of Object.keys(params)) {
        const value = params[propName]
        if (value !== void 0 && value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const val of Object.keys(value)) {
              const params = propName + '[' + val + ']'
              const subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[val]) + '&'
            }
          } else {
            url += `${propName}=${encodeURIComponent(value)}&`
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (err: AxiosError) => {
    console.log(err)
    Promise.reject(err)
  }
)

service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    const { data } = response
    if (!data) {
      throw new Error()
    }

    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response.data
    }

    const code = data.code || result_code
    const msg = data.msg || errorCode[code] || errorCode['default']
    if (ignoreMsgs.indexOf(msg) !== -1) {
      return Promise.reject(msg)
    }

    if (code === 500) {
      ElMessage.error('服务器错误,请联系管理员!')
      return Promise.reject(new Error(msg))
    }

    if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    }
    return data
  },
  (err: AxiosError) => {
    console.log('err' + err)
    const { message } = err
    ElMessage.error(message)
    return Promise.reject(err)
  }
)

export { service }
