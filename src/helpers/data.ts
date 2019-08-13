// 请求和响应的辅助函数

import { isPlainObject } from './utils'

// 将普通对象转换成JSON字符串
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
