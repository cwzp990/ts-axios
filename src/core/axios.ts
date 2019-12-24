import dispatchRequest, { transformURL } from './dispatchRequest'
import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import interceptorManagers from './interceptorManager'
import mergeConfig from './mergeConfig'

interface interceptors {
  request: interceptorManagers<AxiosRequestConfig>
  response: interceptorManagers<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise) // 链式中首次是请求结果
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: interceptors

  // 初始化拦截器
  // 配置参数由外部传入
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new interceptorManagers<AxiosRequestConfig>(), // 用户调用axios.interceptors.request.use添加拦截器
      response: new interceptorManagers<AxiosResponse>()
    }
  }

  /* 
    request(config: AxiosRequestConfig): AxiosPromise {
      return dispatchRequest(config)
    }
  */
  // 函数重载 url运行时做判断 若是url地址，需要将它添加到config里，若不是，即只传了一个配置对象，需要将它赋值给config
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config) // 合并配置

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // request后添加的先执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // response先添加的先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    // return dispatchRequest(config)
    return promise
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

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
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
