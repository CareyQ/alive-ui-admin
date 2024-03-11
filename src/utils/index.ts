export const imageTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

export function isImage(mediaType: string | undefined): boolean {
  if (!mediaType) {
    return false
  }
  return imageTypes.includes(mediaType)
}

/**
 * element plus 的文件大小 Formatter 实现
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
// @ts-ignore
export const fileSizeFormatter = (row, column, cellValue) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //保留的小数位数
  return sizeStr + ' ' + unitArr[index]
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = ''
  for (let i = 0; i < 32; i++) {
    const random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}
