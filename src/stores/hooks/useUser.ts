import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/modules";
import { loginUser, logoutUser } from "~/modules/user";

export function useUser() {
  const { isAuthenticated, isFetching, name } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  function login(username: string, password: string) {
    dispatch(loginUser(username, password));
  }

  function logout() {
    dispatch(logoutUser());
  }

  return { isAuthenticated, isFetching, name, login, logout };
}
