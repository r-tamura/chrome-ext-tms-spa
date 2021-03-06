import { combineReducers } from "redux";
import dailies, * as fromDailies from "./dailies";
import monthlies, * as fromMonthlies from "./monthlies";
import settings, * as fromSettings from "./settings";
import { ActionTypes } from "./actiontypes";
import { AttendanceAction } from "./actions";

/**
 * State
 */
export type AttendanceSelectState = {
  selectedYear: number;
  selectedMonth: number;
};

export type AttendanceState = {
  yearAndMonth: AttendanceSelectState;
  dailies: fromDailies.AttendanceDailiesState;
  monthlies: fromMonthlies.AttendanceMonthliesState;
  settings: fromSettings.Settings;
};

/**
 * Reducer
 * @param state デフォルト: 現在現在年月
 * @param action
 */
const now = new Date();
function yearAndMonth(
  state: AttendanceSelectState = {
    selectedYear: now.getFullYear(),
    selectedMonth: now.getMonth() + 1
  },
  action: AttendanceAction
): AttendanceSelectState {
  switch (action.type) {
    case ActionTypes.SET_MONTH: {
      const { year, month } = action;
      return { selectedYear: year, selectedMonth: month };
    }
    default:
      return state;
  }
}

export * from "./monthlies";
export * from "./dailies";
export * from "./settings";
export * from "./actions";
export * from "./selectors";
export * from "./utils";
export { yearAndMonth };
export default combineReducers({
  yearAndMonth,
  dailies,
  monthlies,
  settings
});
