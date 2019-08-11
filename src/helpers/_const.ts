//
// 定数定義ファイル
//

// Debug mode
export const DEBUG = true;

// Application version
export const APPVERSION = "0.0.1";

// Media Query Break Point (css側 _variables.scss と一致されるようにすること)
export const MEDIA_BREAKPOINTS = {
  xs: "(max-width: 480px)",
  sm: "(max-width: 768px)",
  md: "(max-width: 992px)",
  lg: "(max-width: 1200px)"
};

// アラートの表示時間(ms)
export const ALERT_DURATION_TIME = 2000;
export const ALERT_DURATION_TIME_LONG = 3000;

// URLリスト
const URL_TMS_ROOT = "http://telema.jp/tmskin/";
export const urls = {
  URL_TMS_ROOT,
  TMSX_MENU: "/tmskin/T0010_menu.php",
  TRANS_ESPENSE: "/tmskin/T1020_transport.php",
  TRANS_EXPENSE_REGISTER: "/tmskin/T1025_transport_db.php",
  TMSX_ATTENDANCE_PREVIEW: "/tmskin/T2022_it_report_preview.php",
  TC_DELETE: "/tmskin/T1023_transport_delete.php",
  ATTENDANCE_REPORT: "/tmskin/T2020_it_report.php",
  ATTENDANCE_EDIT: "/tmskin/T2025_it_report_db.php",
  ATTENDANCE_APPLY: "/tmskin/T2023_it_report_apply.php"
};

// 貨幣フォーマッター
export const CURRENCY = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "JPY"
});

// navに表示するリンク一覧
export const LINKS = [
  { id: 1, displayName: "交通費" },
  { id: 2, displayName: "勤怠登録" },
  { id: 3, displayName: "資源管理", disabled: true }
];

// ローカルストレージキー
export const LS_TRANS_EXPENSE_TEMPLATE = "ls/transpexpensetemplate";
export const LS_ATTND_SETTINGS = "ls/attendancesettings";

// 初期勤怠年月
export const ATD_YEAR = 2017;
export const ATD_MONTH = 8;

export enum MsgAttendance {
  HAS_SUBMITED = "承認",
  NOT_SUBMITED = ""
}
