import * as React from "react"
import EventListener from "react-event-listener"
import { Link } from "react-router-dom"

interface IMenuItemProps {
  button?: boolean
  onClick?: (e: React.SyntheticEvent<any>) => any
  to?: string
  disabled?: boolean
}

const MenuItem: React.SFC<IMenuItemProps> = ({
  button = false,
  to,
  children,
  ...otherProps
}) => {

  const Component = !button && to ? Link : "span"
  const classes = []
  if (button) {
    classes.push("")
  }

  const className = classes.join(" ")
  return (
    <li className="menu-item">
      <Component className={className} {...otherProps}>
        {children}
      </Component>
    </li>
  )
}

interface IMenuListProps extends React.ClassAttributes<{}> {

}

const MenuList: React.SFC<IMenuListProps> = ({
  children,
}) => {
  return (
    <ul className={"menu-list"}>
      {children}
    </ul>
  )
}

interface IMenuProps {
  title: string
  open?: boolean
  onClick?: (e: any) => any
  onClose?: (e: any) => any
}

const Menu: React.SFC<IMenuProps> = ({
  title,
  children,
  open = false,
  onClick,
  onClose,
  ...otherProps
}) => {
  if (!open) {
    return null
  }
  return (
    <div className={`menu-main`}>
      <EventListener target={document} onClick={e => onClose(e)} />
      <div className={"menu-item menu-item--strong"}>{title}</div>
      <MenuList>
        {children}
      </MenuList>
    </div>
  )
}

export {
  MenuItem,
  IMenuItemProps,
  MenuList,
  IMenuListProps,
  IMenuProps,
}

export default Menu
