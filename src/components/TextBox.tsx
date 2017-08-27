import * as React from "react"
import { TextBox } from "~/types"

// フォーム - テキスト
const InputText: React.SFC<TextBox> = ({
  name,
  label,
  value,
  onChange,
  disabled,
}) => (
  <div className="text-field">
    <input
      type="text"
      name={name}
      placeholder={label}
      value={value}
      disabled={disabled}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget
        onChange(input)
      }}
    />
    <label>{label}</label>
  </div>
)

InputText.defaultProps = {
  value: "",
  onChange: () => false,
  disabled: false,
}

export default InputText
