import Axios from './core/axios'
import { extend } from './helpers/utils'
import { AxiosRequestConfig, AxiosStatic } from './types'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

// 工厂函数
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config) // 实例化
  // 这样instance就指向了request方法，且上下文指向context，所以可以直接以 instance(option) 方式调用
  // Axios.prototype.request 内对第一个参数的数据类型判断，使我们能够以 instance(url, option) 方式调用
  const instance = Axios.prototype.request.bind(context)

  // 把Axios.prototype上的方法扩展到instance对象上
  // 这样 instance 就有了 get、post、put等方法
  // 并指定上下文为context，这样执行Axios原型链上的方法时，this会指向context
  // 把context对象上的自身属性和方法扩展到instance上
  // 注：因为extend内部使用的forEach方法对对象做for in遍历时，只遍历对象本身的属性，而不会遍历原型链上的属性
  // 这样，instance就有了defaults、interceptors属性
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  const newConf = mergeConfig(defaults, config)
  return createInstance(newConf)
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
