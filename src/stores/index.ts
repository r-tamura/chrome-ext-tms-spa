import { createStore, Store, applyMiddleware, AnyAction } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { createLogger } from "redux-logger";
import { createRootReducer, RootState } from "~/modules";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

const recoverState = () => ({});

export const history = createBrowserHistory();

const logger = createLogger({
  collapsed: true
});

const rootReducer = createRootReducer(history);

/**
 * Reduxストアインスタンスを生成します
 *
 * @param preloadedState 初期ストア (default: {})
 */
export const configureStore = (
  preloadedState: Partial<RootState> = recoverState()
): Store<RootState, AnyAction> =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunk as ThunkMiddleware<RootState, AnyAction>,
      routerMiddleware(history),
      logger
    )
  );
