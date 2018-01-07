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

/**
 * 月間勤怠データをサーバから取得します
 *
 * @param year 取得対象の年
 * @param month 取得対象の月
 * @param master プロジェクト名などのマスタデータ
 * @return Promise<AttendanceMonthlyAPI>
 */
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

/**
 * サーバへ月間勤怠データを保存します
 * 指定された年月の複数日データを同時に更新することが可能
 *
 * @param year 更新対象の年
 * @param month 更新対象の月
 * @param attendances 更新データ(日ごと)
 * @return Promise<ResultStatus> 更新結果
 */
export const saveMonthlyAttendances =
  async (year: number, month: number, attendances: Array<Partial<AttendanceDaily>>): Promise<ResultStatus> => {

    if (attendances.length === 0) {
      return Promise.resolve({status: Status.OK, message: "There was no update."})
    }

    // データ形式をクライアント形式からサーバ形式へ変換
    const attendancesOnServer =
      attendances
        .map(clientToServer)
        .map((a: AttendanceOnServer) => {
          // サーバAPI用に送信パラメータを整形
          a.day = a.day.toString().padStart(2, "0") // 3 => "03"
          a.from = a.from.replace(":", "") // "09:00" => "0900"
          a.to = a.to.replace(":", "") // 上記fromと同じ
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
export const getMonthlyDates = async (year: number, month: number): Promise<boolean> => {
  const htmlRes = await post(urls.ATTENDANCE_EDIT, {year, month})
  const res = convAttendanceCalendar(htmlRes)
  return res
}

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
 * 指定された造成のみ更新します
 *
 * @param patch 更新パ属性のみの出勤データ
 * @return 更新結果
 */
export const patchSettings = async (patch: Partial<AttendanceSettings>): Promise<ResultStatus> =>
  Promise.resolve(getSettings())
    .then(currentSettings => ({ ...currentSettings, ...patch }))
    .then(nextSettings => localStorage.setItem(LS_ATTND_SETTINGS, JSON.stringify(nextSettings)))
    .then(_ => ({
      status: Status.OK,
      message: "勤怠設定の保存が完了しました",
    }))
