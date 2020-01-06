import React from "react";
import styled from "styled-components";
import { math } from "polished";
import { ThemeProps } from "~/styles/theme";
import { MD } from "~/styles/font";

export type SelectBoxOptions<T> = {
  items: T[];
  /** SelectBox内部で扱われるTのプロパティ値を返す関数 */
  value(t: T): string;
  /** SelectBoxに表示されるTのプロパティ値を返す関数 */
  label(t: T): string;
};
export interface SelectBoxProps<T> extends React.HTMLProps<HTMLSelectElement> {
  label?: string;
  options?: SelectBoxOptions<T>;
}

/**
 *  `select`ボックス
 *   Reference to 'Forward Refs': https://reactjs.org/docs/forwarding-refs.html
 */
export const SelectBox = React.forwardRef(
  <T, _>(
    { label, options, ...otherProps }: SelectBoxProps<T>,
    ref: React.Ref<HTMLSelectElement>
  ) => {
    return (
      <SelectContainer>
        <select {...otherProps} ref={ref}>
          {options.items.map(item => (
            <option key={options.value(item)} value={options.value(item)}>
              {options.label(item)}
            </option>
          ))}
        </select>
        <label>{label}</label>
      </SelectContainer>
    );
  }
);

const ITEM_HEIGHT = "30px";
const ITEM_MARGIN_BOTTOM = "20px";
const SelectContainer = styled.div`
  font-family: ${({ theme }: ThemeProps) => theme.fontFamily};
  display: block;
  padding-top: calc(1.25 * ${MD});
  margin-bottom: ${ITEM_MARGIN_BOTTOM};
  position: relative;

  &:focus {
    outline: 0;
  }

  & > select {
    /* Layout */
    display: block;
    height: ${math(`${ITEM_HEIGHT} + 1px`)};
    width: 100%;
    font-size: 100%;

    /* Look and feel */
    appearance: none;
    outline: none;
    border: none;
    border-bottom: 1px solid ${({ theme }: ThemeProps) => theme.formBorderColor};
    border-radius: 0px;
    box-shadow: none;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNiIgd2lkdGg9IjEwIj48cG9seWdvbiBwb2ludHM9IjAsMCAxMCwwIDUsNiIgc3R5bGU9ImZpbGw6cmdiYSgwLDAsMCwuMjQpOyIvPjwvc3ZnPg==");
    background-repeat: no-repeat;
    background-position: right center;
    background-color: inherit;
    cursor: pointer;

    font-family: inherit;
    line-height: inherit;

    padding: 0 25px 0 0;
    text-indent: 8px;

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
    color: rgba(0, 0, 0, 0.54);
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  &.tms-select--table {
    padding-top: 0;
    border: 0;
    height: 100%;
    margin-bottom: 0px;
  }
`;
