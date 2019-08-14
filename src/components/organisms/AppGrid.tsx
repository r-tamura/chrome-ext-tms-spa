import styled from "styled-components";

export const AppGrid = styled.div`
  display: grid;
  /* header content (contentの高さは view height - headerの高さ*/
  grid-template-rows: 50px minmax(calc(100vh - 50px), auto);
  /* grid-template-rows: 50px 1fr; */
  grid-template-columns: 200px 1fr;

  & > .app-header {
    grid-column: 1 / 2 span;
  }

  & > .app-content-full {
    grid-column: 1 / 2 span;
  }

  & > .app-navbar {
    grid-column: 1 / 1 span;
  }

  & > .app-content-with-navbar {
    grid-column: 2 / 1 span;
  }
`;
