import React from "react";
import { ThemeProvider } from "styled-components";
import { telema } from "~/styles/theme";

export const AppThemeProvider: React.SFC<{ children: JSX.Element }> = ({
  children
}) => <ThemeProvider theme={telema}>{children}</ThemeProvider>;
