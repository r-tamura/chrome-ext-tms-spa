import { compose, filter, map, propEq, not } from "ramda"
import { get, post } from "~/helpers/http"
import {
  convTransExpenseList,
  convTransExpenseUpdate,
  convTransExpenseCreate,
  convTransExpenseDelete,
} from "~/helpers/htmlConverter"
import { LS_TRANS_EXPENSE_TEMPLATE, urls } from "~/helpers/_const"
import { composeAsync, remap, uuidv4 } from "~/helpers/common"
import {
  TransExpense,
  TransExpenseTemplate,
  TransExpenseView,
  Master,
  ResultStatus,
  Status,
} from "~/types"
import Storage from "~/helpers/storage"

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
  const newTemplates = compose(
    filter(compose(
      not,
      propEq("templateId", templateId)
    ))
  )(templates)

  // ストーレジ更新
  await Storage.saveInStorage(LS_TRANS_EXPENSE_TEMPLATE, newTemplates)
  return {
    status: Status.OK,
    message: "テンプレートの削除が完了しました",
  }
}

/**
 * 指定されたテンプレートのデータを更新します
 *
 * @param {TransExpenseTemplate} newTemplates
 */
export async function updateTemplate(newTemplate: TransExpenseTemplate): Promise<ResultStatus> {
  const templates = await fetchTemplatesAll()
  const newTemplates = map(dbTemplate => {
      if (propEq("templateId", newTemplate.templateId, dbTemplate)) {
        return newTemplate
      }
      return dbTemplate
    })(templates)

  // ストーレジ更新
  await Storage.saveInStorage(LS_TRANS_EXPENSE_TEMPLATE, newTemplates)
  return {
    status: Status.OK,
    message: "テンプレートの更新が完了しました",
  }
}

export function fetchTemplatesAll(): Promise<TransExpenseTemplate[]> {
  // return Promise.resolve(localStorage.getItem(LS_TRANS_EXPENSE_TEMPLATE))
  //   .then((strjson: string) => strjson === null ? [] : JSON.parse(strjson))
  return Storage.getFromStorage<TransExpenseTemplate[]>(LS_TRANS_EXPENSE_TEMPLATE)
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
 * サーバに交通費データを作成します
 *
 * @param expenseOnClient 新規作成する交通費データ(クライアント形式)
 * @return 交通費作成の結果
 */
export async function create(expenseOnClient: TransExpense): Promise<ResultStatus> {
  const expenseOnServer = clientToServer(expenseOnClient)
  const action = { func: "insert" }
  const htmlRes = await post(urls.TRANS_EXPENSE_REGISTER, { ...expenseOnServer, ...action})
  const res = convTransExpenseCreate(htmlRes)
  return res
}

/**
 * サーバ交通費を更新します
 *
 * @param expenseOnClient 更新する交通費データ(クライアント形式)
 * @return 交通費更新の結果
 */
export async function update(expenseOnClient: TransExpense): Promise<ResultStatus> {
  const expenseOnServer = clientToServer(expenseOnClient)
  const action = { func: "update" }
  const htmlRes = await post(urls.TRANS_EXPENSE_REGISTER, { ...expenseOnServer, ...action})
  const res = convTransExpenseUpdate(htmlRes)
  return res
}

/**
 *  サーバ交通費を削除します
 * "delete"だと予約語扱いとなるのので関数名の最後にに"_"を追加
 *
 * @param expenseId 交通費ID
 * @return 交通費削除の結果
 */
export async function delete_(expenseId: number): Promise<ResultStatus> {
  const expenseIdKey = clientToServerKeyMap.expenseId
  const action = { func: "delete" }
  const htmlRes = await post(urls.TRANS_EXPENSE_REGISTER, { [expenseIdKey]: expenseId, ...action })
  const res = convTransExpenseDelete(htmlRes)
  return res
}

/**
 * サーバに登録されている交通費リストを全て取得します
 *
 * @param master プロジェクト名などのマスタデータ(JSONへの変換に使用)
 * @return View用交通費リスト
 */
export async function fetchAll(master: Master): Promise<TransExpenseView[]> {
  const htmlRes = await get("/tmsx/T1020_transport.php")
    .catch(err => {
      console.error(err)
      throw err
    })
  const res = convTransExpenseList(master, htmlRes)
  return res
}
