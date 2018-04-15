// サーバからのレスポンス
// 2018/2/4 TODO: Status => State へ変更
export enum Status {
  OK = "ok",
  NG = "error",
}
export interface ResultStatus {
  status: Status
  message?: string
}
export interface ResultStatusSuccess extends ResultStatus {
  status: Status.OK
}
export interface ResultStatusFailure extends ResultStatus {
  status: Status.NG
}

interface ApiResponse {
  status: Status
  body?: object
  error?: object
}

interface CompleteResponse extends ApiResponse {
  body: {
    message: string
  }
}

interface NgResponse extends ApiResponse {
  error: {
    message: string
  }
  statusCode: number
}

interface ApiError {
  response: NgResponse
}

export {
  ApiResponse,
  CompleteResponse,
  NgResponse,
  ApiError,
}
