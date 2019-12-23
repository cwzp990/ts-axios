import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config) // token存在不需要发送请求
  processConfig(config) // 对配置参数进行处理
  return xhr(config) // 发送http请求 响应Promise化
    .then(res => {
      return transformResponseData(res) // 响应数据默认是JSON字符串，需要将它转换成对象方便后续调用
    })
}

function processConfig(config: AxiosRequestConfig): void {
  const { data, headers, transformRequest, method } = config
  config.url = transformURL(config) // 对url参数进行处理
  // 对请求data做处理，对象需转换为JSON字符串
  // config.data = transformRequestData(config)
  config.data = transform(data, headers, transformRequest)

  // 对headers进行处理
  // config.headers = transformHeaders(config)
  config.headers = flattenHeaders(headers, method!) // 需要添加的headers字段提取出来
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params)
}

// 移到 defaults.ts 里实现了
// function transformRequestData(config: AxiosRequestConfig): any {
//   const { data } = config
//   return transformRequest(data)
// }

// 移到 defaults.ts 里实现了
// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  const { data, headers, config } = res
  res.data = transform(data, headers, config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) config.cancelToken.throwIfRequested()
}
