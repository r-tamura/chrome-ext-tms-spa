// /**
//  * UI系の汎用処理
//  */
// import { addAlert } from "../actions"
// import * as Const from "./_const"

// /**
//  * ボタンアクティブ化
//  */
// export function activateButton(e) {
//   const root = (e.target as HTMLElement)
//   if(root.classList.contains("btn-raised")) {
//     root.classList.add("on-active")
//   }
// }

// /**
//  * ボタン非アクティブ化
//  */
// export function deactivateButton(e) {
//   const root = (e.target as HTMLElement)
//   if(root.classList.contains("btn-raised")) {
//     root.classList.remove("on-active")
//   }
// }

// /**
//  * ボタンアクティブイベント追加
//  */
// export function addActivateEventListener(element: HTMLElement): void {
//   element.addEventListener("mousedown", this.activateButton)
//   element.addEventListener("mouseup", this.deactivateButton)
//   element.addEventListener("mouseout", this.deactivateButton)
// }

// /**
//  * ボタンアクティブイベント削除
//  */
// export function removeActivateEventListener(element: HTMLElement): void {
//   element.removeEventListener("mousedown", this.activateButton)
//   element.removeEventListener("mouseup", this.deactivateButton)
//   element.removeEventListener("mouseout", this.deactivateButton)
// }

// // アラート系
// /**
//  * インフォ通知を表示します
//  * @param {string} title 通知タイトル
//  * @param {string} message 通知本文
//  */
// export function alertInfo(title: string = "タイトルなし", message: string = "本文なし") {
//   addAlert(title, message, "default", 3000)
// }

// /**
//  * 成功通知を表示します
//  * @param {string} title 通知タイトル
//  * @param {string} message 通知本文
//  */
// export function alertSuccess(title: string = "タイトルなし", message: string = "本文なし") {
//   addAlert(title, message, "primary", Const.ALERT_DURATION_TIME)
// }

// /**
//  * 成功通知を表示します
//  * @param {string} title 通知タイトル
//  * @param {string} message 通知本文
//  */
// export function alertError(title: string = "タイトルなし", message: string = "本文なし") {
//   addAlert(title, message, "danger", Const.ALERT_DURATION_TIME)
// }   

// export function showUnderConstruction(title: string = "タイトルなし") {
//   addAlert(title, "工事中", "default", Const.ALERT_DURATION_TIME)
// }
