import React from "react";
import { Store, AnyAction } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { ThemeProvider } from "styled-components";
import { history } from "~/stores";
import { App } from "~/components/pages";
import { RootState } from "~/modules";
import { telema } from "~/styles/theme";
import { GlobalStyle } from "~/styles/GlobalStyle";

interface Props {
  store: Store<RootState, AnyAction>;
}

export const Root: React.FC<Props> = ({ store }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={telema}>
        <ConnectedRouter history={history}>
          <>
            <App />
            <GlobalStyle />
          </>
        </ConnectedRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
};
