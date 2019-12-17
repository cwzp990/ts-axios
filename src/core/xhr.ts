import { AxiosRequestConfig } from '../types/index'

export default function xhr(config: AxiosRequestConfig) {
  let { url, method = 'get', data = null } = config
  let xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url, true)
  xhr.send(data)
}
