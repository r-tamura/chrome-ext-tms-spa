import { convMenu } from "~/helpers/htmlConverter";
import { get, post } from "~/helpers/http";
import { composeAsync } from "~/helpers/common";
import { urls } from "~/helpers/_const";
import { User } from "~/types";
import Cookie from "~/helpers/cookie";

/**
 * ユーザ情報を取得します
 *
 * @returns {Promise} ユーザログインデータ
 */
const fetchIsLoggedIn = (): Promise<User> =>
  composeAsync(convMenu, get)(urls.TMSX_MENU);

/**
 * ログインIDとパスワードを利用して、ログイン処理を行います
 *
 * @param {string} id Login ID
 * @param {string} password User password
 * @return {Promise} ユーザログインデータ
 */
const login = async (id: string, password: string): Promise<User> => {
  const params = { id, pw: password };
  const html = await post(urls.TMSX_MENU, params);
  const json = convMenu(html);
  return json;
};

/**
 * TMSサイトからログアウトします
 */
const logout = (): User => {
  Cookie.remove("PHPSESSID");
  return {
    isAuthenticated: false
  };
};

export { fetchIsLoggedIn, login, logout };
