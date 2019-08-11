import { RouteComponentProps, } from "react-router"
import { UnregisterCallback, Href } from "history"

const emptyObject = {}

export function getMockRouterProps<P>(data: P) {

    const location =  {
      hash: "",
      key: "",
      pathname: "",
      search: "",
      state: {},
    }

    const props: RouteComponentProps<P> = {
      match: {
        isExact: true,
        params: data,
        path: "",
        url: "",
      },
      location,
      history: {
        length: 2,
        action: "POP",
        location,
        push: () => emptyObject,
        replace: () => emptyObject,
        go: num => emptyObject,
        goBack: () => emptyObject,
        goForward: () => emptyObject,
        block: t => {
          const temp: UnregisterCallback = null
          return temp
        },
        createHref: t => {
          const temp: Href = ""
          return temp
        },
        listen: t => {
          const temp: UnregisterCallback = null
          return temp
        },
      },
      staticContext: emptyObject,
    }
    return props
}

