// import * as React from "react"
// import LoginActionCreator from "../actions/LoginActionCreator"
// import CommonAPI from "../utils/CommonAPI"
// import Common from "../utils/Common"
// import Cookies from "../utils/Cookies"

// interface IState {
//   // メニューの表示/非表示
//   visible: boolean 
// }

// /**
//  * ユーザメニューコンポーネント
//  */
// export default class UserMenu extends React.Component<{}, IState> {

//   constructor(props) {
//     super(props)
//     this.state = this.getInitState(props)
//   }

//   // 初期Stateを取得します
//   private getInitState(props): IState {
//     return {
//       visible: false
//     }
//   }

//   private onSignoutClick(e: React.SyntheticEvent) {
//     Cookies.remove("PHPSESSID")
//     location.href = "http://www.telema.jp"
//   }

//   /**
//    * メニューを非表示状態に設定します
//    */
//   public hide = () => {
//     document.removeEventListener("click", this.hide)
//     this.setState({visible: false})
//   }

//   /**
//    * メニューを表示状態に設定します
//    */
//   public show = () => {
//     document.addEventListener("click", this.hide)
//     this.setState({visible: true})
//   }

//   public render() {
//     if(!this.state.visible) return <div className="displayNone"></div>
//     return (
//       <div className="dropdown-menu">
//         <ul>
//           <li className="sign-out-link"><a href="javascript:void 0" rel="nofollow" onClick={this.onSignoutClick}>Sign out</a></li>
//         </ul>
//       </div>
//     )
//   }

// }
