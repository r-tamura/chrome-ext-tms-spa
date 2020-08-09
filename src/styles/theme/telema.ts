import { Theme } from "./type";

const PRIMARY = "hsl(206, 100%, 31%)";
const SECONDARY = "#689F38";
const DARKGRAY = "rgba(0, 0, 0, 0.26)";
const GRAY = "rgba(0, 0, 0, 0.16)";
const LIGHTGRAY = "rgba(0, 0, 0, 0.08)";
const ERROR = "#D32F2F";
export const telema: Theme = {
  fontFamily: `"M PLUS Rounded 1c", sans-serif`,
  primaryHeavyLight: "hsl(199, 91%, 64%);",
  primaryLight: "hsl(201, 98%, 41%);",
  primary: PRIMARY,
  primaryDark: "hsl(208, 80%, 27%)",
  primaryHeavyDark: "hsl(208, 80%, 27%)",
  white: "rgb(253, 253, 253)",
  black: "rgb(5, 5, 5)",
  primaryReverse: "hsla(0, 0%, 99%, 1);",
  primaryReverseDark: "hsla(0, 0%, 99%, 0.5);",
  secondary: SECONDARY,
  danger: ERROR,
  hoveredBg: "rgba(0, 0, 0, 0.03)",
  textMain: "hsl(0, 5%, 5%)",
  textGray: "hsla(0, 5%, 5%, .25)",
  inputPlaceHolder: "rgba(0, 0, 0, 0.09)",
  formBorderColor: GRAY,
  formBorderColorFocused: PRIMARY,
  formBorderColorDisabled: LIGHTGRAY,
  formBorderColorError: ERROR,
  buttonDefault: LIGHTGRAY
};
