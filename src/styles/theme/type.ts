import { ThemeProps as StyledComponentsThemProps } from "styled-components";

export type FontFamilyValue = string;
export type ColorValue = string;

export interface Theme {
  fontFamily: FontFamilyValue;
  /* color */
  primaryHeavyLight: ColorValue;
  primaryLight: ColorValue;
  primary: ColorValue;
  primaryDark: ColorValue;
  primaryHeavyDark: ColorValue;
  white: ColorValue;
  black: ColorValue;
  primaryReverse: ColorValue;
  primaryReverseDark: ColorValue;
  secondary: ColorValue;
  danger: ColorValue;
  hoveredBg: ColorValue;

  /* text */
  textMain: ColorValue;
  textGray: ColorValue;

  /* form */
  inputPlaceHolder: ColorValue;
  formBorderColor: ColorValue;
  formBorderColorFocused: ColorValue;
  formBorderColorDisabled: ColorValue;
  formBorderColorError: ColorValue;
  buttonDefault: ColorValue;
}

export type ThemeProps = StyledComponentsThemProps<Theme>;
