import dayjs from 'dayjs'

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm:ss 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
// @ts-ignore
export const dateFormatter = (row, column, cellValue) => {
  if (!cellValue) {
    return
  }
  return formatDate(cellValue)
}

export function formatDate(date: dayjs.ConfigType, format?: string): string {
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }
  // 日期存在，则进行格式化
  if (format === undefined) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  return dayjs(date).format(format)
}
