import Axios from './core/axios'
import { extend } from './helpers/utils'
import { AxiosRequestConfig, AxiosStatic } from './types'
import defaults from './default'
import mergeConfig from './core/mergeConfig'

// 工厂函数
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config) // 实例化
  const instance = Axios.prototype.request.bind(context)

  // axios属性需要拷贝到instance上
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  const newConf = mergeConfig(defaults, config)
  return createInstance(newConf)
}

export default axios
