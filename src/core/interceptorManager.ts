import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T>{
  private interceptors: Array<Interceptor<T>>

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

  forEach(fn:(interceptor:Interceptor<T>)=>void):void { // 传入一个函数
    this.interceptors.forEach(interceptor => {
      if (interceptor !==null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if(this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}