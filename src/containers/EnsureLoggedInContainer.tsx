import * as React from "react"
import * as ReactDOM from "react-dom"
import { connect } from "react-redux"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { RootState, getIsAuthenticated } from "~/modules"
import { navigateToLogin } from "~/modules/user"

interface OwnProps extends React.Props<{}> {}

interface IProps extends OwnProps {
  isAuthenticated: boolean
  currentURL?: string
  navigateToLogin: () => void
}

class EnsureLoggedInContainer extends React.Component<IProps, {}> {

  public componentWillMount() {
    this.redirectToLoginIfNeeded(this.props.isAuthenticated)
  }

  public render() {
    return <div>{this.props.children}</div>
  }

  private redirectToLoginIfNeeded(isAuthenticated: boolean) {
    if (!isAuthenticated) {
      this.props.navigateToLogin()
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  isAuthenticated: getIsAuthenticated(state),
})

export default connect(mapStateToProps, { navigateToLogin })(EnsureLoggedInContainer)
