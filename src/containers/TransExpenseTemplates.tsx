import * as React from "react"
import { find, propEq } from "ramda"
import ModalContainer from "~/components/ModalContainer"
import ModalBody from "~/components/ModalBody"
import { RootState, getTransExpenseTemplates, getMaster } from "~/modules"
import { CURRENCY } from "~/helpers/_const"
import { Project, Usage, Objective, TransExpenseTemplate, TransExpenseTemplateView, FormItemType } from "~/types"

interface IProps extends React.Props<{}> {
  templates: TransExpenseTemplateView[]
  projects: Project[]
  usages: Usage[]
  objectives: Objective[]
  createExpenseTemplate: (template: Partial<TransExpenseTemplate>) => void
  deleteExpenseTemplate: (templateId: string) => void
  updateExpenseTemplate: (template: Partial<TransExpenseTemplate>) => void
}

interface IState {
  // 編集モーダルがオープン状態であるか
  isModalOpen?: boolean
  // 選択中のテンプレートID
  selected?: string
}

/**
 * 交通費テンプレート
 */
class TransExpenseTemplateTemplates extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = this.getInitState(props)
  }

  public render() {
    const { templates, createExpenseTemplate, deleteExpenseTemplate } = this.props
    const { isModalOpen } = this.state
    const $templates = this.renderExpenseTemplates(templates, deleteExpenseTemplate)
    const $modalBody = isModalOpen ? this.renderEditorModal(this.props, this.state) : null
    return (
      <div>
        {/* テンプレート一覧 */}
        {templates.length > 0 ? $templates : <p>There is no template in your browser. Create your new template!</p>}
        {/* 新規登録ボタン */}
        <div className="clearfix">
          <div className="button-group">
            <button className="secondary-button circle btn-raised" onClick={this.openCreateModal}>+</button>
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

  private renderExpenseTemplates = (
    template: TransExpenseTemplateView[],
    deleteTemplate: (templateId: string) => void,
  ): JSX.Element => {
    const headers = ["#", "テンプレート名", "プロジェクト", "利用区分", "目的", "金額", "", ""]
    return (
      <div className="mr-records">
        <table className="tms-table tms-table--bordered">
        <thead>
          <tr>
          {headers.map((e, i) => (<th key={i}>{e}</th>))}
          </tr>
        </thead>
        <tbody>
        {template.length > 0 && template.map((t, i) => (
          <tr key={t.templateId}>
            <td className="record-id">{i + 1}</td>
            <td>{t.templateName}</td>
            <td>{t.project.name}</td>
            <td>{t.usage.name}</td>
            <td>{t.objective.name}</td>
            <td>{CURRENCY.format(t.cost)}</td>
            <td><button className="edit button-rev" onClick={() => this.openEditModal(t.templateId)}>編集</button></td>
            <td><button className="remove button-rev" onClick={() => deleteTemplate(t.templateId)}>削除</button></td>
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
    const { templates, projects, usages, objectives, createExpenseTemplate, updateExpenseTemplate } = props
    const { selected } = state
    const {
      templateId = "",
      templateName = "",
      project,
      usage,
      objective,
      customer = "",
      from = "",
      to = "",
      cost = "",
    }: TransExpenseTemplateView = find(propEq("templateId", selected), templates) || {}
    return (
      <ModalBody
        formItems={[
          {
            type: FormItemType.TEXT,
            name: "templateName",
            label: "テンプレート名",
            value: templateName,
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
        onOKClick={selected ? s => updateExpenseTemplate({ ...s, templateId }) : s => createExpenseTemplate(s)}
      />
    )
  }

  private getInitState(props: IProps) {
    return { isModalOpen: false, selected: "" }
  }

  private closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  /* 編集モーダルオープン */
  private openEditModal = (templateId: string) => {
    this.setState({ isModalOpen: true, selected: templateId })
  }

  /* 新規登録ボタンクリックイベント */
  private openCreateModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ isModalOpen: true, selected: "" })
  }

}

export default TransExpenseTemplateTemplates
