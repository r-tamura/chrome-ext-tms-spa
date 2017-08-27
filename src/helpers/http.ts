import { prop } from "ramda"
import { composeAsync } from "~/helpers/common"

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
  return Promise.reject(new Error(res.statusText))
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

export async function get(url: string, params: object = {}): Promise<string> {
  return ajax(url, "GET", params)
}

export async function post(url: string, formdata: FormData | object): Promise<string> {
  if (!(formdata instanceof FormData)) {
    // FormDataオブジェクトでない場合はFormDataオブジェクトへ変換
    const fd: FormData = new FormData()
    const names = Object.getOwnPropertyNames(formdata)

    for ( const name of names ) {
      fd.append(name, prop(name, formdata))
    }
    formdata = fd
  }
  return ajax(url, "POST", formdata)
}
