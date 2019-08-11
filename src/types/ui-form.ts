export enum FormItemType {
  SELECT = "type/select",
  TEXT = "type/text"
}

export interface FormItemBase extends Partial<HTMLElement> {
  label?: string;
  name?: string;
  value?: string | number;
  disabled?: boolean;
  additionalClass?: string | string[]; // フォーム追加クラス
}

export interface TextBox extends FormItemBase {
  onChange?: (input: HTMLInputElement) => void;
}

export type SelectBoxOptions = {
  items: object[];
  valueKey: string;
  labelKey: string;
};
export interface SelectBox extends FormItemBase {
  options: SelectBoxOptions;
  onChange?: (input: HTMLSelectElement) => void;
}

export type FormItem = TextBox | SelectBox;
