import { convMenu, LoginResponse } from "./htmlConvertor"
import { get, post } from "~/helpers/http"
import { composeAsync } from "~/helpers/common"
import { urls } from "~/helpers/_const"
import { User } from "~/types"

/**
 * ユーザ情報を取得します
 * @returns { Promise }
 */
export const fetchIsLoggedIn = (): Promise<User> => composeAsync(convMenu, get)(urls.TMSX_MENU)

/**
 * ログインIDとパスワードを利用して、ログイン処理を行います
 * @param { string } id Login ID
 * @param { string } password User password
 * @returns { Promise }
 */
export const login = async (id: string, password: string): Promise<LoginResponse> => {
  const params = { id, pw: password }
  const html = await post(urls.TMSX_MENU, params)
  if (!/TMS MENU/.test(html)) {
    throw new Error("ログインに失敗しました。")
  }

  const json = convMenu(html)
  return json
}
