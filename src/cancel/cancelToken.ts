import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (!this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason) // 调用cancel方法才会调用resolve函数，将pending --> resolve
    })
  }

  throwIfRequested() {
    if (this.reason) throw this.reason
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler

    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
