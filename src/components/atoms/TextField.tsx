import React from "react";
import { FormItemContainer, FormItem } from "./Form";
import styled, { css } from "styled-components";
import { ThemeProps } from "~/styles/theme";

export type InputProps = FormItem<HTMLInputElement>;
type LabelProps = FormItem<HTMLLabelElement>;

// フォーム Input
// Reference to 'Forward Refs': dhttps://reactjs.org/docs/forwarding-refs.html
export const Input: React.SFC<InputProps> = React.forwardRef(
  ({ name, label, error, ...others }, ref: React.Ref<HTMLInputElement>) => {
    // styled-componentsの返すinputはstring型でTypeScriptに定義されているHTMLのinput型の属性asの型が異なるため
    return (
      <FormItemContainer>
        <StyledInput
          name={name}
          error={error}
          {...others}
          as="input"
          ref={ref}
        />
        {label && (
          <StyledLabel error={error} htmlFor={name}>
            {label}
          </StyledLabel>
        )}
      </FormItemContainer>
    );
  }
);

const errorStyleInput = css`
  color: ${props => props.theme.danger} !important;
  border-bottom-color: ${props => props.theme.danger} !important;
  border-bottom-width: 2px !important;
`;
const errorLabelStyle = css`
  color: ${props => props.theme.danger} !important;
  font-weight: bold;
`;
const StyledInput = styled.input<InputProps>`
  ${({ error }) => (error ? errorStyleInput : "")};
`;

const StyledLabel = styled.label<LabelProps>`
  ${({ error }) => (error ? errorLabelStyle : "")};
`;
