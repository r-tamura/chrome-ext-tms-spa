import { find, propEq, map, cond, all, compose, T } from "ramda"
import { convAttendancePreview, convAttendanceUpdate, convAttendanceCalendar } from "~/helpers/htmlConvertor"
import { post } from "~/helpers/http"
import { composeAsync, remap, doAction } from "~/helpers/common"
import { urls, LS_ATTND_SETTINGS } from "~/helpers/_const"
import {
  AttendanceMonthlyAPI,
  AttendanceDaily,
  AttendanceOnServer,
  AttendanceSettings,
  ResultStatus,
  Status,
  Master,
} from "~/types"

export const fetchMonthlyAttendance =
  (year: number, month: number, master: Master): Promise<AttendanceMonthlyAPI> =>
  composeAsync(
    convAttendancePreview(master.projects),
    post,
  )(urls.TMSX_ATTENDANCE_PREVIEW, {year, month})

const clientToServerKeyMap = {
  projectId: "pjcd",
  start: "from",
  end: "to",
  day: "day",
}

const clientToServer = (client: Partial<AttendanceDaily>) => remap(clientToServerKeyMap, client)

const isSuccess = cond([
  [res => typeof res === "undefined", () => ({ status: Status.OK })],
  [T, res => res],
])
const allHaveOK = find(propEq("status", Status.FAILURE))

export const saveMonthlyAttendances =
  async (year: number, month: number, attendances: Array<Partial<AttendanceDaily>>): Promise<ResultStatus> => {

    if (attendances.length === 0) {
      return Promise.resolve({status: Status.OK, message: "There was no update."})
    }

    const attendancesOnServer =
      attendances
        .map(clientToServer)
        .map((a: AttendanceOnServer) => {
          // サーバAPI用に送信パラメータを整形
          a.day = a.day.toString().padStart(2, "0") // 3 => "03"
          a.from = a.from.replace(":", "") // "09:00" => "0900"
          a.to = a.to.replace(":", "")
          return a
        })

    // TODO: きれいな処理を書く

    const action = {
      func: "accept",
      yk: "0000",
      inp2: "",
      inp3: "",
      inp4: "",
      inp5: "",
      etc: "",
   }
    return composeAsync(
      isSuccess,
      allHaveOK,
      (promises: Array<Promise<{}>>) => Promise.all(promises),
      map(a =>
        composeAsync(
          convAttendanceUpdate,
          post,
        )(urls.ATTENDANCE_EDIT, {
           ...a,
           year,
           month: month.toString().padStart(2, "0"),
           ...action,
        }),
      ),
    )(attendancesOnServer)
  }

/**
 *  月間勤怠データの日付情報一覧を取得します
 */
export const getMonthlyDates = async (year: number, month: number): Promise<boolean> =>
  composeAsync(
    convAttendanceCalendar,
    post,
  )(urls.ATTENDANCE_EDIT, {year, month})

/**
 *  ユーザの勤怠登録設定を読み込みます
 *   - 初期業務開始時間
 *   - 初期業務終了時間
 *   - 初期プロジェクト
 */
export const getSettings = async (): Promise<Partial<AttendanceDaily>> =>
  Promise.resolve(localStorage.getItem(LS_ATTND_SETTINGS))
    .then(jsonStr => jsonStr ? JSON.parse(jsonStr) : {})

/**
 *  ユーザの勤怠登録設定を更新します
 */
export const patchSettings = async (patch: Partial<AttendanceSettings>): Promise<ResultStatus> =>
  Promise.resolve(getSettings())
    .then(currentSettings => ({ ...currentSettings, ...patch }))
    .then(nextSettings => localStorage.setItem(LS_ATTND_SETTINGS, JSON.stringify(nextSettings)))
    .then(_ => ({
      status: Status.OK,
      message: "勤怠設定の保存が完了しました",
    }))