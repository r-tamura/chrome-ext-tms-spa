import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MenuItem } from "./Menu";
import styled, { ThemeContext } from "styled-components";

interface INavProps {
  to: string; // Routeのナビゲーション先
  selected?: boolean; // 選択中であるか
  disabled?: boolean; // 無効リンクであるか
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
export const NavItem: React.SFC<INavProps> = ({
  to,
  disabled = false,
  selected = false,
  children
}) => {
  const theme = useContext(ThemeContext);
  const StyledLink = disabled ? DisabeldLink : BaseLink;

  return (
    <MenuItem
      disabled={disabled}
      style={
        selected
          ? {
              backgroundColor: theme.primaryDark
            }
          : null
      }
    >
      <StyledLink to={to}>{children}</StyledLink>
    </MenuItem>
  );
};

const BaseLink = styled(Link)`
  color: ${({ theme }) => theme.white};
  display: block;
`;

const DisabeldLink = styled.div`
  color: ${({ theme }) => theme.white};
  opacity: 0.7;
`;
