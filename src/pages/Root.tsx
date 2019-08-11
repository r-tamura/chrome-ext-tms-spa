import * as React from "react";
import { Store, AnyAction } from "redux";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "~/stores";
import App from "~/pages/App";
import { RootState } from "~/modules";

interface Props {
  store: Store<RootState, AnyAction>;
}

const Root: React.FC<Props> = ({ store }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
