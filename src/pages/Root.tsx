import * as React from "react";
import { Store, AnyAction } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { ThemeProvider } from "styled-components";
import { history } from "~/stores";
import { App } from "~/pages";
import { RootState } from "~/modules";
import { telema } from "~/styles/theme";

interface Props {
  store: Store<RootState, AnyAction>;
}

const Root: React.FC<Props> = ({ store }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={telema}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default Root;
