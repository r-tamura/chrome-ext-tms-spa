import { AttendanceDaily } from "~/types"
import { AttendanceAction } from "./actions"
import { ActionTypes } from "./actiontypes"

export type Settings = Partial<AttendanceDaily>

/**
 * Selectors
 */
export const getSettings = (state: Settings) => state

/**
 * Reducers
 */
const initialState = {
  start: "09:00",
  end: "17:30",
}

const settings = (state: Settings = initialState, action: AttendanceAction): Settings => {
  switch (action.type) {
  case ActionTypes.FETCH_SETTINGS_SUCCESS:
    return { ...state, ...action.settings }
  case ActionTypes.PATCH_SETTINGS_SUCCESS:
    return { ...state, ...action.patch }
  default:
    return state
  }
}

export default settings
