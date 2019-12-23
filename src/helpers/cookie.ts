const cookie = {
  // 读取cookie match[0]是整个表达式的值
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
