import { combineReducers, Action, Dispatch } from "redux"
import { pluck } from "ramda"
import { createMonthlyId } from "./utils"
import { AttendanceAction } from "./actions"
import { ActionTypes } from "./actiontypes"
import { ATD_YEAR, ATD_MONTH } from "~/helpers/_const"
import { AttendanceMonthly, AttendanceMonthlyView } from "~/types"

type ById = { [s: string]: AttendanceMonthly }
type AllIds = string[]

/**
 * State
 */
export type AttendanceMonthliesState =  {
  byId: ById,
  allIds: AllIds,
}

/**
 * Selectors
 */
type S = AttendanceMonthliesState
export function getMonthly(state: S, monthlyId: string): AttendanceMonthly
export function getMonthly(state: S, year: number, month: number): AttendanceMonthly
export function getMonthly(state: S, arg1: number | string, arg2?: number): AttendanceMonthly {
  if (typeof arg1 === "string") {
    const monthlyId = arg1
    return state.byId[monthlyId]
  }

  return state.byId[createMonthlyId(arg1, arg2)] || initialMonthly
}

/**
 * Reducer
 */
const initialMonthly: AttendanceMonthly = {
  monthlyId: "",
  reportId: "",
  days: [],
  hasApplied: false,
  year: ATD_YEAR,
  month: ATD_MONTH,
}

const monthly = (state: AttendanceMonthly, action: AttendanceAction): AttendanceMonthly => {
  switch (action.type) {
    case ActionTypes.FETCH_REQUEST:
    case ActionTypes.FETCH_FAILURE:
      return { ...state, isFetching: action.isFetching }
    case ActionTypes.SUBMIT_APPLICATION_REQUEST:
    case ActionTypes.SUBMIT_APPLICATION_OK:
    case ActionTypes.SUBMIT_APPLICATION_NG:
      return { ...state, isFetching: action.payload.isFetching }
    case ActionTypes.FETCH_SUCCESS: {
      const { attendanceMonthlyResponse, type, ...otherActionProps } = action
      const { days, ...otherMonthlyProps } = attendanceMonthlyResponse
      return { ...state, ...otherActionProps, ...otherMonthlyProps, days: pluck<string>("dailyId", days) }
    }
    default:
    return state
  }
}

const byId = (state: ById = {}, action: AttendanceAction) => {
  switch (action.type) {
    case ActionTypes.FETCH_REQUEST:
    case ActionTypes.FETCH_FAILURE:
      return { ...state, [action.monthlyId]: monthly(state[action.monthlyId], action) }
    case ActionTypes.SUBMIT_APPLICATION_REQUEST:
    case ActionTypes.SUBMIT_APPLICATION_OK:
    case ActionTypes.SUBMIT_APPLICATION_NG:
      return { ...state, [action.payload.monthlyId]: monthly(state[action.payload.monthlyId], action)}
    case ActionTypes.FETCH_SUCCESS:
      const { monthlyId } = action.attendanceMonthlyResponse
      return { ...state, [monthlyId]: monthly(state[monthlyId], action) }
    default:
      return state
    }
}

const allIds = (state: AllIds = [], action: AttendanceAction) => {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS: {
      const { monthlyId } = action.attendanceMonthlyResponse
      return [ ...state, monthlyId ]
    }
    default:
      return state
    }
}

export default combineReducers({
  byId,
  allIds,
})
