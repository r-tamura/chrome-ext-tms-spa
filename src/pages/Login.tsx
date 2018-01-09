import * as React from "react"
import { Helmet } from "react-helmet"
import { RouteComponentProps } from "react-router-dom"
import { Form, Text } from "react-form"
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
 * ログインフォームコンポーネント
 */
class LoginPage extends React.Component<IProps, {}> {
  public render() {
    const { isFetching } = this.props
    if (isFetching) {
      return <p>Fetching...</p>
    }

    return (
      <div className="main main--full tms-grid-12-col-parent">
        <Helmet>
          <title>Login | TMS</title>
        </Helmet>
        <div className="tms-grid--offset3 tms-grid--col7 login-center">
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
                  <button className="tms-btn tms-btn--primary tms-btn--block">Log in</button>
                </form>
              </div>
            )}
          </Form>
        </div>
      </div>
    )
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
}

// export default withNav<RouteComponentProps<{}>>(Login)
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
