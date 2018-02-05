// サーバからのレスポンス
// 2018/2/4 TODO: Status => State へ変更
export enum Status {
  OK = "ok",
  FAILURE = "error",
}
export interface ResultStatus {
  status: Status
  message?: string
}
export interface ResultStatusSuccess extends ResultStatus {
  status: Status.OK
}
export interface ResultStatusFailure extends ResultStatus {
  status: Status.FAILURE
}
