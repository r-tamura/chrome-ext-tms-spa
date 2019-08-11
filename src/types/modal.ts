import { TextBox, SelectBox, FormItemType, FormItemBase } from "./ui-form";

export type FormModalItem = FormModalTextBox | FormModalSelectBox;

export interface FormModalTextBox extends TextBox {
  type: FormItemType.TEXT;
}

export interface FormModalSelectBox extends SelectBox {
  type: FormItemType.SELECT;
}
