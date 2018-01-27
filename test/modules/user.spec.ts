import "jest"
import configureStore, { MockStore } from "redux-mock-store"
import thunk from "redux-thunk"
import user, {
  ActionTypes,
  UserAction,
  requestLogin,
  receiveLogin,
  loginError,
  loginUser,
  initialState,
  navigateToDashBoard,
  navigateToLogin,
  logoutUser,
} from "~/modules/user"
import { logout } from "~/api/login"

const createMockStore = configureStore([thunk])

describe("user actions", () => {

  let store: MockStore<{}>

  beforeEach(() => {
    store = createMockStore({})
  })

  it("should dispatch login success action", async () => {
    expect.assertions(1)
    await store.dispatch(loginUser("alice", "password"))
    const actions = store.getActions()
    const expectedActions = [
      requestLogin(),
      receiveLogin("Alice Cooper"),
      navigateToDashBoard(),
    ]
    expect(actions).toEqual(expectedActions)
  })

  it("should dispatch login error action", async () => {
    expect.assertions(1)
    await store.dispatch(loginUser("invalid_user", "password"))
    const actions = store.getActions()
    const expectedActions = [
      requestLogin(),
      loginError(),
    ]
    expect(actions).toEqual(expectedActions)
  })

  it("should logout", async () => {
    expect.assertions(1)
    await store.dispatch(logoutUser())
    const actions = store.getActions()
    const expectedActions = [
      navigateToLogin(),
    ]
    expect(actions).toEqual(expectedActions)
  })
})

describe("user reducer", () => {
  it("login request", () => {
    const action: UserAction = {
      type: ActionTypes.LOGIN_REQUEST,
      isFetching: true,
      isAuthenticated: false,
    }
    const expected = {
      isFetching: true,
      isAuthenticated: false,
      name: "",
    }
    expect(user(initialState, action)).toEqual(expected)
  })

  it("login success", () => {
    const action: UserAction = {
      type: ActionTypes.LOGIN_SUCCESS,
      isFetching: false,
      isAuthenticated: true,
      name: "Alice",
    }
    const expected = {
      isFetching: false,
      isAuthenticated: true,
      name: "Alice",
    }
    expect(user(initialState, action)).toEqual(expected)
  })

  it("login error", () => {
    const action: UserAction = {
      type: ActionTypes.LOGIN_ERROR,
      isFetching: false,
      isAuthenticated: false,
    }
    const expected = initialState
    expect(user(initialState, action)).toEqual(expected)
  })

  it("logout", () => {
    const state = {
      isFetching: false,
      isAuthenticated: true,
      name: "Alice",
    }
    const action: UserAction = {
      type: ActionTypes.LOGOUT_REQUEST,
      isAuthenticated: false,
    }
    const expected = initialState
    expect(user(initialState, action)).toEqual(expected)
  })
})
