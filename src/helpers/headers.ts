import { isObject } from './utils'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(key => {
    if (key !== normalizeName && key.toLocaleUpperCase() === normalizeName.toLocaleUpperCase()) {
      headers[normalizeName] = headers[key]
      delete headers[key]
    }
  })
}

// data是对象的时候，headers需要有Conteent-Type标识
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isObject) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

// headers是一个字符串 需要解析成对象
export function parseHeaders(headers: string): any {
  let parsed = Object.create({})
  if (!headers) return parsed
  headers.split('\r\n').forEach(line => {
    // 字符串可能存在多个 ":" 的情况
    let [key, ...vals] = line.split(':')
    key = key.trim().toLocaleLowerCase()
    if (!key) return
    const val = vals.join(':').trim()
    parsed[key] = val
  })
  return parsed
}
