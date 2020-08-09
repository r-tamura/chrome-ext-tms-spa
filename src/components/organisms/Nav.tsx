import React from "react";
import { NavItem } from "~/components/molecules";
import styled from "styled-components";
import { MID } from "~/styles/zIndex";
import { STANDARD } from "~/styles/boxShadow";
import { ThemeProps } from "~/styles/theme";

interface INavProps extends React.Props<{}> {
  path: string;
}

export const Nav: React.SFC<INavProps> = ({ path }) => {
  const pathname = path.replace(/^\/([^/]+).*$/, "$1");
  return (
    <NavStyled id="side-nav-bar">
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
          <NavItem to={"attendance"} selected={"attendance" === pathname}>
            勤怠管理
          </NavItem>
        </li>
        {/* TODO: 資源管理は未実装 */}
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
    </NavStyled>
  );
};

const NavStyled = styled.nav<ThemeProps>`
  background-color: ${({ theme }) => theme.primary};
  z-index: ${MID};
  box-shadow: ${STANDARD};
`;
