import { useSelector } from "react-redux";
import {
  RootState,
  getAttendanceSettings,
  getProjects,
  getAttendancesSelectedMonth
} from "~/modules";
import { useEffect } from "react";
import {
  fetchSettings,
  fetchAttendancesIfNeeded,
  updateDaily,
  setMonthlyWithDefaults,
  updateSettings,
  changeMonth,
  submitApplication,
  saveAttendancesIfNeeded
} from "~/modules/attendances";
import { useThunkDispatch } from "./useThunkDispatcher";
import { compose } from "redux";
import { addMonths } from "date-fns";

export function useAttendance() {
  const state = useSelector((state: RootState) => ({
    attendanceSettings: getAttendanceSettings(state),
    projects: getProjects(state),
    attendanceMonthly: getAttendancesSelectedMonth(state)
  }));
  const thunkDispatch = useThunkDispatch();

  useEffect(() => {
    thunkDispatch(fetchSettings());
    thunkDispatch(fetchAttendancesIfNeeded());
  }, [thunkDispatch]);

  function _addMonths(amount: number) {
    let { year, month } = state.attendanceMonthly;
    return addMonths(new Date(year, month), amount);
  }

  function nextMonth() {
    const date = _addMonths(1);
    dispatchChangeMonth(date.getFullYear(), date.getMonth());
  }

  function prevMonth() {
    const date = _addMonths(-1);
    dispatchChangeMonth(date.getFullYear(), date.getMonth());
  }

  const dispatchChangeMonth = compose(
    thunkDispatch,
    changeMonth
  );

  return {
    ...state,
    fetchAttendances: compose(
      thunkDispatch,
      fetchAttendancesIfNeeded
    ),
    fetchSettings: compose(
      thunkDispatch,
      fetchSettings
    ),
    saveAttendances: compose(
      thunkDispatch,
      saveAttendancesIfNeeded
    ),
    updateDaily: compose(
      thunkDispatch,
      updateDaily
    ),
    setMonthlyWithDefaults: compose(
      thunkDispatch,
      setMonthlyWithDefaults
    ),
    updateSettings: compose(
      thunkDispatch,
      updateSettings
    ),
    changeMonth: dispatchChangeMonth,
    submitApplication: compose(
      thunkDispatch,
      submitApplication
    ),
    nextMonth,
    prevMonth
  };
}
