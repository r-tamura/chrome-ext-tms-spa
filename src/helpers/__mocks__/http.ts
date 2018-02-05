import fs from "fs"
import path from "path"
import { promisify } from "util"
import ejs from "ejs"
import { prop } from "ramda"
import toFormData from "~/helpers/to-formdata"
import { urls } from "~/helpers/_const"
import { Status } from "~/types"

const renderFile = promisify<string, object, string>(ejs.renderFile)

const users = new Map<string, { [s: string]: string }>([
  ["alice", { id: "alice", name: "Alice Cooper", password: "password" }],
  ["bob", { id: "bob", name: "Bob Warner", password: "bobpass" }],
  ["marie", { id: "marie", name: "Marie Fredriksson", password: "marie1986" }],
  ["per", { id: "per", name: "Per Gessle", password: "pa22w0rd" }],
])

const MOCK_RESPONSE_DIR = __dirname + "/responses"

async function get(url: string, params: object = {}): Promise<string> {
  return post(url, params)
}

const mockLoginResponse = (fd: FormData) => {
  const id = fd.get("id").toString()
  if (users.has(id)) {
    const user = users.get(id)
    return renderFile(path.resolve(MOCK_RESPONSE_DIR, "T0010_menu.html"), { name: user.name })
  }
  return Promise.resolve("<html><body>")
}

const mockAttendanceCalendarResponse = (fd: FormData): Promise<string> => {
  // 2018年からは未申請
  return renderFile(path.resolve(MOCK_RESPONSE_DIR, "T2020_it_report.html"), {
    name: "Marie Fredriksson",
    hasApplied: fd.get("year").valueOf() < 2018,
  })
}

const mockSaveAttencandeDaysResponse = (fd: FormData): Promise<string> => {
  return Promise.resolve(`
    <html><body>
      <p align=\"center\"><p>
      <p align=\"center\"><p>
      <p align=\"center\">承認が完了しました<p>
    </body></html>
  `)
}

const mockAttendancePreviewResponse = (fd: FormData): Promise<string> => {
  return renderFile(path.resolve(MOCK_RESPONSE_DIR, "T2022_it_report_preview.html"), {
    name: "Marie Fredriksson",
  })
}

async function post(url: string, formdata: FormData | object): Promise<string> {
  const fd = (formdata instanceof FormData) ? formdata : toFormData(formdata)
  switch (url) {
  case urls.TMSX_MENU:
    return mockLoginResponse(fd)
  case urls.ATTENDANCE_REPORT:
    return mockAttendanceCalendarResponse(fd)
  case urls.ATTENDANCE_EDIT:
    return mockSaveAttencandeDaysResponse(fd)
  case urls.TMSX_ATTENDANCE_PREVIEW:
    return mockAttendancePreviewResponse(fd)
  }

  return Promise.reject("Specified URL doesn't exist")
}

export {
  get,
  post,
}
