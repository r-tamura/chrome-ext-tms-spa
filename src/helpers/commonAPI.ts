// import Http from "./http"
// import { convTCEntry } from "./ConvertUtil"
// import * as Const from "./_const"
// import { addAlert } from "../actions"
// import commonActionCreator from "../actions/commonActionCreator"

// class commonAPI {

//   /**
//    * マスターデータの一覧を取得します
//    */
//   public async fetchMasterInfo() {
//     try {
//       const html = await Http.post("/tmsx/T1021_transport_entry.php", {func: 1})
//       const res = convTCEntry(html)
//       commonActionCreator.createReceiveProjectsAction(res.projects)
//       commonActionCreator.createReceiveUsagesAction(res.usages)
//       commonActionCreator.createReceiveObjectivesAction(res.objectives)
//     } catch (error) {
//       console.error(error.stack)
//       addAlert (
//         "Faild", "プロジェクトリストの取得に失敗しました。", "danger", Const.ALERT_DURATION_TIME
//       )
//     }
//   }

//   /**
//    * メインタブのアクティブIDを更新します
//    */
//   public updateMainTab(id: number) {
//     commonActionCreator.createUpdateMainTab(id)
//   }
// }

// export default new commonAPI
