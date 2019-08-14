import React, { FC, SyntheticEvent, useState } from "react";
import Menu, { MenuItem } from "~/components/Menu";
import styled from "styled-components";
import { lighten } from "polished";
import { HIGH } from "~/styles/zIndex";
import { STANDARD } from "~/styles/boxShadow";
import { XL } from "~/styles/font";
import { Theme } from "~/styles/theme";
import { useUser } from "~/stores/hooks";

interface IHeaderUserProps {
  onLogout: () => void;
}

const HeaderUser: FC<IHeaderUserProps> = ({ onLogout, children }) => {
  const [anchorElm, setAnchorElm] = useState(null);

  const menuOpened = anchorElm != null;
  return (
    <UserMenu>
      <ClickableSpan id={"header-user-button"} onClick={handleClick}>
        {children}
      </ClickableSpan>
      <Menu title={"User Menu"} onClose={handleClose} open={menuOpened}>
        <MenuItem id={"logout"} button onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </UserMenu>
  );

  function handleClick(e: SyntheticEvent<Element>) {
    setAnchorElm(e.currentTarget);
  }

  function handleClose(_: MouseEvent) {
    setAnchorElm(null);
  }

  function handleLogout(e: SyntheticEvent<Element, MouseEvent>) {
    handleClose(e.nativeEvent);
    onLogout();
  }
};

/**
 * アプリケーションヘッダーコンポーネント
 */
export const AppHeader: FC = () => {
  const { logout, name: username } = useUser();
  return (
    <Root className="app-header">
      <CompanyLogoAnchor href="http://www.telema.jp/">
        <img src="https://www.telema.co.jp/images/logo_sp.svg" alt="logo" />
      </CompanyLogoAnchor>
      <HeaderUser onLogout={logout}>{username}</HeaderUser>
    </Root>
  );
};

const ClickableSpan = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

const CompanyLogoAnchor = styled.a`
  display: block;
  width: 40px;
  &:focus,
  &:hover {
    opacity: 0.8;
    text-decoration: none;
  }
`;

const Root = styled.header`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0 5px;
  background-color: ${({ theme }) => theme.primaryReverse};
  font-size: ${XL};
  font-weight: bolder;
  line-height: 50px;

  z-index: ${HIGH};
  box-shadow: ${STANDARD};
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  color: ${({ theme }) => theme.textMain};

  .person-icon {
    background-image: url(chrome-extension://odbcdehjjdjjnpenjbblpmkkibggblpe/chrome/assets/images/person.svg);
    height: 50%;
    width: 25px;
    display: block;
  }

  &:hover {
    color: ${({ theme }: { theme: Theme }) => lighten(0.3, theme.textMain)};
  }
`;
