import * as React from "react"
import { Link } from "react-router-dom"

interface INavProps extends React.ClassAttributes<{}> {
  to: string,          // Routeのナビゲーション先
  selected?: boolean,  // 選択中であるか
  disabled?: boolean,  // 無効リンクであるか
}

/**
 * ナビゲーションアイテムコンポーネント
 * サイドナビゲーションの項目
 *
 * @param {string} to Routeのナビゲーション先
 * @param {boolean} selected 選択中であるか(true: 選択中/false: 未選択)
 * @param {boolean} disabled 無効なリンクであるか(true: 無効/false: 有効)
 * @param {React.ReactNode} children 子コンポーネント
 */
const NavItem: React.SFC<INavProps> = ({
  to,
  disabled = false,
  selected = false,
  children,
}) => {
  // Classes
  const defaultClass = "menu-item nav-item"
  const classes = [
    defaultClass,
    selected ? "selected" : "",
    disabled ? "disabled" : "",
  ].filter(s => s !== "").join(" ")

  // Attributes
  const attrs = {
    disabled,
  }
  return disabled
      ? <div className={classes} {...attrs}>{children}</div>
      : <Link to={to} className={classes} {...attrs}>{children}</Link>
}

export {
  INavProps,
}

export default NavItem
