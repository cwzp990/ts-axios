// 发送请求

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index'
import { parseHeaders } from './helpers/header'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config // 拿到传入的配置参数

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout // 设置超时时间
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders()) // headers字符串转换成对象
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    // 网络错误
    request.onerror = function handleError() {
      reject(new Error('NetWork Error~'))
    }

    // 超时处理
    request.ontimeout = function handleTimeout() {
      reject(new Error(`Timeout of ${timeout} ms exceeded~`))
    }

    Object.keys(headers).forEach(key => {
      // 没有request body时，不需要配置content-type属性
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        request.setRequestHeader(key, headers[key])
      }
    })
    request.send(data)

    // 非200状态码处理
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }
  })
}
