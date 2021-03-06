import { pluck } from "ramda";
import { combineReducers } from "redux";
import { RootState } from "~/modules";
import { AttendanceAction } from "./actions";
import { ActionTypes } from "./actiontypes";
import { aryOfObjToObj } from "~/helpers/common";
import { AttendanceDaily } from "~/types";

type ById = { [s: string]: AttendanceDaily };
type AllIds = string[];

/**
 * State
 */
export type AttendanceDailiesState = {
  byId: ById;
  allIds: AllIds;
};

const initialState: AttendanceDailiesState = {
  byId: {},
  allIds: []
};

/**
 * Selectors
 */
type S = AttendanceDailiesState;
export const getAttendanceDayly = (
  state: S,
  daylyId: string
): AttendanceDaily => state.byId[daylyId];

function daily(
  state: AttendanceDaily,
  action: AttendanceAction
): AttendanceDaily {
  switch (action.type) {
    case ActionTypes.DAILIES_UPDATE:
      return { ...state, ...action.dailyItem, hasUpdated: true };
    case ActionTypes.SET_MONTHLY_DEFAULTS: {
      // 休日 or 承認済みの場合は更新しない
      return !state.isWeekday || state.hasConfirmed
        ? state
        : { ...state, ...action.defaultDaily, hasUpdated: true };
    }
    default:
      return state;
  }
}

/**
 * Reducer
 */
function byId(state: ById = {}, action: AttendanceAction): ById {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS: {
      const { days } = action.attendanceMonthlyResponse;
      return {
        ...state,
        ...aryOfObjToObj("dailyId", days)
      };
    }
    case ActionTypes.DAILIES_UPDATE: {
      const { dailyId } = action;
      return { ...state, [dailyId]: daily(state[dailyId], action) };
    }
    case ActionTypes.SET_MONTHLY_DEFAULTS: {
      const nextStates = action.ids.reduce(
        (acc: { [s: string]: AttendanceDaily }, v) => {
          acc[v] = daily(state[v], action);
          return acc;
        },
        {}
      );
      return { ...state, ...nextStates };
    }
    default:
      return state;
  }
}

function allIds(state: AllIds = [], action: AttendanceAction): AllIds {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS: {
      const view = action.attendanceMonthlyResponse;
      const days = view.days;
      return [...state, ...pluck("dailyId", days)];
    }
    default:
      return state;
  }
}

export default combineReducers<AttendanceDailiesState>({
  byId,
  allIds
});
