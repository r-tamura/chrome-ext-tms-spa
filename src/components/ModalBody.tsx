import * as React from "react"
import { pluck, prop } from "ramda"
import SelectBox from "~/components/SelectBox"
import TextBox from "~/components/TextBox"
import { FormItem, TextBox as TextBoxProps, SelectBox as SelectBoxProps, FormItemType } from "~/types"

interface IProps extends React.Props<{}> {
  formItems: FormItem[]
  onClose: () => void
  onOKClick: (state: object) => void
  onCancelClick?: (state: object) => void
}

interface IState {
  byId: { [s: string]: FormItem & { type: string } }
  allIds: string[]
}

export default class ModalBody extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      byId: props.formItems.reduce((acc, item) =>
        ({ ...acc, [item.name]: { ...item, value: this.getValue(item) }}),
        {},
      ),
      allIds: pluck("name", props.formItems),
    }
  }

  public render() {
    const { onClose, onOKClick, onCancelClick } = this.props
    const formItems = this.getFormItems(this.state)
    return (
      <div className="modal-body">
        <div className="panel">
          {formItems.map(e => this.renderFormItem(e.type, e))}
          <div className="confirm-section clearfix">
            <div className="button-group">
              <button
                className="default-button confirm btn-raised"
                onClick={() => onCancelClick ? onCancelClick(this.getState(this.state)) : onClose()}
              >
                cancel
              </button>
              <button
                className="secondary-button confirm btn-raised"
                onClick={() => {
                  onOKClick(this.getState(this.state))
                  onClose()
                }}
              >
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private onFormChange(element: HTMLInputElement | HTMLSelectElement) {
    const { name, value } = element
    const nextState = {
      byId: {
        ...this.state.byId,
        [name]: {
          ...this.state.byId[name],
          value,
        },
      },
    }
    this.setState(nextState)
  }

  private renderFormItem(type: string = "TEXT", props: FormItem): JSX.Element {
    switch (type) {
    case FormItemType.SELECT:
      return  (
        <SelectBox
          key={props.name}
          {...props as SelectBoxProps}
          onChange={(input: HTMLSelectElement) => this.onFormChange(input)}
        />
      )
    default:
      return (
        <TextBox
          key={props.name}
          {...props as TextBoxProps}
          onChange={(input: HTMLInputElement) => this.onFormChange(input)}
        />
      )
    }
  }

  private getValue(formItem: FormItem): number | string {
    switch (formItem.type) {
    case FormItemType.SELECT:
      return formItem.value || prop(formItem.options.valueKey, formItem.options.items[0])
    default:
      return formItem.value
    }
  }

  private getFormItems = (state: IState) => state.allIds.map(id => state.byId[id])
  private getState = (state: IState) => state.allIds.reduce((acc, v) => ({ ...acc, [v]: state.byId[v].value }), {})

  // /* よく使う交通費登録データをお気に入りとして追加 */
  // private onOKClick = (e: React.MouseEvent<HTMLElement>) => {
  //   const { isFavorite, favorites, onClose, onOKClick } = this.props
  //   const { expenseId, strdate, favorite } = this.state
  //   // お気に入りから登録の場合はストアクラスからレコード取得
  //   const record = isFavorite ? favorites[favorite] : this.state
  //   try {
  //       // 交通費IDが設定されている場合は”更新"", そうでない場合は"新規登録"を行う
  //       // if (expenseId) {
  //       //   await TCActionCreator.update(expenseId, strdate, record)
  //       // } else {
  //       //   await TCActionCreator.register(strdate, record)
  //       // }
  //       onOKClick(record, e)
  //       onClose()
  //   } catch (err) {
  //       console.error(err.statck)
  //   }
  // }
}
