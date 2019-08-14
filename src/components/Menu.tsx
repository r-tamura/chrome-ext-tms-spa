import * as React from "react";
import EventListener from "react-event-listener";
import { Link } from "react-router-dom";

interface IMenuItemProps extends React.HTMLAttributes<{}> {
  button?: boolean;
  onClick?: (e: React.SyntheticEvent<any>) => any;
  to?: string;
  disabled?: boolean;
}

/**
 * メニューアイテムコンポーネント
 *
 * @param button ボタンコンポーネントを使用するか  true: ボタンコンポーネントを利用
 * @param to     リンク先のパス
 */
const MenuItem: React.SFC<IMenuItemProps> = ({
  button = false,
  to,
  children,
  ...otherProps
}) => {
  const Component = !button && to ? Link : "button";
  const classes: string[] = [];
  const className = classes.join(" ");
  return (
    <li className="menu-item">
      <Component className={className} {...otherProps} to={to}>
        {children}
      </Component>
    </li>
  );
};

interface IMenuListProps extends React.ClassAttributes<{}> {}

const MenuList: React.SFC<IMenuListProps> = ({ children }) => {
  return <ul className={"menu-list"}>{children}</ul>;
};

interface IMenuProps {
  title: string;
  open?: boolean;
  onClose?: (e: MouseEvent) => void;
}

const Menu: React.SFC<IMenuProps> = ({
  title,
  children,
  open = false,
  onClose,
  ...otherProps
}) => {
  if (!open) {
    return null;
  }
  return (
    <div className={`menu-main`}>
      <EventListener target={document} onClick={e => onClose(e)} />
      <div className={"menu-item menu-item--strong"}>{title}</div>
      <MenuList>{children}</MenuList>
    </div>
  );
};

export { MenuItem, IMenuItemProps, MenuList, IMenuListProps, IMenuProps };

export default Menu;
