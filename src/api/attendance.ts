import { filter, propEq, map, compose } from "ramda"
import { post } from "~/helpers/http"
import { urls, LS_ATTND_SETTINGS } from "~/helpers/_const"
import { composeAsync, remap, doAction } from "~/helpers/common"
import {
  convAttendancePreview,
  convAttendanceUpdate,
  convAttendanceCalendar,
  convAttendanceApplyComplete,
  convAttendanceSummary
} from "~/helpers/htmlConverter"
import {
  AttendanceMonthlyAPI,
  AttendanceDaily,
  AttendanceOnServer,
  AttendanceSettings,
  ResultStatus,
  Status,
  Master,
  ApiResponse,
  SummaryResponse,
  SubmitApplicationReqestPayload,
} from "~/types"

/**
 * 月間勤怠データをサーバから取得します
 *
 * @param year 取得対象の年
 * @param month 取得対象の月
 * @param master プロジェクト名などのマスタデータ
 * @return Promise<AttendanceMonthlyAPI>
 */
const fetchMonthlyAttendance =
  async (year: number, month: number, master: Master): Promise<AttendanceMonthlyAPI> => {
    const html = await post(urls.TMSX_ATTENDANCE_PREVIEW, { year, month })
    const json = convAttendancePreview(master.projects, html)
    return json
  }

const clientToServerKeyMap = {
  projectId: "pjcd",
  start: "from",
  end: "to",
  day: "day",
}

const clientToServer = (client: Partial<AttendanceDaily>) => remap(clientToServerKeyMap, client)
const isSuccess = propEq("status", Status.OK)

/**
 * サーバへ月間勤怠データを保存します
 * 指定された年月の複数日データを同時に更新することが可能
 *
 * @param year 更新対象の年
 * @param month 更新対象の月
 * @param attendances 更新データ(日ごと)
 * @return Promise<ResultStatus> 更新結果
 */
const saveMonthlyAttendances =
  async (year: number, month: number, attendances: Array<Partial<AttendanceDaily>>): Promise<ResultStatus> => {

    if (attendances.length === 0) {
      return Promise.resolve({status: Status.OK, message: "There was no update."})
    }

    // データ形式をクライアント形式からサーバ形式へ変換
    const attendancesOnServer =
      attendances
        .map(clientToServer)
        .filter((a: AttendanceOnServer) => a.from && a.to)
        .map((a: AttendanceOnServer) => {
          // サーバAPI用に送信パラメータを整形
          a.day = a.day.toString().padStart(2, "0") // 3 => "03"
          a.from = a.from.replace(":", "") // "09:00" => "0900"
          a.to = a.to.replace(":", "") // 上記fromと同じ
          return a
        })

    // TODO: リファクタリング
    const action = {
      func: "accept",
      yk: "0000",
      inp2: "",
      inp3: "",
      inp4: "",
      inp5: "",
      etc: "",
    }

    const promises =
      attendancesOnServer
        .map(async attendance => {
          const html = await post(urls.ATTENDANCE_EDIT, {
            ...attendance,
            ...action,
            year,
            month: month.toString().padStart(2, "0"),
          })
          const json = convAttendanceUpdate(html)
          return json
        })
    const results = await Promise.all(promises)
    const okResults = filter(isSuccess, results)
    return okResults.length === attendancesOnServer.length
      ? {
        status: Status.OK,
        message: `${attendancesOnServer.length} attendances recordes was sent`,
      }
      : {
        status: Status.NG,
        message: `${attendancesOnServer.length - okResults.length} attendance requests failed`,
      }
  }

/**
 * 月勤怠が申請済みであるかを判定します
 */
const fetchHasApplied = async (year: number, month: number): Promise<boolean> => {
  const htmlRes = await post(urls.ATTENDANCE_REPORT, { year, month })
  const json = convAttendanceCalendar(htmlRes)
  return json
}

const fetchSummary = async (year: number, month: number): Promise<SummaryResponse> => {
  const html = await post(urls.ATTENDANCE_APPLY, { year, month, day: "" })
  const json = convAttendanceSummary(html)
  return { status: Status.OK, body: { ...json }}
}

/**
 * 上長申請を実行します
 */
const submitApplication = async (action: SubmitApplicationReqestPayload): Promise<ApiResponse> => {
  // await post(urls.)
  const [ year, month ] = action.monthlyId.split(":").map(s => parseInt(s, 10))
  const summary = await fetchSummary(year, month)
  const html = await post(urls.ATTENDANCE_EDIT, { func: "commit", ...summary, eym: action.monthlyId })
  const json = convAttendanceApplyComplete(html)
  return json
}

/**
 *  ユーザの勤怠登録設定を読み込みます
 *   - 初期業務開始時間
 *   - 初期業務終了時間
 *   - 初期プロジェクト
 */
const getSettings = async (): Promise<Partial<AttendanceDaily>> =>
  Promise.resolve(localStorage.getItem(LS_ATTND_SETTINGS))
    .then(jsonStr => jsonStr ? JSON.parse(jsonStr) : {})

/**
 *  ユーザの勤怠登録設定を更新します
 * 指定された造成のみ更新します
 *
 * @param patch 更新パ属性のみの出勤データ
 * @return 更新結果
 */
const patchSettings = async (patch: Partial<AttendanceSettings>): Promise<ResultStatus> =>
  Promise.resolve(getSettings())
    .then(currentSettings => ({ ...currentSettings, ...patch }))
    .then(nextSettings => localStorage.setItem(LS_ATTND_SETTINGS, JSON.stringify(nextSettings)))
    .then(_ => ({
      status: Status.OK,
      message: "勤怠設定の保存が完了しました",
    }))

export {
  fetchMonthlyAttendance,
  saveMonthlyAttendances,
  fetchHasApplied,
  fetchSummary,
  getSettings,
  submitApplication,
  patchSettings,
}
