import React from "react";
import styled from "styled-components";
import { ThemeProps } from "~/styles/theme";

interface TableProps {
  header?: string[];
}
const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;
  font-size: 14px;
`;

export const Table: React.FC<TableProps> = ({ header, children }) => {
  return (
    <StyledTable>
      {header && header.length > 0 && (
        <thead>
          <Tr>
            {header.map((name, i) => (
              <Td key={i} th>
                {name}
              </Td>
            ))}
          </Tr>
        </thead>
      )}
      <tbody>{children}</tbody>
    </StyledTable>
  );
};

interface TrProps {
  /** hover時に要素の色を変更するかを指定します */
  readonly hover?: boolean;
}

export const Tr = styled.tr`
  &:hover {
    background-color: ${(props: TrProps) =>
      props.hover ? "rgba(0, 0, 0, 0.03)" : "inherit"};
    transition: ${(props: TrProps) =>
      props.hover ? "background-color 0.1s ease-in-out" : "inherit"};
  }
`;

interface TdProps extends ThemeProps {
  /** th/td要素であるかを指定します */
  readonly th?: boolean;
  readonly type?: "standard" | "border" | "stripe";
}

const thstyles = `
  &:hover{
      text - align: left;
    border-bottom: 2px solid var(--input-border-color);
  }
`;
export const Td = styled.td`
  display: table-cell;
  padding: 8px;
  vertical-align: middle;
  line-height: 1.3;
  cursor: default;
  ${(props: TdProps) => (props.th ? thstyles : "")}
    border-bottom: ${(props: TdProps) =>
      props.type === "border"
        ? `1px solid ${props.theme.inputPlaceHolder}`
        : "none"};
`;
