import { ResolvedFn, RejectedFn } from '../types'

// 支持request拦截器和response拦截器 所以是泛型接口
interface interceptor<T> {
  resolved: ResolvedFn<T> // 成功的回调
  rejected?: RejectedFn   // 失败的回调
}

export default class interceptorManagers<T> {
  private interceptors: Array<interceptor<T> | null> // 拦截器数组

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  // 内部方法 支持传入一个函数，遍历执行
  forEach(fn: (interceptor: interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) fn(interceptor)
    })
  }

  eject(id: number): void {
    if (!this.interceptors[id]) this.interceptors[id] = null
  }
}
