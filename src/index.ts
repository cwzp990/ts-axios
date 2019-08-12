// 入口文件

import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'

// 主方法
function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config) // xhr实例
}

function processConfig(config: AxiosRequestConfig): void {
  // 对url进行处理
  config.url = transformUrl(config)
  // 对请求头headers进行处理
  config.headers = transformHeaders(config)
  // 对请求的参数data进行处理（对象默认转换成JSON字符串）
  config.data = transformRequestData(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
