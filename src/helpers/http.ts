import { prop } from "ramda"
import { composeAsync } from "~/helpers/common"
import toFormData from "~/helpers/to-formdata"
import { ApiError, NgResponse } from "~/types"

function toURLEncoded(fd: FormData): string {
  let encoded = ""
  for (const key of fd.keys()) {
    encoded += `${key}=${fd.get(key)}&`
  }
  return encoded.slice(0, -1)
}

function toHtml(res: Response) {
  if (res.status >= 200 && res.status < 300) {
    return res.text()
  }
  return Promise.reject({ response: { error: { message: res.statusText }, status: res.status }})
}

async function ajax(url: string, method: string = "GET", params: any = null): Promise<string> {

  const baseReqInit: {} = {
    method,
    credentials: "include",
  }

  switch (method) {
  case "POST":
    return fetch(url, {
      ...baseReqInit,
      headers: {
        "Accept": "text/html",
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: toURLEncoded(params),
    })
      .then(toHtml)
  default:
    return fetch(url, baseReqInit).then(toHtml)
  }
}

async function get(url: string, params: object = {}): Promise<string> {
  return ajax(url, "GET", params)
}

async function post(url: string, formdata: FormData | object): Promise<string> {
  const fd = !(formdata instanceof FormData) ?  toFormData(formdata) : formdata
  return ajax(url, "POST", fd)
}

export {
  get,
  post,
}
