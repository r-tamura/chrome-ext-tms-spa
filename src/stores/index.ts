import { createStore, Store, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import { rootReducer, RootState } from "~/modules"
import { routerReducer, routerMiddleware } from "react-router-redux"
import createHistory from "history/createBrowserHistory"

const recoverState = () => ({})

export const history = createHistory()

const logger = createLogger({
  collapsed: true,
})

/**
 * Reduxストアインスタンスを生成します
 *
 * @param preloadedState 初期ストア (default: {})
 */
export const configureStore = (preloadedState: Partial<RootState> = recoverState()): Store<{}> =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, routerMiddleware(history), logger)
  )
