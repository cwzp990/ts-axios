import dispatchRequest from './dispatchRequest'
import { AxiosRequestConfig, AxiosPromise, Method } from '../types'

export default class Axios {
  /* 
    request(config: AxiosRequestConfig): AxiosPromise {
      return dispatchRequest(config)
    }
  */
  // 函数重载 url运行时做判断 若是url地址需要将它添加到config里，若不是，即只传了一个配置对象，需要将它赋值给config
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, config: AxiosRequestConfig, data?: any): AxiosPromise {
    return this._requestMethodWithData('post', url, config, data)
  }

  put(url: string, config: AxiosRequestConfig, data?: any): AxiosPromise {
    return this._requestMethodWithData('put', url, config, data)
  }

  patch(url: string, config: AxiosRequestConfig, data?: any): AxiosPromise {
    return this._requestMethodWithData('patch', url, config, data)
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
