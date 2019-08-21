import axios from '../../src/axios'

// 请求拦截器的顺序和添加的时候是相反的 headers.test:321
axios.interceptors.request.use(config => {
  config.headers.test += '1'
  return config
})

axios.interceptors.request.use(config => {
  config.headers.test += '2'
  return config
})

axios.interceptors.request.use(config => {
  config.headers.test += '3'
  return config
})

// 结果应该是hello13
axios.interceptors.response.use(res => {
  res.data += '1'
  return res
})

let interceptor = axios.interceptors.response.use(res => {
  res.data += '2'
  return res
})

axios.interceptors.response.use(res => {
  res.data += '3'
  return res
})

axios.interceptors.response.eject(interceptor) // 删掉第二个拦截器

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then(res => {
  console.log(res.data)
})