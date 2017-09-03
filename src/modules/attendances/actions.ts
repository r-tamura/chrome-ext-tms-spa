import { Action, Dispatch } from "redux"
import { RootState } from "~/modules"
import dailies, * as fromDailies from "./dailies"
import monthlies, * as fromMonthlies from "./monthlies"
import { createMonthlyId, hasUpdated } from "./utils"
import { ActionTypes } from "./actiontypes"
import {
  fetchMonthlyAttendance,
  saveMonthlyAttendances,
  getSettings,
  patchSettings,
} from "~/api/attendance"
import { composeAsync } from "~/helpers/common"
import {
  AttendanceMonthly,
  AttendanceMonthlyAPI,
  AttendanceDaily,
  AttendanceSettings,
} from "~/types"
/**
 * Actions
 */

interface IAttendanceMonthliesFetchRequest extends Action {
  type: ActionTypes.FETCH_REQUEST
  monthlyId: string
  isFetching: boolean
}

interface IAttendanceMonthliesFetchSuccess extends Action {
  type: ActionTypes.FETCH_SUCCESS
  attendanceMonthlyResponse: AttendanceMonthlyAPI
  isFetching: boolean
  lastUpdatedOn: number
}

interface IAttendanceMonthliesFetchFailure extends Action {
  type: ActionTypes.FETCH_FAILURE
  monthlyId: string
  isFetching: boolean
}

interface AttendanceSaveRequestAction extends Action {
  type: ActionTypes.SAVE_REQUEST
  monthlyAPI: AttendanceMonthlyAPI
  isFetching: boolean
}

interface AttendanceSaveSuccessAction extends Action {
  type: ActionTypes.SAVE_SUCCESS
  attendanceMonthlyResponse: AttendanceMonthlyAPI
  isFetching: boolean
}

interface AttendanceSaveFailureAction extends Action {
  type: ActionTypes.SAVE_FAILURE
  monthlyId: string
  isFetching: boolean
}

interface SetMonthAction extends Action {
  type: ActionTypes.SET_MONTH
  year: number
  month: number
}

interface DailyUpdateAction extends Action {
  type: ActionTypes.DAILIES_UPDATE
  dailyId: string
  dailyItem: Partial<AttendanceDaily>
}

interface FetchSettingsSuccessAction extends Action {
  type: ActionTypes.FETCH_SETTINGS_SUCCESS
  settings: AttendanceSettings
}

interface PatchSettingsSuccessAction extends Action {
  type: ActionTypes.PATCH_SETTINGS_SUCCESS
  patch: Partial<AttendanceSettings>
}

interface MonthlySetDefaultAction extends Action {
  type: ActionTypes.SET_MONTHLY_DEFAULTS
  defaultDaily: Partial<AttendanceDaily>
  ids: string[]
}

/**
 * Actions Creators
 */

/**
 * 月間勤怠をサーバから読み込むかを判定します
 *
 * @param state
 * @param monthlyId 月勤怠ID
 * @return {boolean} true: フェッチを行うべき false: キャッシュを利用するべき
 */
const shouldFetchAttendances = (state: any, monthlyId: string): boolean => {
  const monthly = fromMonthlies.getMonthly(state.monthlies, monthlyId)
  if (!monthly) {
    return true
  }

  if (monthly.isFetching) {
    // ロード中の場合はフェッチしない
    return false
  }

  if (
    monthly
      .days
      .filter(dayId => fromDailies.getAttendanceDayly(state.dailies, dayId).hasUpdated)
      .length > 0
  ) {
    // 前回フェッチ後、変更がない場合はフェッチを実行
    return true
  }

  if (Date.now() - monthly.lastUpdatedOn > 300000) {
    // 前回フェッチしてから5分以上経過している場合はフェッチを実行
    return true
  }

  return false
}

const shouldSaveAttendances = (state: any, monthlyId: string): boolean => {
  return true
}

const fetchAttendances = (year: number, month: number) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const { master } = getState()
    const monthlyId = createMonthlyId(year, month)
    dispatch(fetchAttendanceMonthliesRequest(monthlyId))
    try {
      composeAsync(
        dispatch,
        fetchAttendanceMonthliesSuccess,
        fetchMonthlyAttendance,
      )(year, month, master)
    } catch (err) {
      dispatch(fetchAttendanceMonthliesFailure(monthlyId))
    }
  }

export const fetchAttendancesIfNeeded = () =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const { attendances } = getState()
    const year = attendances.yearAndMonth.selectedYear
    const month = attendances.yearAndMonth.selectedMonth
    if (shouldFetchAttendances(attendances, createMonthlyId(year, month))) {
      dispatch(fetchAttendances(year, month))
    }
  }
const getAttendancesSelectedMonth = (state: any) => {
  const year = state.yearAndMonth.selectedYear
  const month = state.yearAndMonth.selectedMonth
  const monthly = state.monthlies.byId[createMonthlyId(year, month)]

  const attendancesMonthly = monthly.days.map((id: string) => fromDailies.getAttendanceDayly(state.dailies, id))
  return { ...monthly, days: attendancesMonthly }
}
const saveAttendances = (year: number, month: number, monthly: AttendanceMonthlyAPI) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const monthlyId = createMonthlyId(year, month)
    dispatch(saveAttendanceMonthlyRequest(monthlyId, monthly))
    try {
      composeAsync(
        dispatch,
        saveAttendanceMonthlySuccess,
        saveMonthlyAttendances,
      )(year, month, monthly.days.filter(hasUpdated))
    } catch (err) {
      dispatch(saveAttendanceMonthlyFailure(monthlyId))
    }
  }

export const saveAttendancesIfNeeded = () =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const { attendances: state } = getState()
    const year = state.yearAndMonth.selectedYear
    const month = state.yearAndMonth.selectedMonth
    const monthlyId = createMonthlyId(year, month)
    const monthlyAPI = getAttendancesSelectedMonth(state)
    if (shouldSaveAttendances(state, monthlyId)) {
      dispatch(saveAttendances(year, month, monthlyAPI))
    }
  }

export const changeMonth = (year: number, month: number) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const monthlyId = createMonthlyId(year, month)
    dispatch(setYearAndMonth(year, month))
    fetchAttendancesIfNeeded()(dispatch, getState)
  }

export const fetchAttendanceMonthliesRequest = (monthlyId: string) => ({
  type: ActionTypes.FETCH_REQUEST,
  monthlyId,
  isFetching: true,
})

export const fetchAttendanceMonthliesSuccess = (attendanceMonthlyResponse: AttendanceMonthlyAPI) => {
  return {
    type: ActionTypes.FETCH_SUCCESS,
    attendanceMonthlyResponse,
    isFetching: false,
    lastUpdatedOn: Date.now(),
  }
}

export const fetchAttendanceMonthliesFailure = (monthlyId: string) => ({
  type: ActionTypes.FETCH_FAILURE,
  monthlyId,
  isFetching: false,
})

export const saveAttendanceMonthlyRequest = (monthlyId: string, monthly: AttendanceMonthlyAPI) => ({
  type: ActionTypes.SAVE_REQUEST,
  monthlyId,
  isFetching: true,
})

export const saveAttendanceMonthlySuccess = (attendanceMonthlyResponse: AttendanceMonthlyAPI) => {
  return {
    type: ActionTypes.SAVE_SUCCESS,
    attendanceMonthlyResponse,
    isFetching: false,
  }
}

export const saveAttendanceMonthlyFailure = (monthlyId: string) => ({
  type: ActionTypes.SAVE_FAILURE,
  monthlyId,
  isFetching: false,
})

export const setYearAndMonth = (year: number, month: number): SetMonthAction => ({
  type: ActionTypes.SET_MONTH,
  year,
  month,
})

export const updateDaily = (dailyId: string, dailyItem: Partial<AttendanceDaily>): DailyUpdateAction => ({
  type: ActionTypes.DAILIES_UPDATE,
  dailyId,
  dailyItem,
})

export const fetchSettings = () =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const { attendances } = getState()
    getSettings()
      .then(settings => fetchSettingsSuccess(settings, attendances.dailies.allIds))
      .then(action => dispatch(action))
  }

export const fetchSettingsSuccess = (settings: AttendanceSettings, Ids: string[]):
  FetchSettingsSuccessAction => ({
  type: ActionTypes.FETCH_SETTINGS_SUCCESS,
  settings,
})

export const updateSettings = (patch: Partial<AttendanceSettings>) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    composeAsync(
      () => fetchSettings()(dispatch, getState),
      dispatch,
      updateSettingsSuccess,
      patchSettings,
    )(patch)
  }

export const updateSettingsSuccess = (patch: Partial<AttendanceDaily>) => ({
  type: ActionTypes.PATCH_SETTINGS_SUCCESS,
})

export const setMonthlyWithDefaults = (ids: string[]) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const { settings } = getState().attendances
    dispatch({
      type: ActionTypes.SET_MONTHLY_DEFAULTS,
      defaultDaily: settings,
      ids,
    })
  }

export type AttendanceAction =
    SetMonthAction
  | IAttendanceMonthliesFetchRequest
  | IAttendanceMonthliesFetchSuccess
  | IAttendanceMonthliesFetchFailure
  | DailyUpdateAction
  | FetchSettingsSuccessAction
  | MonthlySetDefaultAction
  | PatchSettingsSuccessAction
