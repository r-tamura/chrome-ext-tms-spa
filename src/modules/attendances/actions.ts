import { Action, Dispatch, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootState } from "~/modules";
import * as fromDailies from "./dailies";
import * as fromMonthlies from "./monthlies";
import { createMonthlyId, hasUpdated } from "./utils";
import { ActionTypes } from "./actiontypes";
import * as Api from "~/api/attendance";
import { composeAsync } from "~/helpers/common";
import {
  AttendanceMonthlyAPI,
  AttendanceDaily,
  AttendanceSettings,
  ResultStatus,
  SubmitApplicationReqestPayload,
  SubmitApplicationOkPayload,
  SubmitApplicationNgPayload
} from "~/types";

/**
 * Actions
 */
interface FetchRequestAction extends Action {
  type: ActionTypes.FETCH_REQUEST;
  monthlyId: string;
  isFetching: boolean;
}
interface FetchSuccessAction extends Action {
  type: ActionTypes.FETCH_SUCCESS;
  attendanceMonthlyResponse: AttendanceMonthlyAPI;
  isFetching: boolean;
  lastUpdatedOn: number;
}
interface FetchFailureAction extends Action {
  type: ActionTypes.FETCH_FAILURE;
  monthlyId: string;
  isFetching: boolean;
}

interface SaveRequestAction extends Action {
  type: ActionTypes.SAVE_REQUEST;
  monthlyAttendances: AttendanceMonthlyAPI;
  isFetching: boolean;
}
interface SaveSuccessAction extends Action {
  type: ActionTypes.SAVE_SUCCESS;
  attendanceMonthlyResponse: AttendanceMonthlyAPI;
  isFetching: boolean;
}
interface SaveFailureAction extends Action {
  type: ActionTypes.SAVE_FAILURE;
  monthlyId: string;
  isFetching: boolean;
}

interface SetMonthAction extends Action {
  type: ActionTypes.SET_MONTH;
  year: number;
  month: number;
}

interface DailyUpdateAction extends Action {
  type: ActionTypes.DAILIES_UPDATE;
  dailyId: string;
  dailyItem: Partial<AttendanceDaily>;
}

interface FetchSettingsSuccessAction extends Action {
  type: ActionTypes.FETCH_SETTINGS_SUCCESS;
  settings: AttendanceSettings;
}

interface PatchSettingsSuccessAction extends Action {
  type: ActionTypes.PATCH_SETTINGS_SUCCESS;
  patch: Partial<AttendanceSettings>;
}

interface MonthlySetDefaultAction extends Action {
  type: ActionTypes.SET_MONTHLY_DEFAULTS;
  defaultDaily: Partial<AttendanceDaily>;
  ids: string[];
}

interface SubmitApplicationRequestAction extends Action {
  type: ActionTypes.SUBMIT_APPLICATION_REQUEST;
  payload: SubmitApplicationReqestPayload;
}

interface SubmitApplicationOkAction extends Action {
  type: ActionTypes.SUBMIT_APPLICATION_OK;
  payload: SubmitApplicationOkPayload;
}

interface SubmitApplicationNgAction extends Action {
  type: ActionTypes.SUBMIT_APPLICATION_NG;
  payload: SubmitApplicationNgPayload;
  error: boolean;
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
  const monthly = fromMonthlies.getMonthly(state.monthlies, monthlyId);
  if (!monthly) {
    return true;
  }

  if (monthly.isFetching) {
    // ロード中の場合はフェッチしない
    return false;
  }

  if (
    monthly.days.filter(
      dayId => fromDailies.getAttendanceDayly(state.dailies, dayId).hasUpdated
    ).length > 0
  ) {
    // 前回フェッチ後、変更がない場合はフェッチを実行
    return true;
  }

  if (Date.now() - monthly.lastUpdatedOn > 300000) {
    // 前回フェッチしてから5分以上経過している場合はフェッチを実行
    return true;
  }

  return false;
};

const shouldSaveAttendances = (state: any, monthlyId: string): boolean => {
  return true;
};

export const fetchAttendances = (year: number, month: number) => async (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  const { master } = getState();
  const monthlyId = createMonthlyId(year, month);
  dispatch(fetchAttendanceMonthliesRequest(monthlyId));
  try {
    const fetching = Api.fetchMonthlyAttendance(year, month, master);
    const gettingHasApplied = Api.fetchHasApplied(year, month);
    const [monthlyAttendances, hasApplied] = await Promise.all([
      fetching,
      gettingHasApplied
    ]);
    dispatch(
      fetchAttendanceMonthliesSuccess({ ...monthlyAttendances, hasApplied })
    );
  } catch (err) {
    dispatch(fetchAttendanceMonthliesFailure(monthlyId));
  }
};

export const fetchAttendancesIfNeeded = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
) => {
  const { attendances } = getState();
  const year = attendances.yearAndMonth.selectedYear;
  const month = attendances.yearAndMonth.selectedMonth;
  if (shouldFetchAttendances(attendances, createMonthlyId(year, month))) {
    dispatch(fetchAttendances(year, month));
  }
};

const getAttendancesSelectedMonth = (state: any) => {
  const year = state.yearAndMonth.selectedYear;
  const month = state.yearAndMonth.selectedMonth;
  const monthly = state.monthlies.byId[createMonthlyId(year, month)];

  const attendancesMonthly = monthly.days.map((id: string) =>
    fromDailies.getAttendanceDayly(state.dailies, id)
  );
  return { ...monthly, days: attendancesMonthly };
};
const saveAttendances = (
  year: number,
  month: number,
  monthly: AttendanceMonthlyAPI
): ThunkAction<Promise<void>, RootState, undefined, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {
  const monthlyId = createMonthlyId(year, month);
  dispatch(saveAttendanceMonthlyRequest(monthlyId));
  try {
    const json = await Api.saveMonthlyAttendances(
      year,
      month,
      monthly.days.filter(hasUpdated)
    );
    dispatch(saveAttendanceMonthlySuccess(json));
  } catch (err) {
    dispatch(saveAttendanceMonthlyFailure(monthlyId));
  }
};

export const saveAttendancesIfNeeded = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
) => {
  const { attendances: state } = getState();
  const year = state.yearAndMonth.selectedYear;
  const month = state.yearAndMonth.selectedMonth;
  const monthlyId = createMonthlyId(year, month);
  const monthlyAttendances = getAttendancesSelectedMonth(state);
  if (shouldSaveAttendances(state, monthlyId)) {
    dispatch(saveAttendances(year, month, monthlyAttendances));
  }
};

export const changeMonth = (year: number, month: number) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  // const monthlyId = createMonthlyId(year, month);
  dispatch(setYearAndMonth(year, month));
  fetchAttendancesIfNeeded()(dispatch, getState);
};

export const fetchAttendanceMonthliesRequest = (monthlyId: string) => ({
  type: ActionTypes.FETCH_REQUEST,
  monthlyId,
  isFetching: true
});

export const fetchAttendanceMonthliesSuccess = (
  attendanceMonthlyResponse: AttendanceMonthlyAPI
) => {
  return {
    type: ActionTypes.FETCH_SUCCESS,
    attendanceMonthlyResponse,
    isFetching: false,
    lastUpdatedOn: Date.now()
  };
};

export const fetchAttendanceMonthliesFailure = (monthlyId: string) => ({
  type: ActionTypes.FETCH_FAILURE,
  monthlyId,
  isFetching: false
});

export const saveAttendanceMonthlyRequest = (monthlyId: string) => ({
  type: ActionTypes.SAVE_REQUEST,
  monthlyId,
  isFetching: true
});

export const saveAttendanceMonthlySuccess = (status: ResultStatus) => {
  return {
    type: ActionTypes.SAVE_SUCCESS,
    isFetching: false
  };
};

export const saveAttendanceMonthlyFailure = (monthlyId: string) => ({
  type: ActionTypes.SAVE_FAILURE,
  monthlyId,
  isFetching: false
});

export const setYearAndMonth = (
  year: number,
  month: number
): SetMonthAction => ({
  type: ActionTypes.SET_MONTH,
  year,
  month
});

export const updateDaily = (
  dailyId: string,
  dailyItem: Partial<AttendanceDaily>
): DailyUpdateAction => ({
  type: ActionTypes.DAILIES_UPDATE,
  dailyId,
  dailyItem
});

export const fetchSettings = () => (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  const { attendances } = getState();
  Api.getSettings()
    .then(settings =>
      fetchSettingsSuccess(settings, attendances.dailies.allIds)
    )
    .then(action => dispatch(action));
};

export const fetchSettingsSuccess = (
  settings: AttendanceSettings,
  Ids: string[]
): FetchSettingsSuccessAction => ({
  type: ActionTypes.FETCH_SETTINGS_SUCCESS,
  settings
});

export const updateSettings = (patch: Partial<AttendanceSettings>) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  composeAsync(
    () => fetchSettings()(dispatch, getState),
    dispatch,
    updateSettingsSuccess,
    Api.patchSettings
  )(patch);
};

export const updateSettingsSuccess = (patch: Partial<AttendanceSettings>) => ({
  type: ActionTypes.PATCH_SETTINGS_SUCCESS
});

export const setMonthlyWithDefaults = (ids: string[]) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  const { settings } = getState().attendances;
  dispatch({
    type: ActionTypes.SET_MONTHLY_DEFAULTS,
    defaultDaily: settings,
    ids
  });
};

const submitApplicationRequest = (
  payload: SubmitApplicationReqestPayload,
  meta = {}
): SubmitApplicationRequestAction => ({
  type: ActionTypes.SUBMIT_APPLICATION_REQUEST,
  payload
});

const submitApplicationOk = (
  payload: SubmitApplicationOkPayload,
  meta = {}
): SubmitApplicationOkAction => ({
  type: ActionTypes.SUBMIT_APPLICATION_OK,
  payload
});

const submitApplicationNg = (
  payload: SubmitApplicationNgPayload,
  meta = {}
): SubmitApplicationNgAction => ({
  type: ActionTypes.SUBMIT_APPLICATION_NG,
  payload,
  error: true
});

const submitApplication = (year: number, month: number) => async (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  const monthlyId = createMonthlyId(year, month);
  dispatch(submitApplicationRequest({ monthlyId, isFetching: true }));
  try {
    await Api.submitApplication(year, month);
    dispatch(
      submitApplicationOk({ message: "Success", monthlyId, isFetching: false })
    );
  } catch (e) {
    dispatch(
      submitApplicationNg({
        message: "Not Found",
        monthlyId,
        isFetching: false
      })
    );
  }
};

type AttendanceAction =
  | SetMonthAction
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | DailyUpdateAction
  | FetchSettingsSuccessAction
  | MonthlySetDefaultAction
  | PatchSettingsSuccessAction
  | SubmitApplicationRequestAction
  | SubmitApplicationOkAction
  | SubmitApplicationNgAction;

export {
  AttendanceAction,
  SubmitApplicationRequestAction,
  SubmitApplicationOkAction,
  SubmitApplicationNgAction,
  submitApplication
};
