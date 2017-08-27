import * as React from "react"
import { Helmet } from "react-helmet"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { RootState } from "~/modules"
import { loginUser } from "~/modules/user"
import { Dispatch } from "redux"
import { connect } from "react-redux"

interface IProps extends React.Props<{}>, RouteComponentProps<{}> {
  readonly isFetching: boolean,
  readonly isAuthenticated: boolean,
  readonly name: string,
  loginUser: (id: string, pw: string) => (dispatch: Dispatch<{}>) => any
}

/**
 * ログインセクション
 */
class Login extends React.Component<IProps, {}> {
  private inputPassword: HTMLInputElement
  private inputUserName: HTMLInputElement

  // private loginSubscribtion: { remove: Function }

  // private inputUserName: HTMLInputElement // ユーザ名テキストボックス
  // private inputPassword: HTMLInputElement // ユーザパスワードテキストボックス

  /* ログインアクション実行 */
  // componentDidMount() {
  //   // 共通クリックイベントの登録
  //   UI.addActivateEventListener(document.getElementById("login-section"))
  // }

  // componentWillUnmount() {
  //   // 共通クリックイベントの登録
  //   UI.removeActivateEventListener(document.getElementById("login-section"))
  // }

  public render() {
    const { isFetching } = this.props
    if (isFetching) {
      return <p>Fetching...</p>
    }

    return (
      <div className="login-main">
        <Helmet>
          <title>Login | TMS</title>
        </Helmet>
        <h1>Sign in to TMS</h1>
        <p>Enter your <strong>user name</strong> and <strong>password</strong>.</p>
        <form onSubmit={this.handleSubmit}>
          <div className="span-10-of-12">
              {/* User name text filed */}
              <div className="text-field">
                <input
                  ref={input => this.inputUserName = input}
                  type="text"
                  placeholder="John Doe"
                  maxLength={30}
                  required={true}
                />
                <label>UserName</label>
              </div>
              {/* Password text field */}
              <div className="text-field">
                <input
                  ref={input => this.inputPassword = input}
                  type="password"
                  placeholder="Your password"
                  maxLength={30}
                  required={true}
                />
                <label>Password</label>
              </div>
              <button className="secondary-button btn-raised span-12-of-12">Log in</button>
            </div>
        </form>
      </div>
    )
  }

  private handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    const username = this.inputUserName.value
    const password = this.inputPassword.value

    e.preventDefault()
    this.props.loginUser(username, password)
  }
}

const mapStateToProps = (state: RootState, props: IProps) => {
  const { isFetching, isAuthenticated, name } = state.user
  return {
    isFetching,
    isAuthenticated,
    name,
  }
}

const mapDispatchToProps = {
  loginUser,
}

// export default withNav<RouteComponentProps<{}>>(Login)
export default connect(mapStateToProps, mapDispatchToProps)(Login)
