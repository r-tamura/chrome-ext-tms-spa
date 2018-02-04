import * as React from "react"
import { Helmet } from "react-helmet"
import { RouteComponentProps } from "react-router-dom"
import { Form, Text } from "react-form"
import { RootState } from "~/modules"
import { loginUser, navigateToDashBoard } from "~/modules/user"
import { Dispatch } from "redux"
import { connect } from "react-redux"

interface IProps extends React.Props<{}>, RouteComponentProps<{}> {
  readonly isFetching: boolean,
  /* ログイン済みであるか */
  readonly isAuthenticated: boolean,
  /* ユーザー名 */
  readonly name: string,
  loginUser: (id: string, pw: string) => any
  navigateToDashBoard: () => any
}

/**
 * ログインページ
 */
class LoginPage extends React.Component<IProps, {}> {

  public componentWillMount() {
    this.redirectToDashboardIfNeeded(this.props.isAuthenticated)
  }

  public render() {
    const { isFetching } = this.props
    if (isFetching) {
      return <p>Fetching...</p>
    }

    return (
      <main className="main main--full tms-grid-3-container">
        <Helmet>
          <title>Login | TMS</title>
        </Helmet>
        <div className="login-main tms-grid--offset1 tms-grid--col1 tms-grid-sm--col3">
          <h1>Sign in to TMS</h1>
          <p>Enter your <strong>user name</strong> and <strong>password</strong>.</p>
          <Form onSubmit={this.handleSubmit}>
            { formApi => (
              <div className="tms-panel">
                <form onSubmit={formApi.submitForm}>
                  {/* User name text filed */}
                  <div className="tms-textfield">
                    <Text
                      field={"username"}
                      id={"username"}
                      placeholder="John Doe"
                      maxLength={30}
                      required={true}
                    />
                    <label htmlFor={"username"}>UserName</label>
                  </div>
                  {/* Password text field */}
                  <div className="tms-textfield">
                    <Text
                      type="password"
                      field={"password"}
                      id={"password"}
                      placeholder="Your password"
                      maxLength={30}
                      required={true}
                    />
                    <label htmlFor={"password"}>Password</label>
                  </div>
                  <button className="tms-btn primary block">SIGN IN</button>
                </form>
              </div>
            )}
          </Form>
        </div>
      </main>
    )
  }

  private shouldRedirectToDashBoard(isAuthenticated: boolean): boolean {
    return isAuthenticated
  }

  private redirectToDashboardIfNeeded(isAuthenticated: boolean) {
    if (this.shouldRedirectToDashBoard(isAuthenticated)) {
      this.props.navigateToDashBoard()
    }
  }

  private handleSubmit = ({username = "", password = ""}) => {
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
  navigateToDashBoard,
}

export {
  LoginPage,
}

// export default withNav<RouteComponentProps<{}>>(Login)
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
