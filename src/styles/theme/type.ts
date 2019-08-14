import { ThemeProps as StyledComponentsThemProps } from "styled-components";

type StyleValue = string;

export interface Theme {
  primaryHeavyLight: StyleValue;
  primaryLight: StyleValue;
  primary: StyleValue;
  primaryDark: StyleValue;
  primaryHeavyDark: StyleValue;
  white: StyleValue;
  primaryReverse: StyleValue;
  primaryReverseDark: StyleValue;
  secondary: StyleValue;
  danger: StyleValue;
  hoveredBg: StyleValue;
  textMain: StyleValue;
  textGray: StyleValue;
}

export type ThemeProps = StyledComponentsThemProps<Theme>;
