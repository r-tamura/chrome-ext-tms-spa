import { Action, Dispatch, AnyAction } from "redux";
import { push } from "connected-react-router";
import { login, logout } from "~/api/login";
import { RootState } from "~/modules";

/**
 * Actions
 */
enum ActionTypes {
  LOGIN_REQUEST = "user/login_request",
  LOGIN_SUCCESS = "user/login_success",
  LOGIN_ERROR = "user/login_error",
  LOGOUT_REQUEST = "user/logout"
}

interface IRequestLoginAction extends Action {
  type: ActionTypes.LOGIN_REQUEST;
  isFetching: boolean;
  isAuthenticated: boolean;
}

interface IReceiveLoginAction extends Action {
  type: ActionTypes.LOGIN_SUCCESS;
  isFetching: boolean;
  isAuthenticated: boolean;
  name: string;
}

interface ILoginError extends Action {
  type: ActionTypes.LOGIN_ERROR;
  isFetching: boolean;
  isAuthenticated: boolean;
}

interface ILogout extends Action {
  type: ActionTypes.LOGOUT_REQUEST;
  isAuthenticated: boolean;
  name: string;
}

const requestLogin = (): IRequestLoginAction => {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false
  };
};

const navigateTo = (path: string) => push(path);
const navigateToLogin = () => navigateTo("/signin");
const navigateToTransportation = () => navigateTo("/transportation");
const navigateToDashBoard = () => navigateTo("/transportation");

const loginUser = (idToken: string, credential: string) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState
) => {
  dispatch(requestLogin());
  return login(idToken, credential)
    .then(res =>
      res.isAuthenticated ? Promise.resolve(res) : Promise.reject("Error")
    )
    .then(res => dispatch(receiveLogin(res.name)))
    .then(() => dispatch(navigateToDashBoard()))
    .catch(err => dispatch(loginError()));
};

const receiveLogin = (name: string): IReceiveLoginAction => ({
  type: ActionTypes.LOGIN_SUCCESS,
  isFetching: false,
  isAuthenticated: true,
  name
});

const loginError = (): ILoginError => ({
  type: ActionTypes.LOGIN_ERROR,
  isFetching: true,
  isAuthenticated: false
});

const logoutUser = (): ILogout => {
  logout();
  return {
    type: ActionTypes.LOGOUT_REQUEST,
    isAuthenticated: false,
    name: null
  };
};

type UserAction =
  | IRequestLoginAction
  | IReceiveLoginAction
  | ILoginError
  | ILogout;

/**
 * State
 */
type UserState = {
  readonly isFetching: boolean;
  readonly isAuthenticated: boolean;
  readonly name?: string;
};

const initialState: UserState = {
  isFetching: false,
  isAuthenticated: false,
  name: ""
};

/**
 * Selectors
 */
const getUserName = (state: UserState): string => state.name || "";
const getIsAuthenticated = (state: UserState): boolean => state.isAuthenticated;
const getIsFetching = (state: UserState): boolean => state.isFetching;

/**
 * Reducer
 */
function user(state: UserState = initialState, action: UserAction): UserState {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated,
        name: action.name
      };
    case ActionTypes.LOGIN_ERROR:
      return { ...state, ...initialState };
    case ActionTypes.LOGOUT_REQUEST:
      return { ...initialState, isAuthenticated: action.isAuthenticated };
    default:
      return state;
  }
}

export {
  ActionTypes,
  UserAction,
  initialState,
  requestLogin,
  navigateTo,
  navigateToLogin,
  navigateToTransportation,
  navigateToDashBoard,
  loginUser,
  logoutUser,
  receiveLogin,
  loginError,
  UserState,
  getUserName,
  getIsAuthenticated,
  getIsFetching
};

export default user;
