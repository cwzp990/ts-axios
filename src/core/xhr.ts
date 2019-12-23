import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utils'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    let {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config

    let xhr = new XMLHttpRequest()

    if (responseType) xhr.responseType = responseType

    // 超时处理，默认为0
    if (timeout) xhr.timeout = timeout

    // 不同域是否携带cookie
    if (withCredentials) xhr.withCredentials = withCredentials

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

    if (onDownloadProgress) xhr.onprogress = onDownloadProgress
    if (onUploadProgress) xhr.upload.onprogress = onUploadProgress

    // 文件类型浏览器会自动添加centent-type字段
    if (isFormData(data)) {
      delete headers['Content-Type']
    }

    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      // 读取 cookie 的值，若存在，需往headers添加该值
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
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
