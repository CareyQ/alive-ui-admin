import { useCache } from '@/hooks/useCache'
import { TokenType } from '@/api/login/types'

const { wsCache } = useCache()

const AccessTokenKey = 'ACCESS_TOKEN'

// 获取token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return wsCache.get(AccessTokenKey) ? wsCache.get(AccessTokenKey) : wsCache.get('ACCESS_TOKEN')
}

// 刷新token
export const getRefreshToken = () => {
  return ''
}

// 设置token
export const setToken = (token: TokenType) => {
  wsCache.set(AccessTokenKey, token.accessToken)
}

// 删除token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey)
}
