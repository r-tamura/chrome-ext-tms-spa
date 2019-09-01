import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
*, *:before, *:after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}
`;
