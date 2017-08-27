import * as React from "react"
import { Store } from "redux"
import { Helmet } from "react-helmet"
import { Router, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { RootState } from "~/modules"
import { history } from "~/stores"
import App from "~/pages/App"

interface Props extends React.Props<{}> {
  store: Store<{}>
}

class Root extends React.Component<Props, {}> {
  public render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider >
    )
  }
}

export default Root
