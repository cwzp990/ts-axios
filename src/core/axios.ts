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
  // 用户调用axios.interceptors.request.use添加拦截器，当用户发起一个请求时，会依次执行拦截器数组里的拦截器
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new interceptorManagers<AxiosRequestConfig>(),
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

    // 中间件
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
      // config会按序通过请求拦截器 dispatchRequest 响应拦截器
      // 数组的 shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
      // 每次执行while循环，从chain数组里按序取出两项，并分别作为promise.then方法的第一个和第二个参数
      // 按照我们使用InterceptorManager.prototype.use添加拦截器的规则，正好每次添加的就是我们通过InterceptorManager.prototype.use方法添加的成功和失败回调
      // 通过InterceptorManager.prototype.use往拦截器数组里添加拦截器时使用的数组的push方法，
      // 对于请求拦截器，从拦截器数组按序读到后是通过unshift方法往chain数组数里添加的，又通过shift方法从chain数组里取出的，所以得出结论：对于请求拦截器，先添加的拦截器会后执行
      // 对于响应拦截器，从拦截器数组按序读到后是通过push方法往chain数组里添加的，又通过shift方法从chain数组里取出的，所以得出结论：对于响应拦截器，添加的拦截器先执行
      // 第一个请求拦截器的fulfilled函数会接收到promise对象初始化时传入的config对象，而请求拦截器又规定用户写的fulfilled函数必须返回一个config对象，所以通过promise实现链式调用时，每个请求拦截器的fulfilled函数都会接收到一个config对象
      // 第一个响应拦截器的fulfilled函数会接受到dispatchRequest（也就是我们的请求方法）请求到的数据（也就是response对象）,而响应拦截器又规定用户写的fulfilled函数必须返回一个response对象，所以通过promise实现链式调用时，每个响应拦截器的fulfilled函数都会接收到一个response对象
      // 任何一个拦截器的抛出的错误，都会被下一个拦截器的rejected函数收到，所以dispatchRequest抛出的错误才会被响应拦截器接收到。
      // 因为axios是通过promise实现的链式调用，所以我们可以在拦截器里进行异步操作，而拦截器的执行顺序还是会按照我们上面说的顺序执行，也就是 dispatchRequest 方法一定会等待所有的请求拦截器执行完后再开始执行，响应拦截器一定会等待 dispatchRequest 执行完后再开始执行
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
    return transformURL(config) // buildURL
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
