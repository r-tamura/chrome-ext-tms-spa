import React, { Component, SFC, SyntheticEvent } from "react";
import { Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";
import { RootState } from "~/modules";
import { logoutUser, navigateToLogin } from "~/modules/user";
import Menu, { MenuItem } from "~/components/Menu";

interface IHeaderUserProps {
  onLogout: () => any;
}

interface IHeaderUserState {
  anchorElement: Element;
}

class HeaderUser extends Component<IHeaderUserProps, IHeaderUserState> {
  constructor(props: IHeaderUserProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      anchorElement: null
    };
  }

  public render() {
    const { children } = this.props;
    const menuOpened = this.state.anchorElement != null;
    return (
      <div className="header-user">
        <span
          id={"header-user-button"}
          className={"clickable"}
          onClick={this.handleClick}
        >
          {children}
        </span>
        <Menu title={"User Menu"} onClose={this.handleClose} open={menuOpened}>
          <MenuItem id={"logout"} button onClick={this.handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }

  private handleClick(e: SyntheticEvent<Element>) {
    this.setState({ anchorElement: e.currentTarget });
  }

  private handleClose(e: SyntheticEvent<Element>) {
    this.setState({ anchorElement: null });
  }

  private handleLogout(e: SyntheticEvent<Element>) {
    this.handleClose(e);
    this.props.onLogout();
  }
}

/**
 * アプリケーションヘッダーコンポーネント
 */

interface IHeaderProps {
  username: string;
  logoutUser: () => any;
}

const Header: SFC<IHeaderProps> = ({ username, logoutUser: logout }) => {
  // const { isLogin } = props
  const isLogin = true;
  return (
    <header className="page-header">
      <a className="company-logo" href="http://www.telema.jp/">
        <img src="https://www.telema.co.jp/images/logo_sp.svg" />
      </a>
      {/* ユーザ */}
      <HeaderUser onLogout={logout}>{username}</HeaderUser>
    </header>
  );
};

type OwnProps = Partial<IHeaderProps>;

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    username: state.user.name
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<AnyAction>,
  ownProps: OwnProps
) => {
  return {
    logoutUser: () => {
      dispatch(logoutUser());
      dispatch(navigateToLogin());
    }
  };
};

export { Header };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
