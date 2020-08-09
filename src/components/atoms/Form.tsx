import React from "react";
import { math } from "polished";
import styled from "styled-components";
import { ReactHookFormError, RegisterInput } from "react-hook-form/dist/types";
import { LG } from "~/styles/font";
import { ThemeProps } from "~/styles/theme";
import { Input } from "./TextField";

type FormLabel = string;

type FormRegister = (
  refOrValidateRule: any,
  validateRule?: RegisterInput | undefined
) => ((ref: any) => void) | undefined;
type FormClear<Name> = (name?: Name | Name[] | undefined) => void;
export interface FormItemBase {
  label?: FormLabel;
  error?: boolean;
}

export type FormItem<T extends Element> = React.HTMLProps<T> & FormItemBase;

const INNER_HEIGHT = "26px";
const FORM_GROUP_MARGIN_BOTTOM = "20px";
const TEXT_AREA_COLOR = "rgba(0, 0, 0, 0.87)";
const LABEL_COLOR = "rgba(0, 0, 0, 0.54)";
export const FormItemContainer = styled.div`
  font-family: ${({ theme }: ThemeProps) => theme.fontFamily};
  display: block;
  padding-top: ${math(`1.25 * ${LG}`)};
  margin-bottom: ${FORM_GROUP_MARGIN_BOTTOM};
  position: relative;

  & input,
  & textarea {
    display: block;
    background-color: transparent;
    color: ${TEXT_AREA_COLOR};
    border: none;
    border-bottom: 1px solid ${({ theme }: ThemeProps) => theme.formBorderColor};
    outline: 0;
    height: ${INNER_HEIGHT};
    width: 100%;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    font-size: 100%;
    font-family: inherit;
    line-height: inherit;
    background-image: none;
    text-indent: 0.5em;

    &:focus {
      border-color: ${({ theme }: ThemeProps) => theme.formBorderColorFocused};
      border-width: 2px;
    }
  }

  & > label {
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
    color: ${LABEL_COLOR};
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  & input[type="time"] {
    cursor: pointer;
  }

  /*
   * autocomplete styles in webkit browsers
   * https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/
  */
  & input:-webkit-autofill,
  & input:-webkit-autofill:hover,
  & input:-webkit-autofill:focus,
  & input:-webkit-autofill:active,
  & textarea:-webkit-autofill,
  & textarea:-webkit-autofill:hover,
  & textarea:-webkit-autofill:focus,
  & select:-webkit-autofill,
  & select:-webkit-autofill:hover,
  & select:-webkit-autofill:focus {
    box-shadow: ${({ theme }: ThemeProps) =>
      `inset 0 0 0px 20px  ${theme.primaryReverse}`};
    -webkit-text-fill-color: ${({ theme }: ThemeProps) => theme.textMain};
  }
`;

export interface RequiredInputProps<FormData extends { [s: string]: string }> {
  name: Extract<keyof FormData, string>;
  label: string;
  placeholder: string;
  defaultValue: string;
  error: ReactHookFormError;
  register: FormRegister;
  clearError: FormClear<keyof FormData>;
}

export function RequiredInput<FormData extends { [s: string]: string }>({
  label,
  register,
  clearError,
  ...otherProps
}: RequiredInputProps<FormData>) {
  return (
    <Input
      {...otherProps}
      error={!!otherProps.error}
      label={label + " *"}
      ref={register({ required: `${label}は必須入力です` })}
      onFocus={() => clearError(otherProps.name)}
    />
  );
}
