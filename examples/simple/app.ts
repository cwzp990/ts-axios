/**
 * 该入口文件会被webpack编译成simple.js 被index.html引入
 */

import axios from '../../src/axios'

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2
  }
})