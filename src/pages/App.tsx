import * as React from "react"
import { Dispatch } from "redux"
import { Helmet } from "react-helmet"
import { connect, MapStateToProps, DispatchProp } from "react-redux"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import Header from "~/components/Header"
import Nav from "~/components/Nav"
import { RootState } from "~/modules"
import EnsureLoggedInContainer from "~/containers/EnsureLoggedInContainer"
import LoginPage from "./LoginPage"
import TransExpense from "./TransExpenses"
import Attendance from "./Attendance"
import NoMatch from "./NoMatch"

type OwnProps = IProps

interface IProps extends React.Props<{}> {
  // fetchMaster: () => Promise<{}>
}

class App extends React.Component<IProps, {}> {
  public render() {
    return (
      <div className="app-root">
        <Helmet>
          {/* iOS9のsafariではinitial-scaleが無視される場合がある */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        </Helmet>
        <Header />
        <Route
          path="/:page"
          render={renderProps => {
            return <Nav path={renderProps.match.url} />
          }}
        />
        <Switch>
          <Route exact={true} path="/" component={LoginPage}/>
          <EnsureLoggedInContainer>
            <Route path="/transportation" component={TransExpense}/>
            <Route path="/attendance" component={Attendance}/>
          </EnsureLoggedInContainer>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    )
  }
}

// export default connect((state: RootState, ownProps: OwnProps) => ({}), { fetchMaster })(App)
export default App
