const DEFAULT_ATTRIBUTES = {}

type SameSite = "lax" | "strict"

interface CookieAttribute {
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: SameSite
}

interface Cookie {
  [s: string]: string
}

const decode = decodeURIComponent

const dateFormat = (date: Date): string => {
  return "Thu, 01 Jan 1970 00:00:00 GMT"
}

/**
 * Cookieを文字列へシリアライズします
 * @param {string} key        cookie名
 * @param {string} value      cookie値
 * @param {object} attributes cookie属性(optional)
 * @example <caption>キーバリューのみ</caption>
 * serialize("foo", "bar") // "foo=bar"
 * @example <caption>属性付き</caption>
 * serialize("foo", "bar", { expires: new Date("2018-01-01")}) // "foo=bar"
 * @return {string} 一つのcookie文字列
 */
const serialize = (key: string, value: string, attributes: CookieAttribute = {}): string => {
  const result = [`${key}=${value}`]
  if (attributes.expires) {
    result.push(`Expires=${attributes.expires.toUTCString()}`)
  }
  if (attributes.maxAge) {
    result.push(`Max-Age=${attributes.maxAge}`)
  }
  if (attributes.domain) {
    result.push(`Domain=${attributes.domain}`)
  }
  if (attributes.path) {
    result.push(`Path=${attributes.path}`)
  }
  if (attributes.sameSite) {
    result.push(`SameSite=${attributes.sameSite}`)
  }
  if (attributes.httpOnly === true) {
    result.push(`HttpOnly`)
  }
  if (attributes.secure === true) {
    result.push(`Secure`)
  }
  return result.join("; ")
}

/**
 * document.cookie形式のcookie文字列をJSONオブジェクト形式に変換します
 * @param {string} strCookie document.cookie形式のcookie文字列
 * @example <caption>一つのみ</caption>
 * parse("foo=bar") // { foo: "bar" }
 * @return {object} cookie名をキー、cookie値をバリューとしたオブジェクト
 */
const parse = (strCookie: string): Cookie => {
  const PAIR_SPLIT_REGEX = /; */
  const obj: Cookie = {}
  const pairs = strCookie.split(PAIR_SPLIT_REGEX)

  for (const pair of pairs) {
    const eq_idx = pair.indexOf("=")

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue
    }

    const key = pair.substr(0, eq_idx).trim()
    let val = pair.substr(eq_idx + 1, pair.length).trim()

    // quoted values
    if ("\"" === val[0]) {
      val = val.slice(1, -1)
    }

    // only assign once
    if (!obj[key]) {
      obj[key] = decode(val)
    }
  }
  return obj
}

const cookie = (key: string, value: string, attributes: CookieAttribute): string => {
  if (document === undefined) {
    return null
  }

  const newCookie = serialize(key, value, attributes)
  document.cookie = newCookie
  return newCookie
}

const get = (key: string, strCookie: string = document.cookie): string => {
  return parse(strCookie)[key]
}

const set = (key: string, value: string): void => {
  cookie(key, value, {})
}

const remove = (key: string): string => {
  if (!has(key)) {
    return null
  }
  return cookie(key, "", { maxAge: -1 })
}

const has = (key: string, strCookie: string = document.cookie): boolean => {
  return !!parse(strCookie)[key]
}

export {
  get,
  set,
  has,
  remove,
  serialize,
}

export default {
  get,
  set,
  has,
  remove,
  serialize,
}
