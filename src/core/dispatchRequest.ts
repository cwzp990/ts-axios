// 入口文件

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import xhr from '../xhr'
import { buildUrl } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/header'

// 主方法
function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  // xhr实例
  return xhr(config).then(res => {
    return transformResponseData(res) // 将data字符串转换成JSON对象
  })
}

function processConfig(config: AxiosRequestConfig): void {
  // 对url进行处理
  config.url = transformUrl(config)
  // 对请求头headers进行处理
  config.headers = transformHeaders(config)
  // 对请求的参数data进行处理（对象默认转换成JSON字符串）
  config.data = transformRequestData(config)
  // 合并配置并对headers的处理
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default dispatchRequest
