import React from "react";
import EventListener from "react-event-listener";
import styled, { css } from "styled-components";

interface IMenuItemProps extends React.HTMLAttributes<{}> {
  // TODO: HTMLタグリストを示す型を利用する
  as?: React.ComponentType | "li" | "button" | "div" | "a";
  style?: React.CSSProperties;
  disabled?: boolean;
  component?: React.ElementType;
}

/**
 * メニューアイテムコンポーネント
 *
 * @param button ボタンコンポーネントを使用するか  true: ボタンコンポーネントを利用
 * @param to     リンク先のパス
 */
const MenuItem: React.SFC<IMenuItemProps> = ({
  as = "div",
  style = null,
  disabled = false,
  children,
  ...otherProps
}) => {
  return (
    <MenuItemStyled as={as} style={style} disabled={disabled} {...otherProps}>
      {children}
    </MenuItemStyled>
  );
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
    <MenuMain>
      <EventListener target={document} onClick={e => onClose(e)} />
      <MenuItemStyled>{title}</MenuItemStyled>
      <MenuList>{children}</MenuList>
    </MenuMain>
  );
};

export { Menu, MenuItem, IMenuItemProps, MenuList, IMenuProps };

const MenuMain = styled.div`
  position: absolute;
  min-width: 16px;
  min-height: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 2px;
  background-color: #fff;
  opacity: 1;
  transform: scale(1, 1) translate(-50px, 57px);
  /* transform-origin: 0px 32px; */
  transition: opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
`;

const MenuList = styled.ul`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const disabledStyle = css`
  cursor: default;
  &:hover {
    opacity: 1;
  }
`;

const MenuItemStyled = styled.div<IMenuItemProps>`
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5em;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  ${({ disabled }) => (disabled ? disabledStyle : "")};
`;
