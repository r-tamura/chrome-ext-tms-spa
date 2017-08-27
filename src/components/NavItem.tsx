import * as React from "react"
import { Link } from "react-router-dom"

interface NavProps extends React.Props<{}> {
  to: string,         // Routeのナビゲーション先
  selected?: boolean,  // 選択中であるか
  disabled?: boolean,  // 無効リンクであるか
  children?: React.ReactNode
}

/* リンクコンポーネントを生成 */
const NavItem: React.SFC<NavProps> = ({
  to,
  disabled,
  selected,
  children,
}) => {
  // 選択中のリンクの場合
  const selectedClass = selected ? "selected " : ""
  // リンクが選択不可の場合
  const disableClass = disabled ? "disabled " : ""
  return (
    <div className={`nav-item ${selectedClass} ${disableClass}`}>
      <Link to={to} style={selected ? { color: "red"} : {}}>{children}</Link>
    </div>
  )
}
NavItem.defaultProps = {
  selected: false,
  disabled: false,
}

export default NavItem
