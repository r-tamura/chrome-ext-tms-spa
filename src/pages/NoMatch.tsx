import * as React from "react"
import { RouteComponentProps } from "react-router-dom"

import { RootState } from "~/modules"

class NoMatch extends React.Component<RouteComponentProps<{}>, {}> {
  public render() {
    return (
    <main className="main">
      <h1>Not Found 404</h1>
    </main>
    )
  }
}

export default NoMatch
