import { AxiosRequestConfig } from './types/index'
import xhr from './core/xhr'
import { buildUrl } from './helpers/url'

function axios(config: AxiosRequestConfig) {
  processConfig(config) // 对配置参数进行处理
  xhr(config) // 发送http请求
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config) // 对url参数进行处理
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

export default axios
