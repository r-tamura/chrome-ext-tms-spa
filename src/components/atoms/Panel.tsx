import styled from "styled-components";
import { ThemeProps } from "~/styles/theme";

export const Panel = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 0;
  background-color: ${({ theme }: ThemeProps) => theme.primaryReverse};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 2px 0 rgba(0, 0, 0, 0.12);
`;
