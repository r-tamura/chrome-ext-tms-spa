import styled from "styled-components";
import { LG } from "~/styles/font";
import { math } from "polished";
import { ThemeProps } from "~/styles/theme";

const FORM_GROUP_MARGIN_BOTTOM = "20px";
const TEXT_AREA_COLOR = "rgba(0, 0, 0, 0.87)";
const LABEL_COLOR = "rgba(0, 0, 0, 0.54)";
export const TextFieldContainer = styled.div`
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.26);
    outline: 0;
    width: 100%;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    font-size: ${LG};
    font-family: inherit;
    line-height: inherit;
    background-image: none;
    text-indent: 0.5em;
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
  & input:-webkit-autofill:active {
    box-shadow: 0 0 0px 10px ${({ theme }: ThemeProps) => theme.primaryReverse}
      inset;
    -webkit-text-fill-color: ${({ theme }: ThemeProps) => theme.textMain};
  }

  &.tms-textfield--table input {
    border-bottom: none;
  }
`;
