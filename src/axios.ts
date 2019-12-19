import Axios from './core/axios'
import { extend } from './helpers/utils'
import { AxiosInstance, AxiosRequestConfig } from './types'
import defaults from './default'

// 工厂函数
function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config) // 实例化
  const instance = Axios.prototype.request.bind(context)

  // axios属性需要拷贝到instance上
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
