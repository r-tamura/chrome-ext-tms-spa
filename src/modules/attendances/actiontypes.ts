export enum ActionTypes {
  SET_MONTH                  = "attendances/changemonth",
  FETCH_REQUEST              = "attendances/fetchmonthlyrequest",
  FETCH_SUCCESS              = "attendances/fetchmonthlysuccess",
  FETCH_FAILURE              = "attendances/fetchmonthlyfailure",
  SAVE_REQUEST               = "attendances/savemonthlyrequest",
  SAVE_SUCCESS               = "attendances/savemonthlysuccess",
  SAVE_FAILURE               = "attendances/savemonthlyfailure",
  DAILIES_UPDATE             = "attendances/updatedailies",
  FETCH_SETTINGS_SUCCESS     = "attendances/fetchsettingssucess",
  SET_MONTHLY_DEFAULTS       = "attendances/setmonthlydefaults",
  PATCH_SETTINGS_SUCCESS     = "attendances/patchsettingssuccess",
}
