import { Project, ApiResponse } from "~/types";

interface AttendanceDailyBase {
  dailyId: string; // yyyymmdd
  day: number;
  isWeekday: boolean;
  start: string;
  end: string;
  overwork: string;
  overnightwork: string;
  hasConfirmed: boolean;
  hasUpdated?: boolean; // クライアントでデータ更新があったか
}

interface AttendanceDaily extends AttendanceDailyBase {
  projectId: string;
}

interface AttendanceDailyView extends AttendanceDailyBase {
  project: Project;
}

interface AttendanceMonthlyBase {
  monthlyId: string;
  reportId: string;
  year: number;
  month: number;
  hasApplied?: boolean;
  total?: number;
  isFetching?: boolean;
  lastUpdatedOn?: number;
}

interface AttendanceMonthly extends AttendanceMonthlyBase {
  days: string[];
}

interface AttendanceMonthlyAPI extends AttendanceMonthlyBase {
  days: AttendanceDaily[];
}

interface AttendanceMonthlyView extends AttendanceMonthlyBase {
  days: AttendanceDailyView[];
}

/* APIリクエスト送信の形式 */
interface AttendanceOnServer {
  pjcd: string;
  from: string;
  to: string;
  year: string;
  month: string;
  day: string;
}

type AttendanceSettings = Partial<AttendanceDaily>;

interface SubmitApplicationReqestPayload {
  monthlyId: string;
  isFetching: boolean;
}

interface SubmitApplicationOkPayload {
  monthlyId: string;
  message: string;
  isFetching: boolean;
}

interface SubmitApplicationNgPayload {
  monthlyId: string;
  message: string;
  isFetching: boolean;
}

/* API Response */
interface SummaryResponse extends ApiResponse {
  body: {
    /* 合計(s) */
    totalTime: number;
    /* 普通(s) */
    normalTime: number;
    /* 深夜(s) */
    midnightTime: number;
    /* 救出(s) */
    weekendTime: number;
    /* 徹夜(s) */
    allnightTime: number;
  };
}

export {
  AttendanceDailyBase,
  AttendanceDaily,
  AttendanceDailyView,
  AttendanceMonthly,
  AttendanceMonthlyAPI,
  AttendanceMonthlyView,
  AttendanceOnServer,
  AttendanceSettings,
  SummaryResponse,
  SubmitApplicationReqestPayload,
  SubmitApplicationOkPayload,
  SubmitApplicationNgPayload
};
