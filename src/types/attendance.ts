import { Project } from "./master"

interface AttendanceDailyBase {
  dailyId: string // yyyymmdd
  day: number
  isWeekday: boolean
  start: string
  end: string
  overwork: string
  overnightwork: string
  hasConfirmed: boolean
  hasUpdated?: boolean   // クライアントでデータ更新があったか
}

export interface AttendanceDaily extends AttendanceDailyBase {
  projectId: string
}

export interface AttendanceDailyView extends AttendanceDailyBase {
  project: Project
}

interface AttendanceMonthlyBase {
  monthlyId: string
  reportId: string
  year: number
  month: number
  total?: number
  isFetching?: boolean
  lastUpdatedOn?: number
}

export interface AttendanceMonthly extends AttendanceMonthlyBase {
  days: string[]
}

export interface AttendanceMonthlyAPI extends AttendanceMonthlyBase {
  days: AttendanceDaily[]
}

export interface AttendanceMonthlyView extends AttendanceMonthlyBase {
  days: AttendanceDailyView[]
}

/* APIリクエスト送信の形式 */
export interface AttendanceOnServer {
  pjcd: string,
  from: string,
  to: string,
  year: string,
  month: string,
  day: string,
}
