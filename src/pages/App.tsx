import React from "react";
import { Helmet } from "react-helmet";
import { Route, Switch, Redirect } from "react-router-dom";
import { AppHeader } from "~/components/organisms/Header";
import Nav from "~/components/Nav";
import { EnsureLoggedInContainer } from "~/containers/EnsureLoggedInContainer";
import { TransportExpensePage, AttendancePage, SignInPage, NoMatch } from ".";
import { AppGrid } from "~/components/organisms";

const PAGES_WITH_NAVBAR = ["/transportation", "/attendance"];

export function App() {
  return (
    <AppGrid>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
      </Helmet>
      <AppHeader />
      <Route
        path={PAGES_WITH_NAVBAR}
        render={renderProps => {
          return <Nav path={renderProps.match.url} />;
        }}
      />
      <Switch>
        <Route
          exact={true}
          path="/"
          component={() => <Redirect to={"/signin"} />}
        />
        <Route exact={true} path="/signin" component={SignInPage} />
        <EnsureLoggedInContainer>
          {/* TODO: Dashboard画面作成までは交通費管理画面へリダイレクト */}
          <Route
            path="/dashboard"
            component={() => <Redirect to={"/transportation"} />}
          />
          <Route path="/transportation" component={TransportExpensePage} />
          <Route path="/attendance" component={AttendancePage} />
        </EnsureLoggedInContainer>
        <Route component={NoMatch} />
      </Switch>
    </AppGrid>
  );
}
