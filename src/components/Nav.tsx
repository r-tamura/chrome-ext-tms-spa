import * as React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import NavItem from "~/components/NavItem"

interface IProps extends React.Props<{}> {
  path: string
}

const Nav: React.SFC<IProps> = ({path}) => {
  const pathname = path.replace(/^\/([^/]+).*$/, "$1")
  return (
    <nav id="side-nav-bar" className="side-nav">
      <ul>
        {/* リンク一覧 */}
        <li>
          <NavItem
            to={"transportation"}
            selected={"transportation" === pathname}
          >
          交通費
          </NavItem>
        </li>
        <li>
          <NavItem
            to={"attendance"}
            selected={"attendance" === pathname}
          >
          勤怠管理
          </NavItem>
        </li>
        <li>
          <NavItem
            to={"resource"}
            disabled={true}
            selected={"resource" === pathname}
          >
          資源管理
          </NavItem>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
