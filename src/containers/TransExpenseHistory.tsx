import * as React from "react"
import * as ReactDOM from "react-dom"
import { connect } from "react-redux"
import { find, propEq } from "ramda"
import ModalContainer from "~/components/ModalContainer"
import ModalBody from "~/components/ModalBody"
import { RootState, getTransExpenses, getMaster } from "~/modules"
import { templateViewToModel } from "~/helpers/convert-type"
import { CURRENCY } from "~/helpers/_const"
import { Project, Usage, Objective, TransExpenseView, TransExpenseTemplateView, FormItemType } from "~/types"

interface IProps extends React.Props<{}> {
  expenses: TransExpenseView[]
  templates: TransExpenseTemplateView[]
  projects: Project[]
  usages: Usage[]
  objectives: Objective[]
  deleteExpense: (expenseId: number) => void
  createExpense: (expense: Partial<TransExpenseView>) => void
  updateExpense: (expense: Partial<TransExpenseView>) => void
  createExpenseFromTemplate: (templateId: string, strdate: string) => void
}

interface IState {
  isModalOpen?: boolean // 編集モーダルがオープン状態であるか
  selected?: number // 選択中の交通費ID
  useTemplate?: boolean
}

/**
 * 登録済み交通費リストセクション
 */
class TransExpenseHistory extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = this.getInitState(props)
  }

  public render() {
    const { expenses, createExpense, deleteExpense, updateExpense } = this.props
    const { isModalOpen, useTemplate } = this.state
    const $expenses = this.renderExpenses(expenses, deleteExpense)
    const $modalBody =
      isModalOpen
      ? useTemplate
      ? this.renderCreateFromTemplateModal(this.props, this.state)
      : this.renderEditorModal(this.props, this.state)
      : null
    return (
      <div>
        {/* 交通費登録テーブル */}
        {$expenses}
        {/* 新規登録ボタン */}
        <div className="clearfix">
          <div className="button-group">
            <button
              className="secondary-button btn-raised"
              onClick={this.openCreateFromTemplateModal}
            >
            テンプレートから新規登録
            </button>
            <button className="secondary-button circle btn-raised" onClick={this.openAddModal}>+</button>
          </div>
        </div>

        {/* 編集モーダル */}
        <ModalContainer
          isOpen={isModalOpen}
          onClose={this.closeModal}
        >
          {$modalBody}
        </ModalContainer>
      </div>
    )
  }

  private renderExpenses = (expenses: TransExpenseView[], deleteExpense: (expenseId: number) => void): JSX.Element  => {
    const headers = ["#", "利用日", "プロジェクト", "利用区分", "目的", "金額", "", ""]
    return (
      <div className="mr-records">
        <table className="tms-table tms-table--bordered">
        <thead>
          <tr>
          {headers.map((e, i) => (<th key={i}>{e}</th>))}
          </tr>
        </thead>
        <tbody>
        {expenses.length > 0 && expenses.map((e, i) => (
          <tr key={e.expenseId}>
            <td className="record-id">{i + 1}</td>
            <td>{e.strdate}</td>
            <td>{e.project.name}</td>
            <td>{e.usage.name}</td>
            <td>{e.objective.name}</td>
            <td>{CURRENCY.format(e.cost)}</td>
            <td><button className="edit button-rev" onClick={() => this.openEditModal(e.expenseId)}>編集</button></td>
            <td><button className="remove button-rev" onClick={() => deleteExpense(e.expenseId)}>削除</button></td>
          </tr>
        ))}
        </tbody>
        </table>
      </div>
    )
  }

  /*
   * 交通費新規作成/編集モーダルをレンダーします
   */
  private renderEditorModal(props: IProps, state: IState) {
    const { expenses, projects, usages, objectives, createExpense, updateExpense } = props
    const { selected } = state
    const { expenseId = 0, strdate = "", project, usage, objective, customer = "",
            from = "", to = "", cost = "",
    }: TransExpenseView = find(propEq("expenseId", selected), expenses) || {}
    return (
      <ModalBody
        formItems={[
          {
            type: FormItemType.TEXT,
            name: "strdate",
            label: "日付",
            value: strdate,
          },
          {
            type: FormItemType.SELECT,
            name: "projectId",
            label: "プロジェクトコード",
            value: project ? project.projectId : "",
            options: { items: projects, valueKey: "projectId", labelKey: "name" },
          },
          {
            type: FormItemType.SELECT,
            name: "usageId",
            label: "利用区分",
            value: usage ? usage.usageId : "",
            options: { items: usages, valueKey: "usageId", labelKey: "name" },
          },
          {
            type: FormItemType.SELECT,
            name: "objectiveId",
            label: "目的コード",
            value: objective ? objective.objectiveId : "",
            options: { items: objectives, valueKey: "objectiveId", labelKey: "name" },
          },
          {
            type: FormItemType.TEXT,
            name: "customer",
            label: "顧客先",
            value: customer,
          },
          {
            type: FormItemType.TEXT,
            name: "from",
            label: "乗車地",
            value: from,
          },
          {
            type: FormItemType.TEXT,
            name: "to",
            label: "降車地",
            value: to,
          },
          {
            type: FormItemType.TEXT,
            name: "cost",
            label: "金額",
            value: cost,
          },
        ]}
        onClose={this.closeModal}
        onOKClick={selected ? s => updateExpense(s) : s => createExpense(s)}
      />
    )
  }

  private renderCreateFromTemplateModal(props: IProps, state: IState): JSX.Element {
    const { templates, createExpenseFromTemplate } = this.props
    return (
      <ModalBody
        formItems={[
          {
            type: FormItemType.TEXT,
            name: "strdate",
            label: "日付",
            value: "",
          },
          {
            type: FormItemType.SELECT,
            name: "templateId",
            label: "テンプレート名",
            value: "",
            options: { items: templates, valueKey: "templateId", labelKey: "templateName" },
          },
        ]}
        onClose={this.closeModal}
        onOKClick={
          ({templateId, strdate}: {templateId: string, strdate: string}) =>
            createExpenseFromTemplate(templateId, strdate)}
      />
    )
  }

  private getInitState(props: IProps) {
    return { isModalOpen: false, useTemplate: false, selected: 0 }
  }

  /* モーダルクローズ */
  private closeModal = () => {
    this.setState({ isModalOpen: false, useTemplate: false, selected: 0 })
  }

  /* 更新モーダル */
  private openEditModal = (expenseId: number) => {
    this.setState({ isModalOpen: true, useTemplate: false, selected: expenseId })
  }

  /* 新規登録モーダル */
  private openAddModal = () => {
    this.setState({ isModalOpen: true, useTemplate: false, selected: 0 })
  }

  /* テンプレートから新規登録モーダル */
  private openCreateFromTemplateModal = () => {
    this.setState({ isModalOpen: true, useTemplate: true, selected: 0 })
  }

}

export default TransExpenseHistory
