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

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

export interface Axios {
  request(config?: AxiosRequestConfig): AxiosResponse
  get(url: string, config?: AxiosRequestConfig): AxiosResponse
  delete(url: string, config?: AxiosRequestConfig): AxiosResponse
  options(url: string, config?: AxiosRequestConfig): AxiosResponse
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise

  (url:string, config?:AxiosRequestConfig):AxiosPromise
}
