import { Action, Dispatch, combineReducers } from "redux"
import attendanceDailiies, { RootState } from "~/modules"
import { isMonthly, createMonthlyId } from "./utils"
import { AttendanceState } from "~/modules/attendances"
import dailies, * as fromDailies from "./dailies"
import monthlies, * as fromMonthlies from "./monthlies"
import { composeAsync } from "~/helpers/common"
import { AttendanceMonthly, AttendanceMonthlyView } from "~/types"
import { AttendanceAction } from "./actions"
import { ActionTypes } from "./actiontypes"

/**
 * Selectors
 */
type S = AttendanceState
export const getYear = (state: S): number => state.yearAndMonth.selectedYear
export const getMonth = (state: S): number => state.yearAndMonth.selectedMonth
const getMonthly = (state: S, year: number, month: number): AttendanceMonthly =>
  fromMonthlies.getMonthly(state.monthlies, year, month)
export const getMonthlyId = (state: S): { year: number, month: number, monthlyId: string } => {
  const year = getYear(state)
  const month = getMonth(state)
  return { year, month, monthlyId: createMonthlyId(year, month) }
}

export const getAttendancesSelectedMonth = (state: S) => {
  const { year, month } = getMonthlyId(state)
  const monthly = getMonthly(state, year, month)

  if (!monthly) {
    return { monthlyId: "", reportId: "", days: [], year, month }
  }

  if (!monthly.days) {
    return { ...monthly, days: [] }
  }

  const attendancesMonthly = monthly.days.map(id => fromDailies.getAttendanceDayly(state.dailies, id))
  return { ...monthly, days: attendancesMonthly }
}
