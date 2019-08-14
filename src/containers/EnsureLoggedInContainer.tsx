import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/modules";
import { navigateToLogin } from "~/modules/user";

export const EnsureLoggedInContainer: React.FC = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const dispatch = useDispatch();

  useEffect(() => {
    function dispatchNavigateToLogin() {
      dispatch(navigateToLogin());
    }

    function redirectToLoginIfNeeded(isAuthenticated: boolean) {
      if (shouldRedirectToLogin(isAuthenticated)) {
        dispatchNavigateToLogin();
      }
    }

    redirectToLoginIfNeeded(isAuthenticated);
  }, [dispatch, isAuthenticated]);

  // 非ログイン時にnullを返さないと、
  // 子コンポーネントのレンダリングが実行されれてしまい、
  // 子コンポーネント内の初期ロードAPIなどが実行されてしまう
  if (shouldRedirectToLogin(isAuthenticated)) {
    return null;
  }

  return <>{children}</>;

  function shouldRedirectToLogin(isAuthenticated: boolean): boolean {
    return !isAuthenticated;
  }
};

// const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
//   isAuthenticated: getIsAuthenticated(state)
// });

// export default connect(
//   mapStateToProps,
//   { navigateToLogin }
// )(EnsureLoggedInContainer);
