import { AxiosRequestConfig } from '../types/index'

export default function xhr(config: AxiosRequestConfig) {
  let { url, method = 'get', data = null, headers } = config

  let xhr = new XMLHttpRequest()

  xhr.open(method.toUpperCase(), url, true)

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
}
