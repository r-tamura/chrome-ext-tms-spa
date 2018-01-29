import { find, propEq, curry, compose } from "ramda"
import { urls } from "./_const"
import * as Common from "./common"
import {
  User, ResultStatus, Status,
  Project, Usage, Objective, Master,
  TransExpenseView,
  AttendanceMonthlyAPI,
} from "~/types"

import { createMonthlyId, createDailyId } from "~/modules/attendances"

const parseHTML = (html: string): HTMLDocument =>
 (new DOMParser()).parseFromString(html, "text/html")

// ようこそ!のタグからユーザ名を取得
function getUserName(welcomeText: Text): string {
  const matched = welcomeText.wholeText.match(/(?:部\s).*(?=さ)/)
  return matched !== null ? matched[0].slice(2).replace("　", " ") : ""
}

/**
 * 登録済み交通費登録画面HTMLをオブジェクトデータへ変換します
 */
export function convMaster(html: string): Master {
  const $html = parseHTML(html)
  const table = $html.querySelector("form[name=\"form01\"] table")
  const tdTags = table.querySelectorAll("td:nth-child(2)")
  // プロジェクトコードリスト
  const projects: Project[] =
    [...tdTags[1].getElementsByTagName("option")]
      .map((e: HTMLOptionElement) => ({ projectId: e.value, name: e.label }))
  // 利用区分
  const usages: Usage[] =
    [...tdTags[2].getElementsByTagName("option")]
      .map((e: HTMLOptionElement) => ({ usageId: e.value, name: e.label }))
  // 目的コード
  const objectives: Objective[] =
    [...tdTags[3].getElementsByTagName("option")]
      .map((e: HTMLOptionElement) => ({ objectiveId: e.value, name: e.label }))
  return { projects, usages, objectives }
}

/**
 * メインメニュー画面HTMLをオブジェクトデータに変換します
 */
export function convMenu(html: string): User {
  if (!/TMS MENU/.test(html)) {
    return { isAuthenticated: false }
  }

  const $html = parseHTML(html)
  // ユーザ名
  const name = getUserName($html.getElementsByTagName("p").item(1).childNodes[0] as Text)
  if (!name.length) {
    return { isAuthenticated: false }
  }

  return { isAuthenticated: true, name }
}

/**
 * 交通費登録情報確認画面HTMLをオブジェクトデータへ変換します
 */
export const convTransExpenseList = curry((master: Master, html: string): TransExpenseView[] => {
    function reduceCallback(children: HTMLCollection, pv: any, cv: any, i: number) {
      const node = children[i].childNodes[0] as Text
      const findNameEq = find(propEq("name", node.wholeText))
      switch (cv) {
      case "projectId":
        pv[cv] = node ? findNameEq(projects).projectId : ""
        break
      case "usageId":
        pv[cv] = node ? findNameEq(usages).usageId : ""
        break
      case "objectiveId":
        pv[cv] = node ? findNameEq(objectives).objectiveId : ""
        break
      default:
        pv[cv] = node ? node.wholeText : ""
      }
      return pv
    }

    const { projects, usages, objectives } = master
    const $html = parseHTML(html)
    const columnName1 = ["strdate", "projectId", "usageId", "objectiveId", "customer"]
    const columnName2 = ["from", "to", "cost", "registerDate"]
    const tclist =
      [...$html.getElementsByTagName("tr")]
        .slice(2)
        .reduce((pv: any[], cv: HTMLElement, i) => {
          const children = cv.getElementsByTagName("td")
          if (i % 3 === 1) {
            // 偶数行
            pv.push(columnName1.reduce(reduceCallback.bind(null, children), {
              expenseId: +(children[5].childNodes[0] as HTMLAnchorElement).getAttribute("href").match(/[\d]+/g)[1],
            }))
          } else if (i % 3 === 2) {
            // 奇数行
            const index = i / 3
            columnName2.reduce(
              reduceCallback.bind(null, children),
              pv[Math.floor(index)],
            )
          }
          return pv
        }, [])
    return tclist
})

const convResultHtml = curry((okresult: string, html: string): ResultStatus =>
  compose(
    (res: string) => ({
      status: res === okresult ? Status.OK : Status.FAILURE,
      message: res,
    }),
    ($html: HTMLDocument) => ($html.querySelectorAll("p[align='center']").item(2).childNodes[0] as Text).wholeText,
    parseHTML,
  )(html),
)

/**
 * 交通費作成結果HTMLをJSONデータに変換します
 */
export const convTransExpenseCreate = convResultHtml("登録が完了しました")

/**
 * 交通費削除結果HTMLをJSONデータに変換します
 */
export const convTransExpenseDelete = convResultHtml("削除が完了しました")

/**
 * 交通費更新結果HTMLをJSONデータに変換します
 */
export const convTransExpenseUpdate = convResultHtml("更新が完了しました")

/**
 * 月間勤怠HTMLから日付型データを取得します
 */
export function convAttendanceCalendar(html: string): boolean {
  const $html = parseHTML(html)
  // const table = $html.querySelector("form[name=\"form01\"] table")
  // const weekDayColor = "black"
  // const $days = Array.from(table.querySelectorAll("font"))
  // const weekdayColors = ["black", "green"]

  // // 日付一覧取得
  // const days = $days.reduce((list, e: HTMLFontElement) => {
  //     // 日付以外の場合は何も行わない
  //     const numericDay = Number(e.innerHTML)
  //     if (isNaN(numericDay)) {
  //       return list
  //     }

  //     // 平日判定
  //     const isWeekDay = weekdayColors.indexOf(e.color) !== -1

  //     return [
  //       ...list,
  //       { day: numericDay, isWeekDay },
  //     ]
  //   }, [])

  // // 上長申請済みであるか
  const trNodes = $html.forms.namedItem("form01").getElementsByTagName("tr")
  const lastTd = trNodes[trNodes.length - 1].getElementsByTagName("td")[0]
  const hasApplied = lastTd.children[0] instanceof HTMLFontElement

  return hasApplied
}

const removeSemicolon = (str: string) => str.trim().replace(";", "")
const getProject = (projects: Project[], name: string) => find(propEq("name", name), projects)
const toDailyAttendance = (projects: Project[], year: number, month: number) => ($f: NodeListOf<Element>) => ({
  day: parseInt($f[0].querySelector("b").textContent, 10),
  dailyId: createDailyId(year, month, $f[0].querySelector("b").textContent),
  isWeekday: !/do|ni|_r/.test($f[1].querySelector("img").getAttribute("src")),
  start: removeSemicolon($f[2].textContent),
  end: removeSemicolon($f[3].textContent),
  overwork: removeSemicolon($f[5].textContent),
  overnightwork: removeSemicolon($f[6].textContent),
  projectId: removeSemicolon($f[10].textContent.trim()).length > 0
    ? getProject(projects, $f[10].textContent)
      ? getProject(projects, $f[10].textContent).projectId
      : projects[0].projectId
    : null,
  hasConfirmed: $f[12].getElementsByTagName("img").length > 0,
})

/**
 * 勤怠プレビュー画面のHTMLをJSONへ変換します
 * T2022_it_report_preview
 */
export const convAttendancePreview =
  curry((projects: Project[], html: string): AttendanceMonthlyAPI => {
    const $html = parseHTML(html.replace(/\&nbsp/g, ""))

    // 年月取得
    const [year, month] = $html.querySelector("form u b").innerHTML.match(/\d+["0-9]/g).map(e => parseInt(e, 10))

    const $contents = $html.querySelectorAll("#table-01") // ※ なぜか同じID指定が複数存在

    // ヘッダ
    const $header = $contents[0]
    const reportId = $header.querySelectorAll("td font")[0].textContent // 勤怠番号

    // 日ごとデータリスト
    const $body = $contents[1]
    const days =
      [...$body.querySelectorAll("tr")]
        .filter((_, i, a) => i > 2 && i < a.length - 1)
        .map($tr => $tr.querySelectorAll("td font"))
        .map(toDailyAttendance(projects, year, month))

    return { days, year, month, reportId, monthlyId: createMonthlyId(year, month) }
  })

export const convAttendanceUpdate = convResultHtml("承認が完了しました")
