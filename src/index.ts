import { AxiosRequestConfig, AxiosPromise } from './types/index'
import xhr from './core/xhr'
import { buildUrl } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config) // 对配置参数进行处理
  return xhr(config) // 发送http请求 响应Promise化
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config) // 对url参数进行处理
  config.headers = transformHeaders(config) // 对headers进行处理
  config.data = transformRequestData(config) // 对请求data做处理，对象需转换为JSON字符串
}

function transformURL(config: AxiosRequestConfig): string {
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
