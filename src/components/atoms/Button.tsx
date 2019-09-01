import React from "react";
import styled from "styled-components";
import { transparentize, lighten } from "polished";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { cond, T } from "ramda";
import { ThemeProps, ColorValue } from "~/styles/theme";
import { MD, BOLD, XL } from "~/styles/font";

type Color = "default" | "primary" | "secondary" | "danger";
type PropsWithTheme = IButtonProps & ThemeProps;
interface IButtonProps extends React.ButtonHTMLAttributes<{}> {
  /**
   * ボタンの種類 デフォルト: "text"
   */
  variant?: "contained" | "text" | "circle" | "link" | "icon";
  color?: Color;
  /* ボタンをblock要素とするか コンテナコンポーネントに対して最大幅と同じになる */
  block?: boolean;
  /** ボタンのアウトラインを表示するか  */
  outline?: boolean;

  /** variantがlinkの場合には必須 */
  to?: string;
  size?: string;
}

export const Button: React.SFC<IButtonProps> = ({
  variant = "text",
  color = "default",
  to = "",
  children,
  block = false,
  ...otherProps
}) => {
  if (variant === "link") {
    return (
      <Link to="to" {...otherProps}>
        {children}
      </Link>
    );
  }

  const Component = {
    text: TextButton,
    contained: ContainedButton,
    circle: CircleButton,
    icon: IconButton
  }[variant];

  return (
    <Component color={color} {...otherProps}>
      {children}
    </Component>
  );
};

function getThemeTextColor({ theme, color }: PropsWithTheme) {
  const colormap: { [P in Color]: ColorValue } = {
    default: theme.textMain,
    primary: theme.primary,
    secondary: theme.secondary,
    danger: theme.danger
  };
  return colormap[color];
}

function getThemeColor({ theme, color }: PropsWithTheme) {
  const colormap: { [P in Color]: ColorValue } = {
    default: theme.buttonDefault,
    primary: theme.primary,
    secondary: theme.secondary,
    danger: theme.danger
  };
  return colormap[color];
}

function isColorDefault(props: PropsWithTheme) {
  return props.color === "default";
}

function hoveredBackgroundColorText(props: PropsWithTheme) {
  const transparentizeTheme = compose(
    transparentize(0.95),
    getThemeColor
  );
  return cond([[isColorDefault, () => "#0000000B"], [T, transparentizeTheme]])(
    props
  );
}

const ligthen20percents = compose(
  lighten(0.2),
  getThemeColor
);

function disabledTextColor(props: PropsWithTheme) {
  const transparentizeTextTheme = compose(
    transparentize(0.7),
    getThemeTextColor
  );
  return transparentizeTextTheme(props);
}

const boxshadow =
  "rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px";
const boxshadowS = "0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2)";
const ButtonBase = styled.button`
  font-weight: ${BOLD};
  font-size: ${MD};
  font-family: ${({ theme }: ThemeProps) => theme.fontFamily};
  text-transform: uppercase;

  transition: all 0.2s ease-in-out;
  display: inline-block;
  padding: 6px 26px;
  border-radius: 4px;
  cursor: pointer;
  touch-action: manipulation;
  background-image: none;
  text-align: center;
  line-height: 36px;
  vertical-align: middle;
  white-space: nowrap;
  user-select: none;
  letter-spacing: 0.03em;
  position: relative;
  overflow: hidden;

  box-shadow: ${boxshadow};
  width: ${(props: PropsWithTheme) => (props.block ? "100%" : "default")};

  border: ${(props: PropsWithTheme) =>
    props.outline ? `2px solid ${getThemeColor(props)}` : "none"};

  &[disabled],
  &[disabled]:active,
  &[disabled]:focus,
  &[disabled]:hover {
    border-color: ${(props: PropsWithTheme) =>
      props.outline
        ? `${compose(
            transparentize(0.95),
            getThemeColor
          )(props)}`
        : "none"};
  }

  &:active,
  &:focus,
  &:hover {
    outline: 0;
  }
`;

const ContainedButton = styled(ButtonBase)`
  color: ${(props: PropsWithTheme) =>
    isColorDefault(props) ? props.theme.textMain : props.theme.white};
  background-color: ${getThemeColor};

  &[disabled],
  &[disabled]:active,
  &[disabled]:focus,
  &[disabled]:hover {
    color: ${({ theme }: ThemeProps) => theme.textGray};
    background-color: ${getThemeColor};
    filter: none;
    cursor: default;
    box-shadow: ${boxshadow};
  }

  &:active,
  &:focus,
  &:hover {
    background-color: ${ligthen20percents};
    box-shadow: ${boxshadowS};
  }
`;

const CircleButton = styled(ContainedButton)`
  font-size: ${XL};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding-left: 0;
  padding-right: 0;
`;

const TextButton = styled(ButtonBase)`
  color: ${getThemeTextColor};
  box-shadow: none;
  background-color: transparent;

  &:hover {
    background-color: ${hoveredBackgroundColorText};
  }

  &[disabled],
  &[disabled]:active,
  &[disabled]:focus,
  &[disabled]:hover {
    color: ${disabledTextColor};
    background-color: transparent;
    cursor: default;
  }
`;

const IconButton = styled(ButtonBase)`
  color: ${getThemeTextColor};
  box-shadow: none;
  background-color: transparent;
  padding: 5px;

  &:hover {
    color: ${ligthen20percents};
  }

  &[disabled],
  &[disabled]:active,
  &[disabled]:focus,
  &[disabled]:hover {
    color: ${disabledTextColor};
    background-color: transparent;
    cursor: default;
  }
`;

interface ButtonGroupProps {
  readonly place?: "left" | "right";
}

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: ButtonGroupProps) =>
      props.place === "left" ? "flex-start" : "flex-end"}
    & > button {
    margin-right: 10px;
  }
`;
