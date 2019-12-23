import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    let { url, method = 'get', data = null, headers, responseType, timeout, cancelToken } = config

    let xhr = new XMLHttpRequest()

    if (responseType) xhr.responseType = responseType

    // 超时处理，默认为0
    if (timeout) xhr.timeout = timeout

    xhr.open(method.toUpperCase(), url!, true)

    xhr.onreadystatechange = function handleLoad() {
      if (xhr.readyState !== 4) return
      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
      const responseData = responseType === 'text' ? xhr.responseText : xhr.response
      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      }
      // 响应结果Promise化
      handleResponse(response)
    }

    xhr.onerror = function handleError() {
      reject(createError('Network Error', config, null, xhr))
    }

    xhr.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, null, xhr))
    }

    // 需要将headers添加到xhr对象上
    Object.keys(headers).forEach(key => {
      // data为null时，headers里的Content-Type没有意义，需要删除
      if (data === null && key.toLocaleLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        // xhr对象添加headers
        xhr.setRequestHeader(key, headers[key])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        xhr.abort()
        reject(reason)
      })
    }

    xhr.send(data)

    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if (status === 200) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, null, xhr, response)
        )
      }
    }
  })
}
