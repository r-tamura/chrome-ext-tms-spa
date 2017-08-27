import * as React from "react"
import { connect } from "react-redux"
import { RootState } from "~/modules"

interface IProps extends React.ClassAttributes<{}> {
  username: string
  // isLogin: boolean
}

  // function getInitState(props) {
  //   return {
  //     isLogin: ContextStore.getIsLogin(),
  //     username: ContextStore.getName(),
  //   }
  // }

  /* メニューオープン3点リーダクリックイベント */
const onMenuBtnClick = (e: React.MouseEvent<HTMLElement>) => {
  const nav = document.getElementById("side-nav-bar")
  nav.classList.toggle("on-active")
}

// function onSelectTabClick(e: React.SyntheticEvent) {
//   // "+"でstring=>number変換
//   const id = +(e.currentTarget as HTMLElement).getAttribute("data-active-id")
//   CommonAPI.updateMainTab(id)
// }

// /* ユーザボタンクリックイベント */
// function onUserClick = (e: React.SyntheticEvent) => {
//   /* ユーザメニューを開く */
//   (refs["usermenu"] as UserMenu).show()
// }

// updateLoginState() {
//   let isLogin = ContextStore.getIsLogin()
//   let username = ContextStore.getName()
//   setState({isLogin, username})
// }

// ユーザJSXを生成します
function renderUser(username: string) {
  let loginButton
  const isLogin = username && username.length > 0
  if (isLogin) {
    loginButton = (
      <div className="header-user" onClick={() => ({})}>
        <i className="person-icon"/>
        <span>{username}</span>
        {/* <UserMenu ref="usermenu"/> */}
      </div>
    )
  }
  return loginButton
}

// リンク一覧を生成します
function renderNavLinks(): JSX.Element[] {

  // ログイン前はリンクを表示しない
  return [<div key={1} className="displayNone"/>]

  // const links = [
  //   { to: "transportation", image: taxiSvg, title: "交通費"},
  //   { to: "attendance", image: bookSvg, title: "月間勤怠"},
  // ]
  // return (
  //   links
  //     .map((e, i) => {
  //       const classActive = e.to === props.activeId ? "active" : ""
  //       return (
  //         <div key={e.to} className={`nav-link ${classActive}`}>
  //         <Link to={e.to} title={e.title}>
  //           {e.image}
  //         </Link>
  //         </div>
  //       )
  //     }
  //   )
  // )
}

/**
 * アプリケーションヘッダーコンポーネント
 */
const Header: React.SFC<IProps> = ({
  username,
}) => {

    // const { isLogin } = props
    const isLogin = true
    const navLinks = renderNavLinks()
    const user = renderUser(username)

    return (
      <header className="page-header">
        {/* メニューボタン 小サイズデバイスで表示 */}
        { isLogin &&
          <div className="menu-btn" onClick={onMenuBtnClick}>
            <img src="" />
          </div>
        }
        <a className="company-logo" href="http://www.telema.jp/">
          <img src="https://www.telema.co.jp/images/logo_sp.svg"/>
        </a>
        {/* リンク */}
        {navLinks}

        {/* ユーザ */}
        {user}
      </header>
    )
  }

type OwnProps = Partial<IProps>

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    username: state.user.name,
  }
}

export default connect(mapStateToProps)(Header)
