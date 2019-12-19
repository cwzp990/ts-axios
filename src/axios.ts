import Axios from "./core/axios";
import { extend } from "./helpers/utils";
import { AxiosInstance } from "./types";

// 工厂函数
function createInstance ():AxiosInstance {
  const context = new Axios() // 实例化
  const instance = Axios.prototype.request.bind(context)

  // axios属性需要拷贝到instance上
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios