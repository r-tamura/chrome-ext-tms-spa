import * as React from "react"
import { prop } from "ramda"
import { SelectBoxOptions, SelectBox } from "~/types"

/**
 *  オプションタグリストのElementを生成します
 */
function renderOptions(options: SelectBoxOptions, hasNotSelected: boolean = true): JSX.Element[] {
  const $notSelected = hasNotSelected ? [<option key={0} className="not-selected" value="-1"> 未選択 </option>] : []
  const getValue = prop(options.valueKey)
  const getLabel = prop(options.labelKey)
  const $options = options.items.map(e => (
    <option key={getValue(e)} value={getValue(e)}>{getLabel(e)}</option>
  ))
  // return [ ...$notSelected, ...$options ]
  return $options
}

/**
 *  共通セレクトボックス
 */
const SelectBox: React.SFC<SelectBox> = ({
  name,
  label,
  value,
  options,
  onChange,
}) => (
      <div className="select-wrapper v-margin">
        <select
          name={name}
          value={value || prop(options.valueKey, options.items[0])}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange(e.currentTarget)
          }}
        >
          {renderOptions(options)}
        </select>
        <label>{label}</label>
      </div>
    )

SelectBox.defaultProps = {
  name: "",
}

export default SelectBox

// export class SelectForTable extends SelectBox {
//   render() {
//     const select = renderSelect()
//     const label = renderLabel()
//     return (
//       <div className="select-wrapper-for-table">
//         {select}
//         {label}
//       </div>
//     )
//   }
// }


// // フォーム - セレクト
// SelectBox = ({
//   name,
//   options,
//   onChange = (e) => {},
//   selected = 0, 
//   disabled = false
// }) => (
//   <div className="select-wrapper v-margin">
//     {/* 未選択の場合は"not-selected"クラスを付加 */}
//     <select
//       className = { selected ? "" : "not-selected" }
//       value={selected.toString()}
//       onChange={(e: React.SyntheticEvent) => {
//         const self = (e.currentTarget as HTMLSelectElement)
//         self.className = self.options[self.selectedIndex].classList.item(0) || ""
//         onChange(e)
//       }}
//     >
//       {createOptions(options)}
//     </select>
//     {name && <label>{name}</label>}
//   </div>
// )
