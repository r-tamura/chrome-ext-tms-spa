/**
 * ユーザ情報インタフェース
 */
export interface User {
  /** ログイン認証済みであるか */
  isAuthenticated: boolean
  /** ユーザ名 */
  name?: string
}
