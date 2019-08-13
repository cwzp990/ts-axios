const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

// 判断是否是普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3a/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2c/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5b/gi, '[')
    .replace(/%5d/gi, ']')
}
