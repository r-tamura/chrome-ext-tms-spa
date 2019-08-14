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
    changeMonth: compose(
      thunkDispatch,
      changeMonth
    ),
    submitApplication: compose(
      thunkDispatch,
      submitApplication
    )
  };
}
