export enum FormItemType {
  SELECT = "type/select",
  TEXT = "type/text",
}
interface FormItemBase extends Partial<HTMLElement> {
  name: string
  label: string
  value?: string | number
  disabled?: boolean
}

export interface TextBox extends FormItemBase {
  type: FormItemType.TEXT
  onChange?: (input: HTMLInputElement) => void
}

export type SelectBoxOptions = { items: object[], valueKey: string, labelKey: string }
export interface SelectBox extends FormItemBase {
  type: FormItemType.SELECT
  options: SelectBoxOptions
  onChange?: (input: HTMLSelectElement) => void
}

export type FormItem = TextBox | SelectBox
