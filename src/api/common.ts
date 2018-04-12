import { post } from "~/helpers/http"
import { convMaster } from "~/helpers/htmlConverter"
import { Master } from "~/types"

/**
 * マスタ情報を取得するAPI
 * @return {Promise<Master>} マスタデータ
 */
export async function fetchMasterInfo(): Promise<Master> {
  return post("/tmskin/T1021_transport_entry.php", { func: 1 })
    .then(convMaster)
}
