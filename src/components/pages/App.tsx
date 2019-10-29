import React from "react";
import { Helmet } from "react-helmet";
import { Route, Switch, Redirect } from "react-router-dom";
import { AppHeader, Nav } from "~/components/organisms";
import { EnsureLoggedInContainer } from "~/components/containers/EnsureLoggedInContainer";
import { TransportExpensePage, TimeCardPage, SignInPage, NoMatch } from ".";
import { AppGrid } from "~/components/organisms";

const PAGES_WITH_NAVBAR = ["/transportation", "/attendance"];

export function App() {
  return (
    <AppGrid>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c"
          rel="stylesheet"
        ></link>
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
          <Route path="/attendance" component={TimeCardPage} />
        </EnsureLoggedInContainer>
        <Route component={NoMatch} />
      </Switch>
    </AppGrid>
  );
}
