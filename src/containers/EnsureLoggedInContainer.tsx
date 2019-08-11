import React from "react";
import { connect } from "react-redux";
import { RootState, getIsAuthenticated } from "~/modules";
import { navigateToLogin } from "~/modules/user";
import { RouterAction } from "connected-react-router";

interface OwnProps extends React.Props<{}> {}

interface IProps extends OwnProps {
  isAuthenticated: boolean;
  currentURL?: string;
  navigateToLogin: () => RouterAction;
}

class EnsureLoggedInContainer extends React.Component<IProps, {}> {
  public componentDidMount() {
    this.redirectToLoginIfNeeded(this.props.isAuthenticated);
  }

  public render() {
    // 非ログイン時にnullを返さないと、
    // 子コンポーネントのレンダリングが実行されれてしまい、
    // 子コンポーネント内の初期ロードAPIなどが実行されてしまう
    if (this.shouldRedirectToLogin(this.props.isAuthenticated)) {
      return null;
    }

    return this.props.children;
  }

  private shouldRedirectToLogin(isAuthenticated: boolean): boolean {
    return !isAuthenticated;
  }

  private redirectToLoginIfNeeded(isAuthenticated: boolean) {
    if (this.shouldRedirectToLogin(isAuthenticated)) {
      this.props.navigateToLogin();
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  isAuthenticated: getIsAuthenticated(state)
});

export default connect(
  mapStateToProps,
  { navigateToLogin }
)(EnsureLoggedInContainer);
