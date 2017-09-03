import { Action, Dispatch, combineReducers } from "redux"
import attendanceDailiies, { RootState } from "~/modules"
import { isMonthly, createMonthlyId } from "./utils"
import dailies, * as fromDailies from "./dailies"
import monthlies, * as fromMonthlies from "./monthlies"
import settings, * as fromSettings from "./settings"
import { ActionTypes } from "./actiontypes"
import { composeAsync } from "~/helpers/common"
import { AttendanceMonthly, AttendanceMonthlyView } from "~/types"
import { AttendanceAction } from "./actions"

/**
 * State
 */
export type AttendanceSelectState = {
  selectedYear: number,
  selectedMonth: number,
}

export type AttendanceState = {
  yearAndMonth: AttendanceSelectState,
  dailies: fromDailies.AttendanceDailiesState,
  monthlies: fromMonthlies.AttendanceMonthliesState,
  settings: fromSettings.Settings,
}

/**
 * Reducer
 */
function yearAndMonth(
  state: AttendanceSelectState = { selectedYear: 2017, selectedMonth: 8 },
  action: AttendanceAction,
): AttendanceSelectState {
  switch (action.type) {
    case ActionTypes.SET_MONTH: {
      const { year, month } = action
      return { selectedYear: year, selectedMonth: month }
    }
    default:
      return state
  }
}

export * from "./monthlies"
export * from "./dailies"
export * from "./settings"
export * from "./actions"
export * from "./selectors"
export * from "./utils"
export default combineReducers({
  yearAndMonth,
  dailies,
  monthlies,
  settings,
})
