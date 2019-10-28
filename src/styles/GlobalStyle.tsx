import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

:root {
  /* --main-font: "Helvetica Neue", Helvetica, "ヒラギノ角ゴ ProN W3",
    "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, sans-serif; */
  --main-font: "M PLUS Rounded 1c", sans-serif;
  --proppotional-font: Consolas, "Courier New", Courier, Monaco, monospace;

  font-family: var(--main-font);
}

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
