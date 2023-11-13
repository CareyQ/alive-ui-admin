/**
 * 用户名校验
 * @param _rule 规则
 * @param value 待验证内容
 * @param callback 回调
 */
export const validateUsername = (_rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_]{1,16}$/
  if (value.length > 16) {
    callback(new Error('用户名不能超过 16 个字符'))
  } else if (!reg.test(value)) {
    callback(new Error('用户名只能包含数字、字母、下划线'))
  } else {
    callback()
  }
}

/**
 * 手机号码验证
 * @param rule 规则
 * @param value 待验证内容
 * @param callback 回调
 */
export const validateMobile = (_rule: any, value: any, callback: any) => {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
