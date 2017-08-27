import { compose, filter, map, propEq, not } from "ramda"
import { get, post } from "./http"
import {
  convTransExpenseList,
  convTransExpenseUpdate,
  convTransExpenseCreate,
  convTransExpenseDelete,
} from "./htmlConvertor"
import { LS_TRANS_EXPENSE_TEMPLATE, urls } from "./_const"
import { composeAsync, remap, uuidv4 } from "~/helpers/common"
import { TransExpense, TransExpenseTemplate, Master, ResultStatus, Status } from "~/types"

/**
 * 交通費登録関連のAPI
 */

/**
 * テンプレートに指定されたIDのアイテムを追加します
 */
export async function createTemplate(template: TransExpense): Promise<ResultStatus> {
  const templates = await fetchTemplatesAll()
  const strJson = JSON.stringify([...templates, { templateId: uuidv4(), ...template }])

  // ストーレジ更新
  localStorage.setItem(LS_TRANS_EXPENSE_TEMPLATE, strJson)

  return {
    status: Status.OK,
    message: "テンプレートの登録が完了しました",
  }
}

/**
 * テンプレートから指定されたIDのアイテムを削除します
 */
export async function deleteTemplate(templateId: number): Promise<ResultStatus> {
  const templates = await fetchTemplatesAll()
  const strJson = compose(
    JSON.stringify,
    filter(compose(
      not,
      propEq("templateId", templateId),
    )),
  )(templates)

  // ストーレジ更新
  localStorage.setItem(LS_TRANS_EXPENSE_TEMPLATE, strJson)
  return {
    status: Status.OK,
    message: "テンプレートの削除が完了しました",
  }
}

/**
 * 指定されたテンプレートのデータを更新します
 */
export async function updateTemplate(template: TransExpenseTemplate): Promise<ResultStatus> {
  const templates = await fetchTemplatesAll()
  const strJson = compose(
    JSON.stringify,
    map(t => propEq("templateId", template.templateId) ? template : t),
  )(templates)

  // ストーレジ更新
  localStorage.setItem(LS_TRANS_EXPENSE_TEMPLATE, strJson)
  return {
    status: Status.OK,
    message: "テンプレートの削除が完了しました",
  }
}

export async function fetchTemplatesAll(): Promise<TransExpenseTemplate[]> {
  return new Promise((resolve, reject) => resolve(localStorage.getItem(LS_TRANS_EXPENSE_TEMPLATE)))
    .then((strjson: string) => strjson === null ? [] : JSON.parse(strjson))
}

const clientToServerKeyMap = {
  strdate: "eymd",
  expenseId: "trcd",
  projectId: "pjcd",
  usageId: "trkbn",
  objectiveId: "mktkcd",
  customer: "custm",
  from: "frpls",
  to: "topls",
  cost: "cost",
}

const clientToServer = (client: TransExpense) => remap(clientToServerKeyMap, client)

/**
 * 新しい交通費データを作成します
 */
export function create(expenseOnClient: TransExpense): Promise<ResultStatus> {
  const expenseOnServer = clientToServer(expenseOnClient)
  const action = { func: "insert" }
  return composeAsync(
    convTransExpenseCreate,
    post,
  )(urls.TRANS_EXPENSE_REGISTER, { ...expenseOnServer, ...action})
}

/**
 *  交通費を更新します
 */
export async function update(expenseOnClient: TransExpense): Promise<ResultStatus> {
  const expenseOnServer = clientToServer(expenseOnClient)
  const action = { func: "update" }
  return composeAsync(
    convTransExpenseUpdate,
    post,
  )(urls.TRANS_EXPENSE_REGISTER, { ...expenseOnServer, ...action})
}

/**
 *  交通費を削除します
 * "delete"だと予約語扱いとなるのので
 */
export function delete_(expenseId: number): Promise<ResultStatus> {
  const expenseIdKey = clientToServerKeyMap.expenseId
  const action = { func: "delete" }
  return composeAsync(
    convTransExpenseDelete,
    post,
  )(urls.TRANS_EXPENSE_REGISTER, { [expenseIdKey]: expenseId, ...action })
}

/**
 * 登録済みの交通費リストを取得します
 */
export async function fetchAll(master: Master) {
  try {
    return composeAsync(
      convTransExpenseList(master),
      get,
    )("/tmsx/T1020_transport.php")
  } catch (err) {
    console.error(err.stack)
    throw err
  }
}
