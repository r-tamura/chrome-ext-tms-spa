import { Action, Dispatch } from "redux"
import { push } from "react-router-redux"
import { login } from "~/helpers/api-login"
import { RootState } from "~/modules"

/**
 * Actions
 */
enum ActionTypes {
  REQUEST = "user/request",
  SUCCESS = "user/success",
  ERROR = "user/error",
}

interface IRequestLoginAction extends Action {
  type: ActionTypes.REQUEST
  isFetching: boolean
  isAuthenticated: boolean,
}

interface IReceiveLoginAction extends Action {
  type: ActionTypes.SUCCESS
  isFetching: boolean,
  isAuthenticated: boolean,
  name: string,
}

interface ILoginError extends Action {
  type: ActionTypes.ERROR
  isFetching: boolean,
  isAuthenticated: boolean,
}

export const requestLogin = (): IRequestLoginAction => {
  return {
    type: ActionTypes.REQUEST,
    isFetching: true,
    isAuthenticated: false,
  }
}

export const navigateToLogin = () => push("/")

export const navigateToDashBoard = () => push("/transportation")

export const loginUser = (idToken: string, credential: string) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(requestLogin())
    login(idToken, credential)
      .then(res => dispatch(receiveLogin(res.name)))
      .then(() =>  dispatch(push("/transportation")))
      .catch(err => dispatch(loginError()))
  }

export const receiveLogin = (name: string): IReceiveLoginAction => ({
  type: ActionTypes.SUCCESS,
  isFetching: false,
  isAuthenticated: true,
  name,
})

export const loginError = (): ILoginError => ({
  type: ActionTypes.ERROR,
  isFetching: false,
  isAuthenticated: true,
})

export type UserAction = IRequestLoginAction | IReceiveLoginAction | ILoginError

/**
 * State
 */
export type UserState =  {
  readonly isFetching: boolean,
  readonly isAuthenticated: boolean,
  readonly name?: string,
}

const initialState: UserState = {
  isFetching: false,
  isAuthenticated: false,
  name: "",
}

/**
 * Selectors
 */
export const getUserName = (state: UserState): string => state.name || ""
export const getIsAuthenticated = (state: UserState): boolean => state.isAuthenticated
export const getIsFetching = (state: UserState): boolean => state.isFetching

/**
 * Reducer
 */
function user(state: UserState = initialState, action: UserAction): UserState {
  switch (action.type) {
    case ActionTypes.REQUEST:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated,
      }
    case ActionTypes.SUCCESS:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated,
        name: action.name,
      }
    case ActionTypes.ERROR:
      return { ...state, ...initialState }
    default:
      return state
  }
}

export default user
