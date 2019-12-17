import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    let { url, method = 'get', data = null, headers, responseType } = config

    let xhr = new XMLHttpRequest()

    if (responseType) xhr.responseType = responseType

    xhr.open(method.toUpperCase(), url, true)

    xhr.onreadystatechange = function handleLoad() {
      if (xhr.readyState !== 4) return
      const responseHeaders = xhr.getAllResponseHeaders()
      const responseData = responseType === 'text' ? xhr.responseText : xhr.response
      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      }
      // 响应Promise化
      resolve(response)
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

    xhr.send(data)
  })
}
