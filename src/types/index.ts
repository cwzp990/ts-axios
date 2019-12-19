// 字符串字面量类型用来约束取值只能是某几个字符串中的一个
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'head'
  | 'HEAD'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response:  AxiosInterceptorManager<AxiosPromise>
  }

  request<T = any>(config?: AxiosRequestConfig): AxiosResponse<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number // 每次创建一个拦截器会返回一个参数，用于以后删除
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T> // 同步或者异步
}

export interface RejectedFn {
  (error: any): any
}
