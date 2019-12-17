// 字符串字面量类型用来约束取值只能是某几个字符串中的一个
export type Method = 'get' | 'GET' | 'post' | 'POST' | 'head' | 'HEAD' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
}
