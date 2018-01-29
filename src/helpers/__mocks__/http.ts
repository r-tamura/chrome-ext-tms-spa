import fs from "fs"
import path from "path"
import { promisify } from "util"
import ejs from "ejs"
import { prop } from "ramda"
import toFormData from "~/helpers/to-formdata"
import { urls } from "~/helpers/_const"

const renderFile = promisify<string, object, string>(ejs.renderFile)

const users = new Map<string, { [s: string]: string }>([
  ["alice", { id: "alice", name: "Alice Cooper", password: "password" }],
  ["bob", { id: "bob", name: "Bob Warner", password: "bobpass" }],
  ["marie", { id: "marie", name: "Marie Fredriksson", password: "marie1986" }],
  ["per", { id: "per", name: "Per Gessle", password: "pa22w0rd" }],
])

async function get(url: string, params: object = {}): Promise<string> {
  return Promise.resolve("get")
}

const mockLoginResponse = (fd: FormData) => {
  const id = fd.get("id").toString()
  if (users.has(id)) {
    const user = users.get(id)
    return renderFile(path.resolve(__dirname, "responses", "T0010_menu.html"), { name: user.name })
  }
  return Promise.resolve("<html><body>")
}

async function post(url: string, formdata: FormData | object): Promise<string> {
  const fd = !(formdata instanceof FormData) ?  toFormData(formdata) : formdata
  switch (url) {
  case urls.TMSX_MENU:
    return mockLoginResponse(fd)
  }

  return Promise.reject("Specified URL dosen't exist")
}

export {
  get,
  post,
}
