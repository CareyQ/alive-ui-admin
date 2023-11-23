export type LoginDTO = {
  username: string
  password: string
}

export type TokenType = {
  accessToken: string // 访问令牌
  userId: number // 用户编号
}
